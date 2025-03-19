import React from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../popup/Popup";

const PopupPage = () => {
  const navigate = useNavigate();

  // Function to go back to landing page
  const goToLanding = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={goToLanding}
            className="flex items-center text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            العودة إلى الصفحة الرئيسية
          </button>
        </div>

        <div className="flex justify-center">
          <Popup />
        </div>
      </div>
    </div>
  );
};

export default PopupPage;
