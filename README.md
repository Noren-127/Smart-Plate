# Smart-Plate
A Data-Driven Personalized Nutrition and Meal Planning System
# 🥗 SmartPlate

**SmartPlate** is a modern, full-stack meal planning and nutrition management web application designed to help users organize healthy meals, track nutrition, and simplify weekly meal prep.

---

## ✨ Features

- **Personalized Meal Planning:** Browse, plan, and organize balanced daily and weekly meals.
- **Meal Prep & Recipes:** Explore curated meal options—from fresh salads and balanced meal boxes to hearty roasts—with detailed nutritional insights.
- **Responsive Modern UI:** Clean, intuitive interface built with React and Tailwind CSS for seamless access across desktop and mobile devices.
- **Full-Stack Architecture:** Powered by a Node.js backend and MongoDB database for reliable data persistence and user management.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas URI)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Noren-127/Smart-Plate.git
   cd Smart-Plate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(If your backend is in a separate folder, run `npm install` inside that directory as well.)*

3. **Configure Environment Variables:**
   Create a `.env` file in the root (and/or `server/`) directory and add your configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the application:**
   - Start the frontend development server:
     ```bash
     npm run dev
     ```
   - Start the backend server (if separate):
     ```bash
     npm start
     ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---
