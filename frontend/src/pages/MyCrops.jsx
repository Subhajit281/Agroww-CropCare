import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const MyCrops = () => {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [showForm, setShowForm] = useState(false);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    month: "",
  });

  //  Location Autocomplete States
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //  Fetch user crops from backend
  const fetchMyCrops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/mycrops`, config);
      setCrops(res.data.crops || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCrops();
  }, []);

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  Fetch locations from backend
  const fetchLocations = async (query) => {
    try {
      setSearchingLocation(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/locations/search?q=${encodeURIComponent(
          query
        )}`,
        config
      );

      setLocationResults(res.data.locations || []);
    } catch (err) {
      console.log(err);
      setLocationResults([]);
    } finally {
      setSearchingLocation(false);
    }
  };

  //  Add crop to backend
  const handleAddCrop = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.month) {
      toast.error("Please fill all fields");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select a valid location from suggestions");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        month: formData.month,
        location: selectedLocation, // ✅ store object (lat/lon etc.)
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/mycrops`,
        payload,
        config
      );

      toast.success(res.data.message || "Crop added successfully!");

      // add instantly in UI
      setCrops((prev) => [res.data.crop, ...prev]);

      // reset form
      setFormData({ name: "", month: "" });
      setLocationQuery("");
      setSelectedLocation(null);
      setLocationResults([]);

      setShowForm(false);
    } catch (err) {
      console.log("ADD CROP ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add crop");
    }
  };

  //  Remove crop from backend
  const handleRemoveCrop = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/mycrops/${id}`, config);

      toast.success("Crop removed successfully!");

      // remove instantly from UI
      setCrops((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove crop");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Crops</h1>
          

          <button
            onClick={() => setShowForm(true)}
            className="bg-[#3c9087] text-white px-4 py-2 border border-black rounded-lg hover:bg-[#48ada3]"
          >
            Add Crop

          </button>
        </div>

        {/* Add Crop Form */}
        {showForm && (
          <form
            onSubmit={handleAddCrop}
            className="bg-white p-6 rounded-lg shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Crop Name */}
            <input
              type="text"
              name="name"
              placeholder="Crop Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border px-4 py-2 rounded-lg"
            />

            {/* Month */}
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className="border px-4 py-2 rounded-lg bg-white"
            >
              <option value="">Select Sown Month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            {/* Location Autocomplete */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search location (eg: Silchar, Guwahati...)"
                value={locationQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocationQuery(val);
                  setSelectedLocation(null);

                  if (val.trim().length >= 2) {
                    fetchLocations(val);
                  } else {
                    setLocationResults([]);
                  }
                }}
                className="border px-4 py-2 rounded-lg w-full"
                required
              />

              {/* Dropdown */}
              {locationQuery.trim().length >= 2 && (
                <div className="absolute top-11 left-0 w-full bg-white border rounded-lg shadow z-50 max-h-48 overflow-y-auto">
                  {searchingLocation ? (
                    <p className="px-4 py-2 text-gray-600 text-sm">
                      Searching...
                    </p>
                  ) : locationResults.length === 0 ? (
                    <p className="px-4 py-2 text-gray-600 text-sm">
                      No locations found
                    </p>
                  ) : (
                    locationResults.map((loc, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationQuery(
                            `${loc.name}${loc.state ? ", " + loc.state : ""}, ${
                              loc.country
                            }`
                          );
                          setLocationResults([]);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-green-50"
                      >
                        {loc.name}
                        {loc.state ? `, ${loc.state}` : ""} ({loc.country})
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-3 flex gap-4">
              <button
                type="submit"
                className="bg-[#3c9087] text-white px-6 py-2 rounded hover:bg-[#48ada3]"
              >
                Save Crop
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: "", month: "" });
                  setLocationQuery("");
                  setSelectedLocation(null);
                  setLocationResults([]);
                }}
                className="border px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Crops List */}
        {loading ? (
          <p className="text-gray-700">Loading your crops...</p>
        ) : crops.length === 0 ? (
          <p className="text-gray-600">No crops added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div
                key={crop._id}
                className="bg-[#e0f4f2] p-5 rounded-lg shadow-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-[#30736c]">
                    {crop.name}
                  </h3>
                  <p className="mt-2">Sown Month: {crop.month}</p>

                  {/* show location properly */}
                  <p>
                    Location:{" "}
                    {typeof crop.location === "string"
                      ? crop.location
                      : `${crop.location?.name || ""}${
                          crop.location?.state ? ", " + crop.location.state : ""
                        }`}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveCrop(crop._id)}
                  className="mt-6 self-start bg-red-400 text-white px-3 py-1.5 text-sm rounded hover:bg-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCrops;
