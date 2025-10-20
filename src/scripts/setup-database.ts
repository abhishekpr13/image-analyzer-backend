import "reflect-metadata";
import { execSync } from 'child_process';
import { AppDataSource } from '../config/database';

async function setupDatabase() {
    try {
        console.log('🚀 Setting up database with automatic migrations...');

        // Initialize the data source
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('✅ Database connection established');
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
            console.log('📋 Creating migrations table...');
            await AppDataSource.query(`
        CREATE TABLE migrations (
          id SERIAL PRIMARY KEY,
          timestamp BIGINT NOT NULL,
          name VARCHAR NOT NULL
        );
      `);
            console.log('✅ Migrations table created');
        }

        // Check if we have any migrations
        const migrationCount = await AppDataSource.query(`
      SELECT COUNT(*) as count FROM migrations
    `);

        if (migrationCount[0].count === '0') {
            console.log('🔄 No migrations found. Generating initial migration...');

            // Generate initial migration based on current entities
            const command = `npx typeorm-ts-node-commonjs migration:generate -d src/config/database.ts src/migrations/InitialMigration`;
            execSync(command, { stdio: 'inherit' });

            console.log('✅ Initial migration generated');
        }

        // Run pending migrations
        const pendingMigrations = await AppDataSource.showMigrations();
        if (pendingMigrations) {
            console.log('🔄 Running pending migrations...');
            await AppDataSource.runMigrations();
            console.log('✅ All migrations completed successfully');
        } else {
            console.log('✅ Database is up to date');
        }

        console.log('🎉 Database setup completed successfully!');

    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();
