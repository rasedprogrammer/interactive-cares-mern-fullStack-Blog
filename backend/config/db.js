// blog-application/backend/config/db.js

<<<<<<< HEAD
const mongoose = require('mongoose');
=======
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MongoDB connection string (MONGO_URI) is not defined in environment variables');
        }
        const dbURI = process.env.MONGO_URI;
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
  }

};

<<<<<<< HEAD
module.exports = connectDB;
=======
export default connectDB;
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
