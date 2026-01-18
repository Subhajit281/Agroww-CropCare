import User from "../models/user.js";
import AppError from "../utils/AppError.js";  // ✅ ADD THIS

export const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: req.file.path },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile picture updated",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return next(new AppError("Name must be at least 2 characters", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    ).select("-password");

    if (!updatedUser) return next(new AppError("User not found", 404));

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
