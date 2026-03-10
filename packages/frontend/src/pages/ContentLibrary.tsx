import React, { useState, useMemo, useEffect } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useTopics } from '../hooks/useTopics';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, BookOpen, Loader2, Search, ChevronLeft,
  Bookmark, Pencil, ArrowRight
} from 'lucide-react';
import { Subject, Topic } from '@medilearn/shared';
import { cn } from '../lib/utils';

export default function ContentLibrary() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: topics, isLoading: topicsLoading } = useTopics(selectedSubject?.id);

  const filteredTopics = useMemo(() => {
    if (!topics) return [];
    return topics.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topics, searchQuery]);

  if (subjectsLoading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-[#8B1E1E]/30" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-7xl font-display text-[#8B1E1E]">Bibliothek</h1>
        <p className="text-xl text-[#4A3A2F]/45 font-serif italic">
          „Wiederholung ist das Fundament der Meisterschaft."
        </p>
      </div>

      {!selectedSubject ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {subjects?.map((subject, i) => {
            const blobs = [
              '58% 42% 52% 48% / 48% 56% 44% 52%',
              '44% 56% 48% 52% / 54% 46% 58% 42%',
              '52% 48% 62% 38% / 40% 60% 50% 50%',
              '40% 60% 46% 54% / 56% 44% 62% 38%',
              '62% 38% 50% 50% / 46% 54% 40% 60%',
              '50% 50% 56% 44% / 60% 40% 52% 48%',
              '46% 54% 40% 60% / 52% 48% 58% 42%',
            ];
            const br = blobs[i % blobs.length];
            const tilt = ((i * 7) % 11) - 5;
            return (
              <motion.button
                key={subject.id}
                initial={{ rotate: tilt }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                onClick={() => setSelectedSubject(subject)}
                className="aspect-square relative overflow-hidden flex items-center justify-center"
                style={{ borderRadius: br }}
              >
                {/* Colour fill */}
                <div className="absolute inset-0" style={{ backgroundColor: subject.color }} />
                {/* Grain overlay – only on colour, not on text */}
                <div
                  className="absolute inset-0 mix-blend-soft-light opacity-40"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '180px 180px' }}
                />
                {/* Text – crisp, above grain */}
                <span className="relative z-10 font-display font-bold text-[10px] text-white text-center uppercase tracking-wide leading-snug px-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.6),0_2px_10px_rgba(0,0,0,0.35)]">
                  {subject.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Subject header – clean, no heavy card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#4A3A2F]/8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedSubject(null)}
                className="p-2 rounded-xl text-[#4A3A2F]/40 hover:text-[#8B1E1E] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B1E1E]/35">Fachbereich</div>
                <h2 className="text-4xl font-display text-[#8B1E1E]">{selectedSubject.name}</h2>
              </div>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A3A2F]/25" />
              <input
                type="text"
                placeholder="Thema suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9F4E8] pl-11 pr-6 py-3 rounded-full border border-[#4A3A2F]/8 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/10 text-sm font-medium placeholder:text-[#4A3A2F]/20"
              />
            </div>
          </div>

          {/* Topic cards – flat, with colored left accent */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTopics.map((topic) => (
                <motion.button
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedTopic(topic)}
                  className="group relative p-6 bg-[#F9F4E8] rounded-2xl text-left flex flex-col border-l-[3px] hover:-translate-y-0.5 transition-all"
                  style={{
                    borderLeftColor: selectedSubject.color,
                    boxShadow: '2px 2px 0 rgba(74,58,47,0.07)',
                  }}
                >
                  <h3 className="font-serif text-lg text-[#4A3A2F] leading-snug mb-3">{topic.title}</h3>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/25">Kapitel lesen</span>
                    <ArrowRight className="w-4 h-4 text-[#8B1E1E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4A3A2F]/40 backdrop-blur-sm"
            onClick={() => setSelectedTopic(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#F9F4E8] max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-[#4A3A2F]/8">
                <h2 className="font-display text-4xl md:text-5xl text-[#8B1E1E] leading-tight pr-8">{selectedTopic.title}</h2>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="p-2.5 rounded-full border border-[#4A3A2F]/10 text-[#4A3A2F]/40 hover:text-[#8B1E1E] hover:border-[#8B1E1E]/30 transition-all shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 md:p-12 overflow-y-auto">
                <div className="font-serif text-lg leading-[1.85] text-[#4A3A2F]/80 italic space-y-5">
                  {selectedTopic.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
