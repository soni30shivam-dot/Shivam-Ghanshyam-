import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Package, Image as ImageIcon, Settings, LogOut, Tags } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [location.pathname, navigate]);

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  if (isAuthenticated === null) return null;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-20">
        <div className="h-16 flex items-center px-6 bg-slate-950 font-bold text-white text-lg font-sans tracking-tight">
          Admin Dashboard
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1">
             <div className="px-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</div>
             <Link to="/admin" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-white transition">
               <Package className="w-5 h-5 text-slate-400" />
               Products
             </Link>
             <div className="mt-8 px-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Site Settings</div>
             <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-red-400 transition">
               <LogOut className="w-5 h-5 text-slate-400" />
               Logout
             </button>
             <div className="mt-8 px-6">
               <Link to="/" className="text-sm text-blue-400 hover:underline">← View Live Site</Link>
             </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
