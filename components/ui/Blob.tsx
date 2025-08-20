"use client";

import React from "react";

export default function Blob() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="absolute -top-40 -left-40 w-[600px] h-[600px] opacity-30 blur-2xl" 
        viewBox="0 0 600 600" 
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>
        <path fill="url(#blobGradient)">
          <animate 
            attributeName="d" 
            dur="25s" 
            repeatCount="indefinite"
            values="
              M438,324Q426,408,352,456Q278,504,194,466Q110,428,92,339Q74,250,125,178Q176,106,267,95Q358,84,420,147Q482,210,438,324Z;
              M459,318Q431,386,371,448Q311,510,219,491Q127,472,97,382Q67,292,96,213Q125,134,205,100Q285,66,360,104Q435,142,461,221Q487,300,459,318Z;
              M412,335Q445,420,365,462Q285,504,201,468Q117,432,85,341Q53,250,102,175Q151,100,243,89Q335,78,398,149Q461,220,412,335Z;
              M438,324Q426,408,352,456Q278,504,194,466Q110,428,92,339Q74,250,125,178Q176,106,267,95Q358,84,420,147Q482,210,438,324Z
            " 
          />
        </path>
      </svg>
      
      {/* Второй blob для более интересного эффекта */}
      <svg 
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] opacity-20 blur-3xl" 
        viewBox="0 0 500 500" 
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="blobGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path fill="url(#blobGradient2)">
          <animate 
            attributeName="d" 
            dur="30s" 
            repeatCount="indefinite"
            values="
              M365,271Q365,342,307,384Q249,426,174,398Q99,370,69,310Q39,250,69,190Q99,130,174,102Q249,74,307,116Q365,158,365,271Z;
              M380,285Q395,370,325,405Q255,440,177,415Q99,390,64,320Q29,250,64,180Q99,110,177,85Q255,60,325,95Q395,130,380,285Z;
              M355,265Q345,330,292,375Q239,420,169,390Q99,360,74,305Q49,250,74,195Q99,140,169,110Q239,80,292,125Q345,170,355,265Z;
              M365,271Q365,342,307,384Q249,426,174,398Q99,370,69,310Q39,250,69,190Q99,130,174,102Q249,74,307,116Q365,158,365,271Z
            " 
          />
        </path>
      </svg>
    </div>
  );
}