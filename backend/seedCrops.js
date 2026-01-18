import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Crop from "./models/crop.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedCrops() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected ✅");

    // Read crops.json manually
    const cropsPath = path.join(__dirname, "data", "crops.json");
    const cropsData = JSON.parse(fs.readFileSync(cropsPath, "utf-8"));

    await Crop.deleteMany();
    console.log("Old crops deleted 🗑️");

    await Crop.insertMany(cropsData);
    console.log(`Inserted ${cropsData.length} crops ✅`);

    process.exit(0);
  } catch (err) {
    console.log("Seeding failed ", err);
    process.exit(1);
  }
}

seedCrops();
