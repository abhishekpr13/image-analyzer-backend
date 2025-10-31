#!/usr/bin/env node
import "reflect-metadata";
import { AppDataSource } from '../config/database';

async function initializeDatabase() {
    try {
        console.log('Initializing database...');

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Database connection established successfully');
        }

        // Check if migrations table exists
        const hasMigrationsTable = await AppDataSource.query(`
            SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'migrations'
            );
        `);

        if (!hasMigrationsTable[0].exists) {
            console.log('Migrations table does not exist. Creating...');
            await AppDataSource.query(`
                CREATE TABLE migrations (
                id SERIAL PRIMARY KEY,
                timestamp BIGINT NOT NULL,
                name VARCHAR NOT NULL
                );
            `);
            console.log('Migrations table created successfully');
        }

        // Run pending migrations
        const pendingMigrations = await AppDataSource.showMigrations();
        if (pendingMigrations) {
            console.log('Running pending migrations...');
            await AppDataSource.runMigrations();
            console.log('Migrations completed successfully');
        } else {
            console.log('No pending migrations');
        }

        console.log('Database initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
}

initializeDatabase();
