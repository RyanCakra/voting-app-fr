// AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

export default function AdminLayout({ userRole }) {
  return (
    <div className="relative min-h-screen flex">
      {/* Background image and blur */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/night.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      </div>

      {/* Content wrapper with z-index to stay above background */}
      <div className="relative z-10 flex flex-1">
        <Sidebar userRole={userRole} />
        <motion.main className="flex-1 p-6 overflow-y-auto" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
