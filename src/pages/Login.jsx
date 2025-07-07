// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login({ setToken, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      setToken(res.data.token);
      setUserRole(res.data.user.role);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side Image with slight blur */}
      <div className="w-1/2 hidden md:block relative bg-[url('/images/reichtag.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/30 "></div>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-[url('/images/night.jpg')] bg-cover  relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-lg z-0"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-md shadow-xl rounded-xl p-6 border border-white/10"
        >
          <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-2xl font-semibold text-center mb-6 text-emerald-400">
            Sign In
          </motion.h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-gray-400"></p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-4">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded w-full hover:bg-emerald-500 transition">Login</button>
              <button type="button" onClick={() => navigate('/register')} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded w-full hover:bg-white/20 transition">
                Register
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
