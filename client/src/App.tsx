import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import PopupPage from "./pages/PopupPage";

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/popup" element={<PopupPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
