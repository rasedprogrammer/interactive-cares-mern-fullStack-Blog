// blog-application/backend/config/cloudinaryConfig.js

<<<<<<< HEAD
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
=======
// const cloudinary = require('cloudinary').v2;
// const dotenv = require('dotenv');
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86

dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Use HTTPS
});

<<<<<<< HEAD
module.exports = cloudinary;
=======
export default cloudinary;
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
