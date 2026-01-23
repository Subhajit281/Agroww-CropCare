/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otp, setOtp] = useState("");

  // ✅ resend timer
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  // countdown effect
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // If email changes -> reset otp states
    if (e.target.name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setResendTimer(0);
    }
  };

  // ✅ Send OTP
  const handleSendOtp = async () => {
  console.log("SEND OTP CLICKED");

  if (!formData.email) return toast.error("Enter email first");

  setOtpLoading(true);

  try {
    const res = await axios.post(`${API}/api/auth/send-otp`, {
      email: formData.email,
    });

    toast.success(res.data.message || "OTP sent to email ✅");
    setOtpSent(true);
    setResendTimer(60);
  } catch (err) {
    console.log("OTP ERROR:", err);
    toast.error(err.response?.data?.message || "Failed to send OTP");
  } finally {
    setOtpLoading(false);
  }
};


  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!formData.email) return toast.error("Enter email first");
    if (!otp) return toast.error("Enter OTP");

    try {
      setVerifyLoading(true);

      const res = await axios.post(`${API}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });

      toast.success(res.data.message || "OTP verified ✅");
      setOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
      setOtpVerified(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  // ✅ Signup (only if OTP verified)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      return toast.error("Please verify OTP before signup ❌");
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/signup`, formData);

      toast.success(res.data.message || "Signup successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#30736c]">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mt-2">Join Agroww</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mt-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48ada3]"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48ada3]"
          />

          {/* Send OTP Button */}
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpLoading || otpVerified || resendTimer > 0}
            className="w-full bg-[#3c9087] text-white py-3 mt-2 rounded-lg hover:bg-[#48ada3] transition disabled:opacity-60"
          >
            {otpVerified
              ? "OTP Verified ✅"
              : otpLoading
              ? "Sending OTP..."
              : resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : otpSent
              ? "Resend OTP"
              : "Send OTP"}
          </button>

          {/* OTP input + Verify button */}
          {otpSent && !otpVerified && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48ada3]"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyLoading}
                className="w-full bg-[#2f6f68] text-white py-3 mt-2 rounded-lg hover:bg-[#3c9087] transition disabled:opacity-60"
              >
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#48ada3]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Signup button */}
          <button
            type="submit"
            disabled={loading || !otpVerified}
            className="w-full bg-[#3c9087] text-white py-3 mt-6 rounded-lg hover:bg-[#48ada3] transition disabled:opacity-60"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#3c9087] font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
