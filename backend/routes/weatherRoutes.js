import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getWeatherAlerts } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/", protect, getWeatherAlerts);

export default router;
