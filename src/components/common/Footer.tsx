import { Link } from 'react-router-dom';
import { Youtube, Instagram, Facebook, Send, Heart } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';

export const Footer = () => {
  const { settings } = useSiteSettings();
  
  const socialConfig = settings?.social;

  const socialLinks = [
    { id: 'youtube', icon: Youtube, url: socialConfig?.youtube, enabled: socialConfig?.youtubeEnabled },
    { id: 'instagram', icon: Instagram, url: socialConfig?.instagram, enabled: socialConfig?.instagramEnabled },
    { id: 'facebook', icon: Facebook, url: socialConfig?.facebook, enabled: socialConfig?.facebookEnabled },
    { id: 'telegram', icon: Send, url: socialConfig?.telegram, enabled: socialConfig?.telegramEnabled },
  ].filter(s => s.enabled && s.url);

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
              <span className="text-xl font-bold tracking-tight dark:text-white">StoryWorld</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Discover a magical world of stories in Hindi and English. Safe, educational, and fun for kids of all ages.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 dark:text-white uppercase text-xs tracking-widest text-slate-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link to="/privacy-policy" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social Social */}
          <div>
            <h4 className="font-bold mb-4 dark:text-white uppercase text-xs tracking-widest text-slate-400">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map(social => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400 uppercase tracking-wider font-semibold">
          <p>© {new Date().getFullYear()} StoryWorld. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Kids</p>
        </div>
      </div>
    </footer>
  );
};
