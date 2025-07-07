// CandidateDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import { motion } from 'framer-motion';

export default function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/vote/${id}`);
        setCandidate(res.data);
      } catch (err) {
        console.error('Failed to fetch candidate detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!candidate) return <p className="text-white">Candidate not found.</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gray-900 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl text-white max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img src={candidate.photo} alt={candidate.name} className="w-full md:w-64 h-64 object-cover rounded-xl shadow-md border border-white/10" />

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">{candidate.name}</h2>
          <p className="text-sm text-gray-400 mb-4">Created By: {candidate.createdBy?.email || 'N/A'}</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Description:</h4>
              <p className="text-white/90 whitespace-pre-line leading-relaxed">{candidate.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Votes:</h4>
              <p>{candidate.votes}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to={`/admin/candidate/${id}/edit`} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md">
              Edit
            </Link>
            <Link to="/admin/candidate" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md">
              Back
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
