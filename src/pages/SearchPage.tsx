import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { StoryCard } from '../components/story/StoryCard';
import { useStories, useCategories } from '../hooks/useData';
import { SEO } from '../components/common/SEO';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { stories, loading: storiesLoading } = useStories();
  const { categories } = useCategories();

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) || 
    s.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Layout>
      <SEO title={`Search: ${query}`} description={`Search results for "${query}" on StoryWorld.`} />
      
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black mb-4 dark:text-white flex items-center gap-4">
              <SearchIcon className="w-8 h-8 text-blue-600" />
              {query ? `Search Results for "${query}"` : 'Experimental Search'}
            </h1>
            <p className="text-slate-500">Found {filteredStories.length} stories matching your quest.</p>
          </div>

          {storiesLoading ? (
            <div className="py-24 flex justify-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {filteredStories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredStories.map((story, i) => (
                    <StoryCard 
                      key={story.id} 
                      story={story} 
                      index={i}
                      categoryName={categories.find(c => c.id === story.categoryId)?.name} 
                    />
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SearchIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">No stories found</h3>
                  <p className="text-slate-500">Try searching for something else, like "Adventures" or "Jungle".</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
