import React, { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Download, Play, Sparkle } from "lucide-react"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <section className="relative pt-20 pb-28 overflow-hidden z-0">
      {/* Enhanced background elements - all with very low z-indices */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900 z-0"></div>
      <div
        className="absolute -top-48 -left-48 w-[30rem] h-[30rem] bg-[#10b981]/10 rounded-full blur-3xl opacity-70 animate-pulse z-0"
        style={{ animationDuration: "10s" }}
      ></div>
      <div
        className="absolute -bottom-48 -right-48 w-[30rem] h-[30rem] bg-[#10b981]/10 rounded-full blur-3xl opacity-60 animate-pulse z-0"
        style={{ animationDuration: "14s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-[#10b981]/5 rounded-full blur-3xl opacity-50 animate-pulse z-0"
        style={{ animationDuration: "17s" }}
      ></div>

      {/* Floating particles - with very low z-index */}
      <div className="absolute inset-0 overflow-hidden z-[1] pointer-events-none">
        {mounted &&
          Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.1 + Math.random() * 0.3,
                transform: `scale(${0.5 + Math.random() * 1.5})`,
                animation: `float ${10 + Math.random() * 20}s linear infinite ${
                  Math.random() * 5
                }s`,
              }}
            ></div>
          ))}
      </div>

      <div className="container mx-auto px-4 relative z-[2]">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className={`space-y-8 ${
              mounted
                ? "animate-in fade-in slide-in-from-bottom-4 duration-1000"
                : "opacity-0"
            }`}
          >
            {/* Subtle label above main heading */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm mb-4">
              <Sparkle size={16} className="text-[#10b981]" />
              <span className="text-sm font-medium text-gray-300">
                أداة ذكية مدعومة بالذكاء الاصطناعي
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              حسّن كتابتك باللغة العربية{" "}
              <span className="relative inline-block">
                <span className="relative z-[3] bg-clip-text text-transparent bg-gradient-to-r from-[#10b981] to-emerald-400">
                  بذكاء
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#10b981] to-emerald-400/30 rounded-full"></span>
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300/90 leading-relaxed max-w-2xl mx-auto">
              أداة ذكية تساعدك على تحسين كتابتك باللغة العربية الفصحى، مع تصحيح
              القواعد وتحويل العامية إلى الفصحى
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
              <Button
                variant="default"
                size="lg"
                className="font-bold flex items-center gap-3 py-7 px-8 group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-gradient-to-r from-[#10b981] to-emerald-600 hover:from-emerald-600 hover:to-[#10b981]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                <Download size={22} className="relative z-[3]" />
                <span className="relative z-[3] text-lg">تثبيت الإضافة</span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex items-center gap-3 py-7 text-white px-8 border border-gray-700/70 hover:border-[#10b981]/50 bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 hover:text-[#10b981] transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <Play size={22} className="text-[#10b981]" />
                <span className="text-lg">شاهد الفيديو التوضيحي</span>
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-16 max-w-xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 transition-all duration-300 hover:bg-gray-800/40 hover:border-gray-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-[#10b981]">
                  +۱۰۰٪
                </div>
                <div className="text-sm text-gray-400 mt-1">تحسين النصوص</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 transition-all duration-300 hover:bg-gray-800/40 hover:border-gray-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-[#10b981]">
                  +۱۰۰۰۰
                </div>
                <div className="text-sm text-gray-400 mt-1">نص مصحح</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 transition-all duration-300 hover:bg-gray-800/40 hover:border-gray-700/50 col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-bold text-[#10b981]">
                  +۹۰٪
                </div>
                <div className="text-sm text-gray-400 mt-1">دقة التصحيح</div>
              </div>
            </div>

            {/* Scrolling dots */}
            <div className="pt-8 pb-2 flex justify-center animate-in fade-in duration-1000 delay-500">
              <svg
                className="w-8 h-8 text-gray-400 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
      `}</style>
    </section>
  )
}
