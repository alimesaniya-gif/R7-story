export type ThemeType = 'default' | 'kids' | 'horror' | 'moral' | 'royal';

export interface ThemeConfig {
  bg: string;
  card: string;
  text: string;
  accent: string;
  font: string;
  radius: string;
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  default: {
    bg: 'bg-slate-50',
    card: 'bg-white',
    text: 'text-slate-900',
    accent: 'bg-blue-600',
    font: 'font-sans',
    radius: 'rounded-2xl',
  },
  kids: {
    bg: 'bg-amber-50',
    card: 'bg-white',
    text: 'text-amber-900',
    accent: 'bg-pink-500',
    font: 'font-sans', // Using Inter but styled for playfulness usually
    radius: 'rounded-[2rem]',
  },
  horror: {
    bg: 'bg-neutral-950',
    card: 'bg-neutral-900',
    text: 'text-neutral-100',
    accent: 'bg-red-800',
    font: 'font-serif',
    radius: 'rounded-none',
  },
  moral: {
    bg: 'bg-emerald-50',
    card: 'bg-white',
    text: 'text-emerald-950',
    accent: 'bg-emerald-700',
    font: 'font-serif',
    radius: 'rounded-3xl',
  },
  royal: {
    bg: 'bg-indigo-950',
    card: 'bg-white',
    text: 'text-indigo-950',
    accent: 'bg-yellow-500',
    font: 'font-serif',
    radius: 'rounded-xl',
  },
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  theme: ThemeType;
  imageUrl: string;
  status: boolean;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  language: 'en' | 'hi';
  bannerUrl: string;
  thumbnailUrl: string;
  content: string;
  readingTime: number;
  views: number;
  publishedAt: string;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

export interface SiteSettings {
  heroImage: string;
  social: {
    youtube: string;
    instagram: string;
    telegram: string;
    facebook: string;
    youtubeEnabled: boolean;
    instagramEnabled: boolean;
    telegramEnabled: boolean;
    facebookEnabled: boolean;
  };
  ads: {
    header: string;
    inline: string;
    sidebar: string;
    footer: string;
  };
}
