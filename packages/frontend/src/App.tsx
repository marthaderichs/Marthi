/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExamMode from './pages/ExamMode';
import ContentLibrary from './pages/ContentLibrary';
import Flashcards from './pages/Flashcards';
import ImportData from './pages/ImportData';
import MistakeGarden from './pages/MistakeGarden';
import Notes from './pages/Notes';
import StudyPlan from './pages/StudyPlan';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="exam" element={<ExamMode />} />
        <Route path="content" element={<ContentLibrary />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="notes" element={<Notes />} />
        <Route path="plan" element={<StudyPlan />} />
        <Route path="garden" element={<MistakeGarden />} />
        <Route path="import" element={<ImportData />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
