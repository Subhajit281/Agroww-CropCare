import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import LogoutModal from "./LogoutModal.jsx";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";


const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ NEW: Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears token + updates navbar
    setShowLogoutModal(false);
    setIsMenuOpen(false); // ✅ close mobile menu too
    navigate("/");
  };

  return (
    <>
      <nav className="bg-[#c6e7e3] shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-[#30736c]"
            onClick={() => setIsMenuOpen(false)}
          >
            Agroww
          </Link>

          {/* Nav Links (Desktop Only) */}
          <div className="hidden md:flex items-center gap-12">
            <Link
              to="/"
              className="text-gray-900 font-semibold text-lg hover:text-gray-700"
            >
              Home
            </Link>

            <Link
              to="/crops"
              className="text-gray-900 font-semibold text-lg hover:text-gray-700"
            >
              Crops
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/my-crops"
                  className="text-gray-900 font-semibold text-lg hover:text-gray-700"
                >
                  My Crops
                </Link>

                <Link
                  to="/calendar"
                  className="text-gray-900 font-semibold text-lg hover:text-gray-700"
                >
                  Crop Suitability
                </Link>

                <Link
                  to="/weather-alerts"
                  className="text-gray-900 font-semibold text-lg hover:text-gray-700"
                >
                  Weather Alerts
                </Link>
              </>
            )}
          </div>

          {/* Right Side (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-[#3c9087] font-semibold text-lg hover:underline"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-[#3c9087] text-white px-4 py-2 rounded-lg hover:bg-[#48ada3] transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-800 font-semibold text-lg hover:text-gray-600"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/*  Mobile Hamburger Button */}
          <button
            className="md:hidden text-gray-900 text-3xl mr-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <ImCross size={20} /> : <GiHamburgerMenu size={20}/>
}
          </button>
        </div>

        {/*  Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#c6e7e3] shadow-lg px-6 py-4 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-900 font-semibold text-lg hover:text-gray-700"
            >
              Home
            </Link>

            <Link
              to="/crops"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-900 font-semibold text-lg hover:text-gray-700"
            >
              Crops
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/my-crops"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-900 font-semibold text-lg hover:text-gray-700"
                >
                  My Crops
                </Link>

                <Link
                  to="/calendar"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-900 font-semibold text-lg hover:text-gray-700"
                >
                  Crop Suitability
                </Link>

                <Link
                  to="/weather-alerts"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-900 font-semibold text-lg hover:text-gray-700"
                >
                  Weather Alerts
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-800 text-lg hover:text-green-600"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-fit"
                >
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#3c9087] font-semibold text-lg hover:underline"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[#3c9087] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-fit"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default Navbar;
