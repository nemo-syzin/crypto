import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, FileText, Lock } from 'lucide-react';

const footerLinks = [
  { href: 'https://kenigswap.com/exchange/', label: 'Обмен' },
  { href: 'https://kenigswap.com/rates/', label: 'Курсы' },
  { href: 'https://kenigswap.com/about/', label: 'О нас' },
  { href: 'https://kenigswap.com/news/', label: 'Новости' },
  { href: 'https://kenigswap.com/support/', label: 'Поддержка' },
];

const policyLinks = [
  { href: 'https://kenigswap.com/policy/aml-kyc/', label: 'AML/CTF и KYC' },
  { href: 'https://kenigswap.com/policy/terms/', label: 'Условия использования' },
  { href: 'https://kenigswap.com/policy/privacy/', label: 'Политика конфиденциальности' },
];

const Footer = () => {
  return (
    <footer className="bg-transparent border-t border-gray-200/50 py-12 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-1">
            <Link href="https://kenigswap.com/" className="flex items-center gap-2">
              <Image
                src="/brand/kenigswap-logo.svg"
                alt="KenigSwap"
                width={180}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>

            <p className="mt-4 text-sm text-gray-600">
              Современная криптовалютная платформа, специализирующаяся на обмене USDT на рубли по
              выгодному курсу и с максимальной безопасностью.
            </p>

            <div className="mt-6 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Telegram-каналы:</h4>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="https://t.me/KaliningradCryptoRatesKenigSwap"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200 text-sm"
                    >
                      Актуальные курсы
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://t.me/KenigSwapCryptoNews"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200 text-sm"
                    >
                      Новости
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://t.me/Kenigswap_39"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200 text-sm"
                    >
                      Связаться с менеджером
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Сервисы</h3>
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

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://kenigswap.com/about/"
                  className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  href="https://kenigswap.com/news/"
                  className="text-gray-600 hover:text-[#001D8D] transition-colors duration-200"
                >
                  Новости
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Документы</h3>
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
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} KenigSwap. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
