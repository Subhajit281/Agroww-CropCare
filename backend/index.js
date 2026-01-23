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
    origin: [
      "http://localhost:5173",
      "https://frontend-qxso.onrender.com",
      "https://agroww-cropcare.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// preflight fix (Express 5 safe)
app.options(/.*/, cors());





//Connection
connectMongoDB(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});
//routes

app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/mycrops", myCropsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/weather-alerts", weatherRoutes);







app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
