/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";





const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    


    try {
    const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, formData);
    
    toast.success(res.data.message || "Signup successful!");
    setTimeout(() => navigate("/login"), 2000);


  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  }finally {
    setLoading(false);
  }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-[#30736c]">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Join Agroww
        </p>

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
            className="absolute right-3 top-5/8 -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>


          {/* Role */}
          {/* <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="farmer">Farmer</option>
            <option value="admin">Admin</option>
          </select> */}
          

          <button
            type="submit"
           className="w-full bg-[#3c9087] text-white py-3 mt-6 rounded-lg hover:bg-[#48ada3] transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#3c9087] font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
