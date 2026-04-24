import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, BookOpen, Layers, Eye, 
  TrendingUp, ArrowUpRight, Clock, Users 
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useStories, useCategories } from '../../hooks/useData';

export default function AdminDashboard() {
  const { stories } = useStories();
  const { categories } = useCategories();

  const stats = useMemo(() => {
    const totalViews = stories.reduce((acc, s) => acc + (s.views || 0), 0);
    const recent = stories.slice(0, 5);
    return { totalViews, recent };
  }, [stories]);

  const cards = [
    { name: 'Total Stories', value: stories.length, icon: BookOpen, color: 'bg-blue-600' },
    { name: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-emerald-600' },
    { name: 'Categories', value: categories.length, icon: Layers, color: 'bg-orange-600' },
    { name: 'Admin Users', value: 1, icon: Users, color: 'bg-purple-600' },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${card.color.split('-')[1]}-600/20 group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.name}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Recent Content
            </h3>
            <Link to="/admin/stories" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-lg">View All</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recent.length > 0 ? stats.recent.map((story) => (
              <div key={story.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img src={story.thumbnailUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{story.title}</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                      {categories.find(c => c.id === story.categoryId)?.name} • {story.language === 'en' ? 'English' : 'Hindi'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 flex items-center gap-1 justify-end">
                    <Eye className="w-3 h-3" /> {story.views || 0}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lifetime Views</p>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-400 italic">No stories published yet.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-600/30">
            <h3 className="text-2xl font-black mb-4 tracking-tight leading-none">Ready to tell a new tale?</h3>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed opacity-80">Add your latest masterpiece to the world and delight thousands of kids.</p>
            <Link to="/admin/stories" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg hover:translate-x-1">
              <Plus className="w-5 h-5" /> Add Story
            </Link>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="font-black mb-6 uppercase text-xs tracking-widest text-slate-500">Quick Links</h3>
            <div className="space-y-4">
              <Link to="/admin/categories" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                <span className="font-bold">Manage Categories</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link to="/admin/settings" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                <span className="font-bold">Global Settings</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
