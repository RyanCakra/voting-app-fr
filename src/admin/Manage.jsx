// AdminManage.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminManage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]); // prevent .filter() crash
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = (Array.isArray(users) ? users : [])
    .filter((u) => {
      if (userRole !== 'superadmin') return u.role !== 'superadmin';
      return true;
    })
    .filter((u) => {
      if (filter === 'all') return true;
      return u.role === filter;
    })
    .sort((a, b) => {
      const roles = ['superadmin', 'admin', 'user'];
      return roles.indexOf(a.role) - roles.indexOf(b.role);
    });

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gray-900 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl text-white w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-emerald-400">Manage Users</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border bg-gray-900 border-white/20 text-white rounded px-3 py-1">
          <option value="all">All</option>
          <option value="superadmin">Superadmin</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-white/10">
          <thead>
            <tr className="text-white/80 border-b border-white/10">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="px-4 text-left">Email</th>
              <th className="px-4 text-left">Role</th>
              {userRole === 'superadmin' && <th className="px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-4">{user.name}</td>
                <td className="px-4">{user.email}</td>
                <td className="px-4 capitalize">{user.role}</td>
                {userRole === 'superadmin' && (
                  <td className="px-4 text-right space-x-2">
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">Promote</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Demote</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
