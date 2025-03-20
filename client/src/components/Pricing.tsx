import React from "react"
import { Button } from "./ui/button"
import { Check, X } from "lucide-react"

export function Pricing() {
  return (
    <section id="pricing" className="py-16 bg-gray-950/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">الخطط المدفوعة</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          اختر الخطة المناسبة لاحتياجاتك وابدأ في تحسين كتابتك اليوم
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-800 rounded-xl overflow-hidden transition-all hover:translate-y-[-5px]">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold mb-2">الخطة المجانية</h3>
              <div className="text-3xl font-bold text-[#10b981] flex items-end gap-2">
                <span>$0</span>
                <span className="text-gray-400 text-sm font-normal mb-1">
                  / شهرياً
                </span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                مثالية لمن يريد تجربة الخدمة
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>10 تصحيحات يومياً</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>تحويل محدود بين اللهجات</span>
                </li>
                <li className="flex gap-2 items-center text-gray-500">
                  <X size={18} className="text-red-500" />
                  <span>لا يوجد دعم للمقترحات الأسلوبية المتقدمة</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="secondary">
                ابدأ مجاناً
              </Button>
            </div>
          </div>

          {/* Individual Plan */}
          <div className="bg-gray-800 rounded-xl overflow-hidden transition-all hover:translate-y-[-5px] relative">
            <div className="absolute top-0 right-0 bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              الأكثر شعبية
            </div>
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <h3 className="text-xl font-bold mb-2">الخطة الفردية</h3>
              <div className="text-3xl font-bold text-[#10b981] flex items-end gap-2">
                <span>$9.99</span>
                <span className="text-gray-400 text-sm font-normal mb-1">
                  / شهرياً
                </span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                للمستخدمين الفرديين الذين يحتاجون تصحيحات غير محدودة
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>تصحيحات غير محدودة</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>تحويل كامل بين جميع اللهجات</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>مقترحات أسلوبية متقدمة</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>إحصائيات استخدام شخصية</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="default">
                اشترك الآن
              </Button>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-gray-800 rounded-xl overflow-hidden transition-all hover:translate-y-[-5px]">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold mb-2">خطة الأعمال</h3>
              <div className="text-3xl font-bold text-[#10b981] flex items-end gap-2">
                <span>$24.99</span>
                <span className="text-gray-400 text-sm font-normal mb-1">
                  / شهرياً
                </span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                للشركات والفرق التي تحتاج إلى ميزات إدارية
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>جميع ميزات الخطة الفردية</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>واجهة إدارة مركزية</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>تقارير استخدام مفصلة</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>تخصيص لمتطلبات الشركة</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>دعم أولوي</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="secondary">
                اطلب عرضاً
              </Button>
            </div>
          </div>

          {/* Educational Plan */}
          <div className="bg-gray-800 rounded-xl overflow-hidden transition-all hover:translate-y-[-5px]">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/40 to-blue-800/30">
              <h3 className="text-xl font-bold mb-2">خطة المؤسسات التعليمية</h3>
              <div className="text-3xl font-bold text-[#10b981] flex items-end gap-2">
                <span>$14.99</span>
                <span className="text-gray-400 text-sm font-normal mb-1">
                  / شهرياً
                </span>
              </div>
              <div className="mt-2 py-1 px-2 bg-blue-600 text-white text-xs inline-block rounded">
                خصم 40%
              </div>
              <p className="mt-2 text-gray-400 text-sm">
                للمدارس والجامعات والمؤسسات التعليمية
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>جميع ميزات خطة الأعمال</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>أدوات تعليمية إضافية</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>لوحة تحكم للمعلمين والأساتذة</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check size={18} className="text-[#10b981]" />
                  <span>تكامل مع أنظمة إدارة التعلم</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="secondary">
                تواصل معنا
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">
            جميع الخطط تأتي مع 14 يوماً ضمان استرداد الأموال. يمكنك الترقية أو
            الإلغاء في أي وقت.
          </p>
          <Button variant="default" size="lg" className="mt-4">
            قارن الخطط بالتفصيل
          </Button>
        </div>
      </div>
    </section>
  )
}
