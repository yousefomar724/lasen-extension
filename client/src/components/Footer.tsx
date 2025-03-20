import React from "react"
import { Instagram, Facebook, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-right">
          {/* Logo and description */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <Image
              src="/imgs/logo.png"
              alt="لِسان"
              className="h-auto w-14 mb-2"
              width={0}
              height={0}
              sizes="100vw"
            />
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
                <a href="#features" className="text-gray-400 hover:text-white">
                  الميزات
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white">
                  التسعير
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
  )
}
