import { Layout } from '../components/common/Layout';
import { SEO } from '../components/common/SEO';

export default function Terms() {
  return (
    <Layout>
      <SEO title="Terms of Service" description="Terms and conditions for using the StoryWorld platform." />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-black mb-10 dark:text-white">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-500 mb-8">By accessing this website we assume you accept these terms and conditions. Do not continue to use StoryWorld if you do not agree to take all of the terms and conditions stated on this page.</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white uppercase tracking-tight">License</h2>
          <p className="mb-6">Unless otherwise stated, StoryWorld and/or its licensors own the intellectual property rights for all material on StoryWorld. All intellectual property rights are reserved. You may access this from StoryWorld for your own personal use subjected to restrictions set in these terms and conditions.</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white uppercase tracking-tight">User Comments</h2>
          <p className="mb-6">Parts of this website offer an opportunity for users to read and share content. StoryWorld does not filter, edit, publish or review content prior to their presence on the website. Content does not reflect the views and opinions of StoryWorld, its agents and/or affiliates.</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white uppercase tracking-tight">Ad Content</h2>
          <p className="mb-6">The advertisements displayed on this platform are provided by third-party services like Google AdSense. We are not responsible for the content of individual ads or the landing pages they link to.</p>
        </div>
      </div>
    </Layout>
  );
}
