"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TableOfContentsItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeItem?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function TableOfContents({ 
  items, 
  activeItem, 
  onItemClick,
  className = ""
}: TableOfContentsProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [activeId, setActiveId] = useState<string>(activeItem || items[0]?.id || '');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Обновляем активный элемент при изменении props
  useEffect(() => {
    if (activeItem) {
      setActiveId(activeItem);
    }
  }, [activeItem]);

  // Отслеживаем скролл для стилизации и прогресса чтения
  useEffect(() => {
    const handleScroll = () => {
      // Обновляем состояние sticky
      setIsSticky(window.scrollY > 100);
      
      // Вычисляем прогресс чтения
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      setScrollProgress(Math.min(scrollPercent * 100, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Оптимизированный обработчик клика
  const handleClick = useCallback((id: string) => {
    setActiveId(id);
    if (onItemClick) {
      onItemClick(id);
    }
  }, [onItemClick]);

  // Вычисляем прогресс чтения на основе активного элемента
  const getReadingProgress = useCallback(() => {
    const activeIndex = items.findIndex(item => item.id === activeId);
    if (activeIndex === -1) return 0;
    return ((activeIndex + 1) / items.length) * 100;
  }, [activeId, items]);

  return (
    <motion.div 
      className={`bg-white/90 backdrop-blur-sm rounded-lg border border-[#001D8D]/10 p-6 ${
        isSticky ? 'shadow-lg' : ''
      } transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h3 className="text-lg font-bold text-[#001D8D] mb-4">Содержание</h3>
      
      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`w-full text-left py-2 px-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
              activeId === item.id
                ? 'bg-[#001D8D]/10 text-[#001D8D] font-medium'
                : 'text-[#001D8D]/70 hover:bg-[#001D8D]/5 hover:text-[#001D8D]'
            }`}
          >
            {item.icon && (
              <span className={`${
                activeId === item.id ? 'text-[#001D8D]' : 'text-[#001D8D]/60'
              }`}>
                {item.icon}
              </span>
            )}
            <span className="text-sm">{item.title}</span>
          </button>
        ))}
      </nav>

      {/* Индикатор прогресса чтения */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-xs text-[#001D8D]/60 mb-2">Прогресс чтения</div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <motion.div 
            className="h-1.5 rounded-full bg-gradient-to-r from-[#001D8D] to-blue-600"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${getReadingProgress()}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}