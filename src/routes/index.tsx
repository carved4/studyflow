import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import GPACalculator from '../components/GPA/GPACalculator';
import StudyTimer from '../components/Timer/StudyTimer';
import AssignmentTracker from '../components/Assignments/AssignmentTracker';
import GradePredictor from '../components/GradePredictor/GradePredictor';
import StudyLogger from '../components/StudyLogger/StudyLogger';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute component={Dashboard} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
