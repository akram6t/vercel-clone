// src/config/index.ts


// Database Configuration
const dbConfig = {
    url: process.env.DATABASE_URL, // PostgreSQL database URL
};

// ClickHouse Configuration
const clickhouseConfig = {
    url: process.env.CLICKHOUSE_HOST!, // ClickHouse server host
    username: process.env.CLICKHOUSE_USERNAME!, // ClickHouse username
    password: process.env.CLICKHOUSE_PASSWORD!, // ClickHouse password
};

const clickhouseTables = {
    containerLogs: 'container_logs',
    analytics: 'analytics',
    usage: 'usage'
}

// Kafka Configuration
const kafkaConfig = {
    serverUrl: process.env.KAFKA_SERVER_URL!, // Kafka broker URL
    jwtToken: process.env.KAFKA_JWT_TOKEN!, // JWT token for Kafka authentication
    topics: {
        containerLogs: process.env.KAFKA_TOPIC_CONTAINER_LOGS!, // Kafka topic for container logs
        analytics: process.env.KAFKA_TOPIC_ANALYTICS!, // Kafka topic for analytics
    },
};

// Export all configurations
export const config = {
    db: dbConfig,
    clickhouse: clickhouseConfig,
    kafka: kafkaConfig,
    clickhouseTables: clickhouseTables
};