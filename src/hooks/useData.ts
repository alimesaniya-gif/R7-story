import { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, limitToLast, get } from 'firebase/database';
import { db } from '../firebase/config';
import { Story, Category, SiteSettings } from '../types';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const storiesRef = ref(db, 'stories');
    const unsub = onValue(storiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...(val as any) })) as Story[];
        setStories(list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      } else {
        setStories([]);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { stories, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const catRef = ref(db, 'categories');
    const unsub = onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...(val as any) })) as Category[];
        setCategories(list.filter(c => c.status));
      } else {
        setCategories([]);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { categories, loading };
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const settingsRef = ref(db, 'settings');
    const unsub = onValue(settingsRef, (snapshot) => {
      setSettings(snapshot.val());
      setLoading(false);
    });
    return unsub;
  }, []);

  return { settings, loading };
};
