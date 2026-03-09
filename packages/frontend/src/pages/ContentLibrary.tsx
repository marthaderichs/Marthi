import React, { useState, useMemo, useEffect } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useTopics } from '../hooks/useTopics';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, BookOpen, Loader2, Search, ChevronLeft,
  Bookmark, Pencil, ArrowRight
} from 'lucide-react';
import { Subject, Topic } from '@medilearn/shared';
import { getIcon } from '../lib/icons';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';


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
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-display text-[#8B1E1E] lowercase">bibliothek</h1>
        <p className="text-xl text-[#4A3A2F]/40 font-medium font-sans lowercase italic">
          "lesen ist ein abenteuer im kopf."
        </p>
      </div>

      {!selectedSubject ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {subjects?.map((subject) => {
            const Icon = getIcon(subject.icon);
            return (
              <motion.button
                key={subject.id}
                whileHover={{ y: -3, scale: 1.03 }}
                onClick={() => setSelectedSubject(subject)}
                className="group flex flex-col text-left"
              >
                <div
                  className="w-full aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundColor: '#E2E8D4',
                    boxShadow: '2px 2px 0 rgba(74,58,47,0.09)',
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.55) 7px, rgba(255,255,255,0.55) 8px)',
                  }}
                >
                  <Icon className="w-9 h-9 relative z-10" style={{ color: subject.color }} />
                </div>
                <div className="pt-2 px-0.5">
                  <h3 className="font-display text-base text-[#4A3A2F] lowercase leading-tight">{subject.name.toLowerCase()}</h3>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[48px] border border-white shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.02] bg-stripes-blue -z-10" />
             <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="p-4 bg-white/80 rounded-2xl text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-white transition-all shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B1E1E]/40 lowercase">fachbereich</div>
                   <h2 className="text-4xl font-display text-[#8B1E1E] lowercase">{selectedSubject.name.toLowerCase()}</h2>
                </div>
             </div>
             
             <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A3A2F]/30" />
                <input 
                  type="text"
                  placeholder="thema suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 pl-11 pr-6 py-4 rounded-2xl border-transparent focus:ring-2 focus:ring-[#8B1E1E]/10 transition-all font-bold text-sm placeholder:text-[#4A3A2F]/20 lowercase"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
                {filteredTopics.map((topic) => (
                  <motion.button
                    key={topic.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedTopic(topic)}
                    className="group relative p-8 bg-white/60 backdrop-blur-sm rounded-[40px] border border-white shadow-lg hover:shadow-2xl transition-all text-left flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                       <div className="w-12 h-12 bg-[#E2E8D4] rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-[#8B1E1E]/60" />
                       </div>
                       <Bookmark className="w-5 h-5 text-[#8B1E1E]/10 group-hover:text-[#8B1E1E]/40 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#4A3A2F] leading-tight mb-4 lowercase">{topic.title.toLowerCase()}</h3>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/30 lowercase">kapitel lesen</span>
                       <ArrowRight className="w-4 h-4 text-[#8B1E1E] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
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
              className="w-full max-w-4xl bg-[#E2E8D4] max-h-[90vh] rounded-[64px] shadow-2xl flex flex-col overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 z-20">
                 <button 
                   onClick={() => setSelectedTopic(null)}
                   className="p-3 bg-white/80 rounded-full text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-white transition-all shadow-md"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-12 md:p-16 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-10 pb-12">
                  <div className="space-y-4 text-center">
                    <h2 className="text-5xl md:text-6xl font-display text-[#8B1E1E] leading-tight">{selectedTopic.title.toLowerCase()}</h2>
                    <div className="h-1 w-24 bg-[#8B1E1E]/20 mx-auto rounded-full" />
                  </div>

                  <div className="prose prose-stone prose-lg max-w-none">
                    <div className="bg-white/40 backdrop-blur-sm p-10 md:p-14 rounded-[48px] border border-white/60 shadow-inner font-serif text-xl leading-[1.8] text-[#4A3A2F] italic">
                      {selectedTopic.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-6 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/40 backdrop-blur-md border-t border-white/60 flex justify-center gap-4">
                 <button className="flex items-center gap-2 px-8 py-4 bg-[#8B1E1E] text-white rounded-2xl font-display text-2xl shadow-lg hover:scale-105 transition-all lowercase">
                    <Pencil className="w-5 h-5" /> notiz hinzufügen
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
