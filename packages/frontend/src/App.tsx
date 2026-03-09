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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="exam" element={<ExamMode />} />
        <Route path="content" element={<ContentLibrary />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="garden" element={<MistakeGarden />} />
        <Route path="import" element={<ImportData />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
