import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Instagram, Facebook, Twitter, Download, Play } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToPopup = () => {
    navigate("/popup");
  };

  return (
    <div className="min-h-screen text-white font-sans max-w-screen-xl mx-auto">
      {/* Header/Navigation */}
      <header
        className={`p-4 sticky top-0 z-10 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-sm border-b-2 border-gray-700 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <Navigation />
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              حسّن كتابتك باللغة العربية{" "}
              <span className="text-[#10b981]">بذكاء</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              أداة ذكية تساعدك على تحسين كتابتك باللغة العربية الفصحى، مع تصحيح
              القواعد وتحويل العامية إلى الفصحى
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={goToPopup}
                variant="green"
                size="lg"
                className="font-bold flex items-center gap-2"
              >
                <Download size={20} />
                تثبيت الإضافة
              </Button>
              <Button
                variant="gray"
                size="lg"
                className="flex items-center gap-2"
              >
                <Play size={20} />
                شاهد الفيديو التوضيحي
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <img
                src="/imgs/hero.png"
                alt="لسان - أداة تصحيح اللغة العربية"
                className="w-full max-w-md mx-auto rounded-lg"
                style={{
                  boxShadow: "0 0 30px 5px rgba(16, 185, 129, 0.4)",
                  filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Try It Now Section */}
      <section id="try-it" className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">
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
              <Button
                onClick={goToPopup}
                variant="green"
                size="lg"
                className="font-bold"
              >
                تحليل النص
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer"
        className="bg-gray-900 py-16 border-t border-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-right">
            {/* Logo and description */}
            <div className="md:col-span-1 flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-bold text-[#10b981]">لِسان</h2>
              <p className="mt-2 text-gray-400">
                أداتك الذكية لتحسين الكتابة باللغة العربية
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-lg mb-4 text-white">روابط سريعة</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white"
                  >
                    الميزات
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white">
                    التسعير
                  </a>
                </li>
                <li>
                  <a href="#video" className="text-gray-400 hover:text-white">
                    المدونة
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-lg mb-4 text-white">الدعم</h3>
              <ul className="space-y-3">
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

            {/* Follow Us */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-lg mb-4 text-white">تابعنا</h3>
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Instagram size={20} className="text-gray-300" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Facebook size={20} className="text-gray-300" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Twitter size={20} className="text-gray-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} لسان. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
