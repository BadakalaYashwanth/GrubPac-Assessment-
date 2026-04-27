const mongoose = require('mongoose'); //mongoose is a library that helps us to connect to the database created by developer connection to create database

const mongoUrl = process.env.MONGO_CONN;

async function connectDB() {
    if (!mongoUrl) {
        console.error("MONGO_CONN is missing in .env");
        return;
    }

    try {
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        if (err?.name === "MongooseServerSelectionError") {
            console.error("MongoDB Atlas is unreachable.");
            console.error("Check Atlas Network Access: allow your current IP or use 0.0.0.0/0 for development.");
        }
        console.error("Error connecting to MongoDB:", err.message);
    }
}

connectDB();