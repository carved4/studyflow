import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GPACalculator from './components/GPA/GPACalculator';
import StudyTimer from './components/Timer/StudyTimer';
import AssignmentTracker from './components/Assignments/AssignmentTracker';
import GradePredictor from './components/GradePredictor/GradePredictor';
import StudyLogger from './components/StudyLogger/StudyLogger';
const AppRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/gpa", element: _jsx(GPACalculator, {}) }), _jsx(Route, { path: "/timer", element: _jsx(StudyTimer, {}) }), _jsx(Route, { path: "/assignments", element: _jsx(AssignmentTracker, {}) }), _jsx(Route, { path: "/grade-predictor", element: _jsx(GradePredictor, {}) }), _jsx(Route, { path: "/study-logger", element: _jsx(StudyLogger, {}) })] }));
};
export default AppRoutes;
