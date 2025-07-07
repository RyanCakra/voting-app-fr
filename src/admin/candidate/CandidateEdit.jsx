// admin/candidate/CandidateEdit.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CandidateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', photo: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await api.get(`/vote/${id}`);
        if (!res.data) return navigate('/admin/candidate');
        setForm({
          name: res.data.name,
          description: res.data.description,
          photo: res.data.photo,
        });
      } catch (err) {
        toast.error('Failed to fetch candidate');
      }
    };
    fetchCandidate();
  }, [id]);

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (files) setFile(files[0]);
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/vote/${id}`, {
        name: form.name,
        description: form.description,
      });

      if (file) {
        const fd = new FormData();
        fd.append('photo', file);
        await api.post(`/vote/${id}/upload`, fd);
      }

      toast.success('Candidate updated successfully!');
      navigate('/admin/candidate');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <motion.div className="max-w-2xl mx-auto mt-10 bg-gray-900 backdrop-blur-md border border-white/10 rounded-xl text-white p-6 shadow-xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Edit Candidate</h2>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleInput} required className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleInput} required className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" rows="4" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Change Photo</label>
          <input type="file" name="photo" accept="image/*" onChange={handleInput} className="w-full bg-gray-800 border border-gray-700 rounded text-sm p-2" />
        </div>

        {form.photo && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Current Photo:</p>
            <img src={form.photo} alt="Candidate" className="w-40 h-40 object-cover rounded border border-white/10" />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded shadow transition">
            Save Changes
          </button>
          <Link to="/admin/candidate" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded">
            Back
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
