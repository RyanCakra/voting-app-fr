import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Modal from '../components/Modal';
import api from '../api';
import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Dashboard({ socket }) {
  const [candidates, setCandidates] = useState([]);
  const [recentVotes, setRecentVotes] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, voted: 0, notVoted: 0 });
  const [form, setForm] = useState({ name: '', description: '', photo: null });
  const [modalOpen, setModalOpen] = useState(false);

  const COLORS = ['#34d399', '#f87171'];

  const fetchDashboardData = async () => {
    const [votesRes, usersRes, recentVotesRes] = await Promise.all([
      api.get('/votes'),
      api.get('/users'),
      api.get('/votes/recent'), // You need to create this API route in backend
    ]);

    setCandidates(votesRes.data);
    setRecentVotes(recentVotesRes.data);

    const totalUsers = usersRes.data.length;
    const votedUsers = usersRes.data.filter((u) => u.votedFor !== null).length;
    const notVotedUsers = totalUsers - votedUsers;

    setUserStats({ total: totalUsers, voted: votedUsers, notVoted: notVotedUsers });
  };

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('photo', form.photo);
      const uploadRes = await api.post('/upload', formData);

      await api.post('/votes', {
        name: form.name,
        description: form.description,
        photo: uploadRes.data.url,
      });

      setForm({ name: '', description: '', photo: null });
      setModalOpen(false);
      fetchDashboardData();
    } catch {
      alert('Failed to create candidate');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    socket.on('voteUpdated', fetchDashboardData);
    return () => socket.off('voteUpdated');
  }, []);

  const pieData = [
    { name: 'Voted', value: userStats.voted },
    { name: 'Not Voted', value: userStats.notVoted },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-400">📊 Dashboard</h1>
        <button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">
          + Add Candidate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 border border-white/10 p-4 rounded-xl flex items-center space-x-4 shadow-md">
          <FaUsers className="text-3xl text-emerald-400" />
          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <h2 className="text-2xl font-bold">{userStats.total}</h2>
          </div>
        </div>
        <div className="bg-gray-800 border border-white/10 p-4 rounded-xl flex items-center space-x-4 shadow-md">
          <FaCheckCircle className="text-3xl text-green-400" />
          <div>
            <p className="text-sm text-gray-400">Voted</p>
            <h2 className="text-2xl font-bold">
              {userStats.voted} ({userStats.total > 0 ? Math.round((userStats.voted / userStats.total) * 100) : 0}%)
            </h2>
          </div>
        </div>
        <div className="bg-gray-800 border border-white/10 p-4 rounded-xl flex items-center space-x-4 shadow-md">
          <FaTimesCircle className="text-3xl text-red-400" />
          <div>
            <p className="text-sm text-gray-400">Not Voted</p>
            <h2 className="text-2xl font-bold">{userStats.notVoted}</h2>
          </div>
        </div>
      </div>

      {/* Charts & Recent Votes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 border border-white/10 p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-emerald-300">Recent Votes</h3>
          <ul className="space-y-2 text-sm">
            {recentVotes.length === 0 && <p className="text-gray-400 italic">No recent votes yet.</p>}
            {recentVotes.map((v) => (
              <li key={v._id} className="border-b border-white/10 pb-2">
                <span className="font-semibold">{v.user?.name || 'Anonymous'}</span> voted for <span className="text-emerald-400 font-semibold">{v.candidate?.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 border border-white/10 p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-emerald-300">Voting Participation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart + Candidates */}
      <div className="bg-gray-800 border border-white/10 p-4 rounded-xl mb-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-emerald-300">Voting Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={candidates}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
            <Bar dataKey="votes" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 border border-white/10 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-emerald-300">Candidate List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-t border-white/10">
            <thead>
              <tr className="text-white/80 border-b border-white/10">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="px-4 text-left">Votes</th>
                <th className="px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="px-4">{c.votes}</td>
                  <td className="px-4 text-right space-x-2">
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">Update</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal title="Add New Candidate" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleInput} className="w-full p-2 border border-white/20 bg-gray-900 text-white rounded" placeholder="Candidate Name" required />
            <textarea name="description" value={form.description} onChange={handleInput} className="w-full p-2 border border-white/20 bg-gray-900 text-white rounded" placeholder="Description" required />
            <input type="file" name="photo" onChange={handleInput} className="w-full p-2 border border-white/20 bg-gray-900 text-white rounded" accept="image/*" required />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded w-full">
              Save Candidate
            </button>
          </form>
        </Modal>
      )}
    </motion.div>
  );
}
