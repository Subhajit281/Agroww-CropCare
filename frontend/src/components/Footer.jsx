import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#c6e7e3] border-t border-black/10 mt-0">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-[#30736c]">Agroww</h2>
          <p className="text-gray-700 mt-2 text-sm leading-relaxed">
            Smart crop care platform to manage crops, get weather alerts and make
            better farming decisions — all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/crops" className="hover:underline">
                Crops
              </Link>
            </li>
            <li>
              <Link to="/my-crops" className="hover:underline">
                My Crops
              </Link>
            </li>
            <li>
              <Link to="/weather-alerts" className="hover:underline">
                Weather Alerts
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Developer
          </h3>

          <p className="text-gray-700 text-sm">
            Email:{" "}
            <a
              href="mailto:subhajitsarkar300400@gmail.com"
              className="hover:underline font-medium"
            >
              subhajitsarkar300400@gmail.com
            </a>
          </p>

          <p className="text-gray-700 text-sm mt-2">
            Location: Assam, India 🇮🇳
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-700 text-sm">
            © {new Date().getFullYear()} Agroww. All rights reserved.
          </p>

          <p className="text-gray-700 text-sm">
            Built with 💖 by <span className="font-semibold">Subhajit</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
