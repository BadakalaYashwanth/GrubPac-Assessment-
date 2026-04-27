const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URI || process.env.MONGO_CONN;
        if (!mongoUrl) {
            console.error("MongoDB URI is missing in .env");
            process.exit(1);
        }

        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        if (err?.name === "MongooseServerSelectionError") {
            console.error("MongoDB Atlas is unreachable.");
            console.error("Check Atlas Network Access: allow your current IP or use 0.0.0.0/0 for development.");
        }
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
