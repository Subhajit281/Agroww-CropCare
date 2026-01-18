import { useEffect, useState } from "react";
import axios from "axios";

const CropModal = ({ crop, onClose }) => {
  if (!crop) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-[#f1f9f8] w-full max-w-lg rounded-2xl shadow-xl px-10 py-8 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <img
          src={crop.imageUrl}
          alt={crop.name}
          className="w-full h-70 object-cover rounded-xl"
        />

        <h2 className="text-2xl font-bold text-gray-900 mt-4">{crop.name}</h2>

        <div className="flex gap-2 mt-2">
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {crop.type}
          </span>
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {crop.season}
          </span>
        </div>

        <p className="text-gray-600 mt-4 leading-relaxed">{crop.description}</p>
      </div>
    </div>
  );
};

const Crops = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [season, setSeason] = useState("all");

  const [page, setPage] = useState(1);
  const limit = 12;

  const [selectedCrop, setSelectedCrop] = useState(null);

  // backend data
  const [crops, setCrops] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCrops = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/crops`, {
        params: {
          page,
          limit,
          search: search.trim(),
          type,
          season,
        },
      });

      setCrops(res.data.crops || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
      setCrops([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, type, season]);

  // reset page when filters change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1);
  };

  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">Crops</h1>
        <p className="text-gray-900 mt-2 mb-3">
          Explore crops with details, season, and category.
        </p>

        {/* Controls */}
         <div className="mt-2 bg-[linear-gradient(170deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)]  rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search crops (eg: Rice, Wheat, Mango...)"
              className="w-[70%] bg-white/90 backdrop-blur-md border border-black/40 rounded-2xl px-5 py-3
             placeholder:text-gray-500 text-gray-900 outline-none"


          />

          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={type}
              onChange={handleTypeChange}
              className="w-1/2 md:w-auto px-2 py-2 border rounded-2xl"
            >
              <option value="all">ALL</option>
              <option value="grain">GRAIN</option>
              <option value="vegetable">VEGETABLE</option>
              <option value="fruit">FRUIT</option>
              <option value="pulse">PULSE</option>
              <option value="oilseed">OILSEED</option>
              <option value="spice">SPICE</option>
              <option value="fiber">FIBER</option>
              <option value="plantation">PLANTATION</option>
              <option value="forage">FORAGE</option>
              <option value="commercial">COMMERCIAL</option>
            </select>

            <select
              value={season}
              onChange={handleSeasonChange}
              className="w-1/2 md:w-auto px-2 py-2 border rounded-2xl "
            >
              <option value="all">ALL</option>
              <option value="kharif">KHARIF</option>
              <option value="rabi">RABI</option>
              <option value="zaid">ZAID</option>
              <option value="all-season">ALL-SEASON</option>
            </select>
          </div>
        </div> 

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 mt-6">Loading crops...</p>
        )}

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!loading &&
            crops.map((crop, idx) => (
              <button
                key={crop._id || `${crop.name}-${idx}`}
                onClick={() => setSelectedCrop(crop)}
                className="bg-[#e0f4f2] rounded-2xl shadow hover:shadow-lg transition overflow-hidden text-left"
              >
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {crop.name}
                  </h2>

                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {crop.type}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {crop.season}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                    {crop.description}
                  </p>
                </div>
              </button>
            ))}
        </div>

        {/* Empty */}
        {!loading && crops.length === 0 && (
          <p className="text-center text-gray-700 mt-10">
            No crops found. Try changing filters.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10 pb-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1 rounded-xl border bg-white disabled:opacity-50"
            >
              &lt;&lt; Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1 rounded-xl border bg-white disabled:opacity-50"
            >
              Next &gt;&gt;
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <CropModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
    </div>
  );
};

export default Crops;
