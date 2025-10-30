"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface WorldMapProps {
  highlightedRegion: number | null;
}

const regionPaths: Record<number, string[]> = {
  0: [
    "M520,140 L540,145 L545,155 L540,165 L525,170 L510,165 L505,155 L510,145 Z",
    "M480,155 L495,158 L500,168 L495,178 L480,180 L465,175 L460,165 L465,155 Z",
    "M545,150 L560,152 L565,162 L560,172 L545,175 L530,170 L525,160 L530,150 Z",
    "M555,135 L570,138 L575,148 L570,158 L555,160 L540,155 L535,145 L540,135 Z",
    "M490,135 L505,138 L510,148 L505,158 L490,160 L475,155 L470,145 L475,135 Z"
  ],
  1: [
    "M570,165 L585,168 L590,178 L585,188 L570,190 L555,185 L550,175 L555,165 Z",
    "M585,155 L600,158 L605,168 L600,178 L585,180 L570,175 L565,165 L570,155 Z",
    "M595,170 L610,173 L615,183 L610,193 L595,195 L580,190 L575,180 L580,170 Z",
    "M560,175 L575,178 L580,188 L575,198 L560,200 L545,195 L540,185 L545,175 Z"
  ],
  2: [
    "M220,180 L240,185 L245,195 L240,205 L225,210 L210,205 L205,195 L210,185 Z",
    "M180,170 L200,175 L205,185 L200,195 L185,200 L170,195 L165,185 L170,175 Z",
    "M240,200 L260,205 L265,215 L260,225 L245,230 L230,225 L225,215 L230,205 Z",
    "M200,240 L220,245 L225,255 L220,265 L205,270 L190,265 L185,255 L190,245 Z"
  ],
  3: [
    "M600,200 L620,205 L625,215 L620,225 L605,230 L590,225 L585,215 L590,205 Z",
    "M640,210 L660,215 L665,225 L660,235 L645,240 L630,235 L625,225 L630,215 Z",
    "M620,230 L640,235 L645,245 L640,255 L625,260 L610,255 L605,245 L610,235 Z",
    "M670,220 L690,225 L695,235 L690,245 L675,250 L660,245 L655,235 L660,225 Z",
    "M655,245 L675,250 L680,260 L675,270 L660,275 L645,270 L640,260 L645,250 Z"
  ],
  4: [
    "M720,310 L745,315 L750,325 L745,335 L730,340 L715,335 L710,325 L715,315 Z",
    "M760,320 L785,325 L790,335 L785,345 L770,350 L755,345 L750,335 L755,325 Z"
  ]
};

const WorldMap: React.FC<WorldMapProps> = ({ highlightedRegion }) => {
  return (
    <div className="w-full h-[400px] bg-white/50 rounded-2xl border border-[#001D8D]/10 overflow-hidden relative">
      <svg
        viewBox="0 0 900 450"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6F0FF" />
            <stop offset="100%" stopColor="#CCE0FF" />
          </linearGradient>
        </defs>

        <rect width="900" height="450" fill="url(#oceanGradient)" />

        <g opacity="0.15">
          <circle cx="150" cy="100" r="40" fill="#001D8D" />
          <circle cx="750" cy="350" r="50" fill="#001D8D" />
          <circle cx="450" cy="225" r="60" fill="#001D8D" />
        </g>

        {Object.entries(regionPaths).map(([regionIndex, paths]) => {
          const isHighlighted = highlightedRegion === parseInt(regionIndex);

          return (
            <g key={regionIndex}>
              {paths.map((pathData, pathIndex) => (
                <motion.path
                  key={pathIndex}
                  d={pathData}
                  initial={{ fill: "#001D8D", opacity: 0.3 }}
                  animate={{
                    fill: isHighlighted ? "#FF6B00" : "#001D8D",
                    opacity: isHighlighted ? 0.8 : 0.3,
                    scale: isHighlighted ? 1.05 : 1
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  stroke="#001D8D"
                  strokeWidth="1"
                  style={{ transformOrigin: "center" }}
                />
              ))}
            </g>
          );
        })}

        <g opacity="0.4" stroke="#001D8D" strokeWidth="0.5" fill="none">
          <line x1="0" y1="225" x2="900" y2="225" strokeDasharray="5,5" />
          <line x1="450" y1="0" x2="450" y2="450" strokeDasharray="5,5" />
        </g>

        <text x="450" y="30" textAnchor="middle" className="text-[#001D8D] text-xl font-bold" fill="#001D8D">
          Карта присутствия KenigSwap
        </text>

        {highlightedRegion !== null && (
          <motion.text
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            x="450"
            y="420"
            textAnchor="middle"
            className="text-[#FF6B00] text-lg font-semibold"
            fill="#FF6B00"
          >
            {["Европа", "СНГ и Ближний Восток", "Америка", "Азия и Африка", "Австралия и Новая Зеландия"][highlightedRegion]}
          </motion.text>
        )}
      </svg>
    </div>
  );
};

export default WorldMap;
