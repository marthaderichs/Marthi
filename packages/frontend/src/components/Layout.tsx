import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Brain, CheckSquare, Layers, Upload, Flower2, Timer, Coffee, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

function FocusTimer({ onActiveChange }: { onActiveChange: (active: boolean) => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const toggle = () => {
    if (isActive) {
      stop();
      setIsActive(false);
      onActiveChange(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { stop(); setIsActive(false); onActiveChange(false); return 0; }
          return prev - 1;
        });
      }, 1000);
      setIsActive(true);
      onActiveChange(true);
    }
  };

  const reset = () => {
    stop();
    setIsActive(false);
    onActiveChange(false);
    setTimeLeft(25 * 60);
  };

  useEffect(() => () => stop(), []);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div className="flex items-center gap-4 bg-white/50 px-4 py-2 rounded-full border border-black/[0.03] shadow-sm">
      <div className="flex items-center gap-2 font-display text-xl text-[#8B1E1E]">
        <Timer className="w-4 h-4" />
        <span className="tabular-nums">{m}:{s < 10 ? '0' : ''}{s}</span>
      </div>
      <div className="flex items-center gap-1 border-l border-black/[0.05] pl-3">
        <button onClick={toggle} className="p-1 hover:text-[#8B1E1E] transition-colors">
          {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <button onClick={reset} className="p-1 hover:text-[#8B1E1E] transition-colors">
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const [isFocusMode, setIsFocusMode] = useState(false);

  const navItems = [
    { to: '/', icon: CheckSquare, label: 'dashboard' },
    { to: '/exam', icon: Play, label: 'klausur' },
    { to: '/content', icon: Layers, label: 'bibliothek' },
    { to: '/flashcards', icon: Brain, label: 'karten' },
    { to: '/garden', icon: Flower2, label: 'garten' },
    { to: '/import', icon: Upload, label: 'import' },
  ];

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans selection:bg-[#8B3E2F]/20 bg-[#F9F4E8] transition-colors duration-1000",
      isFocusMode && "bg-[#D1E3ED]/30"
    )}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F4E8] border-b border-[#4A3A2F]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <span className="font-display text-4xl text-[#8B1E1E] tracking-tight">marthi lernt!</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => cn(
                  "text-xs font-bold tracking-widest transition-colors uppercase",
                  isActive
                    ? "text-[#8B1E1E] border-b-2 border-[#8B1E1E]"
                    : "text-[#4A3A2F]/60 hover:text-[#8B1E1E]"
                )}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <FocusTimer onActiveChange={setIsFocusMode} />
        </div>
        <div className="border-checker" />
      </header>

      {/* Mobile Nav */}
      <nav 
        className="md:hidden fixed bottom-6 left-6 right-6 p-2 bg-[#F9F4E8] rounded-2xl flex justify-around z-50 shadow-xl border border-black/[0.03] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.03] bg-stripes-blue -z-10" />
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-4 py-3 transition-all duration-300 rounded-2xl",
              isActive ? "bg-[#B8D3E5] text-[#4A3A2F]" : "text-[#4A3A2F]/30"
            )}
          >
            <item.icon className="w-5 h-5 stroke-[2]" />
            <span className="font-display text-[10px] font-bold tracking-wide lowercase">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <main className={cn(
        "flex-1 pb-32 w-full flex flex-col items-center bg-[#F9F4E8] transition-opacity duration-1000",
        isFocusMode && "opacity-80"
      )}>
        {/* Streifen starten bei y=0 (unter Header), Header überdeckt obere 86px,
            sichtbarer Streifen-Teil liegt nahtlos unter dem Checker */}
        <div className="w-full main-bg-stripes flex-shrink-0" style={{ height: '150px' }} />
        <div className="max-w-6xl w-full px-6 pt-8 pb-12">
          {isFocusMode && (
            <div className="flex items-center justify-center mb-8 gap-3 text-[#8B1E1E]/40 font-display text-2xl animate-pulse lowercase">
               <Coffee className="w-6 h-6" />
               <span>fokus-zeit... genieße die ruhe</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
