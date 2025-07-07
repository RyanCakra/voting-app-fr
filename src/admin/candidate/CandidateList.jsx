// CandidateList.jsx
import { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/votes');
        setCandidates(res.data);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
        setCandidates([]);
      }
    };
    fetch();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gray-900 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl text-white w-full">
      <h2 className="text-xl font-semibold text-emerald-400 mb-4">Candidate List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-white/10">
          <thead>
            <tr className="text-white/80 border-b border-white/10">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="px-4 text-left">Votes</th>
              <th className="px-4 text-left">Created By</th>
              <th className="px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-4">{c.name}</td>
                <td className="px-4">{c.votes}</td>
                <td className="px-4 text-sm text-gray-400">{c.createdBy?.email || '-'}</td>
                <td className="px-4 text-right space-x-2">
                  <Link to={`/admin/candidate/${c._id}/view`} className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800">
                    View
                  </Link>
                  <Link to={`/admin/candidate/${c._id}/edit`} className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                    Edit
                  </Link>
                  <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
