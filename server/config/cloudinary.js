import { v2 as cloudinary } from "cloudinary";

// 🔐 Config (env based - secure)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true, // always use https
});

// 🔥 Upload function (reusable - future ready)
export const uploadToCloudinary = async (fileBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "airbnb-clone",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

export default cloudinary;