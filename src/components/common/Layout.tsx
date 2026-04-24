import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AdSlot } from './AdSlot';
import { useSiteSettings } from '../../hooks/useData';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { settings } = useSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Header Ad */}
      <div className="max-w-7xl mx-auto w-full px-4">
        <AdSlot html={settings?.ads?.header} />
      </div>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Ad */}
      <div className="max-w-7xl mx-auto w-full px-4">
        <AdSlot html={settings?.ads?.footer} />
      </div>

      <Footer />
    </div>
  );
};
