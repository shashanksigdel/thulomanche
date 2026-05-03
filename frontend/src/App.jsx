import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { UnicodeToPreetiConverter } from './pages/tools/UnicodeToPreetiConverter';
import './styles/globals.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/tools/unicode-to-preeti" element={<Navigate to="/?tab=unicode-to-preeti" />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </Router>
  );
}

export default App;
