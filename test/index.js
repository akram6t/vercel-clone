const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const { createClient } = require('@clickhouse/client');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

// Kafka configuration
const kafka = new Kafka({
    clientId: 'log-producer',
    brokers: ['localhost:9092'], // Local Kafka broker
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'log-consumer' });

// ClickHouse configuration
const clickhouse = createClient({
    host: 'http://localhost:8123', // Local ClickHouse
    database: 'logs_db',
});

// ECS configuration for LocalStack
const ecsClient = new ECSClient({
    region: 'us-east-1', // LocalStack defaults to us-east-1
    endpoint: 'http://localhost:4566', // LocalStack endpoint
    credentials: {
        accessKeyId: 'test', // Dummy credentials for LocalStack
        secretAccessKey: 'test', // Dummy credentials for LocalStack
    },
});

const config = {
    CLUSTER: 'my-cluster', // ECS cluster name
    TASK: 'my-task-def', // ECS task definition name
};

// Function to produce logs every 2 seconds
async function produceLogs() {
    await producer.connect();
    setInterval(async () => {
        const log = {
            event_id: uuidv4(),
            log_message: `Log at ${new Date().toISOString()}`,
        };
        await producer.send({
            topic: 'container-logs',
            messages: [{ value: JSON.stringify(log) }],
        });
        console.log('Produced log:', log);
    }, 2000);
}

// Function to consume logs and store them in ClickHouse
async function consumeLogs() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'container-logs', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;
            const log = JSON.parse(message.value.toString());
            console.log('Consumed log:', log);

            // Insert log into ClickHouse
            await clickhouse.insert({
                table: 'log_events',
                values: [log],
                format: 'JSONEachRow',
            });
            console.log('Inserted log into ClickHouse:', log);
        },
    });
}

// Function to initialize the ECS task (optional)
async function runECSTask() {
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-1', 'subnet-2', 'subnet-3'], // Dummy subnets for LocalStack
                securityGroups: ['sg-1'], // Dummy security group for LocalStack
            },
        },
    });

    await ecsClient.send(command);
    console.log('ECS task started');
}

// Main function
async function main() {
    try {
        // Start producing logs
        await produceLogs();

        // Start consuming logs
        await consumeLogs();

        // Optionally, run an ECS task
        await runECSTask();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the main function
main();