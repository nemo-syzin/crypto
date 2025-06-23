"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleTextProps {
  children: React.ReactNode;
  collapsedHeight?: number;
  className?: string;
}

const CollapsibleText = ({
  children,
  collapsedHeight = 200,
  className,
}: CollapsibleTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setShouldShowButton(contentRef.current.scrollHeight > collapsedHeight);
    }
  }, [collapsedHeight, children]);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={contentRef}
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          !isExpanded && 'relative'
        )}
        style={{ maxHeight: isExpanded ? contentRef.current?.scrollHeight : collapsedHeight }}
      >
        {children}
        {!isExpanded && shouldShowButton && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      
      {shouldShowButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 mt-4 text-[#0070f3] hover:text-[#0070f3]/80 transition-colors duration-200"
        >
          <span>{isExpanded ? 'Свернуть' : 'Читать далее'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default CollapsibleText;