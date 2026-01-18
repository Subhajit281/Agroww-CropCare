import mongoose from "mongoose";

const myCropSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    month: { type: String, required: true, trim: true },
    location: {
        name: { type: String, required: true },
        state: { type: String, default: "" },
        country: { type: String, default: "" },
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const MyCrop = mongoose.model("MyCrop", myCropSchema);
export default MyCrop;
