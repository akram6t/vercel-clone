const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, CreateBucketCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const { Kafka } = require('kafkajs');
const { Upload } = require('@aws-sdk/lib-storage');

// Hardcoded configuration for LocalStack
// const s3Client = new S3Client({
//     endpoint: 'http://localhost:4566',
//     region: 'us-east-1',
//     credentials: {
//         accessKeyId: 'test',
//         secretAccessKey: 'test',
//     },
//     forcePathStyle: true,
// });

const s3Client = new S3Client({
    region: "ap-southeast-3", // Asia Pacific (Hanoi) RegionID
    endpoint: "https://mos.ap-southeast-3.sufybkt.com", // Asia Pacific (Hanoi) Endpoint
    credentials: {
        accessKeyId: 'Ml7yU1hLHoY_mvx6fCoIfGvqMvtbctHftCc-KAcE',
        secretAccessKey: '9a0dcRwNDjhPCTUQwepBlzEVd29kBFz7zUn5zt_Y'
    }
});

let serverUrl = "pc-9e4b39f9.aws-use2-production-snci-pool-kid.streamnative.aws.snio.cloud:9093";
let jwtToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE0NjYyZGM5LWIzZjctNTM1Ny05MzAyLTBiYWE3ODNmYzYyMCIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidXJuOnNuOnB1bHNhcjpvLTdpbHkyOmthZmthIl0sImh0dHBzOi8vc3RyZWFtbmF0aXZlLmlvL3Njb3BlIjpbImFkbWluIiwiYWNjZXNzIl0sImh0dHBzOi8vc3RyZWFtbmF0aXZlLmlvL3VzZXJuYW1lIjoia2Fma2Fqc0BvLTdpbHkyLmF1dGguc3RyZWFtbmF0aXZlLmNsb3VkIiwiaWF0IjoxNzM1ODU0MTI4LCJpc3MiOiJodHRwczovL3BjLTllNGIzOWY5LmF3cy11c2UyLXByb2R1Y3Rpb24tc25jaS1wb29sLWtpZC5zdHJlYW1uYXRpdmUuYXdzLnNuaW8uY2xvdWQvYXBpa2V5cy8iLCJqdGkiOiI1NjY0MDA2M2Q3NzY0MTc2YmQxYzNjNjAxNDQ4NjQ0ZiIsInBlcm1pc3Npb25zIjpbXSwic3ViIjoiSnBTUkxWMFZtUDdTcFJQSGlQTmtmelFrWVBUdkdFREZAY2xpZW50cyJ9.k57tYzHe0LZNl4v0o5HB4lNM8eDeyEzOnSLeBPYS4jsRxQbxBVtNMjd1seXWSIZ2wbAVMaGrMD90OHAWHUhU-pTF49kPQfDcaDbfkrop3MSHNwPHLoXtEuy5ZsR5LWBNxCAqQpyZdqFc1c5qILUKXBnG6sJYh0Zb80c-SsC0XE7KnA2qAkSE0MnZ29VaFnoeTbg9712pkCBv4xXoJ4Vk7aiABKTEsrE_5CaC8fbZNvQPUwtYFQCCnfTgwIc0PE8D7Wqkcqtf-6IQ5l-T88aM8urAZMTsu2GdzI0aBwNB0RtiVnmeuVEYATPos-tuTYuFw6oWWyMnobKGxDOMzXOZkQ";
let topicName = "kafka.kafka_space.container-logs";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [serverUrl],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: 'user',
        password: 'token:' + jwtToken,
    }
});

const producer = kafka.producer();

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID;


// Check if the bucket exists and create it if it doesn't
async function createBucketIfNotExists(bucketName) {
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket ${bucketName} already exists.`);
    } catch (error) {
        if (error.name === 'NotFound') {
            console.log(`Bucket ${bucketName} does not exist. Creating...`);
            await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
            console.log(`Bucket ${bucketName} created successfully.`);
        } else {
            console.error(`Error checking/creating bucket ${bucketName}:`, error);
            throw error;
        }
    }
}

async function uploadFile(filePath, fileName) {
    try {
        const fileStream = fs.createReadStream(filePath);
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: 'vercel-clone',
                Key: `__outputs/${PROJECT_ID}/${fileName}`,
                Body: fileStream,
                ContentType: mime.lookup(filePath)
            },
            queueSize: 4, // Concurrent parts
            partSize: 5 * 1024 * 1024, // 5MB per part
        });

        upload.on('httpUploadProgress', (progress) => {
            console.log(`Progress: ${progress.loaded}/${progress.total}`);
        });

        await upload.done();
        await publishLog(`uploaded ${fileName}`);
        console.log('uploaded', filePath);
    } catch (err) {
        console.error(`Failed to upload ${fileName}:`, err);
        await publishLog(`error uploading ${fileName}: ${err.message}`);
        throw err;
    }
}

async function init() {
    // Uncomment if Kafka is enabled
    await producer.connect();

    await createEnvFile();

    console.log('Executing script.js');
    await publishLog('Build Started...');

    const bucketName = 'vercel-clone';
    await createBucketIfNotExists(bucketName);

    const outDirPath = path.join(__dirname, 'output');

    const packageInstallCommand = process.env.PACKAGE_INSTALL_COMMAND || 'npm install';
    const buildCommand = process.env.BUILD_COMMAND || 'npm run build';

    console.log(`${packageInstallCommand} && ${buildCommand}`);
    const p = exec(`cd ${outDirPath} && ${packageInstallCommand} && ${buildCommand}`, {
        env: {
            ...removeSensitiveEnvFromCommand
        }
    });

    p.stdout.on('data', function (data) {
        console.log(data.toString());
        publishLog(data.toString());
    });

    p.stderr.on('data', function (data) {
        console.error('Error:', data.toString());
        publishLog(`error: ${data.toString()}`);
    });

    p.on('close', async function (code) {
        if (code !== 0) {
            console.error(`Build failed with exit code ${code}`);
            await publishLog(`Build failed with exit code ${code}`);
            process.exit(code);
        }

        console.log('Build Complete');
        await publishLog(`Build Complete`);

        const possibleFolders = ["dist", "build", "out", "public"]; // Add more folder names if needed
        let distFolderPath = null;

        for (const folder of possibleFolders) {
            const possibleFolderPath = path.join(outDirPath, folder);
            if (fs.existsSync(possibleFolderPath)) {
                distFolderPath = possibleFolderPath;
                break;
            }
        }

        if (!distFolderPath) {
            console.error("No output folder found! Expected one of:", possibleFolders);
            await publishLog("No output folder found!");
            process.exit(1);
        }

        console.log("Output folder found:", distFolderPath);
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        await publishLog(`Starting to upload`);
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath);
            await publishLog(`uploading ${file}`);
            await uploadFile(filePath, file);
        }
        await publishLog(`Completed!`);
        console.log('Complete!...');    
        process.exit(0);
    });
}

init();