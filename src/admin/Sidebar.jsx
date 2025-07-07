// Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Sidebar({ userRole }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    ...(userRole === 'superadmin' ? [{ path: '/admin/manage', label: 'Admin Manage' }] : []),
    ...(userRole === 'superadmin' ? [{ path: '/admin/candidate/list', label: 'Candidates' }] : []),
  ];

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <motion.aside initial={{ width: 240 }} animate={{ width: collapsed ? 64 : 240 }} transition={{ duration: 0.3 }} className="bg-gray-900 text-white h-screen sticky top-0 z-40 shadow-lg flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-bold tracking-tight text-emerald-400">Admin Panel</span>}
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white transition">
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 mt-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-2 rounded-r-full transition-all duration-200 ${location.pathname === link.path ? 'bg-emerald-600 font-semibold' : 'hover:bg-gray-800'} ${collapsed ? 'text-center' : 'text-left'}`}
          >
            {collapsed ? link.label.charAt(0) : link.label}
          </Link>
        ))}
      </nav>

      {!collapsed && <div className="px-4 py-4 text-xs text-gray-400 text-center border-t border-gray-700">&copy; {new Date().getFullYear()} Voting App</div>}
    </motion.aside>
  );
}
