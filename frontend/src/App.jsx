import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { PostDetail } from './components/PostDetail';
import { Home } from './pages/Home';
import { AdminPanel } from './pages/AdminPanel';
import { Login } from './components/Login';
import 'react-quill/dist/quill.snow.css';
import './styles/globals.css';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/post/:slug" element={<PostDetail />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <main style={{ minHeight: '100vh' }}>
          <AppRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
