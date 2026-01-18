# 🌾 CropCare (Agroww)

CropCare (Agroww) is a MERN stack web application built to help farmers manage crops, check crop suitability, and get weather-based alerts for their crop locations.

---

## 🚀 Features

### 🔐 Authentication
- Signup / Login with JWT Authentication
- Protected routes for logged-in users
- Logout confirmation modal

### 👤 Dashboard
- Shows user profile details (name + email)
- Upload profile picture (Cloudinary)
- Edit and update username permanently
- Quick actions to navigate easily

### 🌱 Crop Management
- Add crops with:
  - Crop Name
  - Sown Month
  - Location (with real location validation using API)
- View all crops added by the user
- Remove crops anytime

### 🌾 Crop Explorer
- Explore different crops and their details
- Crop cards UI with images and descriptions

### 📅 Crop Suitability Checker
- Helps farmers check suitable crops based on selected month/location
- UI-based results (backend integration can be improved later)

### 🌦️ Weather Alerts (3-Day Forecast)
- Fetches forecast for the next 3 days for each crop location
- Displays:
  - Min/Max temperature
  - Rainfall
  - Wind speed
- Shows “Safe” or “Alert” based on risk conditions

### 🎨 Modern UI
- Responsive UI for desktop + mobile
- Glassmorphism dashboard design
- Gradient background theme
- Toast notifications for better UX

---

## 🛠 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast
- React Icons

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file upload)
- Cloudinary (image storage)
- External Weather API (Open Meteo)

---

## 📂 Project Structure

