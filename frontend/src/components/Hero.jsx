import { Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
const Hero = () => {
  const { isLoggedIn } = useAuth();
  return (
    <section className="bg-[linear-gradient(150deg,#439d93,#4da89f,#E0F3F0,#f1f9f8)] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Smart Crop Care <br/>
            With Agroww
          </h1>

          <p className="mt-4 text-gray-900 text-xl">
            Manage crops, get weather alerts and make better farming
            decisions — all in one platform.
          </p>

          <div className="mt-6 flex gap-4">
          {!isLoggedIn ? (
            <Link
              to="/signup"
              className="bg-[#4da89f] text-black font-semibold px-6 py-3 rounded-lg border-black border shadow-lg hover:bg-[#439d93] transition"
            >
              Get Started
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="bg-[#4da89f] text-black font-semibold px-6 py-3 rounded-lg border-black border shadow-lg hover:bg-[#439d93] transition"
            >
              Go to Dashboard
            </Link>
          )}

          <Link
            to="/crops"
            className="bg-[#4da89f] text-black font-semibold px-6 py-3 rounded-lg border-black border shadow-lg hover:bg-[#439d93] transition"
          >
            Explore Crops
          </Link>
        </div>

        </div>

        {/* Right Illustration */}
        <div className="flex justify-center">
          <img
           // src ="https://res.cloudinary.com/dyxbvlzcl/image/upload/v1768736554/farmer-watering-crops-in-a-field-black-and-white-vintage-illustration-of-agriculture-vector_whsakc.jpg"
            src="https://res.cloudinary.com/dyxbvlzcl/image/upload/v1768736667/farmer-watering-crops-in-a-field-black-and-white-vintage-illustration-of-agriculture-vector-removebg-preview_ewhaks.png"
           alt="Farmer Illustration"
            className="w-[90%] max-w-lg rounded-xl "
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
