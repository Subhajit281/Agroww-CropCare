import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import MyCrops from "./pages/MyCrops";
import CropSuitability from "./pages/CropSuitability";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import WeatherAlerts from "./pages/WeatherAlerts"
import Footer from "./components/Footer";


function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/crops" element={<Crops />} />
      <Route path="/my-crops" element={<MyCrops />} />
      <Route path="/calendar" element={<CropSuitability />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/weather-alerts" element={<WeatherAlerts />} />

    </Routes>
    <Footer />
    </>
  );
}

export default App;
