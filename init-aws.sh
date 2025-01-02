#!/bin/bash

# Wait for LocalStack to be ready
while ! aws --endpoint-url=http://localhost:4566 s3 ls > /dev/null 2>&1; do
  echo "Waiting for LocalStack to be ready..."
  sleep 2
done

# Create an S3 bucket
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket my-bucket
echo "S3 bucket 'my-bucket' created."

# Wait for Kafka to be ready
while ! kafka-topics --bootstrap-server kafka:9092 --list > /dev/null 2>&1; do
  echo "Waiting for Kafka to be ready..."
  sleep 2
done

# Create a Kafka topic
kafka-topics --bootstrap-server kafka:9092 --create --topic container-logs --partitions 1 --replication-factor 1
echo "Kafka topic 'container-logs' created."

# Wait for ClickHouse to be ready
while ! clickhouse-client --host clickhouse --query "SHOW DATABASES" > /dev/null 2>&1; do
  echo "Waiting for ClickHouse to be ready..."
  sleep 2
done

# Create a ClickHouse database
clickhouse-client --host clickhouse --query "CREATE DATABASE IF NOT EXISTS logs_db"
echo "ClickHouse database 'logs_db' created."

# Create a ClickHouse table
clickhouse-client --host clickhouse --query "
CREATE TABLE IF NOT EXISTS logs_db.container_logs (
    event_id UUID,
    deployment_id String,
    project_id String,
    createdAt DateTime DEFAULT now(),
    is_error UInt8 DEFAULT 0, -- 0 = false (not an error), 1 = true (error)
    log_message String
) ENGINE = MergeTree()
ORDER BY (event_id, createdAt)"
echo "ClickHouse table 'container_logs' created."