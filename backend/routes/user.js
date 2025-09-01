const express = require('express');
const userRouter = express.Router();
const DatabaseManager = require('../database/DatabaseManager');
const User = require('../database/models/User');

// Create new user (register)
userRouter.post('/', async (req, res) => {
    const { username, email, birthdate, password } = req.body;
    if (!username || !email || !birthdate || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const dateObj = new Date(birthdate);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format for birthdate. Use YYYY-MM-DD or ISO format.' });
    }

    await DatabaseManager.createEntry(User,
        {
            username,
            email,
            birthdate: dateObj,
            password
        }
    ).then(user => {
        // Remove password from response
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({
            message: 'User created successfully',
            user: userObj
        });
    }).catch(error => {
        console.error('Error creating user:', error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'User with this email or username already exists' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

module.exports = userRouter;