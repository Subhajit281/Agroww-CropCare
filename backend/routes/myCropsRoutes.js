import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMyCrops,
  addMyCrop,
  deleteMyCrop,
} from "../controllers/myCropsController.js";

const router = express.Router();

router.get("/", protect, getMyCrops);
router.post("/", protect, addMyCrop);
router.delete("/:id", protect, deleteMyCrop);

export default router;
