import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    season: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
