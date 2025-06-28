// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Toaster } from 'react-hot-toast';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#1f2937', // bg-gray-800
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
          success: {
            icon: '✅',
          },
          error: {
            icon: '❌',
          },
        }}
      />
      <Navbar userRole={userRole} setToken={setToken} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/login" element={<Login setToken={setToken} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={token && userRole === 'admin' ? <AdminDashboard socket={socket} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
