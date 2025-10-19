#!/usr/bin/env node
import "reflect-metadata";
import { execSync } from 'child_process';
import { AppDataSource } from '../config/database';

async function generateMigration(migrationName: string) {
    try {
        console.log(`Generating migration: ${migrationName}`);

        // Initialize the data source
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Generate the migration using TypeORM CLI
        const command = `npx typeorm-ts-node-commonjs migration:generate -d src/config/database.ts src/migrations/${migrationName}`;

        console.log('Running command:', command);
        execSync(command, { stdio: 'inherit' });

        console.log(`✅ Migration '${migrationName}' generated successfully!`);
        console.log('📝 Review the generated migration file before running it.');
        console.log('🚀 Run "npm run migration:run" to apply the migration.');

    } catch (error) {
        console.error('❌ Error generating migration:', error);
        process.exit(1);
    }
}

// Get migration name from command line arguments
const migrationName = process.argv[2];

if (!migrationName) {
    console.error('❌ Please provide a migration name:');
    console.log('Usage: npm run migration:generate -- MigrationName');
    console.log('Example: npm run migration:generate -- AddUserProfile');
    process.exit(1);
}

generateMigration(migrationName);
