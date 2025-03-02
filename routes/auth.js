import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post("/signup", async(req, res)=>{
    const {name,email, password } = req.body;

    try{
        const existingUser = await User.findOne({where: {email}});
        if(existingUser) return res.status(400).json({msg: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({name,email, password: hashedPassword});

        res.status(201).json({message: "User created successfully", userID: newUser.id});
    }
    catch(err){
        console.error(err);
        res.status(500).json({msg: 'Server error'});
    }
});

router.post("/login", async (req, res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.findOne({where: {email}});
        if(!user) return res.status(401).json({msg: 'Invald user or password'});



        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(401).json({msg: 'Invalid user or password'});

        const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.json({message:"login successful", token});
        
    }
    catch(error){
        res.status(500).json({msg: 'Server error'});
    }
});

export default router;