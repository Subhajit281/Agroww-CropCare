import axios from "axios";
import MyCrop from "../models/myCrop.js";

export const getWeatherAlerts = async (req, res) => {
  try {
    const crops = await MyCrop.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!crops.length) {
      return res.status(200).json({
        success: true,
        alerts: [],
      });
    }

    const alerts = [];

    for (const crop of crops) {
      const lat = Number(crop.location?.lat);
      const lon = Number(crop.location?.lon);

      // validate lat/lon
      if (
        Number.isNaN(lat) ||
        Number.isNaN(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {
        console.log("⚠️ Invalid lat/lon for crop:", crop.name, crop.location);
        continue;
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&forecast_days=3&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;

      const weatherRes = await axios.get(url);

      const data = weatherRes.data;

      // create simple warning rules
      const daily = data.daily || {};
      const maxWind = Math.max(...(daily.wind_speed_10m_max || [0]));
      const totalRain = Math.max(...(daily.precipitation_sum || [0]));

      const warnings = [];

      if (maxWind >= 35) warnings.push("⚠️ Strong wind expected");
      if (totalRain >= 20) warnings.push("⚠️ Heavy rain expected");

      alerts.push({
        cropId: crop._id,
        cropName: crop.name,
        month: crop.month,
        location: crop.location,
        warnings,
        weather: {
          daily: data.daily,
          hourly: data.hourly,
        },
      });
    }

    return res.status(200).json({
      success: true,
      alerts,
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather alerts",
    });
  }
};
