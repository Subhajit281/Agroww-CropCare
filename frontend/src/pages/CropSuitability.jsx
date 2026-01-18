import { useState } from "react";
import cropData from "../data/CropSeason.json";
import cropInsights from "../data/cropInsights.json";

const CropSuitability = () => {
const states = [
"Andhra Pradesh",
"Arunachal Pradesh",
"Assam",
"Bihar",
"Chhattisgarh",
"Goa",
"Gujarat",
"Haryana",
"Himachal Pradesh",
"Jharkhand",
"Karnataka",
"Kerala",
"Madhya Pradesh",
"Maharashtra",
"Manipur",
"Meghalaya",
"Mizoram",
"Nagaland",
"Odisha",
"Punjab",
"Rajasthan",
"Sikkim",
"Tamil Nadu",
"Telangana",
"Tripura",
"Uttar Pradesh",
"Uttarakhand",
"West Bengal"
];

const [stateName, setStateName] = useState("");
const [season, setSeason] = useState("");
const [results, setResults] = useState([]);
const [selectedCrop, setSelectedCrop] = useState(null);

const handleCheck = () => {
if (cropData[stateName] && cropData[stateName][season]) {
  setResults(cropData[stateName][season]);
} else {
  setResults([]);
}


setSelectedCrop(null);
};

return (
<div className="min-h-screen bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] pt-24 px-6 flex justify-center">
  <div className="max-w-4xl mx-auto w-full">

    <h1 className="text-3xl mt-1 font-bold text-gray-900 mb-2">
      Crop Suitability
    </h1>
    <p className="">Find out the best suitable crops for your region in different seasons.</p>

    {/* Search Section */}
    <div className="bg-[linear-gradient(170deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] p-6 rounded-2xl shadow-md border mb-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
      
      {/* State Select */}
      <select
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
        className="border px-4 py-2 rounded-xl font-semibold bg-gray-100 outline-none"
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* Season Select */}
      <select
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="border px-4 py-2 rounded-xl font-semibold bg-gray-100 outline-none"
      >
        <option value="">Select Season</option>
        <option value="Kharif">🌧️ Kharif</option>
        <option value="Rabi">❄️ Rabi</option>
        <option value="Zaid">☀️ Zaid</option>
      </select>

      {/* Button */}
      <button
        disabled={!stateName || !season}
        onClick={handleCheck}
        className="bg-[#3c9087] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-[#48ada3] transition"
      >
        Check Crops
      </button>
    </div>

    {/* Results Section */}
    {results.length > 0 ? (
      <>
        <p className="text-black font-semibold mb-4">
          Suitable crops for {stateName} in {season} season
        </p>

        <p className="text-sm text-gray-800 mb-6">
        {results.length} crops found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((crop, index) => (
            <div
              key={index}
              onClick={() => setSelectedCrop(crop)}
              className={`bg-white p-4 rounded-lg shadow text-center cursor-pointer
                hover:shadow-lg hover:-translate-y-1 transition
                ${selectedCrop === crop ? "ring-1 ring-gray-900" : ""}
              `}
            >
              <p className="text-lg font-semibold text-[#30736c]">
                  {crop}
              </p>
                {/* Tap hint */}
              
                {selectedCrop !== crop && (
                <span className="absolute top-2 right-3 text-xs text-gray-700 animate-pulse">
                  Tap me👆
                </span>
              )}
              

            </div>
          ))}
        </div>
      </>
    ) : (
      stateName &&
      season && (
        <p className="text-gray-800">
          No crop data found for the selected state and season.
        </p>
      )
    )}

    {/* Crop Insight Section */}
    {selectedCrop && cropInsights[selectedCrop] && (
      <div className="mt-10 bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-[#30736c] mb-4">
          {selectedCrop} Overview
        </h3>

        <p><b>Type:</b> {cropInsights[selectedCrop].type}</p>
        <p><b>Climate:</b> {cropInsights[selectedCrop].climate}</p>
        <p><b>Duration:</b> {cropInsights[selectedCrop].duration}</p>

        <p className="mt-3 text-gray-700">
          {cropInsights[selectedCrop].description}
        </p>
      </div>
    )}

    {/* Disclaimer */}
    <p className="mt-8 mb-2 text-sm text-gray-800 text-center">
      ⚠️ Crop suitability shown here is for reference purposes only and may vary with local conditions.
    </p>

  </div>
</div>
);
};

export default CropSuitability;
