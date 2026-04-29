import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { PostDetail } from './components/PostDetail';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './components/Login';
import { UnicodeToPreetiConverter } from './pages/tools/UnicodeToPreetiConverter';
import 'react-quill/dist/quill.snow.css';
import './styles/globals.css';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/post/:slug" element={<PostDetail />} />
      <Route path="/tools/unicode-to-preeti" element={<UnicodeToPreetiConverter />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <AppRoutes />
          </div>
          <Footer />
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
