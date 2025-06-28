import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ socket }) {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', photo: null });
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCandidates = async () => {
    const res = await api.get('/votes');
    setCandidates(res.data);
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
      fetchCandidates();
    } catch (err) {
      alert('Failed to create candidate');
    }
  };

  useEffect(() => {
    fetchCandidates();
    socket.on('voteUpdated', fetchCandidates);
    return () => socket.off('voteUpdated');
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r flex flex-col justify-between shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Panel</h2>
          <nav className="space-y-2 text-gray-700">
            <button className="w-full text-left py-2 px-3 rounded hover:bg-gray-100">Dashboard</button>
            <button className="w-full text-left py-2 px-3 rounded hover:bg-gray-100">Statistics</button>
            <button className="w-full text-left py-2 px-3 rounded hover:bg-gray-100">Candidates</button>
          </nav>
        </div>
        <div className="p-6">
          <button className="text-red-500 hover:underline">Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
            + New
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow mb-8 focus:outline-none focus:ring-0">
          <h3 className="text-lg font-semibold mb-4">Voting Stats</h3>
          <div className="outline-none ring-0 focus:outline-none focus:ring-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={candidates} className="outline-none ring-0">
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="votes" fill="#3182ce" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Candidate List</h2>
            <input className="border p-2 rounded w-48" placeholder="Search..." />
          </div>
          <table className="w-full text-left border-t">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2">Name</th>
                <th>Votes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{c.name}</td>
                  <td>{c.votes}</td>
                  <td className="text-right space-x-2">
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Update</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalOpen && (
        <Modal title="Add Candidate" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" value={form.name} onChange={handleInput} className="w-full p-2 border rounded" placeholder="Candidate Name" required />
            <textarea name="description" value={form.description} onChange={handleInput} className="w-full p-2 border rounded" placeholder="Description" required />
            <input type="file" name="photo" onChange={handleInput} className="w-full p-2 border rounded" accept="image/*" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
              Save
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
