import { v2 as Cloudinary, ConfigOptions } from "cloudinary";

const cloudConfig: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // https
};

Cloudinary.config(cloudConfig);

export default Cloudinary;
