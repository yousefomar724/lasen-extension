/// <reference types="chrome" />

import React, { useState, useEffect } from "react"

// Correction history interface
interface Correction {
  _id: string
  originalText: string
  correctedText: string
  source: string
  dialect?: string
  createdAt: string
}

interface CorrectionResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  data: Correction[]
}

// Settings interface
interface UserSettings {
  processInputs: boolean
  processTextareas: boolean
  processContentEditable: boolean
  instantCheck: boolean
}

const Popup = () => {
  const [activeTab, setActiveTab] = useState("corrections")
  const [isEnabled, setIsEnabled] = useState(true)
  const [wordCount] = useState(259)
  const [errorCount] = useState(3)
  const [saveStatus] = useState("")

  // Corrections state
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    processInputs: true,
    processTextareas: true,
    processContentEditable: true,
    instantCheck: false,
  })

  // Fetch corrections from the API
  const fetchCorrections = async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:5000/api/corrections?page=${page}&limit=5`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data: CorrectionResponse = await response.json()

      if (data.success) {
        setCorrections(data.data)
        setCurrentPage(data.page)
        setTotalPages(data.pages)
        setTotalItems(data.total)
      } else {
        throw new Error("Failed to fetch corrections")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error fetching corrections:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load settings on initial render
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(
        {
          processInputs: true,
          processTextareas: true,
          processContentEditable: true,
          instantCheck: false,
        },
        (items) => {
          setSettings(items as UserSettings)
        }
      )
    }

    // Fetch initial corrections
    fetchCorrections()
  }, [])

  // Handle individual setting change
  const handleSettingChange = (setting: keyof UserSettings) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [setting]: !prev[setting] }

      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.sync.set(newSettings)
      }

      return newSettings
    })
  }

  // Handle text correction with the current selected text
  const handleCorrection = () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "correctText" })
        }
      })
    }
  }

  // Handle dialect conversion with the current selected text
  const handleDialectConversion = (dialect: string) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "convertDialect",
            dialect: dialect,
          })
        }
      })
    }
  }

  // Tabs configuration
  // const tabs = [
  //   { id: "corrections", label: "التصحيحات" },
  //   { id: "settings", label: "الإعدادات" },
  //   { id: "language", label: "اللغة" },
  //   { id: "help", label: "المساعدة" },
  // ]

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    fetchCorrections(page)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Render the feature tab content
  const renderFeatures = () => {
    return (
      <div className="py-4 px-2">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold mb-2">معالجة النص</h2>
          <p className="text-gray-300 text-sm mb-4">
            اختر العملية المطلوبة لتطبيقها على النص المحدد
          </p>

          <button
            onClick={handleCorrection}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4 w-full transition-colors"
          >
            تصحيح النص
          </button>

          <h3 className="text-md font-bold mt-4 mb-2">تحويل اللهجة</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDialectConversion("egyptian")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              المصرية
            </button>
            <button
              onClick={() => handleDialectConversion("levantine")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              الشامية
            </button>
            <button
              onClick={() => handleDialectConversion("gulf")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              الخليجية
            </button>
            <button
              onClick={() => handleDialectConversion("moroccan")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              المغربية
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render settings tab content
  const renderSettings = () => {
    return (
      <div className="py-4 px-2">
        <h2 className="text-lg font-bold mb-4">الإعدادات</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm">معالجة حقول الإدخال:</label>
            <div
              onClick={() => handleSettingChange("processInputs")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.processInputs ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.processInputs ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">معالجة حقول النص المتعدد:</label>
            <div
              onClick={() => handleSettingChange("processTextareas")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.processTextareas ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.processTextareas ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">معالجة محتوى قابل للتحرير:</label>
            <div
              onClick={() => handleSettingChange("processContentEditable")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.processContentEditable ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.processContentEditable
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">تصحيح تلقائي فوري للكلمات:</label>
            <div
              onClick={() => handleSettingChange("instantCheck")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.instantCheck ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.instantCheck ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
          </div>

          {saveStatus && (
            <div className="text-green-500 text-xs mt-2">{saveStatus}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-gray-800 text-white min-h-96 rounded overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gray-900 py-3 px-4 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-xl font-bold">أداة تصحيح العربية</h1>
        <div
          onClick={() => setIsEnabled(!isEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
              isEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <div
          className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
            activeTab === "features"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("features")}
        >
          الميزات
        </div>
        <div
          className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
            activeTab === "corrections"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("corrections")}
        >
          السجل
        </div>
        <div
          className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
            activeTab === "settings"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          الإعدادات
        </div>
      </div>

      {/* Tab Content */}
      <div className="h-80 overflow-y-auto">
        {activeTab === "features" && renderFeatures()}
        {activeTab === "corrections" && (
          <>
            {/* Statistics */}
            <div className="flex justify-between bg-gray-900 rounded-md p-3 mb-4">
              <div className="text-right">
                <span className="block text-gray-400 text-sm mb-1">
                  عدد الكلمات
                </span>
                <span className="text-xl font-bold text-white">
                  {wordCount}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-gray-400 text-sm mb-1">
                  الأخطاء
                </span>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-white">
                    {errorCount}
                  </span>
                  {errorCount > 0 && (
                    <span className="inline-block bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold mr-2">
                      {errorCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Corrections History List */}
            <div className="flex flex-col space-y-3 ">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-5 text-gray-500">
                  <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                  <p>جاري تحميل التصحيحات...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-center">
                  <p>حدث خطأ: {error}</p>
                  <button
                    className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold text-sm"
                    onClick={() => fetchCorrections(currentPage)}
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : corrections.length === 0 ? (
                <div className="text-center p-5 text-gray-500 bg-gray-900 rounded-md">
                  <p>لا توجد تصحيحات سابقة</p>
                </div>
              ) : (
                <>
                  <div className="h-[200px] overflow-y-auto px-2 space-y-2">
                    {corrections.map((correction) => (
                      <div
                        key={correction._id}
                        className="bg-gray-900 rounded-lg shadow overflow-hidden border border-gray-700"
                      >
                        <div className="flex justify-between items-center p-3 bg-gray-700 border-b border-gray-600">
                          <span className="text-gray-400 text-sm">
                            {formatDate(correction.createdAt)}
                          </span>
                          {/* <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-200">
                          {correction.source === 'extension' ? 'إضافة المتصفح' : 'واجهة برمجة التطبيقات'}
                        </span> */}
                        </div>
                        <div className="p-4">
                          <div className="mb-3">
                            <p className="font-bold text-gray-300 mb-1">
                              النص الأصلي:
                            </p>
                            <p className="bg-red-900/20 p-3 rounded border-r-4 border-red-500 font-sans rtl leading-relaxed text-gray-200">
                              {correction.originalText}
                            </p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-300 mb-1">
                              النص المصحح:
                            </p>
                            <p className="bg-green-900/20 p-3 rounded border-r-4 border-green-500 font-sans rtl leading-relaxed text-gray-200">
                              {correction.correctedText}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded font-bold text-sm ${
                        currentPage === 1
                          ? "bg-gray-600 cursor-not-allowed text-gray-400"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      السابق
                    </button>

                    <span className="text-sm text-gray-400">
                      صفحة {currentPage} من {totalPages} (إجمالي التصحيحات:{" "}
                      {totalItems})
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded font-bold text-sm ${
                        currentPage === totalPages
                          ? "bg-gray-600 cursor-not-allowed text-gray-400"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      التالي
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {activeTab === "settings" && renderSettings()}
      </div>
    </div>
  )
}

export default Popup
