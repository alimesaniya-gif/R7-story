import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { StoryCard } from '../components/story/StoryCard';
import { useStories, useCategories } from '../hooks/useData';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/common/SEO';

export default function CategoryPage() {
  const { slug } = useParams();
  const { stories, loading: storiesLoading } = useStories();
  const { categories, loading: catsLoading } = useCategories();
  const { setTheme, config } = useTheme();

  const category = useMemo(() => categories.find(c => c.slug === slug), [categories, slug]);
  const categoryStories = useMemo(() => {
    return stories.filter(s => s.categoryId === category?.id);
  }, [stories, category]);

  useEffect(() => {
    if (category) {
      setTheme(category.theme);
    }
  }, [category, setTheme]);

  if (storiesLoading || catsLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
          <h1 className="text-4xl font-bold">Category Not Found</h1>
          <p className="text-slate-500">The adventure you're looking for doesn't exist yet.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`${category.name} Stories`}
        description={`Explore the best ${category.name} stories for kids. Adventures, moral lessons and more.`}
        image={category.imageUrl}
      />

      <section className={`py-12 md:py-20 ${config.bg} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className={`relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 ${config.radius} overflow-hidden shadow-2xl group`}>
              <img 
                src={category.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={category.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 transition-all" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <span className={`inline-block px-4 py-1.5 ${config.accent} text-white rounded-full text-xs font-black uppercase tracking-widest mb-6`}>
                Collection
              </span>
              <h1 className={`text-4xl md:text-6xl font-black mb-6 ${config.text} leading-tight`}>
                {category.name} Stories
              </h1>
              <p className="text-lg opacity-70 max-w-2xl leading-relaxed">
                Dive into our curated collection of {category.name.toLowerCase()} tales. Every story here is handpicked to provide joy, learning, and wonder.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryStories.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} />
            ))}
          </div>

          {categoryStories.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-slate-400 font-medium italic">We're currently writing new stories for this category. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
