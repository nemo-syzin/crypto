"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const { setTheme, theme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Refs для контейнеров дропдаунов
  const policyRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Node;
    if (policyDropdownOpen && policyRef.current && !policyRef.current.contains(target)) {
      setPolicyDropdownOpen(false);
    }
    if (userDropdownOpen && userRef.current && !userRef.current.contains(target)) {
      setUserDropdownOpen(false);
    }
  }, [policyDropdownOpen, userDropdownOpen]);

  // Закрытие по Esc
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setPolicyDropdownOpen(false);
      setUserDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleClickOutside, handleKeydown]);

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
              href="/blog" 
              className="text-[#001D8D] hover:opacity-80 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="text-[#001D8D] hover:opacity-80 transition-colors duration-200"
            >
              About
            </Link>
            <div className="relative" ref={policyRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={policyDropdownOpen}
                type="button"
                aria-haspopup="menu"
                aria-expanded={policyDropdownOpen}
                className="text-[#001D8D] hover:opacity-80 transition-colors duration-200 flex items-center gap-1"
                  role="menu"
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200"
                >
                  <Link 
                    href="/policy/aml-kyc" 
                    className="block px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
                  >
                    AML/CTF и KYC
                  </Link>
                  <Link 
                    href="/policy/terms" 
                    className="block px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
                  >
                    Условия использования
                  </Link>
                  <Link 
                    href="/policy/privacy" 
                    className="block px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
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

            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={userDropdownOpen}
                  className="flex items-center gap-2 text-[#001D8D] hover:bg-[#001D8D]/10 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                >
                  <div className="w-8 h-8 bg-[#001D8D]/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-[#001D8D]" />
                  </div>
                  <span className="font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {userDropdownOpen && (
                  <div 
                    role="menu"
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-[#001D8D]">
                        {user.user_metadata?.full_name || 'Пользователь'}
                      </div>
                      <div className="text-sm text-[#001D8D]/70">{user.email}</div>
                    </div>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Личный кабинет
                    </Link>
                    <Link 
                      href="/operator-dashboard" 
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#001D8D] hover:bg-[#001D8D]/5 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Панель оператора
                    </Link>
                    <button 
                      onClick={async () => {
                        try {
                          await signOut();
                        } catch (error) {
                          console.error('Ошибка выхода:', error);
                        }
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="ghost"
                  className="text-[#001D8D] hover:bg-[#001D8D]/10"
                >
                  <Link href="/login">Вход</Link>
                </Button>
                
                <Button 
                  asChild 
                  className="bg-[#001D8D] hover:opacity-90 text-white font-medium"
                >
                  <Link href="/register">Регистрация</Link>
                </Button>
              </>
            )}
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
                  <SheetClose asChild>
                    <Link 
                      href="/exchange" 
                      className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                    >
                      Exchange
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      href="/rates" 
                      className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                    >
                      Rates
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      href="/blog" 
                      className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                    >
                      Blog
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      href="/about" 
                      className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                    >
                      About
                    </Link>
                  </SheetClose>
                  <div className="p-2 text-[#001D8D]">
                    <div className="mb-2 font-medium">Policy</div>
                    <div className="pl-4 flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link 
                          href="/policy/aml-kyc" 
                          className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors text-sm"
                        >
                          AML/CTF и KYC
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/policy/terms" 
                          className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors text-sm"
                        >
                          Условия использования
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/policy/privacy" 
                          className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors text-sm"
                        >
                          Политика конфиденциальности
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Link 
                      href="/support" 
                      className="p-2 text-[#001D8D] hover:bg-[#001D8D]/5 rounded-md transition-colors"
                    >
                      Support
                    </Link>
                  </SheetClose>
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
                    <SheetClose asChild>
                      <Button 
                        asChild 
                        variant="ghost"
                        className="text-[#001D8D] hover:bg-[#001D8D]/5"
                      >
                        {user ? (
                          <Link href="/dashboard">Личный кабинет</Link>
                        ) : (
                          <Link href="/login">Вход</Link>
                        )}
                      </Button>
                    </SheetClose>
                    {user ? (
                      <>
                        <SheetClose asChild>
                          <Button 
                            asChild 
                            variant="ghost"
                            className="text-[#001D8D] hover:bg-[#001D8D]/5"
                          >
                            <Link href="/operator-dashboard">Панель оператора</Link>
                          </Button>
                        </SheetClose>
                        <Button 
                          onClick={async () => {
                            try {
                              await signOut();
                            } catch (error) {
                              console.error('Ошибка выхода:', error);
                            }
                          }}
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Выйти
                        </Button>
                      </>
                    ) : (
                      <SheetClose asChild>
                        <Button 
                          asChild 
                          className="bg-[#001D8D] hover:opacity-90 text-white"
                        >
                          <Link href="/register">Регистрация</Link>
                        </Button>
                      </SheetClose>
                    )}
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