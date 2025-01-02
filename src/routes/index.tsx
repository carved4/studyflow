import React, { Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from 'react-router-dom';

// Lazy-loaded components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Home = lazy(() => import('../pages/Home'));
const GPACalculator = lazy(() => import('../components/GPA/GPACalculator'));
const StudyTimer = lazy(() => import('../components/Timer/StudyTimer'));
const AssignmentTracker = lazy(() => import('../components/Assignments/AssignmentTracker'));
const GradePredictor = lazy(() => import('../components/GradePredictor/GradePredictor'));
const StudyLogger = lazy(() => import('../components/StudyLogger/StudyLogger'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Existing components
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading component with proper typing
const LoadingFallback: React.FC = () => (
  <div className="loading-spinner-container">
    <div className="spinner" />
    <p>Loading...</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <ThemeProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <ErrorBoundary>
                    <Home />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gpa" 
                element={
                  <ProtectedRoute>
                    <GPACalculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/timer" 
                element={
                  <ProtectedRoute>
                    <StudyTimer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assignments" 
                element={
                  <ProtectedRoute>
                    <AssignmentTracker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/grade-predictor" 
                element={
                  <ProtectedRoute>
                    <GradePredictor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/study-logger" 
                element={
                  <ProtectedRoute>
                    <StudyLogger />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="*" 
                element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                } 
              />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;
