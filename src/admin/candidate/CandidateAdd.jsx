// admin/candidate/CandidateAdd.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';

export default function CandidateAdd() {
  const [form, setForm] = useState({ name: '', description: '', photo: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', form.photo);
      const uploadRes = await api.post(`/vote/upload`, formData);

      await api.post('/votes', {
        name: form.name,
        description: form.description,
        photo: uploadRes.data.url,
      });

      toast.success('Candidate added!');
      navigate('/admin/candidate');
    } catch (err) {
      toast.error('Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Candidate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Candidate Name" className="w-full border p-2 rounded" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={handleChange} required />
        <input type="file" name="photo" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Candidate'}
        </button>
      </form>
    </div>
  );
}
