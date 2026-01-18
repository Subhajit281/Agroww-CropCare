import MyCrop from "../models/myCrop.js";
import AppError from "../utils/AppError.js";

export const getMyCrops = async (req, res, next) => {
  try {
    const crops = await MyCrop.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      crops,
    });
  } catch (err) {
    next(err);
  }
};

export const addMyCrop = async (req, res, next) => {
  try {
    const { name, month, location } = req.body;

    if (!name || !month || !location) {
      return next(new AppError("All fields are required", 400));
    }

    if (!location?.lat || !location?.lon) {
      return next(
        new AppError("Please select a valid location from suggestions", 400)
      );
    }


    const crop = await MyCrop.create({
      user: req.user._id,
      name,
      month,
      location,
    });

    res.status(201).json({
      success: true,
      message: "Crop added successfully",
      crop,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMyCrop = async (req, res, next) => {
  try {
    const crop = await MyCrop.findById(req.params.id);

    if (!crop) return next(new AppError("Crop not found", 404));

    if (crop.user.toString() !== req.user._id.toString()) {
      return next(new AppError("Not allowed", 403));
    }

    await crop.deleteOne();

    res.status(200).json({
      success: true,
      message: "Crop removed successfully",
    });
  } catch (err) {
    next(err);
  }
};
