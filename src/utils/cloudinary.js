import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    api_key: 'process.env.CLOUDINARY_API_KEY',
    api_secret: 'process.env.CLOUDINARY_API_SECRET',
    // secure_distribution: 'mydomain.com',
    // upload_prefix: 'myprefix.com'
});



const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on Cloudinary.
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        })

        // File has been upload successfully
        console.log("File is successfully uploaded in cloudinary.", uploadOnCloudinary);

        return response.url
    } catch (error) {
        fs.unlink(localFilePath) // REMOVE THE LOCALY SAVED TEMPORARY FILE AS THE UPLOAD OPERATON GOT FAILED.
    }
}



export {
    uploadOnCloudinary,
}