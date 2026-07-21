"use client";

import { useState } from "react";

const PRESETS = [
  {
    angle: 15,
    name: "목례 (15°)",
    sub: "가벼운 인사",
    desc: "동료를 길에서 마주치거나, 좁은 공간(복도, 엘리베이터 등)에서 가볍게 인사할 때 사용합니다. 고개와 상체를 약간만 숙이는 가볍고 친근한 인사법입니다.",
  },
  {
    angle: 30,
    name: "평절 (30°)",
    sub: "보통 인사",
    desc: "가장 널리 쓰이는 표준 인사법입니다. 직장 상사, 고객, 혹은 처음 만나는 분들께 정중하게 예를 표할 때 사용하며, 허리를 약 30도 굽히고 머리를 숙입니다.",
  },
  {
    angle: 45,
    name: "큰절 (45°)",
    sub: "정중한 인사",
    desc: "깊은 감사나 진심 어린 사과를 전할 때, 또는 면접이나 격식 있는 공식 행사에서 예의를 갖출 때 사용합니다. 허리를 약 45도 깊게 숙여 극도의 존경과 성의를 보입니다.",
  },
];

export default function BowingVisualizer() {
  const [angle, setAngle] = useState(30);

  const getEtiquetteDetails = (deg) => {
    if (deg < 5) {
      return {
        title: "선 자세 (0°)",
        category: "준비 자세",
        description: "바르게 서서 시선은 상대방을 부드럽게 바라보는 자세입니다. 인사를 시작하기 전의 기본 상태입니다.",
        bgClass: "from-zinc-500/10 to-zinc-500/5 border-zinc-500/20",
        textClass: "text-zinc-400",
      };
    } else if (deg <= 20) {
      return {
        title: "목례 (15° 내외)",
        category: "가벼운 인사",
        description: "친한 친구나 동료를 만나 스쳐 지나갈 때, 혹은 좁은 실내 공간이나 엘리베이터에서 가볍게 고개를 숙여 건네는 친밀하고 일상적인 인사입니다.",
        bgClass: "from-blue-500/10 to-cyan-500/5 border-cyan-500/20",
        textClass: "text-cyan-400",
      };
    } else if (deg <= 37) {
      return {
        title: "평절 (30° 내외)",
        category: "보통 인사 (가장 표준적)",
        description: "가장 표준적이고 정중한 일상 인사입니다. 직장 상사나 비즈니스 파트너, 손님을 맞이할 때 사용하며 허리를 반듯이 편 상태로 30도 가량 부드럽게 굽힙니다.",
        bgClass: "from-teal-500/10 to-emerald-500/5 border-teal-500/20",
        textClass: "text-teal-400",
      };
    } else {
      return {
        title: "큰절 / 정중한 인사 (45° 내외)",
        category: "정중한 인사",
        description: "깊은 감사의 인사, 극진한 존경의 표시, 또는 깊이 사죄할 때 등 각별한 정성을 담아 행하는 인사입니다. 허리를 45도 이상 깊게 굽혀 마음을 표현합니다.",
        bgClass: "from-purple-500/10 to-fuchsia-500/5 border-purple-500/20",
        textClass: "text-purple-400",
      };
    }
  };

  const details = getEtiquetteDetails(angle);

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Visualizer SVG Graphic */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-950/40 rounded-2xl border border-white/5 w-full max-w-[320px] md:max-w-none">
        <div className="relative">
          <svg viewBox="0 0 200 220" className="w-56 h-56 md:w-64 md:h-64 text-teal-400 transition-colors duration-300">
            {/* Ambient light ring around head location */}
            <circle cx="100" cy="110" r="80" fill="none" stroke="url(#gridGradient)" strokeWidth="1" className="opacity-20" />
            
            <defs>
              <radialGradient id="gridGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid references */}
            <line x1="100" y1="20" x2="100" y2="200" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Ground */}
            <line x1="20" y1="200" x2="180" y2="200" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />
            
            {/* Static Legs */}
            <path d="M100,130 L100,200" stroke="#71717a" strokeWidth="6" strokeLinecap="round" />
            {/* Feet */}
            <path d="M94,200 L106,200" stroke="#52525b" strokeWidth="8" strokeLinecap="round" />

            {/* Rotating Upper Body Group */}
            <g transform={`rotate(${angle}, 100, 130)`} className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
              {/* Torso */}
              <line x1="100" y1="130" x2="100" y2="70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-teal-400" />
              
              {/* Clasped Hands (Gongsu) */}
              <path d="M100,90 C84,95 84,112 100,112" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" className="opacity-90" />
              <path d="M100,90 C116,95 116,112 100,112" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" className="opacity-90" />
              <circle cx="100" cy="101" r="5" fill="#09090b" stroke="#2dd4bf" strokeWidth="2" />

              {/* Head */}
              <circle cx="100" cy="46" r="16" fill="#09090b" stroke="currentColor" strokeWidth="3" className="text-teal-300" />
              {/* Face direction guide (gaze line/nose pointing right) */}
              <path d="M112,46 L118,46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-teal-300" />
              
              {/* Dynamic Bow Line indicator */}
              <path d="M100,30 A 70 70 0 0 1 125 50" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 3" className="opacity-40" />
            </g>
            
            {/* Hip Joint / Pivot Center */}
            <circle cx="100" cy="130" r="5" fill="#f43f5e" stroke="#09090b" strokeWidth="1.5" />
          </svg>

          {/* Floating Live Angle Counter */}
          <div className="absolute top-2 right-2 bg-zinc-900/90 border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            <span>ANGLE: {angle}°</span>
          </div>
        </div>

        {/* Live Formality Name Display */}
        <div className="mt-4 text-center">
          <div className={`text-lg font-bold font-serif ${details.textClass} transition-colors duration-300`}>
            {details.title}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">
            {details.category}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex-1 w-full flex flex-col justify-between self-stretch">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2 text-zinc-100 flex items-center gap-2">
            인사각도 시뮬레이터
            <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Etiquette
            </span>
          </h3>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            한국 문화에서 인사는 마음뿐만 아니라 고개와 허리를 숙이는 각도로도 예의의 깊이를 나타냅니다. 슬라이더를 움직이거나 프리셋 버튼을 클릭하여 각 상황에 알맞은 인사 각도를 탐구해 보세요.
          </p>

          {/* Interactive Slider */}
          <div className="mb-6 bg-zinc-950/30 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-zinc-500 font-medium">허리 숙이기</span>
              <span className="text-sm font-mono font-bold text-teal-400">{angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1 px-1">
              <span>0° (준비)</span>
              <span>15° (목례)</span>
              <span>30° (평절)</span>
              <span>45° (큰절)</span>
            </div>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {PRESETS.map((preset) => (
              <button
                key={preset.angle}
                onClick={() => setAngle(preset.angle)}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-medium transition-all duration-300 ${
                  angle === preset.angle
                    ? "bg-teal-500/10 border-teal-500/30 text-teal-300 shadow-md shadow-teal-500/5"
                    : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
                }`}
              >
                <div className="font-semibold">{preset.name}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{preset.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Etiquette Card */}
        <div className={`p-4 rounded-2xl border bg-gradient-to-br ${details.bgClass} transition-all duration-500`}>
          <h4 className={`text-sm font-bold flex items-center gap-1.5 mb-1.5 ${details.textClass}`}>
            💡 가이드: {details.title}
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {details.description}
          </p>
        </div>
      </div>
    </div>
  );
}
