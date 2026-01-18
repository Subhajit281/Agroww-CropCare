import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {;

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        formData
      );

      toast.success(res.data.message || "Login successful!");

      // ✅ update global auth state + save token
      login(res.data.token, res.data.user);

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] px-4">
      <div className="bg-white shadow-2xl rounded-xl px-8 py-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#30736c]">Login</h2>

        <p className="text-center text-gray-500 mt-2">Welcome Back Farmer!</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mt-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48ada3]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#48ada3]"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3c9087] text-white py-3 mt-6 rounded-lg hover:bg-[#48ada3] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#3c9087] font-medium hover:underline"
          >
            Signup
          </Link>
        </p>

       <p className="text-center text-xs text-gray-500 mt-2">* Forgot Password currently not in work</p>
        {/* <p className="text-center text-gray-600">
          Forgot password?{" "}
          <Link
            to="/forgotpassword"
            className="text-[#48ada3] font-medium hover:underline"
          >
            Recover
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
