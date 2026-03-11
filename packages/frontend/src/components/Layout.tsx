import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Brain, CheckSquare, Layers, Upload, Flower2, Timer, Coffee, Play, Pause, RotateCcw, Search, X, BookOpen, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// ── Focus Timer ──────────────────────────────────────────────────────────────
function FocusTimer({ onActiveChange }: { onActiveChange: (active: boolean) => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const toggle = () => {
    if (isActive) { stop(); setIsActive(false); onActiveChange(false); }
    else {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { stop(); setIsActive(false); onActiveChange(false); return 0; }
          return prev - 1;
        });
      }, 1000);
      setIsActive(true); onActiveChange(true);
    }
  };

  const reset = () => { stop(); setIsActive(false); onActiveChange(false); setTimeLeft(25 * 60); };
  useEffect(() => () => stop(), []);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div className="flex items-center gap-4 bg-white/50 px-4 py-2 rounded-full border border-black/[0.03] shadow-sm">
      <div className="flex items-center gap-2 font-display text-xl text-[#673147]">
        <Timer className="w-4 h-4" />
        <span className="tabular-nums">{m}:{s < 10 ? '0' : ''}{s}</span>
      </div>
      <div className="flex items-center gap-1 border-l border-black/[0.05] pl-3">
        <button onClick={toggle} className="p-1 hover:text-[#673147] transition-colors">
          {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <button onClick={reset} className="p-1 hover:text-[#673147] transition-colors">
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ── Search Overlay ────────────────────────────────────────────────────────────
type SearchResult = {
  topics: Array<{ id: string; title: string; subjectId: string; subject: { name: string; color: string } }>;
  questions: Array<{ id: string; text: string; subjectId: string; subject: { name: string; color: string } }>;
  flashcards: Array<{ id: string; front: string; back: string; subjectId: string; subject: { name: string; color: string } }>;
};

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults(null); return; }
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    setResults(await res.json());
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(v), 300);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const totalResults = results
    ? results.topics.length + results.questions.length + results.flashcards.length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center pt-24 px-6 bg-[#4A3A2F]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, y: -10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: -10 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#F9F4E8] rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-4 px-6 py-5 border-b border-[#4A3A2F]/8">
          <Search className="w-5 h-5 text-[#673147]/30 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Themen, Fragen, Karteikarten durchsuchen…"
            value={query}
            onChange={handleChange}
            className="flex-1 bg-transparent text-lg text-[#673147] placeholder:text-[#673147]/25 focus:outline-none font-serif"
          />
          {loading && <div className="w-4 h-4 border-2 border-[#673147]/30 border-t-[#673147] rounded-full animate-spin shrink-0" />}
          <button onClick={onClose} className="p-1.5 rounded-full text-[#673147]/30 hover:text-[#673147] transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!results && !loading && (
            <div className="py-12 text-center text-[#673147]/25 font-serif italic text-sm">
              Mindestens 2 Zeichen eingeben…
            </div>
          )}
          {results && totalResults === 0 && (
            <div className="py-12 text-center text-[#673147]/25 font-serif italic text-sm">
              Keine Ergebnisse für „{query}"
            </div>
          )}

          {results && results.topics.length > 0 && (
            <div className="p-4 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#673147]/30 px-3 py-2 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Bibliothek
              </div>
              {results.topics.map(t => (
                <NavLink key={t.id} to="/content" onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#4A3A2F]/5 transition-colors group">
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: t.subject.color }} />
                  <div>
                    <div className="font-serif text-base text-[#673147] group-hover:text-[#673147] transition-colors">{t.title}</div>
                    <div className="text-[10px] text-[#673147]/35 font-black uppercase tracking-widest">{t.subject.name}</div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}

          {results && results.questions.length > 0 && (
            <div className="p-4 space-y-1 border-t border-[#4A3A2F]/5">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#673147]/30 px-3 py-2 flex items-center gap-2">
                <CheckSquare className="w-3 h-3" /> Klausurfragen
              </div>
              {results.questions.map(q => (
                <NavLink key={q.id} to="/exam" onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#4A3A2F]/5 transition-colors group">
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: q.subject.color }} />
                  <div>
                    <div className="font-serif text-base text-[#673147] group-hover:text-[#673147] transition-colors line-clamp-1">{q.text}</div>
                    <div className="text-[10px] text-[#673147]/35 font-black uppercase tracking-widest">{q.subject.name}</div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}

          {results && results.flashcards.length > 0 && (
            <div className="p-4 space-y-1 border-t border-[#4A3A2F]/5">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#673147]/30 px-3 py-2 flex items-center gap-2">
                <Brain className="w-3 h-3" /> Karteikarten
              </div>
              {results.flashcards.map(f => (
                <NavLink key={f.id} to="/flashcards" onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#4A3A2F]/5 transition-colors group">
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: f.subject.color }} />
                  <div>
                    <div className="font-serif text-base text-[#673147] group-hover:text-[#673147] transition-colors line-clamp-1">{f.front}</div>
                    <div className="text-[10px] text-[#673147]/35 font-black uppercase tracking-widest">{f.subject.name}</div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function Layout() {
  const location = useLocation();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navItems = [
    { to: '/',           icon: CheckSquare,  label: 'Dashboard',  heart: '#C2341E' },
    { to: '/exam',       icon: Play,         label: 'Klausur',    heart: '#673147' },
    { to: '/content',    icon: Layers,       label: 'Bibliothek', heart: '#E9C46A' },
    { to: '/flashcards', icon: Brain,        label: 'Karten',     heart: '#A3B18A' },
    { to: '/garden',     icon: Flower2,      label: 'Garten',     heart: '#E07A8A' },
    { to: '/import',     icon: Upload,       label: 'Import',     heart: '#B8D3E5' },
  ];

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans selection:bg-[#673147]/20 transition-colors duration-1000",
      location.pathname === '/' ? "main-bg-stripes" : "bg-[#F9F4E8]"
    )}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F4E8] border-b border-[#4A3A2F]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <span className="font-display text-5xl text-[#C2341E] tracking-tight">marthi lernt!</span>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => cn(
                  "text-xs font-bold tracking-widest transition-colors uppercase",
                  isActive
                    ? "text-[#673147] border-b-2 border-[#673147]"
                    : "text-[#673147]/60 hover:text-[#673147]"
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full border border-[#4A3A2F]/8 text-[#673147]/40 hover:text-[#673147] hover:border-[#673147]/20 transition-all text-xs font-bold shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suchen</span>
              <span className="hidden sm:inline text-[10px] opacity-50 ml-1">⌘K</span>
            </button>
            <div className="hidden lg:block">
              <FocusTimer onActiveChange={setIsFocusMode} />
            </div>
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 text-[#673147] hover:bg-[#E2E8D4] rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="border-checker" />
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[150] bg-[#F9F4E8]"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#4A3A2F]/8">
                <span className="font-display text-4xl text-[#C2341E]">marthi lernt!</span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-[#673147]/50 hover:text-[#673147] hover:bg-[#E2E8D4] rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col justify-center gap-2 px-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-5 px-5 py-4 rounded-2xl transition-all",
                      isActive
                        ? "bg-[#E2E8D4]/80 text-[#673147]"
                        : "text-[#673147]/50 hover:bg-[#E2E8D4]/40 hover:text-[#673147]"
                    )}
                  >
                    <span className="text-2xl shrink-0 leading-none" style={{ color: item.heart }}>♥</span>
                    <span className="font-display text-3xl">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="px-6 pb-10">
                <FocusTimer onActiveChange={setIsFocusMode} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pb-12 w-full flex flex-col items-center pt-[90px]">
        {location.pathname !== '/' && (
          <div className="w-full main-bg-stripes flex-shrink-0" style={{ height: '180px' }} />
        )}
        <div className="max-w-6xl w-full px-6 pt-0 pb-12">
          {isFocusMode && (
            <div className="flex items-center justify-center mb-8 gap-3 text-[#673147]/40 font-display text-2xl animate-pulse">
               <Coffee className="w-6 h-6" />
               <span>Fokus-Zeit… genieße die Ruhe</span>
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

      <AnimatePresence>
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </div>
  );
}
