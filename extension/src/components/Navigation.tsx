import React from "react";
import { AlignJustify } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const navItems = [
  { label: "الرئيسية", href: "#", isActive: true },
  { label: "الميزات", href: "#features" },
  { label: "التسعير", href: "#pricing" },
  { label: "المدونة", href: "#blog" },
];

export function Navigation() {
  return (
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#10b981] ml-2">لِسان</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    item.isActive ? "text-white" : "text-gray-300"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="gray" size="sm">
          تسجيل دخول
        </Button>
        <Button variant="green" size="sm">
          تجربة مجانية
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <AlignJustify size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 border-gray-800">
            <SheetHeader>
              <SheetTitle className="text-white text-right">لسان</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col mt-6 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-right px-2 py-2 rounded-md text-sm font-medium ${
                    item.isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-800">
                <Button
                  variant="gray"
                  size="sm"
                  className="w-full mb-2 justify-center"
                >
                  تسجيل دخول
                </Button>
                <Button
                  variant="green"
                  size="sm"
                  className="w-full justify-center"
                >
                  تجربة مجانية
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
