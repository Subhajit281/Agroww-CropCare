import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import { uploadProfilePic, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.patch(
  "/profile-pic",
  protect,
  upload.single("profilePic"),
  uploadProfilePic
);


router.patch("/update-profile", protect, updateProfile);

export default router;
