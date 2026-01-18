import "./config/env.js";
import express from "express";
import connectMongoDB from "./connection.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js"
import cropRoutes from "./routes/cropRoutes.js";
import myCropsRoutes from "./routes/myCropsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

import "./config/cloudinary.js"; 

import cors from "cors";


const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));


const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-qxso.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: handle preflight properly
app.options("*", cors());



//Connection
connectMongoDB(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log(err));

//routes

app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/mycrops", myCropsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/weather-alerts", weatherRoutes);







app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});