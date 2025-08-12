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

  // Рассчитываем ширину блоков на основе приоритета
  const getBlockWidth = (priority: number): string => {
    const widths = {
      1: '20%',  // Самый высокий приоритет - самый широкий блок
      2: '18%',
      3: '17%',
      4: '16%',
      5: '15%',
      6: '14%'   // Самый низкий приоритет - самый узкий блок
    };
    return widths[priority as keyof typeof widths] || '16%';
  };

  const activeValueData = values.find(v => v.id === activeValue);

  return (
    <div className={`w-full ${className}`}>
      {/* Горизонтальная полоса-манифест */}
      <div className="relative w-full h-32 bg-gradient-to-r from-[#001D8D] to-blue-700 overflow-hidden">
        {/* Геометрический паттерн фона */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent" />
        </div>

        {/* Блоки ценностей */}
        <div className="relative flex h-full overflow-x-auto md:overflow-x-hidden">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              className="relative cursor-pointer group transition-all duration-500 ease-out flex-shrink-0 min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
              className="relative cursor-pointer group transition-all duration-500 ease-out flex-shrink-0 min-w-[180px] sm:min-w-[200px] md:min-w-[220px]"
              style={{ 
                width: getBlockWidth(value.priority),
                backgroundColor: activeValue === value.id ? value.color : 'transparent'
              }}
              onMouseEnter={() => setActiveValue(value.id)}
              onMouseLeave={() => setActiveValue(null)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Разделительная линия */}
              {index > 0 && (
                <div className="absolute left-0 top-0 w-px h-full bg-white/30" />
              )}

              {/* Контент блока */}
              <div className="flex flex-col items-center justify-center h-full px-2 py-4 text-center md:p-4">
                {/* Номер */}
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-white/90 mb-2 font-mono tracking-wider"
                  animate={{ 
                    scale: activeValue === value.id ? 1.2 : 1,
                    color: activeValue === value.id ? '#ffffff' : 'rgba(255, 255, 255, 0.9)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {value.number}
                </motion.div>

                {/* Заголовок */}
                <motion.h3 
                  className="text-xs sm:text-sm md:text-base font-semibold text-white leading-tight"
                  className="text-xs sm:text-sm md:text-base font-semibold text-white"
                  animate={{ 
                    opacity: activeValue === value.id ? 1 : 0.8,
                    y: activeValue === value.id ? -2 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {value.title}
                </motion.h3>

                {/* Индикатор активности */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white"
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
                className="absolute inset-0 bg-white/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Геометрические акценты */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-white/20 transform rotate-45 -translate-x-4 -translate-y-4" />
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-white/20 transform rotate-45 translate-x-3 translate-y-3" />
      </div>

      {/* Область описания под полосой */}
      <div className="relative mt-8 min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeValueData ? (
            <motion.div
              key={activeValueData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-lg border-2 border-gray-100 p-8 shadow-lg"
            >
              {/* Заголовок с номером */}
              <div className="flex items-center gap-4 mb-6 w-full">
                <div 
                  className="w-16 h-16 flex items-center justify-center text-white font-bold text-xl rounded-lg"
                  style={{ backgroundColor: activeValueData.color }}
                >
                  {activeValueData.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-[#001D8D] mb-1">
                    {activeValueData.title}
                  </h3>
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: activeValueData.color }} />
                </div>
              </div>

              {/* Описание */}
              <p className="text-lg text-[#001D8D]/80 leading-relaxed w-full">
                {activeValueData.description}
              </p>

              {/* Геометрический акцент */}
              <div className="absolute top-4 right-4 w-3 h-3 transform rotate-45" style={{ backgroundColor: activeValueData.color }} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-48 text-center"
            >
              <div className="text-[#001D8D]/60">
                <div className="text-4xl mb-4">👆</div>
                <p className="text-lg font-medium">
                  Наведите курсор на блок выше, чтобы узнать подробности о наших ценностях
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Статистика приоритетов (опционально) */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2 text-xs text-[#001D8D]/50">
          <span>Ширина блоков отражает приоритет ценностей</span>
          <div className="w-2 h-2 bg-[#001D8D]/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}