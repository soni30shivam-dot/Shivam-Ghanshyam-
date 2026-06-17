import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageSquare, PhoneCall, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { config } from '../config';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${config.apiUrl}/products?featured=true`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setFeaturedProducts(data.slice(0, 4));
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-950 text-white relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-blue-950/80 mix-blend-multiply" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight mb-6"
          >
            Champa's Trusted Bag & Luggage Destination
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            School Bags, College Bags, Travel Bags, Trolley Bags, Office Bags and Premium Luggage Collection at Wholesale & Retail Prices.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/products" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-lg">
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
            <a href="https://wa.me/918109950542" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg">
              <MessageSquare className="w-5 h-5" />
              WhatsApp Order
            </a>
            <a href="tel:+918109950542" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <PhoneCall className="w-5 h-5" />
              Call Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-sans tracking-tight text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-500">Discover our most popular collections</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p, i) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}
                  {p.compareAtPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-blue-600 mb-1">{p.categoryName || 'Bags'}</span>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">₹{p.price}</span>
                    {p.compareAtPrice && (
                      <span className="text-sm text-gray-400 line-through">₹{p.compareAtPrice}</span>
                    )}
                  </div>
                  <a 
                    href={`https://wa.me/918109950542?text=Hi, I want to order: ${p.name}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 w-full block text-center py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition"
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          {featuredProducts.length === 0 && (
             <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
             <p className="text-gray-500">No products available yet.</p>
           </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
