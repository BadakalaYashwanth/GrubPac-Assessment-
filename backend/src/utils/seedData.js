require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedData = async () => {
    try {
        await connectDB();

        const principalEmail = 'principal@admin.com';
        const principalExists = await User.findOne({ email: principalEmail });

        if (!principalExists) {
            const hashedPassword = await bcrypt.hash('Admin123', 10);
            await User.create({
                name: 'Principal User',
                email: principalEmail,
                password: hashedPassword,
                role: 'principal'
            });
            console.log('Principal seeded successfully');
        } else {
            console.log('Principal already exists');
        }

        const teacherEmail = 'teacher@demo.com';
        const teacherExists = await User.findOne({ email: teacherEmail });

        if (!teacherExists) {
            const hashedPassword = await bcrypt.hash('Teacher123', 10);
            await User.create({
                name: 'Demo Teacher',
                email: teacherEmail,
                password: hashedPassword,
                role: 'teacher'
            });
            console.log('Teacher demo seeded successfully');
        } else {
            console.log('Teacher demo already exists');
        }

        process.exit();
    } catch (error) {
        console.error('Error while seeding data:', error);
        process.exit(1);
    }
};

seedData();
