"use client"

import React, { useState, useEffect } from "react"
import { Navigation } from "../components/Navigation"
import { Hero } from "../components/Hero"
import { Features } from "../components/Features"
import { TryItNow } from "../components/TryItNow"
import { Footer } from "../components/Footer"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen text-white font-zarid bg-gray-900">
      {/* Header/Navigation */}
      <header
        className={`px-2 sticky top-0 z-10 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-sm border-b-2 border-gray-700 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <Navigation />
      </header>

      {/* Main sections */}
      <main>
        <Hero />
        <Features />
        {/* <Pricing /> */}
        <TryItNow />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
