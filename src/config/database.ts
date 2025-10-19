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
    synchronize: process.env.NODE_ENV !== 'production', // Only in development
    logging: process.env.NODE_ENV === 'development',
    entities: [User, File],
    migrations: [],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established successfully');
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};
