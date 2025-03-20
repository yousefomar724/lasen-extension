import React from "react"

export function Features() {
  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          مميزات متقدمة لتحسين الكتابة
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          كل ما تحتاجه متوفر في مكان واحد
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-lg hover:shadow-lg transition-all hover:translate-y-[-5px]">
            <div className="bg-green-500/20 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12L9 16L19 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">تصحيح القواعد</h3>
            <p className="text-gray-400">
              تصحيح الأخطاء النحوية والإملائية والترقيم مع شرح للأسباب
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg hover:shadow-lg transition-all hover:translate-y-[-5px]">
            <div className="bg-blue-500/20 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <svg
                className="w-6 h-6 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 8L3 12L7 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 8L21 12L17 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 4L10 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">تحويل العامية</h3>
            <p className="text-gray-400">
              تحويل النصوص من اللغة العربية العامية إلى الفصحى بسهولة
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg hover:shadow-lg transition-all hover:translate-y-[-5px]">
            <div className="bg-purple-500/20 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <svg
                className="w-6 h-6 text-purple-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19L17 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 14L14 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 9L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 4L12 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 19C7 19 5 19 5 17C5 15 7 15 7 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 15C7 15 5 15 5 13C5 11 7 11 7 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 11C7 11 5 11 5 9C5 7 7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7C7 7 5 7 5 5C5 3 7 3 7 3L17 3C17 3 19 3 19 5C19 7 17 7 17 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">اقتراحات أسلوبية</h3>
            <p className="text-gray-400">
              تحسين أسلوب الكتابة مع اقتراحات لكلمات وتعابير أفضل
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
