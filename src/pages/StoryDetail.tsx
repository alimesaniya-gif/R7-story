import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, update, increment, onValue } from 'firebase/database';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Share2, Type, 
  MessageCircle, Send, Twitter, Facebook,
  ArrowRight
} from 'lucide-react';
import { db } from '../firebase/config';
import { useStories, useCategories, useSiteSettings } from '../hooks/useData';
import { useTheme } from '../context/ThemeContext';
import { Layout } from '../components/common/Layout';
import { SEO } from '../components/common/SEO';
import { StoryCard } from '../components/story/StoryCard';
import { AdSlot } from '../components/common/AdSlot';

export default function StoryDetail() {
  const { slug } = useParams();
  const { stories, loading: storiesLoading } = useStories();
  const { categories } = useCategories();
  const { settings } = useSiteSettings();
  const { setTheme, config, isDark } = useTheme();
  const [fontSize, setFontSize] = useState(18);
  const [showFontControl, setShowFontControl] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const story = useMemo(() => stories.find(s => s.slug === slug), [stories, slug]);
  const category = useMemo(() => categories.find(c => c.id === story?.categoryId), [categories, story]);
  
  useEffect(() => {
    if (category) {
      setTheme(category.theme);
    }
    window.scrollTo(0, 0);
  }, [category, setTheme]);

  useEffect(() => {
    if (story && db) {
      // Increment views
      const storyRef = ref(db, `stories/${story.id}`);
      update(storyRef, {
        views: increment(1)
      });
    }
  }, [story?.id, db]);

  const relatedStories = useMemo(() => {
    if (!story) return [];
    return stories
      .filter(s => s.categoryId === story.categoryId && s.id !== story.id)
      .slice(0, 4);
  }, [stories, story]);

  const [prevStory, nextStory] = useMemo(() => {
    if (!story) return [null, null];
    const index = stories.findIndex(s => s.id === story.id);
    return [
      index > 0 ? stories[index - 1] : null,
      index < stories.length - 1 ? stories[index + 1] : null
    ];
  }, [stories, story]);

  if (storiesLoading && !story) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!story) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">Story Not Found</h1>
          <Link to="/" className="text-blue-600 font-bold">Back to Home</Link>
        </div>
      </Layout>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = story.title;

  const share = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'whatsapp': url = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`; break;
      case 'telegram': url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`; break;
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`; break;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <Layout>
      <SEO 
        title={story.meta?.title || story.title}
        description={story.meta?.description}
        keywords={story.meta?.keywords}
        image={story.bannerUrl}
        type="article"
      />

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-16 left-0 right-0 h-1 z-[60] bg-blue-600 origin-left"
        style={{ scaleX }}
      />

      <article className={`min-h-screen pb-24 ${config.bg} ${config.text} transition-all duration-500`}>
        {/* Banner */}
        <div className="relative h-[400px] mb-[-100px] z-0">
          <img 
            src={story.bannerUrl || 'https://images.unsplash.com/photo-1544415598-a0e4ce8c8485?auto=format&fit=crop&q=80&w=1200&h=600'} 
            className="w-full h-full object-cover"
            alt={story.title}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content Wrapper */}
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className={`${config.card} p-8 md:p-12 ${config.radius} shadow-2xl border border-white/10 dark:border-white/5`}>
            {/* Header */}
            <header className="mb-12 text-center">
              <Link 
                to={`/category/${category?.slug}`}
                className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs font-black uppercase tracking-widest mb-6"
              >
                {category?.name || 'Story'}
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                {story.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm opacity-60 font-medium">
                <span>{story.language === 'hi' ? 'हिंदी' : 'English'}</span>
                <span>•</span>
                <span>{story.readingTime || 5} min read</span>
                <span>•</span>
                <span>{new Date(story.publishedAt).toLocaleDateString()}</span>
              </div>
            </header>

            <AdSlot html={settings?.ads?.header} />

            {/* Reading Controls */}
            <div className="flex items-center justify-between py-4 border-y border-slate-100 dark:border-slate-800 mb-12 sticky top-20 bg-inherit/90 backdrop-blur-sm z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowFontControl(!showFontControl)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <Type className="w-5 h-5" />
                    <span className="text-sm font-bold">Aa</span>
                  </button>
                  {showFontControl && (
                    <div className="absolute top-full mt-2 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-48 z-50">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Text Size</p>
                      <input 
                        type="range" min="14" max="32" value={fontSize} 
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                      <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-slate-400">
                        <span>Small</span>
                        <span>Large</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => share('whatsapp')} className="p-2 hover:bg-green-50 dark:hover:bg-green-950 text-green-600 rounded-xl transition-all">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button onClick={() => share('telegram')} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-500 rounded-xl transition-all">
                  <Send className="w-6 h-6" />
                </button>
                <button onClick={() => share('twitter')} className="p-2 hover:bg-sky-50 dark:hover:bg-sky-950 text-sky-400 rounded-xl transition-all">
                  <Twitter className="w-6 h-6" />
                </button>
                <button onClick={() => share('facebook')} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 rounded-xl transition-all">
                  <Facebook className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div 
              style={{ fontSize: `${fontSize}px` }}
              className={`markdown-body ${story.language === 'hi' ? 'font-hi' : config.font} max-w-none transition-all duration-300`}
              dangerouslySetInnerHTML={{ __html: story.content }}
            />

            <AdSlot html={settings?.ads?.inline} className="mt-12" />

            {/* Pagination */}
            <div className="grid grid-cols-2 gap-4 mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
              {prevStory ? (
                <Link to={`/story/${prevStory.slug}`} className="group p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Previous</span>
                  <p className="font-bold dark:text-white line-clamp-1 group-hover:text-blue-500 transition-colors">{prevStory.title}</p>
                </Link>
              ) : <div />}
              
              {nextStory && (
                <Link to={`/story/${nextStory.slug}`} className="group p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Next</span>
                  <p className="font-bold dark:text-white line-clamp-1 group-hover:text-blue-500 transition-colors">{nextStory.title}</p>
                </Link>
              )}
            </div>
          </div>

          <AdSlot html={settings?.ads?.footer} className="my-12" />

          {/* Related Stories */}
          {relatedStories.length > 0 && (
            <div className="mt-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">More in {category?.name}</h2>
                <Link to={`/category/${category?.slug}`} className="flex items-center gap-2 text-sm font-bold text-blue-600">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedStories.map((s, i) => (
                  <StoryCard key={s.id} story={s} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}
