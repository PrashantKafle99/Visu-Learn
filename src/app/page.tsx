import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ShowcaseSection } from '@/components/ShowcaseSection';
import { EngagementSection } from '@/components/EngagementSection';
import { CTASection } from '@/components/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <EngagementSection />
      <CTASection />
    </main>
  );
}