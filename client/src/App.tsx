import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import PopupPage from "./pages/PopupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/popup" element={<PopupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
