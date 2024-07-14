import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const Exercise = lazy(() => import('./pages/Exercise'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Exercise />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
