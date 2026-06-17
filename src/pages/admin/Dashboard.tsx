import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Upload } from 'lucide-react';
import { config } from '../../config';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
      setLoading(true);
      const resP = await fetch(`${config.apiUrl}/products`);
      const resC = await fetch(`${config.apiUrl}/categories`);
      if (resP.ok) setProducts(await resP.json());
      if (resC.ok) setCategories(await resC.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${config.apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !editingProduct.id;
      const url = isNew ? `${config.apiUrl}/products` : `${config.apiUrl}/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct)
      });
      
      if (!res.ok) throw new Error('Save failed');
      
      setIsEditing(false);
      setEditingProduct(null);
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to save product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your catalog</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct({ name: '', price: 0, categoryId: '', description: '', inStock: true, isFeatured: false });
            setIsEditing(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select required value={editingProduct.categoryId} onChange={e => setEditingProduct({...editingProduct, categoryId: parseInt(e.target.value)})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input required type="number" min="0" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare At Price (₹)</label>
              <input type="number" min="0" value={editingProduct.compareAtPrice || ''} onChange={e => setEditingProduct({...editingProduct, compareAtPrice: parseFloat(e.target.value)})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL or Upload</label>
              <div className="flex gap-2">
                <input type="text" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://" />
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition border border-gray-300">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('image', file);
                    try {
                      const res = await fetch(`${config.apiUrl}/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
                      });
                      const data = await res.json();
                      if (data.url) setEditingProduct({...editingProduct, image: data.url});
                    } catch (err) {
                      alert('Upload failed');
                    }
                  }} />
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
            </div>
            <div className="flex items-center gap-6 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editingProduct.inStock} onChange={e => setEditingProduct({...editingProduct, inStock: e.target.checked})} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editingProduct.isFeatured} onChange={e => setEditingProduct({...editingProduct, isFeatured: e.target.checked})} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>

            <div className="md:col-span-2 border-t pt-4 mt-2 flex justify-end">
               <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2">
                 <Save className="w-4 h-4" /> Save
               </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center"><div className="animate-spin h-6 w-6 border-b-2 border-blue-900 mx-auto"></div></td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0 bg-gray-100 rounded overflow-hidden">
                      {p.image ? <img src={p.image} alt="" className="h-10 w-10 object-cover" /> : <div className="h-10 w-10 bg-gray-200"></div>}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">{p.name}</div>
                      {p.isFeatured && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{p.categoryName || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{p.price}</div>
                  {p.compareAtPrice && <div className="text-xs text-gray-500 line-through">₹{p.compareAtPrice}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => { setEditingProduct(p); setIsEditing(true); window.scrollTo(0, 0); }} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
