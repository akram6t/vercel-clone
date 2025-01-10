// import { serve } from '@hono/node-server'
// import { Hono } from 'hono'

// const app = new Hono()

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })

// const port = 3000
// console.log(`Server is running on http://localhost:${port}`)

// serve({
//   fetch: app.fetch,
//   port
// })

import { Hono } from 'hono';
import apiRouter from './routes/index.js';
import { serve } from '@hono/node-server';
import { clickhouse, KAFKA_TOPIC, kafkaConsumer } from './services/index.js';
import type { KafkaMessage } from 'kafkajs';
import { config } from './config/index.js';
// import projectRoutes from './routes/index.js';
// import userRoutes from './routes/index.js';
// import logRoutes from './routes/index.js';

const app = new Hono();

// app.route('/deployments', deploymentRoutes);
// app.route('/projects', projectRoutes);
// app.route('/users', userRoutes);
app.route('/api', apiRouter);

export default app;

serve({
  fetch: app.fetch,
  port: 5000,
});
console.log('server running at: 5000');




async function storedInClickhouse(table: string, message: KafkaMessage) {
  console.log('table: ', table);
  console.log('message: ', message);
}

async function initKafka(topic: string, table: string, storedInClickhouse: Function) {
  await kafkaConsumer.connect();
  kafkaConsumer.subscribe({ topic: topic })
  await kafkaConsumer.run({
    eachBatch: async function ({ batch, resolveOffset, commitOffsetsIfNecessary }) {
      const { messages } = batch;
      for (const message of messages) {
        try {
          storedInClickhouse(table, message);
          resolveOffset(message.offset);
        } catch (error) {
          console.error(`Error processing message ${message.offset}:`, error);
        }
      }

      await commitOffsetsIfNecessary();
    }
  })
}

initKafka(KAFKA_TOPIC.containerLogs, config.clickhouseTables.containerLogs, storedInClickhouse);