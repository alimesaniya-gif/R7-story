import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, BookOpen, Eye, Heart } from 'lucide-react';
import { Story } from '../../types';
import { useBookmarks } from '../../hooks/useBookmarks';

interface StoryCardProps {
  story: Story;
  categoryName?: string;
  index: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, categoryName, index }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(story.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative block aspect-[4/3] overflow-hidden">
        <Link to={`/story/${story.slug}`}>
          <img 
            src={story.thumbnailUrl || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600&h=400'} 
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
            {story.language === 'hi' ? 'हिंदी' : 'English'}
          </span>
        </div>
        <button 
          onClick={() => toggleBookmark(story.id)}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${bookmarked ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
        </button>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-white text-sm font-bold flex items-center gap-2">
            Read Now <BookOpen className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {categoryName && (
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            {categoryName}
          </span>
        )}
        <Link to={`/story/${story.slug}`} className="flex-1">
          <h3 className="text-xl font-bold dark:text-white leading-tight mb-3 group-hover:text-blue-600 transition-colors">
            {story.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-xs mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{story.readingTime || 5} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            <span>{story.views || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
