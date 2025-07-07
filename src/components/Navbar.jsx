import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Navbar({ userRole, setToken, setUserRole }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUserRole(null);

    // Show toast
    toast.success('Signed out successfully!');

    // Delay reload to allow toast to show
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 1200); // 1.2 detik
  };

  return (
    <motion.header className="bg-gradient-to-b from-black via-gray-950 to-gray-950 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-400 tracking-tight hover:text-emerald-300 transition">
          Truth.
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition duration-200 shadow-sm">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-200 shadow-sm">
                Register
              </Link>
            </>
          ) : (
            <>
              {(userRole === 'admin' || userRole === 'superadmin') && (
                <button onClick={() => navigate('/admin/dashboard')} className="px-4 py-2 bg-gray-900 border border-emerald-500 text-emerald-500 hover:text-white hover:bg-emerald-700 rounded-lg transition duration-200 shadow-sm">
                  Admin
                </button>
              )}

              <button onClick={handleLogout} className="px-4 py-2 bg-gray-900 border border-red-500 text-red-500 hover:text-white hover:bg-red-700 rounded-lg transition duration-200 shadow-sm">
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
