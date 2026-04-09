import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, Trophy, Activity, RotateCcw } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = 'leicht' | 'mittel' | 'schwer';

interface BGAValues { pH: number; pCO2: number; pO2: number; HCO3: number; BE: number; SaO2: number; lactate?: number; }
interface StepOption { text: string; correct: boolean; explanation: string; }
interface CaseStep { question: string; hint?: string; options: StepOption[]; }
interface BGACase { id: string; title: string; difficulty: Difficulty; context: string; values: BGAValues; steps: CaseStep[]; finalDiagnosis: string; teaching: string; }

// ── Reference ranges ──────────────────────────────────────────────────────────

const REF: Record<string, { min: number; max: number; unit: string; label: string; dec: number }> = {
  pH:   { min: 7.35, max: 7.45, unit: '',       label: 'pH',      dec: 2 },
  pCO2: { min: 35,   max: 45,   unit: 'mmHg',   label: 'pCO₂',   dec: 0 },
  pO2:  { min: 70,   max: 100,  unit: 'mmHg',   label: 'pO₂',    dec: 0 },
  HCO3: { min: 22,   max: 26,   unit: 'mmol/L', label: 'HCO₃⁻', dec: 0 },
  BE:   { min: -2,   max: 2,    unit: 'mmol/L', label: 'BE',      dec: 0 },
  SaO2: { min: 95,   max: 100,  unit: '%',      label: 'SaO₂',   dec: 0 },
};

function getStatus(key: string, val: number): 'low' | 'normal' | 'high' {
  const r = REF[key];
  return val < r.min ? 'low' : val > r.max ? 'high' : 'normal';
}

// ── Cases ─────────────────────────────────────────────────────────────────────

const CASES: BGACase[] = [
  {
    id: 'case1',
    title: 'Akute COPD-Exazerbation',
    difficulty: 'leicht',
    context: '65-jähriger Patient mit bekannter COPD (Stadium III). Akut verschlechterte Dyspnoe. AF 28/min, SpO₂ 87% an Raumluft, HR 118/min. Somnolent, kann kaum sprechen.',
    values: { pH: 7.28, pCO2: 68, pO2: 52, HCO3: 25, BE: 1, SaO2: 87 },
    steps: [
      {
        question: 'Beurteile die Oxygenierung: pO₂ = 52 mmHg, SaO₂ = 87%.',
        options: [
          { text: 'Normale Oxygenierung', correct: false, explanation: 'Falsch — pO₂ 52 mmHg liegt weit unter dem Normbereich (70–100 mmHg), SaO₂ 87% unter 95%. Das ist eine schwere Hypoxämie.' },
          { text: 'Hypoxämie', correct: true, explanation: 'Richtig! pO₂ 52 und SaO₂ 87% belegen eine schwere Hypoxämie. Ab pO₂ < 60 mmHg spricht man von respiratorischer Insuffizienz Typ I. Beim COPD-Patienten: O₂-Gabe vorsichtig (Hypoxie-Atemstimel), Ziel-SpO₂ 88–92%.' },
          { text: 'Hyperoxie', correct: false, explanation: 'Falsch — Hyperoxie wäre pO₂ > 100 mmHg. Hier liegen pO₂ und SaO₂ weit darunter.' },
        ],
      },
      {
        question: 'Beurteile den pH-Wert: pH = 7.28.',
        options: [
          { text: 'Alkalose (pH > 7.45)', correct: false, explanation: 'Falsch — 7.28 liegt unter dem Normbereich, nicht darüber.' },
          { text: 'Normbereich (7.35–7.45)', correct: false, explanation: 'Falsch — Normbereich ist 7.35–7.45. Mit 7.28 liegt eine klare Azidose vor.' },
          { text: 'Azidose (pH < 7.35)', correct: true, explanation: 'Richtig! pH 7.28 < 7.35 = Azidose. pH < 7.2 gilt als lebensbedrohlich. Hier besteht Handlungsbedarf.' },
        ],
      },
      {
        question: 'Was ist die primäre Störung? pCO₂ = 68 mmHg, HCO₃⁻ = 25 mmol/L, BE = +1 mmol/L.',
        hint: 'Welcher Parameter weicht von der Norm ab und erklärt die Azidose?',
        options: [
          { text: 'Metabolische Azidose (HCO₃⁻ ↓)', correct: false, explanation: 'Falsch — bei metabolischer Azidose wäre HCO₃⁻ erniedrigt. Hier ist HCO₃⁻ mit 25 mmol/L völlig normal.' },
          { text: 'Respiratorische Azidose (pCO₂ ↑)', correct: true, explanation: 'Richtig! pCO₂ 68 mmHg (Norm 35–45) ist deutlich erhöht — CO₂-Retention durch Hypoventilation. HCO₃⁻ normal → akute Störung, noch keine renale Kompensation.' },
          { text: 'Gemischte Azidose (pCO₂ ↑ + HCO₃⁻ ↓)', correct: false, explanation: 'Falsch — HCO₃⁻ ist normal (25 mmol/L). Gemischte Azidose würde beide Parameter pathologisch erfordern.' },
        ],
      },
      {
        question: 'Liegt eine Kompensation vor? HCO₃⁻ = 25 mmol/L, BE = +1 mmol/L.',
        hint: 'Bei respiratorischer Azidose wäre die Kompensation metabolisch (renale HCO₃⁻-Retention).',
        options: [
          { text: 'Ja — ausgeprägte metabolische Kompensation', correct: false, explanation: 'Falsch — HCO₃⁻ ist mit 25 mmol/L normal. Keine Kompensation erkennbar.' },
          { text: 'Nein — keine Kompensation (akute Störung)', correct: true, explanation: 'Richtig! HCO₃⁻ normal → die Nieren haben noch nicht begonnen zu kompensieren. Renale Kompensation setzt erst nach 3–5 Tagen ein. Dies spricht für eine akute Genese.' },
          { text: 'Ja — respiratorische Kompensation durch Hyperventilation', correct: false, explanation: 'Falsch — respiratorische Kompensation gibt es bei metabolischen Störungen. Zudem ist pCO₂ erhöht, nicht erniedrigt.' },
        ],
      },
      {
        question: 'Stelle die finale Diagnose.',
        options: [
          { text: 'Chronische respiratorische Azidose', correct: false, explanation: 'Falsch — bei chronischer Form wäre HCO₃⁻ deutlich erhöht (z.B. 32–38 mmol/L). Hier ist HCO₃⁻ normal → keine Chronizitätszeichen.' },
          { text: 'Akute respiratorische Azidose mit Hypoxämie', correct: true, explanation: 'Richtig! Akut (keine metabolische Kompensation), respiratorisch (pCO₂ ↑), kombiniert mit schwerer Hypoxämie. Therapie: NIV/Beatmung + Bronchodilatatoren.' },
          { text: 'Metabolische Azidose mit respiratorischer Kompensation', correct: false, explanation: 'Falsch — primär erhöht ist pCO₂, nicht erniedrigt HCO₃⁻. Bei metabolischer Azidose mit resp. Kompensation: HCO₃⁻ ↓ und pCO₂ ↓.' },
        ],
      },
    ],
    finalDiagnosis: 'Akute respiratorische Azidose mit schwerer Hypoxämie',
    teaching: 'Akut vs. chronisch: Bei akuter respiratorischer Azidose ist HCO₃⁻ normal (keine Zeit für renale Kompensation). Bei chronischer Form ist HCO₃⁻ kompensatorisch erhöht, der pH fast normalisiert. Merke: Renale Kompensation braucht 3–5 Tage. Beim COPD-Patienten Ziel-SpO₂ 88–92% — zu viel O₂ kann den Hypoxie-Atemstimel ausschalten!',
  },
  {
    id: 'case2',
    title: 'Chronisch kompensierte COPD',
    difficulty: 'mittel',
    context: '72-jährige Patientin mit COPD Stadium IV (FEV₁ 28%). Routinekontrolle beim Pneumologen. Sie ist leicht dyspnoisch unter Belastung, aber stabil. Heimsauerstoff 2 L/min.',
    values: { pH: 7.37, pCO2: 58, pO2: 64, HCO3: 33, BE: 7, SaO2: 92 },
    steps: [
      {
        question: 'pO₂ = 64 mmHg, SaO₂ = 92% — aber unter O₂-Gabe (2 L/min). Wie beurteilst du die Oxygenierung?',
        options: [
          { text: 'Völlig normal', correct: false, explanation: 'Falsch — pO₂ 64 liegt unter der Norm (70–100 mmHg), obwohl die Patientin O₂ erhält.' },
          { text: 'Leichte Hypoxämie, therapeutisch akzeptabel bei COPD', correct: true, explanation: 'Richtig! Bei hyperkapnischer COPD ist ein Ziel-SpO₂ von 88–92% und pO₂ 55–65 mmHg angestrebt. Zu hohe O₂-Gabe könnte den Hypoxie-Atemstimel unterdrücken → CO₂-Anstieg.' },
          { text: 'Schwere Hypoxämie, sofort intervenieren', correct: false, explanation: 'Falsch — bei einer stabilen COPD-Patientin unter angepasster Heimsauerstofftherapie ist SaO₂ 92% akzeptabel.' },
        ],
      },
      {
        question: 'pH = 7.37 — wie beurteilst du diesen Wert?',
        hint: 'Normbereich: 7.35–7.45. Achte auf die Tendenz innerhalb des Normbereichs.',
        options: [
          { text: 'Klar normal — kein pathologischer Befund', correct: false, explanation: 'Nicht ganz — 7.37 ist formal normal, aber im unteren Bereich. Angesichts des massiv erhöhten pCO₂ (58!) zeigt der fast normale pH, dass eine ausgeprägte Kompensation vorliegen muss.' },
          { text: 'Formal normal, Tendenz zur Azidose (low-normal)', correct: true, explanation: 'Richtig! 7.37 ist formal im Normbereich, aber unteres Drittel. Bei pCO₂ 58 mmHg wäre der pH ohne Kompensation viel niedriger. Der fast normale pH verrät: starke metabolische Kompensation.' },
          { text: 'Alkalose', correct: false, explanation: 'Falsch — Alkalose wäre pH > 7.45.' },
        ],
      },
      {
        question: 'pCO₂ = 58 mmHg (↑), HCO₃⁻ = 33 mmol/L (↑), BE = +7 mmol/L. Was ist die primäre Störung?',
        options: [
          { text: 'Metabolische Alkalose mit respiratorischer Kompensation', correct: false, explanation: 'Falsch — bei primärer metabolischer Alkalose wäre HCO₃⁻ die Ursache und pCO₂ nur leicht erhöht (als Kompensation). Hier ist pCO₂ extrem erhöht (58 mmHg!) → das ist die primäre Störung.' },
          { text: 'Respiratorische Azidose mit metabolischer Kompensation', correct: true, explanation: 'Richtig! pCO₂ 58 = primäre respiratorische Azidose (CO₂-Retention). HCO₃⁻ 33 + BE +7 = renale Kompensation (Niere retiniert HCO₃⁻ um pH zu heben). Klassisches Bild chronischer COPD.' },
          { text: 'Kombinierte metabolisch-respiratorische Alkalose', correct: false, explanation: 'Falsch — pH 7.37 ist nicht alkalisch, und pCO₂ ist erhöht, nicht erniedrigt.' },
        ],
      },
      {
        question: 'Ist die Kompensation adäquat? HCO₃⁻ stieg von normal ~24 auf 33 mmol/L (+9).',
        options: [
          { text: 'Keine Kompensation', correct: false, explanation: 'Falsch — HCO₃⁻ ist von 24 auf 33 gestiegen = eindeutige metabolische Kompensation.' },
          { text: 'Adäquate Kompensation (pH fast normalisiert)', correct: true, explanation: 'Richtig! Der massive HCO₃⁻-Anstieg (+9 mmol/L) hat den pH trotz pCO₂ 58 auf 7.37 angehoben — vollständige Kompensation, typisch für chronische COPD. Die Nieren haben über Monate adaptiert.' },
          { text: 'Überschießende Kompensation (Alkalose)', correct: false, explanation: 'Falsch — pH 7.37 ist noch nicht alkalisch. Überschießend wäre pH > 7.45.' },
        ],
      },
      {
        question: 'Diagnose?',
        options: [
          { text: 'Akute respiratorische Azidose (keine Kompensation)', correct: false, explanation: 'Falsch — HCO₃⁻ 33 mmol/L ist deutlich erhöht. Akute Störungen haben normales HCO₃⁻ (Kompensation fehlt noch).' },
          { text: 'Chronische respiratorische Azidose mit vollständiger metabolischer Kompensation', correct: true, explanation: 'Richtig! Chronisch (HCO₃⁻ stark erhöht durch jahrelange renale Kompensation), respiratorisch (pCO₂ ↑ primär), vollständig kompensiert (pH 7.37 = normal). Klassischer BGA-Befund bei fortgeschrittener COPD.' },
          { text: 'Metabolische Alkalose (primär)', correct: false, explanation: 'Falsch — das erhöhte HCO₃⁻ ist reaktiv/kompensatorisch. Bei primärer metabolischer Alkalose wäre pH > 7.45 und pCO₂ nur moderat erhöht.' },
        ],
      },
    ],
    finalDiagnosis: 'Chronische respiratorische Azidose mit vollständiger metabolischer Kompensation',
    teaching: 'Akut vs. chronisch im Vergleich: Akute respir. Azidose → HCO₃⁻ normal, pH stark erniedrigt. Chronische respir. Azidose → HCO₃⁻ stark erhöht, pH fast normal. Faustregel: Pro 10 mmHg pCO₂-Anstieg steigt HCO₃⁻ akut um ~1, chronisch um ~3.5 mmol/L. Beim COPD-Patienten nicht versuchen den pH auf 7.40 zu „korrigieren" — das ist sein Normalzustand!',
  },
  {
    id: 'case3',
    title: 'Diabetische Ketoazidose (DKA)',
    difficulty: 'mittel',
    context: '23-jährige Patientin mit Typ-1-Diabetes (seit dem 12. Lebensjahr). Seit 3 Tagen Übelkeit, Erbrechen, Bauchschmerzen. Notfall-Labor: BZ 487 mg/dL, Ketonurie +++. Sie atmet tief und schnell (Kussmaul-Atmung), AF 30/min.',
    values: { pH: 7.21, pCO2: 22, pO2: 96, HCO3: 9, BE: -18, SaO2: 98 },
    steps: [
      {
        question: 'pO₂ = 96 mmHg, SaO₂ = 98%. Wie beurteilst du die Oxygenierung?',
        options: [
          { text: 'Normale Oxygenierung', correct: true, explanation: 'Richtig! pO₂ 96 und SaO₂ 98% sind komplett normal. Merke: Azidose und Oxygenierung sind zwei unabhängige Probleme — man kann eine schwere Azidose bei normaler Oxygenierung haben!' },
          { text: 'Hypoxämie', correct: false, explanation: 'Falsch — pO₂ 96 und SaO₂ 98% sind im Normbereich.' },
          { text: 'Hyperoxie', correct: false, explanation: 'Falsch — Hyperoxie wäre pO₂ > 100 mmHg.' },
        ],
      },
      {
        question: 'pH = 7.21 — wie schwer ist die Azidose?',
        options: [
          { text: 'Normal', correct: false, explanation: 'Falsch — Normbereich ist 7.35–7.45.' },
          { text: 'Leichte Azidose (7.30–7.35)', correct: false, explanation: 'Falsch — pH 7.21 ist weit unter 7.30. Das ist eine schwere Azidose.' },
          { text: 'Schwere Azidose (pH < 7.25) — lebensbedrohlich', correct: true, explanation: 'Richtig! pH 7.21 = schwere Azidose. Ab pH < 7.20 drohen Myokarddepression, Vasodilation und Arrhythmien. Sofortige Behandlung erforderlich!' },
        ],
      },
      {
        question: 'pCO₂ = 22 mmHg (↓), HCO₃⁻ = 9 mmol/L (↓↓), BE = −18 mmol/L. Was ist die primäre Störung?',
        hint: 'Welcher Parameter weicht mehr von der Norm ab: pCO₂ (Norm 35–45) oder HCO₃⁻ (Norm 22–26)?',
        options: [
          { text: 'Respiratorische Alkalose (pCO₂ ↓ ist primär)', correct: false, explanation: 'Falsch — pCO₂ ist erniedrigt, aber das ist eine Reaktion (Kompensation). HCO₃⁻ 9 mmol/L ist dramatisch erniedrigt → metabolische Ursache.' },
          { text: 'Metabolische Azidose (HCO₃⁻ ↓ ist primär)', correct: true, explanation: 'Richtig! HCO₃⁻ 9 mmol/L (Norm 22–26) und BE −18 = schwere metabolische Azidose. Ursache: Ketonkörper (β-Hydroxybutyrat, Acetoacetat) verbrauchen Bikarbonat. pCO₂ 22 ist die respiratorische Kompensation.' },
          { text: 'Gemischte respiratorisch-metabolische Azidose', correct: false, explanation: 'Falsch — bei gemischter Azidose: pCO₂ ↑ UND HCO₃⁻ ↓ gleichzeitig. Hier ist pCO₂ erniedrigt (Kompensation!), nicht erhöht.' },
        ],
      },
      {
        question: 'pCO₂ = 22 mmHg. Ist das erwartet? Wintersche Formel: Erwartetes pCO₂ = 1.5 × HCO₃⁻ + 8 ± 2',
        hint: 'Berechne: 1.5 × 9 + 8 = ?',
        options: [
          { text: 'Zu hoch — zusätzliche respiratorische Azidose', correct: false, explanation: 'Falsch — berechne: 1.5 × 9 + 8 = 21.5 ± 2 → Erwartungsbereich 19.5–23.5 mmHg. Gemessenes pCO₂ = 22 liegt genau darin.' },
          { text: 'Adäquate respiratorische Kompensation — Kussmaul-Atmung', correct: true, explanation: 'Richtig! Wintersche Formel: 1.5 × 9 + 8 = 21.5 ± 2 → Erwartungsbereich 19.5–23.5 mmHg. Gemessen: 22 mmHg = perfekte Kompensation. Die tiefe, schnelle Kussmaul-Atmung atmet CO₂ ab und hebt damit den pH.' },
          { text: 'Keine Kompensation', correct: false, explanation: 'Falsch — pCO₂ 22 (erniedrigt) ist eindeutig die respiratorische Kompensation. Ohne Kompensation wäre der pH noch viel niedriger.' },
        ],
      },
      {
        question: 'Diagnose und wichtigste Sofortmaßnahmen?',
        options: [
          { text: 'Laktatazidose → Volumen + Kreislaufstabilisierung', correct: false, explanation: 'Falsch — bei Laktatazidose: Laktat erhöht, keine Ketone. Hier: Ketonurie +++, BZ 487 → DKA.' },
          { text: 'Diabetische Ketoazidose → Insulin-Infusion + Volumen + Kalium-Monitoring', correct: true, explanation: 'Richtig! DKA-Trias: Hyperglykämie + Ketonämie/urie + Azidose. Therapie: 1. Volumen (NaCl 0,9%), 2. Insulin-Infusion 0,1 IE/kg/h, 3. Kalium engmaschig überwachen (Insulin senkt Kalium!), 4. Bikarbonat nur bei pH < 7.0.' },
          { text: 'Hyperventilationssyndrom → Rückatmen in Tüte', correct: false, explanation: 'Falsch — beim Hyperventilationssyndrom liegt eine respiratorische Alkalose vor (pH ↑). Hier schwere metabolische Azidose. Das wäre fatal!' },
        ],
      },
    ],
    finalDiagnosis: 'Diabetische Ketoazidose – metabolische Azidose mit adäquater respiratorischer Kompensation (Kussmaul-Atmung)',
    teaching: 'Die Wintersche Formel prüft, ob die respiratorische Kompensation adäquat ist: Erwartetes pCO₂ = 1.5 × HCO₃⁻ + 8 ± 2. Liegt gemessenes pCO₂ > Erwartungsbereich → zusätzliche respiratorische Azidose. Liegt es < Erwartungsbereich → zusätzliche respiratorische Alkalose. Liegt es darin → reine metabolische Störung mit adäquater Kompensation.',
  },
  {
    id: 'case4',
    title: 'Hyperventilationssyndrom',
    difficulty: 'leicht',
    context: '26-jährige Studentin in der Notaufnahme. Nach einer Prüfung plötzlich Kribbeln in Händen und Mund, Schwindel, Pfötchenstellung der Hände (Karpopedalspasmen). AF 34/min. Sie wirkt sehr ängstlich.',
    values: { pH: 7.54, pCO2: 24, pO2: 118, HCO3: 21, BE: -1, SaO2: 99 },
    steps: [
      {
        question: 'pO₂ = 118 mmHg, SaO₂ = 99%. Wie beurteilst du die Oxygenierung?',
        options: [
          { text: 'Hypoxämie', correct: false, explanation: 'Falsch — pO₂ 118 und SaO₂ 99% sind ausgezeichnet. Keinerlei Hypoxämie.' },
          { text: 'Gute bis leicht erhöhte Oxygenierung', correct: true, explanation: 'Richtig! pO₂ 118 mmHg ist leicht über dem Normbereich (Hyperoxie), SaO₂ 99% exzellent. Durch Hyperventilation wird mehr O₂ ein- und CO₂ ausgeatmet → pO₂ steigt, pCO₂ fällt.' },
          { text: 'Gefährliche Hyperoxie', correct: false, explanation: 'Falsch — gefährliche Hyperoxie betrifft vor allem beatmete Patienten (pO₂ >> 200 mmHg). pO₂ 118 an Raumluft ist unproblematisch.' },
        ],
      },
      {
        question: 'pH = 7.54. Was liegt vor?',
        options: [
          { text: 'Azidose (pH < 7.35)', correct: false, explanation: 'Falsch — 7.54 liegt über 7.45.' },
          { text: 'Normbereich (7.35–7.45)', correct: false, explanation: 'Falsch — Normbereich ist 7.35–7.45.' },
          { text: 'Alkalose (pH > 7.45)', correct: true, explanation: 'Richtig! pH 7.54 = deutliche Alkalose. Die Karpopedalspasmen erklären sich durch Alkalose: Proteinbindung von Ca²⁺ steigt → ionisiertes Calcium fällt trotz normalem Gesamt-Calcium → Tetanie.' },
        ],
      },
      {
        question: 'pCO₂ = 24 mmHg (↓), HCO₃⁻ = 21 mmol/L (knapp normal), BE = −1. Was ist die primäre Störung?',
        options: [
          { text: 'Metabolische Alkalose (HCO₃⁻ primär erhöht)', correct: false, explanation: 'Falsch — HCO₃⁻ ist mit 21 mmol/L eher erniedrigt. Bei metabolischer Alkalose wäre HCO₃⁻ > 26 mmol/L.' },
          { text: 'Respiratorische Alkalose (pCO₂ ↓ primär)', correct: true, explanation: 'Richtig! pCO₂ 24 mmHg (Norm 35–45) ist stark erniedrigt durch Hyperventilation. Das ist die primäre Störung. HCO₃⁻ ist nur minimal kompensatorisch abgesunken (renale Ausscheidung beginnt erst nach Stunden).' },
          { text: 'Gemischte Alkalose', correct: false, explanation: 'Falsch — gemischte Alkalose: pCO₂ ↓ + HCO₃⁻ ↑. Hier ist HCO₃⁻ normal bis leicht erniedrigt (keine metabolische Alkalose).' },
        ],
      },
      {
        question: 'HCO₃⁻ = 21 mmol/L — liegt eine Kompensation vor?',
        options: [
          { text: 'Nein — keine Kompensation (akute Störung)', correct: true, explanation: 'Richtig! HCO₃⁻ ist kaum verändert — keine relevante renale Kompensation. Passt zur akuten Hyperventilation (begann vor Minuten). Renale Kompensation (HCO₃⁻-Ausscheidung) setzt erst nach Stunden bis Tagen ein.' },
          { text: 'Ja — vollständige metabolische Kompensation', correct: false, explanation: 'Falsch — bei vollständiger Kompensation wäre HCO₃⁻ stärker erniedrigt und pH näher an 7.40. Hier ist pH 7.54 → kaum Kompensation.' },
          { text: 'Ja — respiratorische Kompensation', correct: false, explanation: 'Falsch — respiratorische Kompensation gibt es nur bei metabolischen Störungen. Bei respiratorischer Alkalose kompensiert die Niere (metabolisch).' },
        ],
      },
      {
        question: 'Diagnose und sinnvolle Sofortmaßnahme?',
        options: [
          { text: 'Akute respiratorische Alkalose → Rückatmen (Papiertüte/Maske) + Beruhigung', correct: true, explanation: 'Richtig! Rückatmen erhöht CO₂ der Einatemluft → pCO₂ steigt → pH sinkt → Symptome bessern sich. Wichtig: Erst organische Ursachen ausschließen (Lungenembolie, Herzinfarkt, Sepsis)!' },
          { text: 'Chronische respiratorische Alkalose → Langzeittherapie', correct: false, explanation: 'Falsch — der Befund ist akut (keine Kompensation) und die Ursache ist psychogen.' },
          { text: 'Metabolische Alkalose → Azidifizieren', correct: false, explanation: 'Falsch — die Alkalose ist respiratorisch bedingt (pCO₂ ↓). Metabolische Korrekturen wären falsch.' },
        ],
      },
    ],
    finalDiagnosis: 'Akute respiratorische Alkalose durch psychogene Hyperventilation',
    teaching: 'Respiratorische Alkalose = pCO₂ ↓ durch Hyperventilation → pH ↑. Klinisches Leitsymptom: Kribbeln (Akroparästhesien) und Karpopedalspasmen durch Abfall des ionisierten Calciums (Alkalose erhöht Ca²⁺-Proteinbindung). Merke: Immer organische Ursachen ausschließen — Lungenembolie, Sepsis, Schmerz und Schock können ebenfalls zur Hyperventilation führen!',
  },
  {
    id: 'case5',
    title: 'Magenausgangsstenose / Erbrechen',
    difficulty: 'mittel',
    context: '45-jähriger Mann. Seit 4 Wochen Erbrechen direkt nach dem Essen (Magenausgangsstenose durch Ulcus). Gewichtsverlust 6 kg, klinisch dehydriert. Labor: Kalium 2.8 mmol/L (↓), Chlorid 88 mmol/L (↓, Norm 98–106).',
    values: { pH: 7.56, pCO2: 52, pO2: 85, HCO3: 42, BE: 16, SaO2: 96 },
    steps: [
      {
        question: 'pO₂ = 85 mmHg, SaO₂ = 96%. Wie beurteilst du die Oxygenierung?',
        options: [
          { text: 'Normale Oxygenierung', correct: true, explanation: 'Richtig! pO₂ 85 liegt im Normbereich (70–100 mmHg), SaO₂ 96% ≥ 95%. Die Oxygenierung ist normal. Das leicht erhöhte pCO₂ (Kompensation durch Hypoventilation) führt zu einem kleinen pO₂-Abfall — aber noch im Normbereich.' },
          { text: 'Schwere Hypoxämie', correct: false, explanation: 'Falsch — pO₂ 85 liegt im Normbereich (70–100 mmHg).' },
          { text: 'Hyperoxie', correct: false, explanation: 'Falsch — Hyperoxie: pO₂ > 100 mmHg.' },
        ],
      },
      {
        question: 'pH = 7.56. Was liegt vor?',
        options: [
          { text: 'Azidose', correct: false, explanation: 'Falsch — Azidose: pH < 7.35.' },
          { text: 'Normbereich', correct: false, explanation: 'Falsch — Normbereich: 7.35–7.45.' },
          { text: 'Alkalose (pH > 7.45)', correct: true, explanation: 'Richtig! pH 7.56 = ausgeprägte Alkalose. Klinisch relevant: Alkalose begünstigt Hypokaliämie (K⁺ shiftet nach intrazellulär), Tetanie und Arrhythmien.' },
        ],
      },
      {
        question: 'pCO₂ = 52 mmHg (↑), HCO₃⁻ = 42 mmol/L (↑↑), BE = +16 mmol/L. Was ist die primäre Störung?',
        hint: 'Der pH ist alkalisch. Was treibt die Alkalose an — erhöhtes HCO₃⁻ (metabolisch) oder erniedrigtes pCO₂ (respiratorisch)?',
        options: [
          { text: 'Respiratorische Azidose mit metabolischer Kompensation', correct: false, explanation: 'Falsch — bei respiratorischer Azidose als primärer Störung wäre der pH erniedrigt (Azidose). Hier ist pH 7.56 (Alkalose).' },
          { text: 'Metabolische Alkalose mit respiratorischer Kompensation (pCO₂ ↑)', correct: true, explanation: 'Richtig! HCO₃⁻ 42 mmol/L und BE +16 = massive metabolische Alkalose (primär). Durch Erbrechen wird HCl verloren → H⁺-Defizit → HCO₃⁻ steigt. pCO₂ 52 = Hypoventilation als Kompensation (Lunge hält CO₂ zurück).' },
          { text: 'Kombinierte metabolisch-respiratorische Alkalose', correct: false, explanation: 'Falsch — kombinierte Alkalose: pCO₂ ↓ + HCO₃⁻ ↑. Hier ist pCO₂ erhöht (Kompensation), nicht erniedrigt.' },
        ],
      },
      {
        question: 'Warum hält die Alkalose so hartnäckig an, obwohl das Erbrechen behandelt wird?',
        hint: 'Labor: Kalium 2.8 mmol/L (↓), Chlorid 88 mmol/L (↓). Was haben diese Werte mit der Alkalose zu tun?',
        options: [
          { text: 'Zusätzliche respiratorische Alkalose durch Schmerzen', correct: false, explanation: 'Falsch — pCO₂ ist erhöht (52 mmHg), nicht erniedrigt. Eine respiratorische Alkalose kann nicht vorliegen.' },
          { text: 'Hypochlorämie und Hypokaliämie perpetuieren die Alkalose', correct: true, explanation: 'Richtig! Zwei Mechanismen: 1. Hypovolämie aktiviert RAAS → Aldosteron → Niere scheidet H⁺ und K⁺ aus, retiniert HCO₃⁻. 2. Zur HCO₃⁻-Ausscheidung braucht die Niere Chlorid — fehlt Cl⁻ (Hypochlorämie), kann die Niere HCO₃⁻ nicht ausscheiden. Die Alkalose erhält sich selbst!' },
          { text: 'Das ist ein Messfehler', correct: false, explanation: 'Falsch — der Befund ist klinisch sehr plausibel bei 4-wöchigem Erbrechen und Dehydratation.' },
        ],
      },
      {
        question: 'Diagnose und Therapieprinzip?',
        options: [
          { text: 'Metabolische Alkalose → NaHCO₃ infundieren', correct: false, explanation: 'Falsch! NaHCO₃ würde die Alkalose massiv verschlimmern. Das ist das Gegenteil der richtigen Therapie.' },
          { text: 'Metabolische Alkalose → NaCl 0,9% + KCl-Substitution + kausale Therapie', correct: true, explanation: 'Richtig! NaCl 0,9% liefert Chlorid → Niere kann jetzt HCO₃⁻ ausscheiden → Alkalose bessert sich. KCl-Substitution korrigiert die Hypokaliämie. Kausal: Operation (Magenausgangsstenose beseitigen).' },
          { text: 'Respiratorische Alkalose → Rückatmen empfehlen', correct: false, explanation: 'Falsch — die Störung ist metabolisch. Das erhöhte pCO₂ ist die Kompensation.' },
        ],
      },
    ],
    finalDiagnosis: 'Metabolische Alkalose (Hypochlorämie-Alkalose bei Magensaftverlust) mit respiratorischer Kompensation',
    teaching: 'Magensaftverlust (Erbrechen, Magensonde) → HCl-Verlust → Metabolische Alkalose. Die Hypochlorämie "sperrt" die renale HCO₃⁻-Ausscheidung → Alkalose unterhält sich selbst. Therapie: NaCl + KCl. Merke: Nie Bikarbonat bei metabolischer Alkalose! Die Erkennung: BE > +2 und HCO₃⁻ > 26 mmol/L bei alkalischem pH.',
  },
  {
    id: 'case6',
    title: 'Septischer Schock + ARDS',
    difficulty: 'schwer',
    context: '55-jähriger Mann, Intensivstation. Septischer Schock bei Pneumonie seit 2 Tagen. Intubiert und beatmet (FiO₂ 0.65, PEEP 12 cmH₂O). Noradrenalin 0.4 μg/kg/min. Laktat 7.8 mmol/L. Temperatur 39.9°C.',
    values: { pH: 7.16, pCO2: 56, pO2: 72, HCO3: 14, BE: -14, SaO2: 93, lactate: 7.8 },
    steps: [
      {
        question: 'pO₂ = 72 mmHg, SaO₂ = 93% — aber: FiO₂ = 0.65 (65% O₂) und PEEP 12. Wie beurteilst du die Oxygenierung?',
        hint: 'Horovitz-Index (PaO₂/FiO₂): Bei gesunder Lunge wäre pO₂ bei FiO₂ 0.65 ca. 400–500 mmHg.',
        options: [
          { text: 'Normal — pO₂ 72 liegt ja im Normbereich', correct: false, explanation: 'Falsch! Zwar ist 72 formal "normal", aber bei FiO₂ 0.65 sollte pO₂ ca. 400 mmHg betragen. Horovitz-Index: 72 / 0.65 ≈ 111 mmHg. Werte < 200 mmHg = ARDS (Berlin-Definition)!' },
          { text: 'Schwere Oxygenierungsstörung (ARDS) trotz invasiver Beatmung', correct: true, explanation: 'Richtig! Horovitz-Index (PaO₂/FiO₂): 72 / 0.65 ≈ 111 mmHg < 200 = schweres ARDS. Trotz hoher FiO₂ und PEEP kann der Patient nicht ausreichend oxygeniert werden — septische Lungenbeteiligung.' },
          { text: 'Leichte Hypoxämie, durch O₂-Erhöhung korrigierbar', correct: false, explanation: 'Falsch — der Patient hat bereits 65% O₂ und PEEP 12 cmH₂O. Das ist eine schwere, therapierefraktäre Oxygenierungsstörung (ARDS).' },
        ],
      },
      {
        question: 'pH = 7.16. Wie schwer ist die Azidose?',
        options: [
          { text: 'Leichte Azidose (7.30–7.35)', correct: false, explanation: 'Falsch — pH 7.16 ist weit unter 7.30.' },
          { text: 'Mäßige Azidose (7.20–7.30)', correct: false, explanation: 'Falsch — pH 7.16 < 7.20.' },
          { text: 'Schwere Azidose (pH < 7.20) — lebensbedrohlich', correct: true, explanation: 'Richtig! pH < 7.20 ist ein medizinischer Notfall: Myokarddepression, Vasodilation, Arrhythmien. Bei pH < 7.10 droht Herzstillstand.' },
        ],
      },
      {
        question: 'pCO₂ = 56 mmHg (↑), HCO₃⁻ = 14 mmol/L (↓↓), BE = −14 mmol/L. Was fällt auf?',
        hint: 'Wintersche Formel: Erwartetes pCO₂ = 1.5 × HCO₃⁻ + 8 ± 2. Berechne den Erwartungsbereich.',
        options: [
          { text: 'Reine metabolische Azidose mit adäquater Kompensation', correct: false, explanation: 'Falsch! Wintersche Formel: 1.5 × 14 + 8 = 29 ± 2 → Erwartungsbereich 27–31 mmHg. Gemessenes pCO₂ = 56 — das ist weit über dem Erwarteten! Zu hohes pCO₂ = zusätzliche respiratorische Azidose.' },
          { text: 'Kombinierte (gemischte) respiratorisch-metabolische Azidose', correct: true, explanation: 'Richtig! Beide Parameter treiben die Azidose: pCO₂ 56 ↑ (respiratorisch — Lunge kann CO₂ nicht abatmen wegen ARDS) + HCO₃⁻ 14 ↓ (metabolisch — Laktatazidose durch Gewebeminderperfusion). Wintersche Formel erwartet pCO₂ 29, gemessen 56 → massiv erhöht = respiratorische Komponente.' },
          { text: 'Reine respiratorische Azidose', correct: false, explanation: 'Falsch — bei reiner respiratorischer Azidose wäre HCO₃⁻ normal oder erhöht (Kompensation). BE −14 und HCO₃⁻ 14 mmol/L zeigen eine ausgeprägte metabolische Komponente.' },
        ],
      },
      {
        question: 'Laktat = 7.8 mmol/L (Norm < 2.0). Was bedeutet das und welche Maßnahme ist am dringlichsten?',
        options: [
          { text: 'Sofort NaHCO₃ 8,4% infundieren bis pH > 7.35', correct: false, explanation: 'Falsch! Bikarbonat bei Laktatazidose ist umstritten: Es entsteht CO₂ (das intrazellulär die Azidose verschlimmern kann). Leitlinien empfehlen Bikarbonat nur als Überbrückung bei pH < 7.15, nicht als Zieltherapie.' },
          { text: 'Ursachenbekämpfung: Hämodynamik optimieren + Antibiotika + Herd-Sanierung', correct: true, explanation: 'Richtig! Laktat 7.8 = schwere Gewebeminderperfusion. Einzige kausale Therapie: Perfusion verbessern. 1. Antibiotika + Fokus-Sanierung, 2. Volumen, 3. Vasopressoren (MAP ≥ 65 mmHg). Beatmung: lungenprotektiv (VT 6 mL/kg, Plateau < 30 cmH₂O).' },
          { text: 'Extubieren und spontan atmen lassen', correct: false, explanation: 'Falsch — der Patient hat schweres ARDS und Schock. Spontanatmung wäre nicht möglich.' },
        ],
      },
      {
        question: 'Finale Diagnose?',
        options: [
          { text: 'Reine metabolische Azidose (Laktatazidose)', correct: false, explanation: 'Falsch — das ist nur ein Teil der Störung. pCO₂ 56 mmHg (Wintersche Formel erwartet 29 mmHg) zeigt die zusätzliche schwere respiratorische Azidose durch ARDS.' },
          { text: 'Kombinierte respiratorisch-metabolische Azidose bei septischem Schock + ARDS', correct: true, explanation: 'Richtig! Zwei simultane Azidosen: 1. Metabolisch (Laktatazidose durch Gewebeminderperfusion), 2. Respiratorisch (CO₂-Retention durch ARDS). Lebensbedrohlich (pH 7.16).' },
          { text: 'Chronische respiratorische Azidose mit metabolischer Kompensation', correct: false, explanation: 'Falsch — ein chronisch stabiles Bild (wie COPD) sieht völlig anders aus: pH normal, HCO₃⁻ erhöht. Hier: akut, dekompensiert, lebensbedrohlich.' },
        ],
      },
    ],
    finalDiagnosis: 'Kombinierte respiratorisch-metabolische Azidose bei septischem Schock und ARDS',
    teaching: 'Kombinierte Azidose erkennen mit der Winterschen Formel: Wenn bei metabolischer Azidose das gemessene pCO₂ HÖHER als erwartet → zusätzliche respiratorische Azidose. Wenn NIEDRIGER als erwartet → zusätzliche respiratorische Alkalose. Bei septischem Schock kombiniert sich oft Laktatazidose (metabolisch) mit Beatmungsproblemen (respiratorisch).',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const DIFF_COLORS: Record<Difficulty, string> = {
  leicht: 'text-[#5A8A3A] bg-[#A3B18A]/15',
  mittel: 'text-[#A06A00] bg-[#E9C46A]/20',
  schwer: 'text-[#C2341E] bg-[#C2341E]/10',
};

// ── BGAValuesPanel ────────────────────────────────────────────────────────────

function BGAValuesPanel({ values }: { values: BGAValues }) {
  const rows: { key: string; val: number; format: (v: number) => string }[] = [
    { key: 'pH',   val: values.pH,   format: v => v.toFixed(2) },
    { key: 'pCO2', val: values.pCO2, format: v => v.toFixed(0) + ' mmHg' },
    { key: 'pO2',  val: values.pO2,  format: v => v.toFixed(0) + ' mmHg' },
    { key: 'HCO3', val: values.HCO3, format: v => v.toFixed(0) + ' mmol/L' },
    { key: 'BE',   val: values.BE,   format: v => (v >= 0 ? '+' : '') + v.toFixed(0) + ' mmol/L' },
    { key: 'SaO2', val: values.SaO2, format: v => v.toFixed(0) + '%' },
  ];

  const rangeLabel = (key: string) => {
    if (key === 'BE') return '−2 – +2';
    if (key === 'SaO2') return '≥ 95%';
    const r = REF[key];
    return `${r.min} – ${r.max}`;
  };

  return (
    <div className="bg-white/60 rounded-2xl p-5 border border-[#4A3A2F]/8 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-[#5A7FA8]" />
        <span className="text-[11px] font-black uppercase tracking-widest text-[#5A7FA8]">BGA-Werte</span>
      </div>
      <div>
        {rows.map(({ key, val, format }) => {
          const status = getStatus(key, val);
          const valueColor =
            status === 'normal' ? 'text-[#4A3A2F]' :
            status === 'low'    ? 'text-[#5A7FA8] font-bold' :
                                   'text-[#C2341E] font-bold';
          const arrow = status === 'high' ? ' ↑' : status === 'low' ? ' ↓' : '';
          return (
            <div key={key} className="flex items-center py-2.5 border-b border-[#4A3A2F]/5 last:border-0 gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#673147]/40 w-16 shrink-0">
                {REF[key].label}
              </span>
              <span className={`text-sm tabular-nums flex-1 ${valueColor}`}>
                {format(val)}{arrow}
              </span>
              <span className="text-[10px] text-[#4A3A2F]/25 shrink-0 text-right">{rangeLabel(key)}</span>
            </div>
          );
        })}
        {values.lactate !== undefined && (
          <div className="flex items-center py-2.5 gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#673147]/40 w-16 shrink-0">Laktat</span>
            <span className={`text-sm tabular-nums flex-1 ${values.lactate > 2 ? 'text-[#C2341E] font-bold' : 'text-[#4A3A2F]'}`}>
              {values.lactate.toFixed(1)} mmol/L{values.lactate > 2 ? ' ↑' : ''}
            </span>
            <span className="text-[10px] text-[#4A3A2F]/25 shrink-0 text-right">{'< 2.0'}</span>
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-[#4A3A2F]/5 grid grid-cols-3 gap-1">
        {[
          { label: 'Azidose', cond: values.pH < 7.35, color: 'bg-[#C2341E]/10 text-[#C2341E]' },
          { label: 'Normal', cond: values.pH >= 7.35 && values.pH <= 7.45, color: 'bg-[#A3B18A]/15 text-[#5A8A3A]' },
          { label: 'Alkalose', cond: values.pH > 7.45, color: 'bg-[#5A7FA8]/10 text-[#5A7FA8]' },
        ].map(({ label, cond, color }) => (
          <div key={label} className={`text-center py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${cond ? color : 'bg-black/3 text-[#4A3A2F]/20'}`}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BGATraining() {
  const [selectedCase, setSelectedCase] = useState<BGACase | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [stepResults, setStepResults] = useState<{ selectedIdx: number; correct: boolean }[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const totalSteps = selectedCase?.steps.length ?? 0;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepData = selectedCase?.steps[currentStep];
  const score = stepResults.filter(r => r.correct).length;

  function startCase(c: BGACase) {
    setSelectedCase(c);
    setCurrentStep(0);
    setSelectedOption(null);
    setStepResults([]);
    setShowSummary(false);
  }

  function handleSelectOption(idx: number) {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
  }

  function handleAdvance() {
    if (selectedOption === null || !currentStepData) return;
    const correct = currentStepData.options[selectedOption].correct;
    const newResults = [...stepResults, { selectedIdx: selectedOption, correct }];
    setStepResults(newResults);
    setSelectedOption(null);
    if (isLastStep) {
      setShowSummary(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }

  function handleRestart() {
    setCurrentStep(0);
    setSelectedOption(null);
    setStepResults([]);
    setShowSummary(false);
  }

  // ── List View ───────────────────────────────────────────────────────────────

  if (!selectedCase) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Activity className="w-6 h-6 text-[#5A7FA8]" />
            <h1 className="font-display text-4xl text-[#673147]">BGA-Training</h1>
          </div>
          <p className="text-[#673147]/50 font-serif text-base mt-1">
            Fallbeispiele Schritt für Schritt — Blutgasanalyse systematisch auswerten
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wider">
            {(['leicht', 'mittel', 'schwer'] as Difficulty[]).map(d => (
              <span key={d} className={`px-3 py-1.5 rounded-full ${DIFF_COLORS[d]}`}>{d}</span>
            ))}
          </div>
        </div>

        <div className="bg-white/50 rounded-2xl p-4 border border-[#5A7FA8]/15 text-sm font-serif text-[#673147]/60">
          <span className="font-bold text-[#5A7FA8]">Systematik:</span>{' '}
          1. Oxygenierung beurteilen → 2. pH (Azidose / Alkalose?) → 3. Primäre Störung (pCO₂ oder HCO₃⁻?) → 4. Kompensation → 5. Diagnose
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASES.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => startCase(c)}
              className="text-left bg-white/60 hover:bg-white/90 rounded-3xl p-6 border border-[#4A3A2F]/8 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="font-display text-xl text-[#673147] group-hover:text-[#5A7FA8] transition-colors leading-tight">
                  {c.title}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full shrink-0 ${DIFF_COLORS[c.difficulty]}`}>
                  {c.difficulty}
                </span>
              </div>
              <p className="text-sm text-[#673147]/50 font-serif line-clamp-2">{c.context}</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#5A7FA8]/60">
                <span>{c.steps.length} Schritte</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── Summary View ────────────────────────────────────────────────────────────

  if (showSummary) {
    const perfect = score === totalSteps;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button onClick={() => setSelectedCase(null)} className="flex items-center gap-2 text-[#673147]/50 hover:text-[#673147] text-xs font-black uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Fallübersicht
        </button>

        <div className={`rounded-3xl p-6 border text-center ${perfect ? 'bg-[#A3B18A]/10 border-[#A3B18A]/30' : 'bg-white/60 border-[#4A3A2F]/8'}`}>
          <div className="text-4xl mb-2">{perfect ? '🎉' : '📋'}</div>
          <p className="font-display text-3xl text-[#673147] mb-1">
            {score} / {totalSteps} richtig
          </p>
          <p className="text-sm text-[#673147]/50 font-serif">
            {perfect ? 'Perfekt! Alle Schritte korrekt.' : score >= totalSteps / 2 ? 'Gut gemacht — schau dir die Erklärungen an.' : 'Lies die Erklärungen durch und versuche es nochmal.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BGAValuesPanel values={selectedCase.values} />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {selectedCase.steps.map((step, i) => {
              const result = stepResults[i];
              return (
                <div key={i} className={`rounded-2xl p-4 border ${result?.correct ? 'bg-[#A3B18A]/8 border-[#A3B18A]/30' : 'bg-[#C2341E]/5 border-[#C2341E]/20'}`}>
                  <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {result?.correct
                        ? <CheckCircle className="w-4 h-4 text-[#5A8A3A]" />
                        : <XCircle className="w-4 h-4 text-[#C2341E]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-wider text-[#673147]/40 mb-1">Schritt {i + 1}</p>
                      <p className="text-sm text-[#673147]/70 font-serif mb-2">{step.question}</p>
                      {result && (
                        <p className="text-xs text-[#4A3A2F]/60 font-serif italic">
                          {step.options[result.selectedIdx].explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#5A7FA8]/8 rounded-2xl p-5 border border-[#5A7FA8]/15">
          <div className="flex items-start gap-3">
            <Trophy className="w-4 h-4 text-[#5A7FA8] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#5A7FA8] mb-2">Diagnose</p>
              <p className="font-serif font-bold text-[#673147] mb-3">{selectedCase.finalDiagnosis}</p>
              <p className="text-xs font-black uppercase tracking-wider text-[#5A7FA8] mb-2">Lernpunkt</p>
              <p className="text-sm font-serif text-[#673147]/70">{selectedCase.teaching}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/60 border border-[#4A3A2F]/10 text-sm font-black uppercase tracking-wider text-[#673147]/60 hover:text-[#673147] transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Wiederholen
          </button>
          <button
            onClick={() => setSelectedCase(null)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#5A7FA8]/10 border border-[#5A7FA8]/20 text-sm font-black uppercase tracking-wider text-[#5A7FA8] hover:bg-[#5A7FA8]/20 transition-all"
          >
            Nächster Fall <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Case + Step View ────────────────────────────────────────────────────────

  const answered = selectedOption !== null;
  const answerCorrect = answered && currentStepData?.options[selectedOption]?.correct;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setSelectedCase(null)} className="flex items-center gap-2 text-[#673147]/50 hover:text-[#673147] text-xs font-black uppercase tracking-wider transition-colors shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> Zurück
        </button>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-[#4A3A2F]/8 overflow-hidden">
            <motion.div
              className="h-full bg-[#5A7FA8] rounded-full"
              animate={{ width: `${((currentStep) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-[#673147]/40 shrink-0">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: context + values */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/60 rounded-2xl p-5 border border-[#4A3A2F]/8">
            <div className="flex items-center justify-between mb-3 gap-2">
              <p className="font-display text-lg text-[#673147] leading-tight">{selectedCase.title}</p>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${DIFF_COLORS[selectedCase.difficulty]}`}>
                {selectedCase.difficulty}
              </span>
            </div>
            <p className="text-sm font-serif text-[#673147]/65 leading-relaxed">{selectedCase.context}</p>
          </div>
          <BGAValuesPanel values={selectedCase.values} />
        </div>

        {/* Right: step question */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-white/60 rounded-2xl p-6 border border-[#4A3A2F]/8">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#5A7FA8] mb-3">
                  Schritt {currentStep + 1}
                </p>
                <p className="font-serif text-lg text-[#673147] leading-relaxed mb-3">
                  {currentStepData?.question}
                </p>
                {currentStepData?.hint && (
                  <p className="text-xs text-[#673147]/45 font-serif italic bg-[#4A3A2F]/4 rounded-xl px-4 py-2.5">
                    💡 {currentStepData.hint}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentStepData?.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = opt.correct;
                  let bg = 'bg-white/60 hover:bg-white/90 border-[#4A3A2F]/10 hover:border-[#5A7FA8]/30 cursor-pointer';
                  if (answered) {
                    if (isSelected && isCorrect) bg = 'bg-[#A3B18A]/15 border-[#A3B18A]/50 cursor-default';
                    else if (isSelected && !isCorrect) bg = 'bg-[#C2341E]/8 border-[#C2341E]/30 cursor-default';
                    else if (!isSelected && isCorrect) bg = 'bg-[#A3B18A]/8 border-[#A3B18A]/30 cursor-default';
                    else bg = 'bg-white/30 border-[#4A3A2F]/5 opacity-50 cursor-default';
                  }
                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      whileTap={answered ? {} : { scale: 0.99 }}
                      className={`w-full text-left rounded-2xl p-4 border transition-all ${bg}`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="mt-0.5 shrink-0">
                          {answered && isSelected && (isCorrect
                            ? <CheckCircle className="w-4 h-4 text-[#5A8A3A]" />
                            : <XCircle className="w-4 h-4 text-[#C2341E]" />)}
                          {answered && !isSelected && isCorrect && (
                            <CheckCircle className="w-4 h-4 text-[#A3B18A]" />
                          )}
                          {!answered && (
                            <div className="w-4 h-4 rounded-full border-2 border-[#4A3A2F]/20 mt-0.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-serif text-[#673147]">{opt.text}</p>
                          {answered && isSelected && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-[#4A3A2F]/65 font-serif mt-2 leading-relaxed"
                            >
                              {opt.explanation}
                            </motion.p>
                          )}
                          {answered && !isSelected && isCorrect && !isSelected && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-[#5A8A3A]/70 font-serif mt-2 leading-relaxed"
                            >
                              {opt.explanation}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Advance button */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end pt-2"
                  >
                    <button
                      onClick={handleAdvance}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all ${
                        answerCorrect
                          ? 'bg-[#A3B18A]/20 border border-[#A3B18A]/40 text-[#5A8A3A] hover:bg-[#A3B18A]/30'
                          : 'bg-white/60 border border-[#4A3A2F]/10 text-[#673147]/60 hover:text-[#673147]'
                      }`}
                    >
                      {isLastStep ? (
                        <><Trophy className="w-4 h-4" /> Auswertung</>
                      ) : (
                        <>Weiter <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
