import React from 'react';
import { cn } from '../lib/utils';

interface SketchBoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export function SketchBox({ children, className, style, color = '#673147' }: SketchBoxProps) {
  return (
    <div className={cn('relative', className)} style={style}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="90 218 1018 748"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id="sk-rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" seed="7" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7"/>
          </filter>
          <g id="sk-vmark">
            <path d="M7 0 L9 2.2 L10.1 9 L10.5 19 L10 30 L8.9 37.2 L7 41 L5 38 L3.9 31 L3.4 19 L4 8.5 L5 2 Z" fill={color}/>
            <path d="M4.3 6 C4.1 11 4.4 22 4.8 35" stroke="#a07090" strokeWidth=".65" strokeLinecap="round" opacity=".30" fill="none"/>
            <path d="M8.9 5 C8.7 12 8.8 23 8.3 34" stroke="#3a1828" strokeWidth=".65" strokeLinecap="round" opacity=".22" fill="none"/>
            <path d="M2.6 8 C2.1 15 2.3 28 2.9 36" stroke="#7a3a55" strokeWidth=".45" strokeLinecap="round" opacity=".28" fill="none"/>
            <path d="M11.2 7 C11.5 15 11.1 27 10.8 35" stroke="#7a3a55" strokeWidth=".45" strokeLinecap="round" opacity=".24" fill="none"/>
          </g>
          <g id="sk-hmark">
            <path d="M0 7 L3 5 L12 4 L26 3.4 L41 4 L50 5 L54 7 L50 9 L41 10 L26 10.6 L12 10 L3 9 Z" fill={color}/>
            <path d="M7 5.1 C16 4.9 28 5.1 47 4.8" stroke="#a07090" strokeWidth=".65" strokeLinecap="round" opacity=".30" fill="none"/>
            <path d="M6 8.8 C17 8.5 31 8.7 48 8.1" stroke="#3a1828" strokeWidth=".65" strokeLinecap="round" opacity=".22" fill="none"/>
            <path d="M5 3.4 C16 2.8 31 3.2 49 2.8" stroke="#7a3a55" strokeWidth=".45" strokeLinecap="round" opacity=".22" fill="none"/>
            <path d="M5.8 11.2 C18 11 32 11 48.5 10.7" stroke="#7a3a55" strokeWidth=".45" strokeLinecap="round" opacity=".20" fill="none"/>
          </g>
        </defs>

        <g filter="url(#sk-rough)">
          {/* oben */}
          <use href="#sk-vmark" transform="translate(106 229) scale(0.62 0.80)" opacity=".88"/>
          <use href="#sk-vmark" transform="translate(116 229) scale(0.58 0.80)" opacity=".90"/>
          <use href="#sk-vmark" transform="translate(127 230) scale(0.55 0.82)" opacity=".90"/>
          <use href="#sk-vmark" transform="translate(146 225) scale(0.78 0.88)"/>
          <use href="#sk-vmark" transform="translate(160 224) scale(0.70 1.02)"/>
          <use href="#sk-vmark" transform="translate(177 222) scale(0.76 0.93)"/>
          <use href="#sk-vmark" transform="translate(191 223) scale(0.64 1.02)"/>
          <use href="#sk-vmark" transform="translate(210 223) scale(0.73 0.96)"/>
          <use href="#sk-vmark" transform="translate(238 225) scale(0.84 0.92)"/>
          <use href="#sk-vmark" transform="translate(265 224) scale(0.74 0.96)"/>
          <use href="#sk-vmark" transform="translate(289 226) scale(0.80 0.87)"/>
          <use href="#sk-vmark" transform="translate(322 228) scale(0.60 0.74)" opacity=".92"/>
          <use href="#sk-vmark" transform="translate(347 227) scale(0.69 0.76)" opacity=".92"/>
          <use href="#sk-vmark" transform="translate(381 221) scale(0.94 1.05)"/>
          <use href="#sk-vmark" transform="translate(406 227) scale(0.70 0.85)"/>
          <use href="#sk-vmark" transform="translate(421 224) scale(0.68 0.96)"/>
          <use href="#sk-vmark" transform="translate(459 224) scale(0.79 0.87)"/>
          <use href="#sk-vmark" transform="translate(487 226) scale(0.84 0.89)"/>
          <use href="#sk-vmark" transform="translate(516 225) scale(0.87 0.91)"/>
          <use href="#sk-vmark" transform="translate(542 225) scale(0.74 0.94)"/>
          <use href="#sk-vmark" transform="translate(569 226) scale(0.73 0.88)"/>
          <use href="#sk-vmark" transform="translate(591 225) scale(0.73 0.90)"/>
          <use href="#sk-vmark" transform="translate(606 227) scale(0.70 0.85)"/>
          <use href="#sk-vmark" transform="translate(627 224) scale(0.90 1.03)"/>
          <use href="#sk-vmark" transform="translate(652 226) scale(0.86 0.94)"/>
          <use href="#sk-vmark" transform="translate(685 226) scale(0.86 0.87)"/>
          <use href="#sk-vmark" transform="translate(710 227) scale(0.72 0.83)"/>
          <use href="#sk-vmark" transform="translate(742 226) scale(0.72 0.90)"/>
          <use href="#sk-vmark" transform="translate(777 227) scale(0.80 0.94)"/>
          <use href="#sk-vmark" transform="translate(805 225) scale(0.73 0.83)"/>
          <use href="#sk-vmark" transform="translate(836 228) scale(0.82 0.81)"/>
          <use href="#sk-vmark" transform="translate(859 225) scale(0.87 0.89)"/>
          <use href="#sk-vmark" transform="translate(882 226) scale(0.82 0.93)"/>
          <use href="#sk-vmark" transform="translate(915 228) scale(0.60 0.79)" opacity=".92"/>
          <use href="#sk-vmark" transform="translate(947 229) scale(0.68 0.85)"/>
          <use href="#sk-vmark" transform="translate(976 228) scale(0.70 0.83)"/>
          <use href="#sk-vmark" transform="translate(1005 227) scale(0.71 0.96)"/>
          <use href="#sk-vmark" transform="translate(1031 228) scale(0.74 1.02)"/>
          <use href="#sk-vmark" transform="translate(1061 229) scale(0.76 0.88)"/>
          <use href="#sk-vmark" transform="translate(1079 229) scale(0.67 0.82)"/>
          <use href="#sk-vmark" transform="translate(1091 229) scale(0.63 0.80)" opacity=".90"/>

          {/* links */}
          <use href="#sk-hmark" transform="translate(102 279) scale(0.95 0.22)" opacity=".80"/>
          <use href="#sk-hmark" transform="translate(101 294) scale(0.90 0.18)" opacity=".78"/>
          <use href="#sk-hmark" transform="translate(101 307) scale(0.88 0.16)" opacity=".76"/>
          <use href="#sk-hmark" transform="translate(101 336) scale(0.92 0.78)"/>
          <use href="#sk-hmark" transform="translate(101 369) scale(0.90 0.56)"/>
          <use href="#sk-hmark" transform="translate(101 404) scale(0.97 0.82)"/>
          <use href="#sk-hmark" transform="translate(101 436) scale(0.86 0.68)"/>
          <use href="#sk-hmark" transform="translate(101 470) scale(0.79 0.76)"/>
          <use href="#sk-hmark" transform="translate(101 506) scale(0.88 0.64)"/>
          <use href="#sk-hmark" transform="translate(101 545) scale(0.92 0.66)"/>
          <use href="#sk-hmark" transform="translate(101 583) scale(0.96 0.82)"/>
          <use href="#sk-hmark" transform="translate(101 620) scale(0.82 0.62)"/>
          <use href="#sk-hmark" transform="translate(101 651) scale(0.88 0.60)"/>
          <use href="#sk-hmark" transform="translate(101 687) scale(0.85 0.58)"/>
          <use href="#sk-hmark" transform="translate(100 714) scale(0.84 0.20)" opacity=".78"/>
          <use href="#sk-hmark" transform="translate(101 750) scale(0.78 0.62)"/>
          <use href="#sk-hmark" transform="translate(101 789) scale(0.74 0.56)"/>
          <use href="#sk-hmark" transform="translate(101 824) scale(0.80 0.46)"/>
          <use href="#sk-hmark" transform="translate(101 851) scale(0.76 0.40)"/>
          <use href="#sk-hmark" transform="translate(101 879) scale(0.70 0.36)"/>
          <use href="#sk-hmark" transform="translate(100 904) scale(0.66 0.18)" opacity=".76"/>

          {/* rechts */}
          <use href="#sk-hmark" transform="translate(1038 327) scale(1.02 0.66)"/>
          <use href="#sk-hmark" transform="translate(1039 348) scale(0.92 0.20)" opacity=".78"/>
          <use href="#sk-hmark" transform="translate(1038 364) scale(0.94 0.18)" opacity=".76"/>
          <use href="#sk-hmark" transform="translate(1038 396) scale(0.92 0.64)"/>
          <use href="#sk-hmark" transform="translate(1039 425) scale(0.96 0.72)"/>
          <use href="#sk-hmark" transform="translate(1038 459) scale(0.92 0.70)"/>
          <use href="#sk-hmark" transform="translate(1038 498) scale(0.84 0.62)"/>
          <use href="#sk-hmark" transform="translate(1039 532) scale(0.88 0.56)"/>
          <use href="#sk-hmark" transform="translate(1038 566) scale(0.93 0.62)"/>
          <use href="#sk-hmark" transform="translate(1039 608) scale(0.96 0.70)"/>
          <use href="#sk-hmark" transform="translate(1039 642) scale(0.86 0.34)"/>
          <use href="#sk-hmark" transform="translate(1038 679) scale(0.95 0.60)"/>
          <use href="#sk-hmark" transform="translate(1038 713) scale(0.87 0.34)"/>
          <use href="#sk-hmark" transform="translate(1038 751) scale(0.92 0.64)"/>
          <use href="#sk-hmark" transform="translate(1038 789) scale(0.94 0.60)"/>
          <use href="#sk-hmark" transform="translate(1038 828) scale(0.98 0.66)"/>
          <use href="#sk-hmark" transform="translate(1038 862) scale(0.95 0.62)"/>
          <use href="#sk-hmark" transform="translate(1038 893) scale(0.86 0.28)" opacity=".80"/>
          <use href="#sk-hmark" transform="translate(1038 907) scale(0.88 0.24)" opacity=".78"/>
          <use href="#sk-hmark" transform="translate(1038 921) scale(0.84 0.18)" opacity=".74"/>

          {/* unten */}
          <use href="#sk-vmark" transform="translate(94 924) scale(0.59 0.90)" opacity=".90"/>
          <use href="#sk-vmark" transform="translate(108 921) scale(0.61 0.82)" opacity=".88"/>
          <use href="#sk-vmark" transform="translate(124 919) scale(0.69 0.85)"/>
          <use href="#sk-vmark" transform="translate(143 919) scale(0.70 0.94)"/>
          <use href="#sk-vmark" transform="translate(165 918) scale(0.80 0.96)"/>
          <use href="#sk-vmark" transform="translate(190 919) scale(0.72 0.88)"/>
          <use href="#sk-vmark" transform="translate(212 917) scale(0.84 1.00)"/>
          <use href="#sk-vmark" transform="translate(238 918) scale(0.78 0.94)"/>
          <use href="#sk-vmark" transform="translate(261 922) scale(0.64 0.80)"/>
          <use href="#sk-vmark" transform="translate(291 920) scale(0.76 0.86)"/>
          <use href="#sk-vmark" transform="translate(320 919) scale(0.61 0.92)"/>
          <use href="#sk-vmark" transform="translate(345 918) scale(0.70 0.96)"/>
          <use href="#sk-vmark" transform="translate(379 918) scale(0.88 0.88)"/>
          <use href="#sk-vmark" transform="translate(401 919) scale(0.72 0.86)"/>
          <use href="#sk-vmark" transform="translate(425 920) scale(0.68 0.92)"/>
          <use href="#sk-vmark" transform="translate(455 919) scale(0.80 0.96)"/>
          <use href="#sk-vmark" transform="translate(481 920) scale(0.74 0.88)"/>
          <use href="#sk-vmark" transform="translate(508 918) scale(0.77 1.00)"/>
          <use href="#sk-vmark" transform="translate(532 915) scale(0.86 1.08)"/>
          <use href="#sk-vmark" transform="translate(558 919) scale(0.74 0.92)"/>
          <use href="#sk-vmark" transform="translate(584 918) scale(0.80 0.96)"/>
          <use href="#sk-vmark" transform="translate(611 915) scale(0.97 1.10)"/>
          <use href="#sk-vmark" transform="translate(637 918) scale(0.84 0.96)"/>
          <use href="#sk-vmark" transform="translate(663 917) scale(0.90 0.98)"/>
          <use href="#sk-vmark" transform="translate(692 916) scale(0.92 1.02)"/>
          <use href="#sk-vmark" transform="translate(716 914) scale(0.91 1.04)"/>
          <use href="#sk-vmark" transform="translate(741 918) scale(0.66 0.94)"/>
          <use href="#sk-vmark" transform="translate(768 916) scale(0.84 1.00)"/>
          <use href="#sk-vmark" transform="translate(794 916) scale(0.73 1.02)"/>
          <use href="#sk-vmark" transform="translate(817 916) scale(0.76 1.00)"/>
          <use href="#sk-vmark" transform="translate(845 918) scale(0.65 0.92)"/>
          <use href="#sk-vmark" transform="translate(869 918) scale(0.71 0.94)"/>
          <use href="#sk-vmark" transform="translate(891 917) scale(0.72 0.96)"/>
          <use href="#sk-vmark" transform="translate(914 916) scale(0.84 1.04)"/>
          <use href="#sk-vmark" transform="translate(939 916) scale(0.92 1.00)"/>
          <use href="#sk-vmark" transform="translate(963 914) scale(0.86 1.08)"/>
          <use href="#sk-vmark" transform="translate(987 918) scale(0.80 0.96)"/>
          <use href="#sk-vmark" transform="translate(1011 919) scale(0.72 0.92)"/>
          <use href="#sk-vmark" transform="translate(1040 912) scale(0.80 1.12)"/>
          <use href="#sk-vmark" transform="translate(1066 912) scale(0.74 1.12)"/>
          <use href="#sk-vmark" transform="translate(1086 917) scale(0.68 1.02)"/>
        </g>
      </svg>
      {children}
    </div>
  );
}
