/// <reference types="chrome" />

import React, { useState, useEffect } from "react";

// Correction history interface
interface Correction {
  _id: string;
  originalText: string;
  correctedText: string;
  source: string;
  createdAt: string;
}

interface CorrectionResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Correction[];
}

// Settings interface
interface UserSettings {
  processInputs: boolean;
  processTextareas: boolean;
  processContentEditable: boolean;
}

const Popup = () => {
  const [activeTab, setActiveTab] = useState("corrections");
  const [isEnabled, setIsEnabled] = useState(true);
  const [wordCount] = useState(259);
  const [errorCount] = useState(3);
  const [saveStatus, setSaveStatus] = useState("");

  // Corrections state
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    processInputs: true,
    processTextareas: true,
    processContentEditable: true,
  });

  // Fetch corrections from the API
  const fetchCorrections = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/corrections?page=${page}&limit=5`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: CorrectionResponse = await response.json();

      if (data.success) {
        setCorrections(data.data);
        setCurrentPage(data.page);
        setTotalPages(data.pages);
        setTotalItems(data.total);
      } else {
        throw new Error("Failed to fetch corrections");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching corrections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load settings on initial render
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(
        {
          processInputs: true,
          processTextareas: true,
          processContentEditable: true,
        },
        (items) => {
          setSettings(items as UserSettings);
        }
      );
    }

    // Fetch initial corrections
    fetchCorrections();
  }, []);

  // Handle individual setting change
  const handleSettingChange = (setting: keyof UserSettings) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting],
    };

    setSettings(newSettings);
  };

  // Save all settings
  const saveSettings = () => {
    // First show saving status
    setSaveStatus("جاري الحفظ...");

    // Save to Chrome storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set(settings, () => {
        console.log("Settings saved:", settings);

        // Show success message
        setSaveStatus("تم الحفظ!");

        // Notify content scripts about the settings change
        if (chrome.tabs) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              try {
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  { type: "SETTINGS_UPDATED" },
                  (response) => {
                    // Handle possible error
                    if (chrome.runtime.lastError) {
                      console.log(
                        "Message passing error:",
                        chrome.runtime.lastError.message
                      );
                      // Still consider settings saved successfully
                    }

                    // Clear status after 2 seconds
                    setTimeout(() => {
                      setSaveStatus("");
                    }, 2000);
                  }
                );
              } catch (error) {
                console.error("Error sending message:", error);
                // Still clear status after 2 seconds
                setTimeout(() => {
                  setSaveStatus("");
                }, 2000);
              }
            } else {
              // No active tab found, but settings are still saved
              setTimeout(() => {
                setSaveStatus("");
              }, 2000);
            }
          });
        } else {
          // If we can't communicate with tabs, still clear the status
          setTimeout(() => {
            setSaveStatus("");
          }, 2000);
        }
      });
    }
  };

  // Tabs configuration
  const tabs = [
    { id: "corrections", label: "التصحيحات" },
    { id: "settings", label: "الإعدادات" },
    { id: "language", label: "اللغة" },
    { id: "help", label: "المساعدة" },
  ];

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchCorrections(page);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-[380px] min-h-[500px] p-4 bg-gray-800 rounded-lg shadow-md flex flex-col rtl">
      {/* Header with switch */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">تصحيح</h1>
        <label className="relative inline-block w-11 h-6">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={() => setIsEnabled(!isEnabled)}
            className="opacity-0 w-0 h-0"
          />
          <span
            className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
              isEnabled ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <span
              className={`absolute h-5 w-5 bg-white rounded-full transition-all duration-300 bottom-0.5 left-0.5 ${
                isEnabled ? "transform translate-x-5" : ""
              }`}
            ></span>
          </span>
        </label>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm transition-all ${
              activeTab === tab.id
                ? "bg-blue-500 text-white rounded-t-md"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1">
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

        {activeTab === "settings" && (
          <div className="px-4 py-3 rtl">
            <h2 className="text-sm font-semibold text-white mb-4">
              عناصر الإدخال المراد تصحيحها
            </h2>
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <label className="flex items-center py-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.processInputs}
                  onChange={() => handleSettingChange("processInputs")}
                  className="mr-2 cursor-pointer"
                />
                حقول النص (Input)
              </label>

              <label className="flex items-center py-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.processTextareas}
                  onChange={() => handleSettingChange("processTextareas")}
                  className="mr-2 cursor-pointer"
                />
                مناطق النص (Textarea)
              </label>

              <label className="flex items-center py-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.processContentEditable}
                  onChange={() => handleSettingChange("processContentEditable")}
                  className="mr-2 cursor-pointer"
                />
                المحتوى القابل للتحرير (Contenteditable)
              </label>
            </div>

            <div className="flex items-center my-5">
              <button
                className={`bg-blue-500 text-white border-none rounded px-4 py-2 text-sm cursor-pointer transition-colors ${
                  saveStatus === "جاري الحفظ..."
                    ? "bg-gray-500 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                onClick={saveSettings}
                disabled={saveStatus === "جاري الحفظ..."}
              >
                حفظ الإعدادات
              </button>
              {saveStatus && (
                <span className="mr-3 text-sm text-green-500 animate-fadeIn">
                  {saveStatus}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mt-3 bg-gray-900/70 border border-gray-700 rounded-md p-3">
              يمكنك تحديد أنواع عناصر الإدخال التي تريد أن يعمل عليها المصحح.
              ستظهر أزرار التصحيح فقط بجانب العناصر المحددة.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-3 mt-4 border-t border-gray-700 text-gray-400 text-xs">
        <span>الإصدار ١.٢.٠</span>
        <span>حول</span>
      </div>
    </div>
  );
};

export default Popup;
