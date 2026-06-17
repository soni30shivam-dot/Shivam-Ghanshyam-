import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search } from 'lucide-react';
import { config } from '../config';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.apiUrl}/categories`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `${config.apiUrl}/products`;
    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }
    
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-sans tracking-tight text-gray-900 mb-4">Our Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our wide range of premium bags and luggage perfect for every occasion.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-28">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === '' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  All Products
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === c.slug ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
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
                      {!p.inStock && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-gray-900 text-white font-bold px-4 py-2 rounded">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="text-xs font-semibold text-blue-600 mb-1">{p.categoryName || 'Bags'}</span>
                      <h3 className="font-bold text-gray-900 mb-2">{p.name}</h3>
                      {p.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.description}</p>}
                      <div className="mt-auto flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">₹{p.price}</span>
                        {p.compareAtPrice && (
                          <span className="text-sm text-gray-400 line-through">₹{p.compareAtPrice}</span>
                        )}
                      </div>
                      <a 
                        href={`https://wa.me/918109950542?text=Hi, I want to order/inquire about: ${p.name}`}
                        target="_blank" rel="noopener noreferrer"
                        className={`mt-4 w-full block text-center py-2.5 rounded-md font-medium text-sm transition
                          ${p.inStock ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}
                      >
                       {p.inStock ? 'Inquire on WhatsApp' : 'Unavailable'}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500">There are no products in this category yet.</p>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory('')} className="mt-4 text-blue-600 font-medium hover:underline">
                    Clear filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
