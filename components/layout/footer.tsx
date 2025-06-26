import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = [
  { href: "/exchange", label: "Exchange" },
  { href: "/rates", label: "Rates" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
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
            <div className="flex mt-4 space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'Linkedin'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-gray-500 hover:text-[#001D8D] transition-colors duration-200"
                  aria-label={social}
                >
                  {social === 'Facebook' && <Facebook size={20} />}
                  {social === 'Twitter' && <Twitter size={20} />}
                  {social === 'Instagram' && <Instagram size={20} />}
                  {social === 'Linkedin' && <Linkedin size={20} />}
                </a>
              ))}
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
              <li>
                <Link href="/support" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200">
                  KYC/AML Policy
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
                  <Link href="#" className="text-sm text-gray-500 hover:text-[#001D8D] transition-colors duration-200">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-[#001D8D] transition-colors duration-200">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-[#001D8D] transition-colors duration-200">
                    Cookies
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