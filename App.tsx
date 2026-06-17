import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<div className="p-20 text-center"><h1 className="text-3xl font-bold">About Us</h1><p className="mt-4 text-gray-600">Coming soon.</p></div>} />
        <Route path="contact" element={<Contact />} />
      </Route>
      
      {/* Admin routes with no standard navbar/footer */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="login" element={<AdminLogin />} />
      </Route>

      <Route path="*" element={<div className="p-20 text-center"><h1 className="text-3xl font-bold">404 Not Found</h1></div>} />
    </Routes>
  );
}
