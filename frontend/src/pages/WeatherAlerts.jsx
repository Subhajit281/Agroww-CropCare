import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WeatherAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/weather-alerts`,
        config
      );

      const alertsArr = res.data?.alerts || res.data?.data?.alerts || [];
      setAlerts(alertsArr);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to load weather alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // helper
  const formatTemp = (n) =>
    typeof n === "number" && !Number.isNaN(n) ? `${n.toFixed(1)}°C` : "--";

  const formatMM = (n) =>
    typeof n === "number" && !Number.isNaN(n) ? `${n.toFixed(1)} mm` : "--";

  const formatWind = (n) =>
    typeof n === "number" && !Number.isNaN(n) ? `${n.toFixed(1)} km/h` : "--";

  const getDailyPreview = (item) => {
    const daily = item?.weather?.daily;

    if (!daily?.time?.length) return null;

    // Day-0 = today
    const i = 0;

    return {
      date: daily.time[i],
      maxTemp: daily.temperature_2m_max?.[i],
      minTemp: daily.temperature_2m_min?.[i],
      rain: daily.precipitation_sum?.[i],
      wind: daily.wind_speed_10m_max?.[i],
    };
  };

  const getNext3Days = (item) => {
    const daily = item?.weather?.daily;
    if (!daily?.time?.length) return [];

    const days = [];

    for (let i = 0; i < Math.min(3, daily.time.length); i++) {
      days.push({
        date: daily.time[i],
        maxTemp: daily.temperature_2m_max?.[i],
        minTemp: daily.temperature_2m_min?.[i],
        rain: daily.precipitation_sum?.[i],
        wind: daily.wind_speed_10m_max?.[i],
      });
    }

    return days;
  };

  // ✅ safety rules
  const RAIN_ALERT_MM = 10;
  const WIND_ALERT_KMH = 8;

  const isRiskyDay = (day) => {
    const rain = Number(day?.rain ?? 0);
    const wind = Number(day?.wind ?? 0);

    return rain >= RAIN_ALERT_MM || wind >= WIND_ALERT_KMH;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)]  pt-24 px-6">
        <p className="text-center text-gray-900">Loading weather alerts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weather Alerts</h1>
            <p className="text-gray-900 mt-1">
              Forecast warnings for your crop locations (next 3 days)
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            className="bg-[#3c9087] border-black border text-white px-3 py-2 rounded-lg hover:bg-[#48ada3]"
          >
            Refresh
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-900">
              No crops found or no alerts available yet.
            </p>
            <p className="text-gray-900 text-sm mt-2">
              Add crops in My Crops page with valid location to see forecast warnings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            {alerts.map((item) => {
              const preview = getDailyPreview(item);
              const next3Days = getNext3Days(item);

              // ✅ create warnings based on condition
              const totalWarnings = next3Days.filter(isRiskyDay).length;

              const warnings = next3Days
                .filter(isRiskyDay)
                .map((d) => ({
                  date: d.date,
                  rain: d.rain,
                  wind: d.wind,
                }));

              return (
                <div
                  key={item.cropId}
                  className="bg-[#E0F4F2] p-6 mb-10 rounded-2xl shadow flex flex-col gap-4 border border-green-100"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#30736c]">
                        {item.cropName}
                      </h2>

                      <p className="text-gray-600 text-sm mt-1">
                        {item.location?.name || "Unknown"}
                        {item.location?.state ? `, ${item.location.state}` : ""}
                        {item.location?.country
                          ? `, ${item.location.country}`
                          : ""}
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        Sown Month: {item.month || "--"}
                      </p>
                    </div>

                    <div
                      className={`px-5 py-1 rounded-full text-sm font-semibold ${
                        totalWarnings > 0
                          ? "bg-red-200 text-red-700"
                          : "bg-green-200 text-green-700"
                      }`}
                    >
                      {totalWarnings > 0 ? `${totalWarnings} Alerts` : "Safe "}
                    </div>
                  </div>

                  {/* Today Preview */}
                  <div className="border rounded-xl p-4 bg-[#D4EEEB]">
                    <p className="text-gray-500 text-sm">Today Forecast</p>

                    {preview ? (
                      <>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          Min/Max {formatTemp(preview.minTemp)}{" "}
                          <span className="text-gray-500 text-base font-medium">
                            / {formatTemp(preview.maxTemp)}
                          </span>
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
                          <p>🌧 Rain: {formatMM(preview.rain)}</p>
                          <p>💨 Wind: {formatWind(preview.wind)}</p>
                          <p className="col-span-2 text-gray-500 text-xs">
                            📅 {preview.date}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 mt-2">
                        Forecast not available.
                      </p>
                    )}
                  </div>

                  {/* Next 3 Days */}
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      Next 3 Days Forecast
                    </p>

                    <div className="space-y-2">
                      {next3Days.map((d, idx) => (
                        <div
                          key={idx}
                          className="border rounded-xl px-4 py-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm text-gray-500">{d.date}</p>
                            <p className="font-semibold text-gray-900">
                              {formatTemp(d.minTemp)} / {formatTemp(d.maxTemp)}
                            </p>
                          </div>

                          <div className="text-right text-sm text-gray-700">
                            <p>🌧 {formatMM(d.rain)}</p>
                            <p>💨 {formatWind(d.wind)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-gray-700 text-xs mt-3">
                      Alerts are based on rain ≥ {RAIN_ALERT_MM}mm or wind ≥{" "}
                      {WIND_ALERT_KMH} km/h.
                    </p>
                  </div>

                  {/* Warnings */}
                  {totalWarnings > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-red-700 mb-2">
                        ⚠️ Warnings
                      </p>

                      <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
                        {warnings.map((w, idx) => (
                          <div
                            key={idx}
                            className="border border-red-300 bg-red-200 rounded-xl px-4 py-3"
                          >
                            <p className="text-sm text-gray-700">{w.date}</p>
                            <p className="font-semibold text-gray-900">
                              🌧 Rain: {formatMM(w.rain)} | 💨 Wind:{" "}
                              {formatWind(w.wind)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safe message */}
                  {totalWarnings === 0 && (
                    <p className="text-gray-600 text-sm">
                      No risky weather detected in next 3 days.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAlerts;
