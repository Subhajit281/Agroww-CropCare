import Crop from "../models/crop.js";

export const getAllCrops = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const search = req.query.search || "";
    const type = req.query.type || "all";
    const season = req.query.season || "all";

    const filter = {};

    // search by name (case-insensitive)
    if (search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    if (type !== "all") filter.type = type;
    if (season !== "all") filter.season = season;

    const totalCrops = await Crop.countDocuments(filter);

    const crops = await Crop.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      crops,
      totalCrops,
      totalPages: Math.ceil(totalCrops / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};

export const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: "Crop not found" });
    }

    return res.status(200).json({ success: true, crop });
  } catch (err) {
    next(err);
  }
};
