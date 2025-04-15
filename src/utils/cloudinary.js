import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js"
import dotenv from "dotenv";

dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    // secure_distribution: 'mydomain.com',
    // upload_prefix: 'myprefix.com'
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) {
        throw new Error("Local file path is not provided.");
      }
  
      // Upload the file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
  
      // console.log("File uploaded to Cloudinary:", response.url);
      fs.unlinkSync(localFilePath); // Remove the temporary file.
      return { success: true, url: response.url };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath); // Remove the temporary file
      }
      return { success: false, error: error.message };
    }
  };



export {
    uploadOnCloudinary,
}