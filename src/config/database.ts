import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { File } from '../entities/File';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',
    database: process.env.DB_NAME || 'image_analyzer_db',
    synchronize: false, // Always use migrations, never synchronize
    logging: process.env.NODE_ENV === 'development',
    entities: [User, File],
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations',
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Database connection established successfully');

            // Check if migrations table exists, if not create it
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
        }
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};
