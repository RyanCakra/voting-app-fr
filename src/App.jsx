// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Navbar from './components/Navbar';

import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminManage from './admin/Manage';

// Candidate Pages (Superadmin only)
import CandidateList from './admin/candidate/CandidateList';
import CandidateAdd from './admin/candidate/CandidateAdd';
import CandidateEdit from './admin/candidate/CandidateEdit';
import CandidateDetail from './admin/candidate/CandidateDetail';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
    setToken(localStorage.getItem('token'));
  }, []);

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  return (
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
          success: { icon: '✅' },
          error: { icon: '❌' },
        }}
      />

      <Navbar userRole={userRole} setToken={setToken} setUserRole={setUserRole} />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/login" element={<Login setToken={setToken} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Admin & Superadmin routes */}
        {token && isAdmin ? (
          <Route path="/admin" element={<AdminLayout userRole={userRole} />}>
            <Route path="dashboard" element={<AdminDashboard socket={socket} />} />
            {userRole === 'superadmin' && (
              <>
                <Route path="manage" element={<AdminManage />} />
                <Route path="candidate" element={<CandidateList />} />
                <Route path="candidate/add" element={<CandidateAdd />} />
                <Route path="candidate/:id/view" element={<CandidateDetail />} />
                <Route path="candidate/:id/edit" element={<CandidateEdit />} />
                <Route path="candidate/list" element={<CandidateList />} />
              </>
            )}
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
