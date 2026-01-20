import express from "express";
const router = express.Router();
import {handleUserSignup,handleLogin} from "../controllers/authControllers.js";
// const {protect,restrictTo} = require("../middlewares/auth");
import { protect } from "../middlewares/authMiddleware.js";
import { getMyProfile } from "../controllers/authControllers.js";



router.post("/signup",handleUserSignup);
router.post("/login",handleLogin);
router.get("/me", protect, getMyProfile);


export default router;
