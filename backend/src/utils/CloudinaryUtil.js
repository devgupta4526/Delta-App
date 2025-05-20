import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';

const uploadToCloudinary = async (filePath, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed');
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) return null;

      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",
          folder: "avatars" // optionally specify folder
      });

      fs.unlinkSync(localFilePath);
      return response;

  } catch (error) {
      console.error("Cloudinary upload error:", error.message, error);
      fs.unlinkSync(localFilePath);
      return null;
  }
};



export {uploadOnCloudinary,uploadToCloudinary};
