import { PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';
import { createClient } from '@clickhouse/client'; // Import ClickHouse client
import { config } from '../config/index.js';

// ------------------------------------PRISMA CLIENT----------------------------------------

// Initialize Prisma Client for PostgreSQL database interactions
const prisma = new PrismaClient();


// ------------------------------------KAFKA CONFIGURATION----------------------------------------

// Initialize Kafka client with SSL and SASL authentication
const kafka = new Kafka({
    clientId: 'api-server', // Unique client ID for Kafka
    brokers: [config.kafka.serverUrl], // Kafka broker URL
    ssl: true, // Enable SSL for secure communication
    sasl: {
        mechanism: 'plain', // SASL authentication mechanism
        username: 'user', // Kafka username
        password: 'token:' + config.kafka.jwtToken, // Kafka password (JWT token)
    },
});

const KAFKA_TOPIC = config.kafka.topics;

// Create Kafka producer and consumer instances
const kafkaProducer = kafka.producer(); // Kafka 
const kafkaConsumer = kafka.consumer({
    groupId: 'api-server',
    sessionTimeout: 30000, // 30 seconds
    heartbeatInterval: 10000, // 10 seconds
});

// ------------------------------------CLICKHOUSE CONFIGURATION----------------------------------------

// ClickHouse Configuration
const clickhouse = createClient({
    ...config.clickhouse
});

// Export all services for use in controllers and other parts of the application
export { prisma, kafkaProducer, kafkaConsumer, clickhouse, KAFKA_TOPIC };