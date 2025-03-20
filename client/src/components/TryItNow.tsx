import React, { useState } from "react"
import { Button } from "../components/ui/button"
import axios, { AxiosError } from "axios"

// Improved type for API error responses
interface APIErrorResponse {
  error: string
  details?: string
  message?: string
  receivedType?: string
  validDialects?: string[]
  receivedDialect?: string
}

export const TryItNow = () => {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [actionType, setActionType] = useState<"correct" | "dialect">("correct")
  const [selectedDialect, setSelectedDialect] = useState<string>("egyptian")
  const [apiError, setApiError] = useState<AxiosError<APIErrorResponse> | null>(
    null
  )

  // Count words in Arabic text
  const countWords = (text: string) => {
    if (!text) return 0
    // Split by whitespace and filter out empty strings
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInputText(text)
    setWordCount(countWords(text))
  }

  // Handle text processing
  const handleProcessText = async () => {
    setApiError(null) // Reset any previous errors
    if (!inputText.trim()) return

    setIsLoading(true)

    try {
      // Get the API base URL from environment or use default
      const apiBase = process.env.NEXT_PUBLIC_API_URL || ""

      // Convert relative paths to absolute URLs
      const apiUrl = apiBase.startsWith("http")
        ? apiBase
        : `${window.location.origin}/api` // Always use /api for local development

      if (actionType === "correct") {
        // For correction, use the specific endpoint
        const correctEndpoint = `${apiUrl}/correct`

        const response = await axios.post(correctEndpoint, {
          text: inputText,
        })

        if (response.data && response.data.correctedText) {
          setOutputText(response.data.correctedText)
        } else {
          setOutputText("حدث خطأ أثناء معالجة النص. الرجاء المحاولة مرة أخرى.")
        }
      } else {
        // For dialect conversion, use the dialect endpoint
        const dialectEndpoint = `${apiUrl}/dialect`

        const requestBody = {
          text: inputText,
          dialect: selectedDialect,
        }

        const response = await axios.post(dialectEndpoint, requestBody)

        if (response.data && response.data.convertedText) {
          setOutputText(response.data.convertedText)
        } else {
          console.error("Invalid API response:", response.data)
          setOutputText("حدث خطأ أثناء تحويل النص. الرجاء المحاولة مرة أخرى.")
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<APIErrorResponse>
        console.error(
          "API error details:",
          axiosError.response?.data || axiosError.message
        )
        setApiError(axiosError)
        setOutputText(
          `حدث خطأ أثناء معالجة النص: ${
            axiosError.response?.status || "unknown"
          } - ${
            (axiosError.response?.data as APIErrorResponse)?.error ||
            axiosError.message
          }`
        )
      } else {
        console.error("Error processing text:", error)
        setOutputText(
          "حدث خطأ أثناء الاتصال بالخادم. الرجاء المحاولة مرة أخرى."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="try-it" className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-4 lg:p-8 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">
            جرب الأداة مباشرة
          </h2>

          <div className="mb-6 flex justify-center">
            <div className="flex p-1 bg-gray-700 rounded-lg">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  actionType === "correct"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setActionType("correct")}
              >
                تصحيح النص
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  actionType === "dialect"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setActionType("dialect")}
              >
                تحويل اللهجة
              </button>
            </div>
          </div>

          {actionType === "dialect" && (
            <div className="mb-6">
              <label className="block text-center text-gray-300 mb-2">
                اختر اللهجة:
              </label>
              <div className="flex justify-center gap-3 flex-wrap">
                <Button
                  variant={
                    selectedDialect === "egyptian" ? "default" : "secondary"
                  }
                  size="sm"
                  onClick={() => setSelectedDialect("egyptian")}
                >
                  المصرية
                </Button>
                <Button
                  variant={
                    selectedDialect === "levantine" ? "default" : "secondary"
                  }
                  size="sm"
                  onClick={() => setSelectedDialect("levantine")}
                >
                  الشامية
                </Button>
                <Button
                  variant={selectedDialect === "gulf" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedDialect("gulf")}
                >
                  الخليجية
                </Button>
                <Button
                  variant={
                    selectedDialect === "moroccan" ? "default" : "secondary"
                  }
                  size="sm"
                  onClick={() => setSelectedDialect("moroccan")}
                >
                  المغربية
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold">المدخل</h3>
                <span className="text-gray-400 text-sm">{wordCount} كلمات</span>
              </div>
              <textarea
                className="w-full h-40 bg-gray-800 border border-gray-700 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="اكتب نصك هنا..."
                value={inputText}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="bg-gray-900 rounded p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold">النتيجة</h3>
              </div>
              <div className="w-full h-40 bg-gray-800 border border-gray-700 rounded p-3 overflow-auto">
                {isLoading ? (
                  <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-2"></div>
                    <p>جاري تحليل النص...</p>
                  </div>
                ) : outputText ? (
                  <div className="text-white">{outputText}</div>
                ) : (
                  <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p>
                      {actionType === "correct"
                        ? "ستظهر هنا نتيجة التصحيح"
                        : "ستظهر هنا نتيجة تحويل اللهجة"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button
              variant="default"
              size="lg"
              className="font-bold"
              onClick={handleProcessText}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading
                ? "جاري المعالجة..."
                : actionType === "correct"
                ? "تصحيح النص"
                : `تحويل إلى اللهجة ${
                    selectedDialect === "egyptian"
                      ? "المصرية"
                      : selectedDialect === "levantine"
                      ? "الشامية"
                      : selectedDialect === "gulf"
                      ? "الخليجية"
                      : "المغربية"
                  }`}
            </Button>

            {apiError && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-900/30 text-red-500 text-sm text-left rounded-md">
                <p className="font-semibold">
                  خطأ في الاتصال ({apiError.response?.status || apiError.code}):
                </p>
                <p>
                  {(apiError.response?.data as APIErrorResponse)?.error ||
                    apiError.message}
                </p>
                <p className="text-xs mt-1 text-red-400">
                  {JSON.stringify(apiError.response?.data)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
