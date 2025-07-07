// Home.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import CandidateCard from '../components/CandidateCard';
import Chart from '../components/Chart';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Home({ socket }) {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);

  const fetchVotes = async () => {
    const res = await api.get('/votes');
    setCandidates(res.data);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data);
      console.log(res.data);
    } catch {
      setUser(null);
    }
  };

  const handleVote = async (id) => {
    try {
      await api.post(`/vote/${id}`);
      fetchVotes();
      fetchUser();
      toast.success('Your vote has been counted!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Voting failed');
    }
  };

  useEffect(() => {
    fetchVotes();
    fetchUser();

    socket.on('voteCreated', fetchVotes);
    socket.on('voteUpdated', fetchVotes);
    socket.on('voteDeleted', fetchVotes);

    return () => {
      socket.off('voteCreated');
      socket.off('voteUpdated');
      socket.off('voteDeleted');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[url('/images/night.jpg')] bg-cover bg-center relative px-4 py-10">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {user && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center text-white text-lg mb-4">
            Welcome back, <span className="font-semibold text-emerald-400">{user.name}</span>! Ready to make your vote count?
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-12">
          <Chart data={candidates} />
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-3xl font-semibold mt-12 mb-6 text-center text-emerald-400">
          Choose Your Candidate!
        </motion.h2>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {candidates.map((c) => (
            <CandidateCard key={c._id} candidate={c} onVote={handleVote} disabled={!!user?.votedFor} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
