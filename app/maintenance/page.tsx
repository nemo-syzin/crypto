import { Wrench, Mail } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001D8D] via-[#001D8D] to-[#002199] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 md:p-12 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Wrench className="h-16 w-16 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            На сайте ведутся технические работы
          </h1>

          <p className="text-lg text-white/90 text-center mb-8 leading-relaxed">
            Мы временно проводим обновление сервиса. Работа возобновится в ближайшее время.
          </p>

          <div className="border-t border-white/20 pt-8">
            <h2 className="text-xl font-semibold text-white text-center mb-6">
              Связаться с нами:
            </h2>

            <div className="space-y-4">
              <Link
                href="https://t.me/kenigswap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 group"
              >
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.093.036.306.02.472z" />
                </svg>
                <span className="text-white font-medium group-hover:underline">
                  @kenigswap
                </span>
              </Link>

              <a
                href="mailto:support@kenigswap.com"
                className="flex items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 group"
              >
                <Mail className="h-6 w-6 text-white" />
                <span className="text-white font-medium group-hover:underline">
                  support@kenigswap.com
                </span>
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/70">
              Приносим извинения за временные неудобства
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
