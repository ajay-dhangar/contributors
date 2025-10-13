import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Contributors } from './pages/Contributors';
import { ContributorDetailPage } from './pages/ContributorDetail';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/contributors" replace />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="/contributors/:username" element={<ContributorDetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
