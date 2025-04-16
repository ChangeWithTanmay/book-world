import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv";

dotenv.config();

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

// Find Public Url
const findPublicUrl = async (link) => {
  try {
    const v1Link = link.split("/");
    const v2Link = v1Link[v1Link.length - 1];
    const url = v2Link.split(/\?|\+|\$|\.|\@|\#|\!|\^/)[0];
    console.log("Find By Public Url", url);
    // url=url.toString();
    return url;
  } catch (error) {
    throw new ApiError(400, "Provide Cloudinary file url");
  }
};

// Delete Cloudinary
const deleteOnCloudinary = async (localFilePath) => {
  try {
    // Todo:
    // 1# Find Coudinary Link to Url id.
    // 2# Return a new Promise.
    // 3# now write destroy request.
    // 4# error and result message.
    const public_id = await findPublicUrl(localFilePath);

    console.log("delete Image public url", public_id);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
          console.error("Error deleting image:", error);
          reject(error);
        } else {
          console.log("Delete result:", result);
          resolve(result);
        }
      });
    });
  } catch (error) {
    // throw new ApiError()
    console.error("err");
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
