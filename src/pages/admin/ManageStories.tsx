import React, { useState, useMemo } from 'react';
import { ref, push, set, remove, update } from 'firebase/database';
import { Plus, Search, Edit2, Trash2, Globe, FileText, ImageIcon, Eye, ExternalLink, X, Save } from 'lucide-react';
import { db } from '../../firebase/config';
import { useStories, useCategories } from '../../hooks/useData';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Story } from '../../types';

export default function ManageStories() {
  const { stories, loading } = useStories();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [editingStory, setEditingStory] = useState<Partial<Story> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  const calculateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      alert('Database is not configured.');
      return;
    }
    if (!editingStory?.title || !editingStory?.categoryId) return;

    const storyData = {
      ...editingStory,
      publishedAt: editingStory.publishedAt || new Date().toISOString(),
      readingTime: calculateReadingTime(editingStory.content || ''),
      views: editingStory.views || 0,
    };

    try {
      if (editingStory.id) {
        await update(ref(db, `stories/${editingStory.id}`), storyData);
      } else {
        await push(ref(db, 'stories'), storyData);
      }
      setIsModalOpen(false);
      setEditingStory(null);
    } catch (err) {
      console.error(err);
      alert('Error saving story');
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (window.confirm('Are you sure you want to delete this story? This cannot be undone.')) {
      await remove(ref(db, `stories/${id}`));
    }
  };

  return (
    <AdminLayout title="Manage Stories">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="relative flex-1 max-w-md w-full">
          <input 
            type="text" 
            placeholder="Search within content..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        </div>
        <button 
          onClick={() => { setEditingStory({ content: '', language: 'en', categoryId: categories[0]?.id }); setIsModalOpen(true); }}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Story
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-4">Title & info</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Stats</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStories.map(story => (
                <tr key={story.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                        <img src={story.thumbnailUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight mb-1">{story.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {story.language === 'en' ? 'English' : 'Hindi'} • {story.readingTime} min
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {categories.find(c => c.id === story.categoryId)?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                      <Eye className="w-4 h-4 text-slate-300" /> {story.views || 0}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/story/${story.slug}`} target="_blank" className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <button onClick={() => { setEditingStory(story); setIsModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(story.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStories.length === 0 && <div className="p-20 text-center text-slate-400 italic">No stories found.</div>}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="text-2xl font-black tracking-tight">{editingStory?.id ? 'Edit Story' : 'New Masterpiece'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Story Title</label>
                    <input 
                      type="text" 
                      value={editingStory?.title || ''}
                      onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value, slug: editingStory?.id ? editingStory.slug : generateSlug(e.target.value) })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-lg"
                      placeholder="e.g. The Brave Little Seed"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Slug (SEO URL)</label>
                    <input 
                      type="text" 
                      value={editingStory?.slug || ''}
                      onChange={(e) => setEditingStory({ ...editingStory, slug: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Category & Language</label>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <select 
                        value={editingStory?.categoryId || ''}
                        onChange={(e) => setEditingStory({ ...editingStory, categoryId: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold"
                        required
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select 
                        value={editingStory?.language || 'en'}
                        onChange={(e) => setEditingStory({ ...editingStory, language: e.target.value as any })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Banner Image URL</label>
                      <input 
                        type="url" 
                        value={editingStory?.bannerUrl || ''}
                        onChange={(e) => setEditingStory({ ...editingStory, bannerUrl: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm"
                        placeholder="1200x600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Thumbnail URL</label>
                      <input 
                        type="url" 
                        value={editingStory?.thumbnailUrl || ''}
                        onChange={(e) => setEditingStory({ ...editingStory, thumbnailUrl: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm"
                        placeholder="600x400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Story Content (HTML Supported)</label>
                <textarea 
                  value={editingStory?.content || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                  className="w-full px-6 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 transition-all font-medium h-[400px] leading-relaxed text-lg"
                  placeholder="Tell your story here..."
                  required
                />
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> SEO Meta Optimization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Meta Title</label>
                    <input 
                      type="text" 
                      value={editingStory?.meta?.title || ''}
                      onChange={(e) => setEditingStory({ ...editingStory, meta: { ...editingStory.meta!, title: e.target.value } })}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Keywords</label>
                    <input 
                      type="text" 
                      value={editingStory?.meta?.keywords || ''}
                      onChange={(e) => setEditingStory({ ...editingStory, meta: { ...editingStory.meta!, keywords: e.target.value } })}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Meta Description</label>
                    <textarea 
                      value={editingStory?.meta?.description || ''}
                      onChange={(e) => setEditingStory({ ...editingStory, meta: { ...editingStory.meta!, description: e.target.value } })}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-sm h-24"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white py-6 border-t border-slate-100">
                <button type="submit" className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                  <Save className="w-5 h-5" /> Save Masterpiece
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
