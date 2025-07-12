"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const { setTheme, theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-[10px] shadow-lg'
          : 'bg-transparent backdrop-blur-[8px]'
      }`}
    >
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/kenigswap-logo.svg"
              alt="KenigSwap"
              width={150}
              height={40}
              priority
              className="h-8 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <Link 
              href="/exchange" 
              className="text-[#001D8D] hover:opacity-80 transition-colors duration-200"
            >
              Exchange
            </Link>
            <Link 
              href="/rates" 
              className="text-[#001D8D] hover:opacity-80 transition-colors duration-200"
            >
              Rates
            </Link>
            <Link 
              href="/about" 
              className="text-[#001D8D] hover:opacity-80 transition-colors duration-200"
            >
              About
            </Link>
            <div className="relative">
              <button
                className="text-[#001D8D] hover:opacity-80 transition-colors duration-200 flex items-center gap-1"
                onClick={() => setPolicyDropdownOpen(!policyDropdownOpen)}
                onBlur={(e) => {
                  // Проверяем, что фокус не переходит на элемент внутри dropdown
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setTimeout(() => setPolicyDropdownOpen(false), 150);
                  }
                }}
              >
                Policy <ChevronDown className="h-4 w-4" />
              </button>
              {policyDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200"
                  onMouseLeave={() => setPolicyDropdownOpen(false)}
                >
                  <Link 
                    href="/policy/aml-kyc" 
                    className="block px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
                    onClick={() => setPolicyDropdownOpen(false)}
                  >
                    AML/CTF и KYC
                  </Link>
                  <Link 
                    href="/policy/terms" 
                    className="block px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
                    onClick={() => setPolicyDropdownOpen(false)}
                  >
                    Условия использования
                  </Link>
                  <Link 
                    href="/policy/privacy" 
                    className="block px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
                    onClick={() => setPolicyDropdownOpen(false)}
                  >
                    Политика конфиденциальности
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/support" 
              className="text-[#001D8D] hover:opacity-80 transition-colors duration-200"
            >
              Support
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-[#001D8D] hover:bg-[#001D8D]/10"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button 
              asChild 
              variant="ghost"
              className="text-[#001D8D] hover:bg-[#001D8D]/10"
            >
              <Link href="/login">Login</Link>
            </Button>
            
            <Button 
              asChild 
              className="bg-[#001D8D] hover:opacity-90 text-white font-medium"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-[#001D8D] hover:bg-[#001D8D]/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-md border-[#001D8D]/20">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image 
                      src="/brand/kenigswap-logo.svg"
                      alt="Kenigswap"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    href="/exchange" 
                    className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                  >
                    Exchange
                  </Link>
                  <Link 
                    href="/rates" 
                    className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                  >
                    Rates
                  </Link>
                  <Link 
                    href="/about" 
                    className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                  >
                    About
                  </Link>
                  <div className="p-2 text-[#001D8D]">
                    <div className="mb-2 font-medium">Policy</div>
                    <div className="pl-4 flex flex-col gap-2">
                      <Link 
                        href="/policy/aml-kyc" 
                        className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors text-sm"
                      >
                        AML/CTF и KYC
                      </Link>
                      <Link 
                        href="/policy/terms" 
                        className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors text-sm"
                      >
                        Условия использования
                      </Link>
                      <Link 
                        href="/policy/privacy" 
                        className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors text-sm"
                      >
                        Политика конфиденциальности
                      </Link>
                    </div>
                  </div>
                  <Link 
                    href="/support" 
                    className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                  >
                    Support
                  </Link>
                  <div className="border-t border-[#001D8D]/10 my-4 pt-4 flex flex-col gap-3">
                    <Button 
                      variant="ghost"
                      className="justify-start text-[#001D8D] hover:bg-[#001D8D]/5"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                      {theme === 'dark' ? (
                        <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
                      ) : (
                        <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>
                      )}
                    </Button>
                    <Button 
                      asChild 
                      variant="ghost"
                      className="text-[#001D8D] hover:bg-[#001D8D]/5"
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="bg-[#001D8D] hover:opacity-90 text-white"
                    >
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;