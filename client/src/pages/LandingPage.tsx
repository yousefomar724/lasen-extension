import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToPopup = () => {
    navigate("/popup");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header/Navigation */}
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white ml-2">لسان</h1>
          </div>
          <nav>
            <ul className="flex space-x-6 space-x-reverse">
              <li>
                <a href="#" className="text-white">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  الميزات
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  التسعير
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  الفيديو
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-md bg-gray-700 text-white">
              تسجيل دخول
            </button>
            <button className="px-4 py-2 rounded-md bg-green-500 text-white">
              تجربة مجانية
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">
              حسّن كتابتك باللغة العربية بذكاء
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              أداة ذكية تساعدك على تحسين كتابتك باللغة العربية الفصحى، مع تصحيح
              القواعد وتحويل العامية إلى الفصحى
            </p>
            <div className="flex gap-4">
              <button
                onClick={goToPopup}
                className="px-6 py-3 bg-green-500 text-white rounded-md font-bold"
              >
                تجربة الأداة
              </button>
              <button className="px-6 py-3 bg-gray-700 text-white rounded-md">
                شاهد الفيديو التوضيحي
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-gray-800 rounded-lg shadow-xl p-2 w-full max-w-md mx-auto">
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-900 p-4 rounded">
                  <div className="text-right">
                    <p className="mb-2">انا اريد ان اتعلم العربيه الفصحى</p>
                    <p className="text-gray-400 text-sm">النص به أخطاء لغوية</p>
                    <div className="mt-2 border-r-4 border-red-500 pr-2 py-1">
                      أنا أريد أن أتعلم اللغة العربية الفصحى
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            مميزات متقدمة لتحسين الكتابة
          </h2>
          <p className="text-center text-gray-400 mb-10">
            كل ما تحتاجه متوفر في مكان واحد
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg">
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

            <div className="bg-gray-800 p-8 rounded-lg">
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

            <div className="bg-gray-800 p-8 rounded-lg">
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

      {/* Try It Now Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              جرب الأداة مباشرة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">المدخل</h3>
                  <span className="text-gray-400 text-sm">0 كلمات</span>
                </div>
                <textarea
                  className="w-full h-40 bg-gray-800 border border-gray-700 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="اكتب نصك هنا..."
                ></textarea>
              </div>
              <div className="bg-gray-900 rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">النتيجة</h3>
                </div>
                <div className="w-full h-40 bg-gray-800 border border-gray-700 rounded p-3 flex items-center justify-center">
                  <div className="text-center text-gray-500">
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
                    <p>ستظهر هنا نتيجة التصحيح</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={goToPopup}
                className="px-6 py-3 bg-green-500 text-white rounded-md font-bold"
              >
                تحليل النص
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">لسان</h2>
              <p className="text-gray-400 max-w-xs">
                أداةٌ ذكية لتحسين الكتابة باللغة العربية
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">روابط سريعة</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      الرئيسية
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      الميزات
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      التسعير
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      الفيديو
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">دعم</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      المساعدة
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      الأسئلة الشائعة
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      اتصل بنا
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} لسان. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM8.5 9.5H10.5V10.5H8.5V14.5H10.5V15.5H8.5V16.5H10.5C11.603 16.5 12.5 15.603 12.5 14.5V13.5C12.5 12.947 12.053 12.5 11.5 12.5C12.053 12.5 12.5 12.053 12.5 11.5V10.5C12.5 9.397 11.603 8.5 10.5 8.5H8.5V9.5ZM15.5 9.5C14.397 9.5 13.5 10.397 13.5 11.5V14.5C13.5 15.603 14.397 16.5 15.5 16.5C16.603 16.5 17.5 15.603 17.5 14.5V11.5C17.5 10.397 16.603 9.5 15.5 9.5ZM15.5 10.5C16.053 10.5 16.5 10.947 16.5 11.5V14.5C16.5 15.053 16.053 15.5 15.5 15.5C14.947 15.5 14.5 15.053 14.5 14.5V11.5C14.5 10.947 14.947 10.5 15.5 10.5Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.5 3H7.5C4.55 3 2.5 5.05 2.5 8V16C2.5 18.95 4.55 21 7.5 21H16.5C19.45 21 21.5 18.95 21.5 16V8C21.5 5.05 19.45 3 16.5 3ZM12 15C10.075 15 8.5 13.427 8.5 11.5C8.5 9.575 10.075 8 12 8C13.925 8 15.5 9.575 15.5 11.5C15.5 13.427 13.925 15 12 15ZM19 7.5H17C16.448 7.5 16 7.052 16 6.5V4.5C16 3.948 16.448 3.5 17 3.5H19C19.552 3.5 20 3.948 20 4.5V6.5C20 7.052 19.552 7.5 19 7.5Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.92 6.62C22.8 6.14 22.56 5.7 22.22 5.35C21.88 5 21.46 4.75 21 4.62C19.28 4.2 12 4.2 12 4.2C12 4.2 4.72 4.2 3 4.62C2.54 4.75 2.12 5 1.78 5.35C1.44 5.7 1.2 6.14 1.08 6.62C0.82 8.4 0.82 12 0.82 12C0.82 12 0.82 15.6 1.08 17.38C1.2 17.86 1.44 18.3 1.78 18.65C2.12 19 2.54 19.25 3 19.38C4.72 19.8 12 19.8 12 19.8C12 19.8 19.28 19.8 21 19.38C21.46 19.25 21.88 19 22.22 18.65C22.56 18.3 22.8 17.86 22.92 17.38C23.18 15.6 23.18 12 23.18 12C23.18 12 23.18 8.4 22.92 6.62ZM9.77 15.14L9.77 8.86L15.45 12L9.77 15.14Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
