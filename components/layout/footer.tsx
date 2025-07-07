import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, FileText, Lock, Send } from 'lucide-react';

const footerLinks = [
  { href: "/exchange", label: "Exchange" },
  { href: "/rates", label: "Rates" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

const policyLinks = [
  { href: "/policy/aml-kyc", label: "AML/CTF и KYC" },
  { href: "/policy/terms", label: "Условия использования" },
  { href: "/policy/privacy", label: "Политика конфиденциальности" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/brand/kenigswap-logo.svg"
                alt="Kenigswap"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Современная криптовалютная платформа, специализирующаяся
            на обмене USDT на рубли по выгодному курсу и с максимальной
            безопасностью.
            </p>
            <div className="flex mt-4">
              {/* Telegram Link */}
              <a 
                href="https://t.me/KenigSwap" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#0088cc] transition-colors duration-200 flex items-center gap-2 bg-gray-100 hover:bg-[#0088cc]/10 px-3 py-2 rounded-lg group"
                aria-label="Связаться с нами в Telegram"
                title="Написать в Telegram @KenigSwap"
              >
                <Send size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">Telegram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Services</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  About Us
                </Link>
              </li>
                </a>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.href} className="flex items-center gap-2">
                  {link.href.includes('privacy') && <Lock className="h-4 w-4 text-gray-400" />}
                  {link.href.includes('terms') && <FileText className="h-4 w-4 text-gray-400" />}
                  {link.href.includes('aml-kyc') && <Shield className="h-4 w-4 text-gray-400" />}
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Kenigswap. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/policy/privacy" className="text-sm text-gray-500 hover:text-[#001D8D] transition-colors duration-200">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/policy/terms" className="text-sm text-gray-500 hover:text-[#001D8D] transition-colors duration-200">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/policy/aml-kyc" className="text-sm text-gray-500 hover:text-[#001D8D] transition-colors duration-200">
                    AML/KYC
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;