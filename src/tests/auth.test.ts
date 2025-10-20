import request from 'supertest';
import  express  from 'express';
import authrouter from '../routes/authRoutes';
import { AppDataSource } from '../config/database';

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
});

afterAll(async () => {
  await AppDataSource.destroy();
});



const app = express();
app.use(express.json());
app.use('/api/auth',authrouter);

describe("authentication test",()=>{
    it("should register the new user", async() => {
        const uniqueEmail = `abhishek${Date.now()}@example.com`;
    
        const response = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Abhishek69',
            email: uniqueEmail,
            password: 'test@1223'
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Successfully created the User");
    });
    it("should login the existing user and return token", async() =>{
        const testUser = {
            name: 'Login Test',
            email: `logintest${Date.now()}@example.com`,
            password: 'password123'
        };
        await request(app)
        .post('/api/auth/register')
        .send(testUser);

        const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password
        });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
        expect(loginResponse.body).toHaveProperty('user');
        expect(loginResponse.body.user.email).toBe(testUser.email);
    });
    it("should fail to login with wrong password", async() => {
        const testUser = {
            name: 'Login Test',
                email: `logintest${Date.now()}@example.com`,
        password: 'password123'
        }
        await request(app)
        .post('/api/auth/register')
        .send(testUser);
        const loginResponse = await request(app)
        .post('/api/auth/login')
        .send ({
            email: testUser.email,
            password: 'wrongpassword999'  
        });
        
        expect(loginResponse.status).toBe(400);
        expect(loginResponse.body.error).toBe('Invalid password');
    });
   
});