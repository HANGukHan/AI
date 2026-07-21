"use client";

import { useState } from "react";
import BowingVisualizer from "./components/BowingVisualizer";
import Guestbook from "./components/Guestbook";

// SVG Speaker Icon
const SpeakerIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

// SVG Info Icon
const InfoIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.985l-.04.025a1.125 1.125 0 01-1.125-1.125zM12 9a.75.75 0 000-1.5.75.75 0 000 1.5zM22.5 12a10.5 10.5 0 11-21 0 10.5 10.5 0 0121 0z" />
  </svg>
);

// Formality level presets
const FORMALITY_LEVELS = [
  {
    id: "casual",
    korean: "안녕",
    roman: "An-nyeong",
    formality: "반말 (Casual / Informal)",
    context: "가장 친한 친구, 동생, 혹은 부모가 자녀에게 건네는 일상적인 인사입니다. 주로 또래나 나이가 더 어린 상대에게 친근함을 표현하기 위해 사용됩니다.",
    literal: "Peace / Wellness (noun)",
  },
  {
    id: "polite",
    korean: "안녕하세요",
    roman: "An-nyeong-ha-se-yo",
    formality: "존댓말 (Polite / Standard)",
    context: "가장 보편적이고 안전한 인사말입니다. 직장 동료, 손님, 웃어른, 혹은 처음 만난 낯선 사람에게 예를 표할 때 사용합니다. 일상적인 비즈니스와 사교 상황을 아우릅니다.",
    literal: "Are you in peace? / Please do peace.",
  },
  {
    id: "formal",
    korean: "안녕하십니까",
    roman: "An-nyeong-ha-sim-ni-ka",
    formality: "하십시오체 (Highly Formal / Honorific)",
    context: "최상의 격식을 차리는 인사입니다. 군대, 비즈니스 공식 보고, 뉴스 방송, 대규모 강연, 또는 지극히 존경을 표해야 하는 윗사람에게 인사할 때 사용됩니다.",
    literal: "Are you residing in peace? (highly formal)",
  },
];

export default function Home() {
  const [activeFormality, setActiveFormality] = useState("polite");
  const [hoveredLetter, setHoveredLetter] = useState(null);

  const currentLevel = FORMALITY_LEVELS.find((l) => l.id === activeFormality);

  // Text-To-Speech helper
  const handleSpeak = (text) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85; // slightly slower for clear pronunciation
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const letters = [
    { char: "안", mean: "편안할 안 (安)", desc: "Peace / Comfort", color: "hover:text-teal-400 hover:shadow-teal-500/20" },
    { char: "녕", mean: "편안할 녕 (寧)", desc: "Wellness / Health", color: "hover:text-cyan-400 hover:shadow-cyan-500/20" },
    { char: "하", mean: "할 하 (하)", desc: "To Do / Act", color: "hover:text-emerald-400 hover:shadow-emerald-500/20" },
    { char: "세", mean: "높임 접미사", desc: "Honorific Marker", color: "hover:text-purple-400 hover:shadow-purple-500/20" },
    { char: "요", mean: "존칭 조문", desc: "Polite Ending", color: "hover:text-fuchsia-400 hover:shadow-fuchsia-500/20" },
  ];

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start pb-24 relative selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Background Neon Blobs */}
      <div className="absolute top-20 left-1/4 w-[30vw] h-[30vw] bg-teal-500/10 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] bg-purple-500/10 rounded-full blur-[130px] animate-float-reverse pointer-events-none"></div>
      <div className="absolute bottom-40 left-1/3 w-[25vw] h-[25vw] bg-emerald-500/10 rounded-full blur-[100px] animate-float pointer-events-none"></div>

      {/* Floating navigation bar */}
      <header className="w-full max-w-6xl px-6 py-6 flex justify-between items-center z-10 border-b border-white/5 backdrop-blur-md sticky top-0 bg-zinc-950/70">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-serif bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            안녕 (Annyeong)
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-white/10 text-zinc-300 rounded border border-white/10 tracking-widest">
            v1.0
          </span>
        </div>
        <nav className="flex gap-6 text-sm text-zinc-400">
          <a href="#etymology" className="hover:text-teal-400 transition-colors">어원</a>
          <a href="#levels" className="hover:text-teal-400 transition-colors">존칭체</a>
          <a href="#bowing" className="hover:text-teal-400 transition-colors">인사법</a>
          <a href="#guestbook" className="hover:text-teal-400 transition-colors">방명록</a>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl px-4 md:px-6 flex flex-col gap-20 mt-16 z-10">
        
        {/* Section 1: Hero Graphic & Big Typography */}
        <section className="flex flex-col items-center text-center py-8 relative">
          
          {/* Subtle decoration */}
          <div className="text-xs uppercase font-mono tracking-widest text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full mb-6">
            The Art of Korean Greeting
          </div>

          {/* Syllable-by-syllable Interactive Typography */}
          <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center items-center select-none py-4">
            {letters.map((item, index) => (
              <div
                key={index}
                className="group relative cursor-default"
                onMouseEnter={() => setHoveredLetter(index)}
                onMouseLeave={() => setHoveredLetter(null)}
              >
                <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-serif text-zinc-100 transition-all duration-500 ease-out inline-block group-hover:-translate-y-4 group-hover:scale-110 ${item.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                  {item.char}
                </span>

                {/* Micro tooltip per letter */}
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-zinc-900 border border-white/10 p-2.5 rounded-xl flex flex-col gap-0.5 text-center min-w-[120px] shadow-2xl transition-all duration-300 pointer-events-none scale-90 ${
                  hoveredLetter === index ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90"
                }`}>
                  <span className="text-xs font-bold text-teal-400">{item.mean}</span>
                  <span className="text-[10px] text-zinc-400">{item.desc}</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtitles & Pronunciation Button */}
          <div className="flex flex-col items-center mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-zinc-400 font-sans">
              An-nyeong-ha-se-yo
            </h2>
            
            <p className="max-w-md text-zinc-500 text-sm mt-3 leading-relaxed">
              글자 위에 마우스를 올리면 각 음절에 담긴 한자적 뜻과 역할을 탐색할 수 있습니다.
            </p>

            <button
              onClick={() => handleSpeak("안녕하세요")}
              className="mt-6 flex items-center gap-2.5 bg-zinc-900 border border-white/10 hover:border-teal-500/40 hover:bg-zinc-800 text-zinc-200 hover:text-teal-300 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 group shadow-lg"
            >
              <SpeakerIcon className="w-4 h-4 group-hover:animate-pulse" />
              발음 듣기 (Listen Pronunciation)
            </button>
          </div>
        </section>

        {/* Section 2: Etymology (어원) */}
        <section id="etymology" className="scroll-mt-24">
          <div className="text-center md:text-left mb-8">
            <h3 className="text-2xl font-bold font-serif text-zinc-100">
              '안녕하세요'의 어원 (Etymology)
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              "평화와 안녕(安寧)을 묻는 따뜻한 질문에서 시작되었습니다."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 안녕 Card */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs uppercase font-mono tracking-widest text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
                    Syllables 1 & 2
                  </span>
                  <span className="text-3xl font-bold text-zinc-700">安寧</span>
                </div>
                <h4 className="text-xl font-bold font-serif text-zinc-200 mb-2">안녕 (An-nyeong)</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  한자 <strong>편안할 안(安)</strong>과 <strong>편안할 녕(寧)</strong>이 결합된 명사입니다.
                  '안(安)'은 집 안에 여자가 앉아있는 모양에서 기원하여 평안과 질서를, '녕(寧)'은 집안에 촛불과 그릇이 가득하여 넉넉하고 평온함을 나타냅니다. 즉, 걱정이나 시련 없이 평화롭고 건강한 상태를 말합니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-xs text-teal-400/80 font-mono">
                Meaning: Peace, Health, Safety
              </div>
            </div>

            {/* 하세요 Card */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs uppercase font-mono tracking-widest text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
                    Syllables 3, 4 & 5
                  </span>
                  <span className="text-3xl font-bold text-zinc-700">하세요</span>
                </div>
                <h4 className="text-xl font-bold font-serif text-zinc-200 mb-2">하세요 (Ha-se-yo)</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  동사 <strong>하다(to do)</strong>의 어간 '하-'에, 상대를 높여 부르는 어미 <strong>'-시-'</strong>와 정중한 청유 및 의문을 나타내는 종결어미 <strong>'-어요'</strong>가 결합된 표현입니다. 
                  따라서 상대방이 평안과 건강을 실천하며 머물고 있는지를 상냥하고 정중하게 물어보는 뜻이 됩니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-xs text-purple-400/80 font-mono">
                Meaning: Please do / Are you doing?
              </div>
            </div>
          </div>

          {/* Historical context note */}
          <div className="mt-6 bg-zinc-900/30 border border-white/5 p-5 rounded-2xl flex items-start gap-4">
            <div className="text-teal-400 mt-0.5 shrink-0">
              <InfoIcon className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-300 font-sans mb-1">역사적 유래 (Historical Origin)</h5>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                과거 사계절이 뚜렷한 한반도에서는 겨울철 혹독한 추위, 자연재해, 혹은 역병 등이 지난 후 이웃의 안부를 살피는 것이 무엇보다 중요했습니다. 
                아침에 일어나 이웃에게 <strong>"밤새 잘 주무셨습니까 (안녕하셨습니까)?"</strong>라고 물었던 인사가 굳어져 오늘날의 표준 인사말인 <strong>"안녕하세요"</strong>가 되었습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Formality Levels (존칭체) */}
        <section id="levels" className="scroll-mt-24">
          <div className="text-center md:text-left mb-8">
            <h3 className="text-2xl font-bold font-serif text-zinc-100">
              인사의 세 가지 높임 단계 (Formality Levels)
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              한국어는 상대방과의 나이, 지위, 친밀도에 따라 인사말을 다양하게 변형하여 예를 갖춥니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {FORMALITY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setActiveFormality(level.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                  activeFormality === level.id
                    ? "bg-zinc-900/80 border-teal-500/40 shadow-lg shadow-teal-500/5"
                    : "bg-zinc-950/20 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                    {level.id}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${activeFormality === level.id ? "bg-teal-500" : "bg-zinc-700"}`}></span>
                </div>
                <div className="text-xl font-bold font-serif text-zinc-100">{level.korean}</div>
                <div className="text-xs text-zinc-400 mt-1 font-mono">{level.roman}</div>
              </button>
            ))}
          </div>

          {/* Active Level Detail Display */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex-1">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
                {currentLevel.formality}
              </span>
              <h4 className="text-2xl font-serif font-bold text-zinc-100 mt-3 flex items-baseline gap-2">
                {currentLevel.korean}
                <span className="text-sm font-sans font-normal text-zinc-500">({currentLevel.roman})</span>
              </h4>
              <p className="text-xs font-mono text-zinc-400 mt-1">어원 직역: "{currentLevel.literal}"</p>
              
              <p className="text-sm text-zinc-300 leading-relaxed mt-4 font-sans">
                {currentLevel.context}
              </p>
            </div>

            <div className="shrink-0 self-stretch md:self-center flex items-center">
              <button
                onClick={() => handleSpeak(currentLevel.korean)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-teal-500/10 transition-colors"
              >
                <SpeakerIcon className="w-4 h-4" />
                발음 듣기 (Play Accent)
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: Bowing Visualizer (인사법) */}
        <section id="bowing" className="scroll-mt-24">
          <div className="text-center md:text-left mb-8">
            <h3 className="text-2xl font-bold font-serif text-zinc-100">
              한국의 인사 예절 (Bowing Etiquette)
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              상대방을 정중히 예우하는 허리의 각도와 예절 시뮬레이션입니다.
            </p>
          </div>

          <BowingVisualizer />
        </section>

        {/* Section 5: Guestbook / Message Board */}
        <section id="guestbook" className="scroll-mt-24">
          <div className="text-center md:text-left mb-8">
            <h3 className="text-2xl font-bold font-serif text-zinc-100">
              따뜻한 한마디 (Guestbook)
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              여러분도 이곳에 발자취를 따라 따뜻한 안부 인사를 건네보세요.
            </p>
          </div>

          <Guestbook />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mt-32 pt-8 px-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500 font-mono">
        <div>
          © {new Date().getFullYear()} 안녕하세요 (Annyeonghaseyo). Built with Next.js & Tailwind CSS.
        </div>
        <div className="flex gap-4">
          <span>평온과 건강을 소망하며</span>
          <span>•</span>
          <span>Time: 2026</span>
        </div>
      </footer>
    </div>
  );
}
