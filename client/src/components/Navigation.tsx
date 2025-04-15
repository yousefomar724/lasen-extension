import React from "react"
import { AlignJustify } from "lucide-react"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"

const navItems = [
  { label: "الرئيسية", href: "#", isActive: true },
  { label: "الميزات", href: "#features" },
  // { label: "التسعير", href: "#pricing" },
]

export function Navigation() {
  return (
    <>
      {/* Fixed header with very high z-index and more transparency */}
      <div className="fixed top-0 left-0 right-0 w-full bg-gray-900/40 backdrop-blur-md shadow-md z-[9999]">
        <div className="container mx-auto flex justify-between items-center p-2">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/imgs/logo.png"
              alt="لِسان"
              className="h-auto w-14"
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex justify-center flex-1">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`font-medium transition-colors hover:text-white ${
                      item.isActive ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#try-it"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" })
              )}
            >
              تجربة مجانية
            </a>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <AlignJustify className="!w-6 !h-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gray-900/80 backdrop-blur-md border-gray-800/50 z-[10000]"
              >
                <SheetHeader className="mb-6">
                  <div className="flex justify-center w-full mb-2">
                    <Image
                      src="/imgs/logo.png"
                      alt="لِسان"
                      className="h-auto w-16"
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  </div>
                  <SheetTitle className="text-white text-center">
                    لسان
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col mt-6 space-y-3">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`text-right px-2 py-2 rounded-md font-medium ${
                        item.isActive
                          ? "bg-gray-800/70 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-700/30">
                    <Button
                      variant="secondary"
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
      </div>

      {/* Placeholder div to push content below the fixed header */}
      <div className="h-[72px]"></div>
    </>
  )
}
