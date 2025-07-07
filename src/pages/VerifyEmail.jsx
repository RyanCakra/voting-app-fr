import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        await new Promise((r) => setTimeout(r, 500)); // ⏳ Delay loading 0.5s
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/verify/${token}`);

        // ✅ Delay dulu baru ubah status & tampilkan toast
        setTimeout(() => {
          setStatus('success');
          toast.success('Email verified! You can now login.');
          setTimeout(() => navigate('/login'), 2000);
        }, 500);
      } catch (err) {
        // ❌ Delay dulu baru tampilkan error
        setTimeout(() => {}, 500);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-[url('/images/night.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />
      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-8 py-6 shadow-xl text-white text-center max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {status === 'loading' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-xl">
            Verifying your email...
          </motion.p>
        )}
        {status === 'success' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-emerald-400">
            Verified! Redirecting...
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-red-400">
            Invalid or expired token.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
