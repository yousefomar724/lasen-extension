import React from "react"
import ReactDOM from "react-dom/client"
import Popup from "./Popup"
import "../index.css"

// Create a wrapper div with RTL attributes to ensure proper RTL layout
const RTLWrapper = () => {
  return (
    <div dir="rtl" className="rtl">
      <Popup />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RTLWrapper />
  </React.StrictMode>
)
