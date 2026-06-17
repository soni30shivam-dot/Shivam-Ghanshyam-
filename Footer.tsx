import { MapPin, Phone, Instagram } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-sans tracking-tight text-white">Ghanshyam Bag</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Champa's Trusted Bag & Luggage Destination. Premium collections of travel bags, school bags, office luggage and more at retail & wholesale prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-sans tracking-tight text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><NavLink to="/products" className="hover:text-white transition-colors">Our Products</NavLink></li>
              <li><NavLink to="/gallery" className="hover:text-white transition-colors">Store Gallery</NavLink></li>
              <li><NavLink to="/about" className="hover:text-white transition-colors">About Us</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-white transition-colors">Contact Us</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-sans tracking-tight text-white">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <span>Champa, Chhattisgarh 495671, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span>+91 81099 50542</span>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-4 w-4" />
                <a href="https://www.instagram.com/ghanshyam_bag_champa" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@ghanshyam_bag_champa</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ghanshyam Bag. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
