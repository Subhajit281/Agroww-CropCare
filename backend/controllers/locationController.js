import axios from "axios";

export const searchLocations = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, locations: [] });
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      q
    )}&count=7&language=en&format=json`;

    const response = await axios.get(url);

    const results = response.data?.results || [];

    const locations = results.map((item) => ({
      name: item.name,
      state: item.admin1 || "",
      country: item.country || "",
      lat: Number(item.latitude),
      lon: Number(item.longitude),
    }));

    res.status(200).json({ success: true, locations });
  } catch (err) {
    console.log("LOCATION SEARCH ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Location search failed",
    });
  }
};
