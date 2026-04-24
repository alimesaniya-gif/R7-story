import { Layout } from '../components/common/Layout';
import { SEO } from '../components/common/SEO';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO title="Privacy Policy" description="Privacy policy for StoryWorld kids storytelling platform." />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-black mb-10 dark:text-white">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-500 mb-6">Last updated: April 24, 2026</p>
          <p className="mb-6">At StoryWorld, accessible from our platform, one of our main priorities is the privacy of our visitors, specifically children. This Privacy Policy document contains types of information that is collected and recorded by StoryWorld and how we use it.</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white uppercase tracking-tight">Children's Information</h2>
          <p className="mb-6">Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
          <p className="mb-6">StoryWorld does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white uppercase tracking-tight">Log Files</h2>
          <p className="mb-6">StoryWorld follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-white uppercase tracking-tight">Google AdSense</h2>
          <p className="mb-6">Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on StoryWorld, which are sent directly to users' browser.</p>
        </div>
      </div>
    </Layout>
  );
}
