import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { StoryCard } from '../components/story/StoryCard';
import { useStories, useCategories, useSiteSettings } from '../hooks/useData';
import { SEO } from '../components/common/SEO';
import { AdSlot } from '../components/common/AdSlot';

export default function Home() {
  const { stories, loading: storiesLoading } = useStories();
  const { categories, loading: catsLoading } = useCategories();
  const { settings } = useSiteSettings();
  const [loadCount, setLoadCount] = useState(8);

  const trendingStories = useMemo(() => {
    return [...stories].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  }, [stories]);

  const recentStories = useMemo(() => {
    return stories.slice(0, loadCount);
  }, [stories, loadCount]);

  if (storiesLoading || catsLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO />
      
      {/* Hero Section */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
          <img 
            src={settings?.heroImage || 'https://images.unsplash.com/photo-1516053303025-5e925cc784ca?auto=format&fit=crop&q=80&w=1200&h=600'} 
            className="w-full h-full object-cover"
            alt="Hero"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-16">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400 text-yellow-950 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Story of the Day
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Unlock a World <br /> of Wonder
              </h1>
              <p className="text-lg text-slate-200 mb-8 max-w-md leading-relaxed">
                Dive into magical tales, ancient legends, and exciting adventures designed for curious young minds.
              </p>
              <div className="flex gap-4">
                <Link to="/search" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
                  Find Stories
                </Link>
                <Link to="#categories" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all">
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-xl flex items-center justify-center text-orange-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black dark:text-white">Trending Stories</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingStories.map((story, i) => (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={i}
                categoryName={categories.find(c => c.id === story.categoryId)?.name} 
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <AdSlot html={settings?.ads?.inline} />
      </div>

      {/* Categories Section */}
      <section id="categories" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 dark:text-white">Pick Your Adventure</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Choose a category to find stories perfectly matched to your mood and style.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group relative h-48 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <img 
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1544415598-a0e4ce8c8485?auto=format&fit=crop&q=80&w=400&h=400'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <span className="text-white font-black text-lg group-hover:translate-x-1 transition-transform flex items-center gap-2">
                    {cat.name} <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Stories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black dark:text-white">Fresh from the Oven</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentStories.map((story, i) => (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={i}
                categoryName={categories.find(c => c.id === story.categoryId)?.name} 
              />
            ))}
          </div>
          
          {stories.length > loadCount && (
            <div className="mt-16 text-center">
              <button 
                onClick={() => setLoadCount(prev => prev + 8)}
                className="px-12 py-4 bg-slate-100 dark:bg-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
              >
                Show More Stories
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
