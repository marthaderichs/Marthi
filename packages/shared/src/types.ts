export type SubjectId = 'anaesthesie' | 'arbeitsmed' | 'augen' | 'chirurgie' | 'derma' | 'allergo' | 'gyn' | 'hno' | 'immuno' | 'infektio' | 'endo' | 'gastro' | 'hemato_onko' | 'cardio' | 'nephro' | 'pneumo' | 'rheuma' | 'intensiv' | 'neuro' | 'patho' | 'pharma' | 'psych' | 'paedia' | 'radio' | 'reha' | 'sozial' | 'uro';

export interface Subject {
  id: string; // Changed to string for database flexibility, though still use SubjectId values
  name: string;
  color: string;
  icon?: string;
  description: string;
  _count?: {
    topics: number;
    questions: number;
    flashcards: number;
  };
  progress?: number;          // Klausur-Fortschritt (0–100)
  flashcardProgress?: number; // Karteikarten-Fortschritt (0–100)
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId?: string | null;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  topicId?: string | null;
  front: string;
  back: string;
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
  nextReview?: string | Date;
  lastReview?: string | Date | null;
}
