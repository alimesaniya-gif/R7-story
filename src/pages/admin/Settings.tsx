import React, { useState, useEffect } from 'react';
import { ref, update, get } from 'firebase/database';
import { 
  Save, Globe, Share2, DollarSign, Layout, 
  Youtube, Instagram, Facebook, Send, Check 
} from 'lucide-react';
import { db } from '../../firebase/config';
import { useSiteSettings } from '../../hooks/useData';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SiteSettings } from '../../types';

export default function AdminSettings() {
  const { settings, loading } = useSiteSettings();
  const [formData, setFormData] = useState<Partial<SiteSettings> | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    } else {
      setFormData({
        heroImage: '',
        social: {
          youtube: '', instagram: '', telegram: '', facebook: '',
          youtubeEnabled: false, instagramEnabled: false, telegramEnabled: false, facebookEnabled: false
        },
        ads: { header: '', inline: '', sidebar: '', footer: '' }
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      alert('Database is not configured. Please add Firebase secrets.');
      return;
    }
    setSaveStatus('saving');
    try {
      await update(ref(db, 'settings'), formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
      setSaveStatus('idle');
    }
  };

  if (loading || !formData) {
    return <AdminLayout title="Settings"><div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Platform Settings">
      <form onSubmit={handleSave} className="max-w-4xl space-y-12 pb-24">
        
        {/* Banner Management */}
        <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
               <Layout className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Homepage Visuals</h2>
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Hero Image URL (1200x500)</label>
            <div className="flex flex-col md:flex-row gap-6">
              <input 
                type="url" 
                value={formData.heroImage || ''}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-medium"
                placeholder="https://..."
              />
              <div className="w-32 h-20 rounded-xl bg-slate-100 border border-slate-100 overflow-hidden flex-shrink-0">
                <img src={formData.heroImage} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </section>

        {/* Social Management */}
        <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
               <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Social Connectivity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 'youtube', label: 'YouTube Channel', icon: Youtube },
              { id: 'instagram', label: 'Instagram Profile', icon: Instagram },
              { id: 'telegram', label: 'Telegram Channel', icon: Send },
              { id: 'facebook', label: 'Facebook Page', icon: Facebook },
            ].map(social => (
              <div key={social.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <social.icon className="w-3.5 h-3.5" /> {social.label}
                  </label>
                  <button 
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      social: { ...formData.social!, [`${social.id}Enabled`]: !formData.social![`${social.id}Enabled` as keyof typeof formData.social] } 
                    })}
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg transition-all ${formData.social![`${social.id}Enabled` as keyof typeof formData.social] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {formData.social![`${social.id}Enabled` as keyof typeof formData.social] ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <input 
                  type="url" 
                  value={formData.social![social.id as keyof typeof formData.social] || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social: { ...formData.social!, [social.id]: e.target.value } 
                  })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-medium"
                  placeholder="Link URL"
                />
              </div>
            ))}
          </div>
        </section>

        {/* AdSense Configuration */}
        <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
               <DollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">AdSense Integration</h2>
          </div>

          <div className="space-y-8">
            {[
              { id: 'header', label: 'Header Ad Code' },
              { id: 'inline', label: 'In-Story Ad Code' },
              { id: 'footer', label: 'Footer Ad Code' },
              { id: 'sidebar', label: 'Sidebar Ad Code' },
            ].map(ad => (
              <div key={ad.id}>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{ad.label}</label>
                <textarea 
                  value={formData.ads![ad.id as keyof typeof formData.ads] || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    ads: { ...formData.ads!, [ad.id]: e.target.value } 
                  })}
                  className="w-full px-5 py-3 bg-slate-950 text-emerald-400 border border-slate-800 rounded-2xl outline-none font-mono text-xs h-32 leading-relaxed"
                  placeholder="<!-- Paste AdSense Code Here -->"
                />
              </div>
            ))}
          </div>
        </section>

        <button 
          type="submit" 
          disabled={saveStatus === 'saving'}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 disabled:opacity-50"
        >
          {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? <><Check className="w-5 h-5" /> Published</> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </form>
    </AdminLayout>
  );
}
