-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    name VARCHAR NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_migrations_timestamp ON migrations (timestamp);

CREATE INDEX IF NOT EXISTS idx_migrations_name ON migrations (name);