import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'bga' | 'qsofa' | 'sofa';
type BGAAnswer = 'resp_az' | 'resp_alk' | 'met_az' | 'met_alk';

// ── BGA Data ─────────────────────────────────────────────────────────────────

const BGA_PATTERNS = [
  {
    name: 'Respiratorische Azidose',
    pH: '↓', pCO2: '↑↑ primär', HCO3: 'normal → ↑ (chron.)', BE: 'normal → ↑',
    comp: 'Metabolisch: HCO₃⁻ ↑ (renal, nach 3–5 Tagen)',
    examples: 'COPD-Exazerbation, Atemdepression, Pneumothorax',
    color: '#C2341E',
  },
  {
    name: 'Respiratorische Alkalose',
    pH: '↑', pCO2: '↓↓ primär', HCO3: 'normal → ↓ (chron.)', BE: 'normal → ↓',
    comp: 'Metabolisch: HCO₃⁻ ↓ (renale Ausscheidung)',
    examples: 'Hyperventilation, Sepsis, Lungenembolie, Höhe',
    color: '#5A7FA8',
  },
  {
    name: 'Metabolische Azidose',
    pH: '↓', pCO2: 'normal → ↓ (komp.)', HCO3: '↓↓ primär', BE: '↓ (negativ)',
    comp: 'Respiratorisch: pCO₂ ↓ (Kussmaul). Formel: pCO₂ = 1.5 × HCO₃⁻ + 8 ± 2',
    examples: 'DKA, Laktatazidose, Niereninsuff., Diarrhö',
    color: '#B8591E',
  },
  {
    name: 'Metabolische Alkalose',
    pH: '↑', pCO2: 'normal → ↑ (komp.)', HCO3: '↑↑ primär', BE: '↑ (positiv)',
    comp: 'Respiratorisch: pCO₂ ↑ (Hypoventilation, begrenzt)',
    examples: 'Erbrechen, Diuretika, Hyperaldosteronismus',
    color: '#5A8A3A',
  },
];

interface QuickCase {
  pH: number; pCO2: number; HCO3: number; BE: number;
  answer: BGAAnswer; label: string; explanation: string;
}

const QUICK_CASES: QuickCase[] = [
  { pH: 7.28, pCO2: 68, HCO3: 25, BE:  1,  answer: 'resp_az',  label: 'Respiratorische Azidose (akut)',        explanation: 'pH ↓, pCO₂ ↑↑ (primär), HCO₃⁻ normal → noch keine metabolische Kompensation (akut).' },
  { pH: 7.37, pCO2: 58, HCO3: 33, BE:  7,  answer: 'resp_az',  label: 'Respiratorische Azidose (kompensiert)',  explanation: 'pH grenzwertig normal, pCO₂ ↑↑, HCO₃⁻ ↑ (renale Kompensation) → chronische Störung.' },
  { pH: 7.22, pCO2: 24, HCO3: 10, BE: -16, answer: 'met_az',   label: 'Metabolische Azidose',                  explanation: 'pH ↓, HCO₃⁻ ↓↓ (primär), pCO₂ ↓ (Kussmaul-Atmung als respiratorische Kompensation).' },
  { pH: 7.34, pCO2: 31, HCO3: 17, BE: -8,  answer: 'met_az',   label: 'Metabolische Azidose (teilkompensiert)', explanation: 'pH leicht ↓, HCO₃⁻ ↓ (primär), pCO₂ ↓ (Kompensation), aber pH noch nicht normalisiert.' },
  { pH: 7.54, pCO2: 24, HCO3: 21, BE: -1,  answer: 'resp_alk', label: 'Respiratorische Alkalose (akut)',        explanation: 'pH ↑, pCO₂ ↓↓ (primär durch Hyperventilation), HCO₃⁻ normal → keine Kompensation (akut).' },
  { pH: 7.43, pCO2: 28, HCO3: 18, BE: -5,  answer: 'resp_alk', label: 'Respiratorische Alkalose (kompensiert)', explanation: 'pH fast normal, pCO₂ ↓, HCO₃⁻ ↓ (renale Kompensation) → chronische Störung.' },
  { pH: 7.56, pCO2: 52, HCO3: 42, BE: 16,  answer: 'met_alk',  label: 'Metabolische Alkalose',                 explanation: 'pH ↑, HCO₃⁻ ↑↑ (primär), pCO₂ ↑ (Hypoventilation als Kompensation).' },
  { pH: 7.50, pCO2: 45, HCO3: 34, BE: 10,  answer: 'met_alk',  label: 'Metabolische Alkalose (unkompensiert)',  explanation: 'pH ↑, HCO₃⁻ ↑ (primär), pCO₂ noch normal → noch keine respiratorische Kompensation.' },
];

const BGA_OPTIONS: { id: BGAAnswer; label: string }[] = [
  { id: 'resp_az',  label: 'Respiratorische Azidose' },
  { id: 'resp_alk', label: 'Respiratorische Alkalose' },
  { id: 'met_az',   label: 'Metabolische Azidose' },
  { id: 'met_alk',  label: 'Metabolische Alkalose' },
];

// ── SOFA Data ─────────────────────────────────────────────────────────────────

interface SOFASystem { label: string; sublabel: string; options: string[]; }
const SOFA_SYSTEMS: SOFASystem[] = [
  { label: 'Atmung', sublabel: 'PaO₂/FiO₂ (mmHg)', options: ['≥ 400', '300–399', '200–299', '100–199 + Beatmung', '< 100 + Beatmung'] },
  { label: 'Koagulation', sublabel: 'Thrombozyten (×10³/μL)', options: ['≥ 150', '100–149', '50–99', '20–49', '< 20'] },
  { label: 'Leber', sublabel: 'Bilirubin (mg/dL)', options: ['< 1.2', '1.2–1.9', '2.0–5.9', '6.0–11.9', '≥ 12.0'] },
  { label: 'Kreislauf', sublabel: 'MAP / Katecholamine', options: ['MAP ≥ 70 mmHg', 'MAP < 70 mmHg', 'Dopamin ≤ 5 oder Dobutamin', 'Dopamin 5–15 oder Epi/NE ≤ 0.1 μg/kg/min', 'Dopamin > 15 oder Epi/NE > 0.1 μg/kg/min'] },
  { label: 'ZNS', sublabel: 'GCS', options: ['GCS 15', 'GCS 13–14', 'GCS 10–12', 'GCS 6–9', 'GCS < 6'] },
  { label: 'Niere', sublabel: 'Kreatinin (mg/dL) / Urin', options: ['< 1.2 mg/dL', '1.2–1.9 mg/dL', '2.0–3.4 mg/dL', '3.5–4.9 mg/dL oder < 500 mL/d', '≥ 5.0 mg/dL oder < 200 mL/d'] },
];

function sofaInterpretation(score: number): { label: string; mortality: string; color: string } {
  if (score <= 1)  return { label: 'Niedrig',     mortality: '< 1%',    color: '#5A8A3A' };
  if (score <= 3)  return { label: 'Niedrig',     mortality: '< 2%',    color: '#5A8A3A' };
  if (score <= 5)  return { label: 'Moderat',     mortality: '~ 5%',    color: '#A06A00' };
  if (score <= 7)  return { label: 'Moderat',     mortality: '~ 10%',   color: '#A06A00' };
  if (score <= 9)  return { label: 'Erhöht',      mortality: '~ 15–20%', color: '#C2341E' };
  if (score <= 11) return { label: 'Hoch',        mortality: '~ 40–50%', color: '#C2341E' };
  if (score <= 14) return { label: 'Sehr hoch',   mortality: '> 50%',    color: '#7A0000' };
  return              { label: 'Kritisch',    mortality: '> 80%',    color: '#7A0000' };
}

// ── BGA Tab ───────────────────────────────────────────────────────────────────

function BGATab() {
  const [mode, setMode] = useState<'ref' | 'practice'>('ref');
  const [caseIdx, setCaseIdx] = useState(0);
  const [selected, setSelected] = useState<BGAAnswer | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const done = results.length === QUICK_CASES.length;
  const current = QUICK_CASES[caseIdx];

  function pick(answer: BGAAnswer) {
    if (selected) return;
    setSelected(answer);
  }

  function next() {
    if (!selected) return;
    const correct = selected === current.answer;
    setResults(prev => [...prev, correct]);
    setSelected(null);
    setCaseIdx(prev => prev + 1);
  }

  function restart() {
    setCaseIdx(0);
    setSelected(null);
    setResults([]);
  }

  if (mode === 'practice') {
    const score = results.filter(Boolean).length;

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => { setMode('ref'); restart(); }} className="text-xs font-black uppercase tracking-wider text-[#673147]/50 hover:text-[#673147] transition-colors">
            ← Referenz
          </button>
          {!done && (
            <span className="text-xs font-black uppercase tracking-wider text-[#673147]/40">
              {caseIdx + 1} / {QUICK_CASES.length}
            </span>
          )}
        </div>

        {done ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className={`rounded-3xl p-6 text-center border ${score === QUICK_CASES.length ? 'bg-[#A3B18A]/10 border-[#A3B18A]/30' : 'bg-white/60 border-[#4A3A2F]/8'}`}>
              <div className="text-4xl mb-2">{score === QUICK_CASES.length ? '🎉' : '📋'}</div>
              <p className="font-display text-3xl text-[#673147]">{score} / {QUICK_CASES.length}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_CASES.map((c, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${results[i] ? 'bg-[#A3B18A]/8 border-[#A3B18A]/25' : 'bg-[#C2341E]/5 border-[#C2341E]/15'}`}>
                  {results[i] ? <CheckCircle className="w-4 h-4 text-[#5A8A3A] shrink-0" /> : <XCircle className="w-4 h-4 text-[#C2341E] shrink-0" />}
                  <span className="font-serif text-[#673147]/70 text-xs">{c.label}</span>
                </div>
              ))}
            </div>
            <button onClick={restart} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/60 border border-[#4A3A2F]/10 text-sm font-black uppercase tracking-wider text-[#673147]/60 hover:text-[#673147] transition-all">
              <RotateCcw className="w-4 h-4" /> Nochmal
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={caseIdx} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
              {/* Values panel */}
              <div className="bg-white/60 rounded-2xl p-5 border border-[#4A3A2F]/8">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#5A7FA8] mb-4">Was liegt vor?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'pH', val: current.pH.toFixed(2), norm: [7.35, 7.45], isHigh: current.pH > 7.45, isLow: current.pH < 7.35 },
                    { label: 'pCO₂', val: `${current.pCO2} mmHg`, norm: [35, 45], isHigh: current.pCO2 > 45, isLow: current.pCO2 < 35 },
                    { label: 'HCO₃⁻', val: `${current.HCO3} mmol/L`, norm: [22, 26], isHigh: current.HCO3 > 26, isLow: current.HCO3 < 22 },
                    { label: 'BE', val: `${current.BE >= 0 ? '+' : ''}${current.BE} mmol/L`, norm: [-2, 2], isHigh: current.BE > 2, isLow: current.BE < -2 },
                  ].map(({ label, val, isHigh, isLow }) => (
                    <div key={label} className="bg-[#F9F4E8] rounded-xl p-3 text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#673147]/40 mb-1">{label}</div>
                      <div className={`text-lg tabular-nums font-bold ${isHigh ? 'text-[#C2341E]' : isLow ? 'text-[#5A7FA8]' : 'text-[#4A3A2F]'}`}>
                        {val} {isHigh ? '↑' : isLow ? '↓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BGA_OPTIONS.map(opt => {
                  const isSelected = selected === opt.id;
                  const isCorrect = opt.id === current.answer;
                  let style = 'bg-white/60 hover:bg-white/90 border-[#4A3A2F]/10 cursor-pointer';
                  if (selected) {
                    if (isSelected && isCorrect) style = 'bg-[#A3B18A]/15 border-[#A3B18A]/50 cursor-default';
                    else if (isSelected && !isCorrect) style = 'bg-[#C2341E]/8 border-[#C2341E]/30 cursor-default';
                    else if (isCorrect) style = 'bg-[#A3B18A]/8 border-[#A3B18A]/30 cursor-default';
                    else style = 'bg-white/30 border-[#4A3A2F]/5 opacity-40 cursor-default';
                  }
                  return (
                    <button key={opt.id} onClick={() => pick(opt.id)} className={`flex items-center gap-3 text-left rounded-2xl p-4 border transition-all ${style}`}>
                      <div className="shrink-0">
                        {selected && isSelected && (isCorrect ? <CheckCircle className="w-4 h-4 text-[#5A8A3A]" /> : <XCircle className="w-4 h-4 text-[#C2341E]" />)}
                        {selected && !isSelected && isCorrect && <CheckCircle className="w-4 h-4 text-[#A3B18A]" />}
                        {!selected && <div className="w-4 h-4 rounded-full border-2 border-[#4A3A2F]/20" />}
                      </div>
                      <span className="font-serif text-sm text-[#673147]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation + next */}
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className={`rounded-2xl p-4 text-sm font-serif ${selected === current.answer ? 'bg-[#A3B18A]/10 text-[#4A3A2F]/70' : 'bg-[#C2341E]/5 text-[#4A3A2F]/70'}`}>
                      <span className="font-bold text-[#673147]">{current.label}: </span>{current.explanation}
                    </div>
                    <div className="flex justify-end">
                      <button onClick={next} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#5A7FA8]/10 border border-[#5A7FA8]/20 text-sm font-black uppercase tracking-wider text-[#5A7FA8] hover:bg-[#5A7FA8]/20 transition-all">
                        {caseIdx + 1 === QUICK_CASES.length ? 'Auswertung' : 'Weiter →'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  // Reference view
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BGA_PATTERNS.map(p => (
          <div key={p.name} className="bg-white/60 rounded-2xl p-5 border border-[#4A3A2F]/8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="font-display text-base text-[#673147]">{p.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[{ l: 'pH', v: p.pH }, { l: 'pCO₂', v: p.pCO2 }, { l: 'HCO₃⁻', v: p.HCO3 }].map(({ l, v }) => (
                <div key={l} className="bg-[#F9F4E8] rounded-xl p-2 text-center">
                  <div className="text-[9px] font-black uppercase tracking-wider text-[#673147]/40">{l}</div>
                  <div className="text-xs font-bold text-[#673147] mt-0.5 leading-tight">{v}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#673147]/35">Kompensation</p>
              <p className="text-xs font-serif text-[#673147]/60">{p.comp}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#673147]/35 mt-2">Beispiele</p>
              <p className="text-xs font-serif text-[#673147]/50">{p.examples}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#5A7FA8]/8 rounded-2xl p-4 border border-[#5A7FA8]/15 text-sm font-serif text-[#673147]/60">
        <span className="font-bold text-[#5A7FA8]">Merksatz: </span>
        Der primär veränderte Parameter bestimmt die Störung (pCO₂ → respiratorisch, HCO₃⁻ → metabolisch). Der andere Parameter zeigt die Kompensation. pH-Richtung = Richtung der primären Störung.
      </div>

      <button onClick={() => setMode('practice')} className="w-full py-4 rounded-2xl bg-[#5A7FA8]/10 border border-[#5A7FA8]/20 text-sm font-black uppercase tracking-wider text-[#5A7FA8] hover:bg-[#5A7FA8]/20 transition-all">
        Jetzt üben → 8 Fälle
      </button>
    </div>
  );
}

// ── qSOFA Tab ─────────────────────────────────────────────────────────────────

function QSofaTab() {
  const [criteria, setCriteria] = useState({ af: false, bewusstsein: false, bp: false });
  const score = Object.values(criteria).filter(Boolean).length;

  const items = [
    { key: 'af' as const,          label: 'Atemfrequenz ≥ 22 /min' },
    { key: 'bewusstsein' as const,  label: 'Bewusstseinsveränderung (GCS < 15)' },
    { key: 'bp' as const,           label: 'Systolischer Blutdruck ≤ 100 mmHg' },
  ];

  const interpretation =
    score === 0 ? { text: 'Niedriges Risiko für schlechten Verlauf.', color: '#5A8A3A', bg: 'bg-[#A3B18A]/10 border-[#A3B18A]/25' } :
    score === 1 ? { text: 'Erhöhte Aufmerksamkeit — klinischen Verlauf beobachten.', color: '#A06A00', bg: 'bg-[#E9C46A]/15 border-[#E9C46A]/30' } :
                  { text: 'Erhöhtes Risiko für Organversagen und Mortalität. Vollständigen SOFA-Score erheben und Sepsis-Protokoll initiieren!', color: '#C2341E', bg: 'bg-[#C2341E]/8 border-[#C2341E]/25' };

  return (
    <div className="space-y-5 max-w-lg">
      <div className="bg-white/50 rounded-2xl p-4 border border-[#4A3A2F]/8 text-xs font-serif text-[#673147]/55">
        Der <span className="font-bold">quick SOFA (qSOFA)</span> ist ein einfaches Screening-Tool zur frühen Identifikation von Patienten mit Verdacht auf Sepsis außerhalb der Intensivstation. Er ersetzt <span className="italic">nicht</span> den SOFA-Score.
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => setCriteria(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${criteria[item.key] ? 'bg-[#C2341E]/8 border-[#C2341E]/30' : 'bg-white/60 border-[#4A3A2F]/10 hover:bg-white/80'}`}
          >
            <div className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${criteria[item.key] ? 'bg-[#C2341E] border-[#C2341E]' : 'border-[#4A3A2F]/20'}`}>
              {criteria[item.key] && <span className="text-white text-xs font-black">✓</span>}
            </div>
            <span className="font-serif text-[#673147]">{item.label}</span>
            <span className="ml-auto font-black text-[#673147]/30 shrink-0">1 Pkt.</span>
          </button>
        ))}
      </div>

      <div className={`rounded-2xl p-5 border ${interpretation.bg}`}>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-display text-5xl" style={{ color: interpretation.color }}>{score}</div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#673147]/40">qSOFA</div>
          </div>
          <div className="border-l border-[#4A3A2F]/10 pl-4">
            <p className="text-sm font-serif text-[#673147]/70">{interpretation.text}</p>
          </div>
        </div>
      </div>

      <button onClick={() => setCriteria({ af: false, bewusstsein: false, bp: false })} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#673147]/40 hover:text-[#673147] transition-colors">
        <RotateCcw className="w-3 h-3" /> Zurücksetzen
      </button>
    </div>
  );
}

// ── SOFA Tab ──────────────────────────────────────────────────────────────────

function SofaTab() {
  const [scores, setScores] = useState<Record<string, number>>({
    Atmung: 0, Koagulation: 0, Leber: 0, Kreislauf: 0, ZNS: 0, Niere: 0,
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const interp = sofaInterpretation(total);

  return (
    <div className="space-y-5">
      <div className="bg-white/50 rounded-2xl p-4 border border-[#4A3A2F]/8 text-xs font-serif text-[#673147]/55">
        Der <span className="font-bold">Sequential Organ Failure Assessment (SOFA)</span> bewertet 6 Organsysteme (je 0–4 Punkte). Ein Score ≥ 2 bei Infektionsverdacht erfüllt die Sepsis-Kriterien (Sepsis-3, 2016).
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOFA_SYSTEMS.map(system => (
          <div key={system.label} className="bg-white/60 rounded-2xl p-4 border border-[#4A3A2F]/8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#673147]/60">{system.label}</p>
                <p className="text-[10px] text-[#673147]/35 font-serif">{system.sublabel}</p>
              </div>
              <div className="text-2xl font-display text-[#673147]">{scores[system.label]}</div>
            </div>
            <div className="space-y-1">
              {system.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setScores(prev => ({ ...prev, [system.label]: i }))}
                  className={`w-full flex items-center gap-2 text-left text-xs px-3 py-2 rounded-xl transition-all ${scores[system.label] === i ? 'bg-[#5A7FA8]/15 border border-[#5A7FA8]/35 text-[#5A7FA8]' : 'bg-[#F9F4E8] text-[#4A3A2F]/55 hover:bg-white/80'}`}
                >
                  <span className="font-black w-3 shrink-0">{i}</span>
                  <span className="font-serif">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="rounded-2xl p-5 border bg-white/60 border-[#4A3A2F]/8">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="text-center">
            <div className="font-display text-6xl" style={{ color: interp.color }}>{total}</div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#673147]/40">SOFA-Score</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black uppercase tracking-wider" style={{ color: interp.color }}>{interp.label}</span>
            </div>
            <p className="text-sm font-serif text-[#673147]/60">Geschätzte Mortalität: <span className="font-bold">{interp.mortality}</span></p>
            {total >= 2 && (
              <div className="flex items-start gap-2 mt-2 text-xs font-serif text-[#C2341E]/70">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Bei SOFA ≥ 2 mit Infektionsverdacht: Sepsis-Kriterien erfüllt.</span>
              </div>
            )}
          </div>
          {/* Per-system breakdown */}
          <div className="flex gap-2 flex-wrap">
            {SOFA_SYSTEMS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-display text-[#673147]">{scores[s.label]}</div>
                <div className="text-[9px] font-black uppercase tracking-wider text-[#673147]/35">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => setScores({ Atmung: 0, Koagulation: 0, Leber: 0, Kreislauf: 0, ZNS: 0, Niere: 0 })} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#673147]/40 hover:text-[#673147] transition-colors">
        <RotateCcw className="w-3 h-3" /> Zurücksetzen
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: 'bga',    label: 'BGA' },
  { id: 'qsofa',  label: 'qSOFA' },
  { id: 'sofa',   label: 'SOFA' },
];

export default function BGATraining() {
  const [tab, setTab] = useState<Tab>('bga');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Activity className="w-6 h-6 text-[#5A7FA8]" />
            <h1 className="font-display text-4xl text-[#673147]">Klinische Tools</h1>
          </div>
          <p className="text-[#673147]/50 font-serif text-sm">BGA · qSOFA · SOFA</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/50 p-1 rounded-2xl border border-[#4A3A2F]/8 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${tab === t.id ? 'bg-[#5A7FA8] text-white shadow-sm' : 'text-[#673147]/50 hover:text-[#673147]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {tab === 'bga'   && <BGATab />}
          {tab === 'qsofa' && <QSofaTab />}
          {tab === 'sofa'  && <SofaTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
