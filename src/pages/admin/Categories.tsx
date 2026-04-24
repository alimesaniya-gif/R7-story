import React, { useState } from 'react';
import { ref, push, set, remove, update } from 'firebase/database';
import { Plus, Edit2, Trash2, Palette, Image as ImageIcon, CheckCircle2, XCircle, X, Save, Globe } from 'lucide-react';
import { db } from '../../firebase/config';
import { useCategories } from '../../hooks/useData';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Category, ThemeType } from '../../types';

export default function AdminCategories() {
  const { categories, loading } = useCategories();
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const THEME_OPTIONS: { value: ThemeType; label: string; color: string }[] = [
    { value: 'default', label: 'Default - Modern', color: 'bg-slate-600' },
    { value: 'kids', label: 'Kids - Soft Pastel', color: 'bg-pink-500' },
    { value: 'horror', label: 'Horror - Dark', color: 'bg-red-800' },
    { value: 'moral', label: 'Moral - Warm', color: 'bg-emerald-700' },
    { value: 'royal', label: 'Royal - Indigo Gold', color: 'bg-indigo-700' },
  ];

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      alert('Database not configured.');
      return;
    }
    if (!editingCat?.name || !editingCat?.theme) return;

    const catData = {
      ...editingCat,
      status: editingCat.status ?? true,
      order: editingCat.order ?? 0,
    };

    try {
      if (editingCat.id) {
        await update(ref(db, `categories/${editingCat.id}`), catData);
      } else {
        await push(ref(db, 'categories'), catData);
      }
      setIsModalOpen(false);
      setEditingCat(null);
    } catch (err) {
      console.error(err);
      alert('Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (window.confirm('Are you sure? All stories in this category will become orphans.')) {
      await remove(ref(db, `categories/${id}`));
    }
  };

  return (
    <AdminLayout title="Category Management">
      <div className="flex justify-end mb-8">
        <button 
          onClick={() => { setEditingCat({ theme: 'default', status: true }); setIsModalOpen(true); }}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Category
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm group hover:shadow-xl transition-all">
              <div className="h-40 relative">
                <img src={cat.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => { setEditingCat(cat); setIsModalOpen(true); }} className="w-10 h-10 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="w-10 h-10 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-500 rounded-xl flex items-center justify-center transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${THEME_OPTIONS.find(t => t.value === cat.theme)?.color}`}>
                    {cat.theme} Theme
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-black text-slate-900">{cat.name}</h3>
                   {cat.status ? (
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   ) : (
                     <XCircle className="w-5 h-5 text-slate-300" />
                   )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Globe className="w-3.5 h-3.5" /> /category/{cat.slug}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">{editingCat?.id ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Category Name</label>
                <input 
                  type="text" 
                  value={editingCat?.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value, slug: editingCat?.id ? editingCat.slug : generateSlug(e.target.value) })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold"
                  placeholder="e.g. Bedtime Stories"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Theme Selection</label>
                <div className="grid grid-cols-2 gap-3">
                  {THEME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEditingCat({ ...editingCat, theme: opt.value })}
                      className={`p-4 rounded-2xl border transition-all text-left group ${editingCat?.theme === opt.value ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                      <div className={`w-6 h-6 ${opt.color} rounded-lg mb-2 shadow-sm`} />
                      <p className={`text-xs font-black uppercase tracking-widest ${editingCat?.theme === opt.value ? 'text-blue-600' : 'text-slate-500'}`}>{opt.label.split(' - ')[0]}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Image URL</label>
                <input 
                  type="url" 
                  value={editingCat?.imageUrl || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, imageUrl: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm"
                  placeholder="800x600 px recommended"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full ${editingCat?.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                   <span className="text-sm font-bold text-slate-600">Active Status</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditingCat({ ...editingCat, status: !editingCat?.status })}
                  className={`w-12 h-6 rounded-full transition-all relative ${editingCat?.status ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editingCat?.status ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                <Save className="w-5 h-5" /> Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
