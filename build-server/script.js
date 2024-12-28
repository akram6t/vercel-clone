const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types');
const { Upload } = require('@aws-sdk/lib-storage');
// const { Readable } = require('stream');
// const { Kafka } = require('kafkajs')

const s3Client = new S3Client({
    // region: 'vercel-clone.mos.ap-southeast-3.sufybkt.com',
    region: "ap-southeast-3", // Asia Pacific (Hanoi) RegionID
    endpoint: "https://mos.ap-southeast-3.sufybkt.com", // Asia Pacific (Hanoi) Endpoint
    credentials: {
        accessKeyId: 'Ml7yU1hLHoY_mvx6fCoIfGvqMvtbctHftCc-KAcE',
        secretAccessKey: '9a0dcRwNDjhPCTUQwepBlzEVd29kBFz7zUn5zt_Y'
    }
})

const PROJECT_ID = process.env.PROJECT_ID
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID

// const kafka = new Kafka({
//     clientId: `docker-build-server-${DEPLOYEMENT_ID}`,
//     brokers: ['localhost:9092']
// })

// const producer = kafka.producer()

async function publishLog(log) {
    // console.log('send: ', log);

    // await producer.send({ topic: `container-logs`, messages: [{ key: 'log', value: JSON.stringify({ PROJECT_ID, DEPLOYEMENT_ID, log }) }] })
}

const envVariables = {
    // Only include BUILD_ prefixed variables and strip BUILD_ prefix
    ...Object.keys(process.env)
        .filter(key => key.startsWith('BUILD_'))
        .reduce((obj, key) => {
            // Remove BUILD_ prefix and keep the rest
            const newKey = key.replace('BUILD_', '');
            obj[newKey] = process.env[key];
            return obj;
        }, {})
};

// Create .env file in output directory
async function createEnvFile() {
    try {
        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const envContent = Object.entries(envVariables)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        console.log('Writing .env file with content:', envContent);
        
        const envPath = path.join(__dirname, 'output', '.env');
        fs.writeFileSync(envPath, envContent);
        console.log('.env file created at:', envPath);
    } catch (error) {
        console.error('Error creating .env file:', error);
        throw error;
    }
}


async function init() {
    // await producer.connect()
    await createEnvFile();

    console.log('Executing script.js')
    await publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output')

    console.log('npm install && build');
    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data) {
        console.log(data.toString())
        publishLog(data.toString())
    })

    p.stdout.on('error', async function (data) {
        console.log('Error', data.toString())
        await publishLog(`error: ${data.toString()}`)
    })

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

    // Replace existing upload code in p.on('close') with:
    p.on('close', async function () {
        console.log('Build Complete');
        await publishLog(`Build Complete`);
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        await publishLog(`Starting to upload`);
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath);
            await publishLog(`uploading ${file}`);
            await uploadFile(filePath, file);
        }
        await publishLog(`Done`);
        console.log('Done...');
        process.exit(0);
    });

}

init()