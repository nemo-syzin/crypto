"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ManifestoValue {
  id: string;
  number: string;
  title: string;
  description: string;
  priority: number; // 1-6, влияет на ширину блока
  color: string;
}

interface ManifestoStripProps {
  values: ManifestoValue[];
  className?: string;
}

export function ManifestoStrip({ values, className = "" }: ManifestoStripProps) {
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const activeValueData = values.find(v => v.id === activeValue);

  return (
    <div className={`w-full ${className}`}>
      {/* Адаптивная сетка блоков манифеста */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {values.map((value, index) => (
          <motion.div
            key={value.id}
            className="relative cursor-pointer group transition-all duration-300 ease-out mobile-touch-target"
            onMouseEnter={() => setActiveValue(value.id)}
            onMouseLeave={() => setActiveValue(null)}
            onClick={() => setActiveValue(activeValue === value.id ? null : value.id)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Блок ценности */}
            <div 
              className={`relative h-28 sm:h-32 md:h-36 lg:h-40 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                activeValue === value.id 
                  ? 'shadow-xl transform scale-105' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
              style={{ 
                backgroundColor: activeValue === value.id ? value.color : '#001D8D',
                color: 'white'
              }}
            >
              {/* Геометрический паттерн фона */}
              <div className="absolute inset-0 opacity-10 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-white/10" />
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-white/20 transform rotate-45" />
                <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 bg-white/20 transform rotate-45" />
              </div>

              {/* Контент блока */}
              <div className="relative z-10 w-full">
                {/* Номер */}
                <motion.div 
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 font-mono tracking-wider"
                  animate={{ 
                    scale: activeValue === value.id ? 1.1 : 1,
                    opacity: activeValue === value.id ? 1 : 0.9
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {value.number}
                </motion.div>

                {/* Заголовок */}
                <motion.h3 
                  className="text-xs sm:text-sm font-semibold leading-tight sm:leading-relaxed px-1"
                  animate={{ 
                    opacity: activeValue === value.id ? 1 : 0.85,
                    y: activeValue === value.id ? -1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {value.title}
                </motion.h3>

                {/* Индикатор активности */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-b-xl"
                  initial={{ scaleX: 0 }}
                  animate={{ 
                    scaleX: activeValue === value.id ? 1 : 0,
                    opacity: activeValue === value.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>

              {/* Hover эффект */}
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Область описания под блоками */}
      <div className="relative min-h-[200px] sm:min-h-[250px] w-full">
        <AnimatePresence mode="wait">
          {activeValueData ? (
            <motion.div
              key={activeValueData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full bg-white rounded-xl border-2 border-gray-100 p-4 sm:p-6 md:p-8 shadow-lg mobile-card"
            >
              {/* Заголовок с номером */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 w-full">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl rounded-lg flex-shrink-0"
                  style={{ backgroundColor: activeValueData.color }}
                >
                  {activeValueData.number}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#001D8D] mb-2 break-words">
                    {activeValueData.title}
                  </h3>
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: activeValueData.color }} />
                </div>
              </div>

              {/* Описание */}
              <div className="w-full">
                <p className="text-sm sm:text-base md:text-lg text-[#001D8D]/80 leading-relaxed break-words mobile-text-scale">
                  {activeValueData.description}
                </p>
              </div>

              {/* Геометрический акцент */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 transform rotate-45" style={{ backgroundColor: activeValueData.color }} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-32 sm:h-48 text-center w-full p-4"
            >
              <div className="text-[#001D8D]/60">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">👆</div>
                <p className="text-sm sm:text-base md:text-lg font-medium px-4 mobile-text-scale">
                  <span className="hidden sm:inline">Наведите курсор на блок выше</span>
                  <span className="sm:hidden">Нажмите на блок выше</span>
                  , чтобы узнать подробности о наших ценностях
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Статистика приоритетов */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <div className="flex items-center gap-2 text-xs text-[#001D8D]/50">
          <span className="hidden sm:inline">Наведите курсор на блок для подробной информации</span>
          <span className="sm:hidden text-center">Нажмите на блок для подробной информации</span>
          <div className="w-2 h-2 bg-[#001D8D]/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}