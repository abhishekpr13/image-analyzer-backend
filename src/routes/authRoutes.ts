import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

const authrouter = express.Router();

// Register route 
authrouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body;  // Changed: name → username
    
    try {
        // Check if user exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with username mapped to name field
        const newUser = userRepository.create({
            name: username,  // Map username to name field
            email,
            password: hashedPassword
        });

        await userRepository.save(newUser);

        res.status(200).json({
            message: "Successfully created the User"
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Server Error. Unable to register....'
        });
    }
});

// Login route 
authrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "No user found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET || 'Your secrete key', { expiresIn: '24h' });

        res.json({
            message: "Successfully logged in",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default authrouter;