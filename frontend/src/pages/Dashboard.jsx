import { useEffect, useMemo, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdOutlineModeEditOutline } from "react-icons/md";


const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("Farmer");
  const [isEditing, setIsEditing] = useState(false);

  const [savingName, setSavingName] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [profilePic, setProfilePic] = useState(null);

  const [myCrops, setMyCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  // ✅ Redirect if token missing
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile picture updated!");
      setUser(res.data.user); // ✅ instant UI update
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  // ✅ SAVE NAME TO BACKEND (PERMANENT FIX)
  const handleSaveName = async () => {
    try {
      if (!username || username.trim().length < 2) {
        toast.error("Name must be at least 2 characters");
        return;
      }

      setSavingName(true);

      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/update-profile`,
        { name: username },
        config
      );

      toast.success(res.data.message || "Name updated successfully!");

      // update UI instantly
      setUser(res.data.user);
      setUsername(res.data.user.name);

      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1) Fetch profile
      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        config
      );

      const fetchedUser = profileRes.data.user;
      setUser(fetchedUser);
      setUsername(fetchedUser?.name || "Farmer");

      // 2) Fetch my crops
      const cropsRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/mycrops`,
        config
      );

      setMyCrops(cropsRes.data.crops || []);
    } catch (err) {
      console.log(err);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const recentCrops = myCrops.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 pt-24 px-6">
        <p className="text-center text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg rounded-xl p-8 flex flex-col md:flex-row md:items-center gap-6 mb-2">
          {/* Avatar */}
          <div className="relative w-fit">
            <div className="w-24 h-24 rounded-full bg-[#3c9087] flex items-center justify-center overflow-hidden text-white text-4xl font-bold">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                username.charAt(0).toUpperCase()
              )}
            </div>

            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
              <FaPlusCircle size={22} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Username + Email */}
          <div className="flex-1">
            {!isEditing ? (
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">{username}</h2>

                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-black font-semibold hover:underline"
                >
                  <MdOutlineModeEditOutline size={21} />

                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border px-3 py-1 rounded-lg "
                />

                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="bg-[#3c9087] text-white px-3 py-1 rounded hover:bg-[#48ada3] disabled:opacity-60"
                >
                  {savingName ? "Saving..." : "Save"}
                </button>

              </div>
            )}

            <p className="text-gray-800 mt-1">
              Welcome to your farming dashboard 
            </p>

            {user?.email && (
              <p className="text-gray-600 mt-2 text-sm">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            )}
          </div>

          {/* Small badge */}
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium text-sm w-fit">
            Logged In
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg rounded-xl p-8">
            <p className="text-gray-900 text-sm">My Crops</p>
            <h3 className="text-3xl font-bold text-[#3c9087]">
              {myCrops.length}
            </h3>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg rounded-xl p-8">
            <p className="text-gray-900 text-sm">Recent Crop Added</p>
            <h3 className="text-xl font-bold text-[#3c9087] mt-2">
              {myCrops.length > 0 ? myCrops[0].name : "No crops yet"}
            </h3>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg rounded-xl p-8">
            <p className="text-gray-900 text-sm">Quick Tip</p>
            <p className="text-gray-600 mt-2">
              Keep crop location updated to get better weather alert results 
            </p>
          </div>
        </div>

        {/* Recent Crops + Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Recent Crops */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg rounded-xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Crops
            </h3>

            {recentCrops.length === 0 ? (
              <p className="text-gray-800">
                No crops added yet. Add your first crop now!
              </p>
            ) : (
              <div className="space-y-3">
                {recentCrops.map((crop) => (
                  <div
                    key={crop._id}
                    className="flex items-center justify-between border rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{crop.name}</p>
                      <p className="text-sm text-gray-700">
                        {crop.month} •{" "}
                        {crop.location?.name
                          ? `${crop.location.name}${
                              crop.location.state ? `, ${crop.location.state}` : ""
                            }${
                              crop.location.country
                                ? `, ${crop.location.country}`
                                : ""
                            }`
                          : "Unknown location"}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/my-crops")}
                      className="text-[#3c9087] font-medium hover:underline"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg rounded-xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/my-crops")}
                className="border-white border-2 px-2 py-2 rounded-lg bg-[#c5e7e4] text-black hover:bg-[#9ad5cf] cursor-pointer"
              >
                Add / Manage My Crops
              </button>

              <button
                onClick={() => navigate("/crops")}
                className="border-white border-2 px-2 py-2 rounded-lg bg-[#c5e7e4] text-black hover:bg-[#9ad5cf] cursor-pointer"
              >
                Explore Various Crops
              </button>

              <button
                onClick={() => navigate("/calendar")}
                className="border-white border-2 px-2 py-2 rounded-lg bg-[#c5e7e4] text-black hover:bg-[#9ad5cf] cursor-pointer"
              >
               Check Crop Suitability
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-4">
              Tip: Add crops first to get better recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
