import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';
import https from 'https';

// Configure HTTPS agent to handle SSL certificate issues
const httpsAgent = new https.Agent({
    rejectUnauthorized: false // Only for development - remove in production
});

// Set the agent for Cloudinary
cloudinary.config({
    secure: true,
    api_proxy: process.env.CLOUDINARY_PROXY || undefined
});

const uploadToCloudinary = async (filePath, folder = 'general') => {
    try {
        if (!filePath) {
            throw new Error('File path is required');
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist at the specified path');
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'auto',
        });
        
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }

        // Check if file exists before attempting upload
        if (!fs.existsSync(localFilePath)) {
            console.error(`File does not exist at path: ${localFilePath}`);
            return null;
        }

        console.log(`Attempting to upload file: ${localFilePath}`);
        
        // Debug: Check Cloudinary config
        console.log("Cloudinary config check:");
        console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing");
        console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing");
        console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing");

        // Skip connection test for now due to SSL issues, directly try upload
        console.log("Skipping connection test, attempting direct upload...");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "avatars",
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            // Add timeout and retry options
            timeout: 60000,
            secure: true
        });

        console.log("Cloudinary upload successful:", response.secure_url);

        // Clean up local file after successful upload
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Full error object:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Clean up local file even if upload fails
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (unlinkError) {
                console.error("Error deleting local file:", unlinkError);
            }
        }
        
        // Provide more detailed error message
        const errorMessage = error.message || error.error?.message || 'Unknown Cloudinary error';
        throw new Error(`Cloudinary upload failed: ${errorMessage}`);
    }
};

export { uploadOnCloudinary, uploadToCloudinary };