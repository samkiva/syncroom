import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Initializing...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/room/:eventId" element={<Room />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
