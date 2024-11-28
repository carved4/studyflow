import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import GPACalculator from './components/GPA/GPACalculator';
import StudyTimer from './components/Timer/StudyTimer';
import AssignmentTracker from './components/Assignments/AssignmentTracker';
import GradePredictor from './components/GradePredictor/GradePredictor';
import StudyLogger from './components/StudyLogger/StudyLogger';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/gpa" element={<GPACalculator />} />
      <Route path="/timer" element={<StudyTimer />} />
      <Route path="/assignments" element={<AssignmentTracker />} />
      <Route path="/grade-predictor" element={<GradePredictor />} />
      <Route path="/study-logger" element={<StudyLogger />} />
    </Routes>
  );
};

export default AppRoutes;
