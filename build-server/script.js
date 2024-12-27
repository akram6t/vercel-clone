const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types');
const { Upload } = require('@aws-sdk/lib-storage');
const { Readable } = require('stream');
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

async function init() {

    // await producer.connect()

    console.log('Executing script.js')
    await publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output')

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