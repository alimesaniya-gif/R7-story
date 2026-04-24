export const StorySkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
    <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
      <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
      <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between">
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
      </div>
    </div>
  </div>
);
