import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/Prisma'

const authrouter = express.Router();

// Register route 
authrouter.post('/register', async(req,res)=>{
    const { name, email, password } = req.body;
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user 
        const newUser = await prisma.user.create({
            data: { 
                name, 
                email, 
                password: hashedPassword 
            }
        });

        res.status(200).json({
            message: "Successfully created the User"
        });
    } catch(error){
        res.status(500).json({
            error: 'Server Error. Unable to register....'
        });
    }
});

// Login route 
authrouter.post('/login', async(req,res)=> {
    const {email,password} = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user){
            return res.status(400).json({error: "No user found"});
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        const token = jwt.sign({
            userId: user.id,  
            email: user.email
        }, 'Your secrete key', {expiresIn: '24h'});

        res.json({
            message: "Successfully logged in",
            token: token,
            user: {
                id: user.id,  
                name: user.name,
                email: user.email
            }
        });
    } catch (error){
        res.status(500).json({ error: 'Server error' });
    }
});

export default authrouter;