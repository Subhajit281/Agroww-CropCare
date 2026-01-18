import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "crop-care/profile-pics",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
console.log("✅ upload middleware loaded");

export const upload = multer({ storage });
