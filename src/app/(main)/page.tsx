import HeroBanner from "@/components/home/HeroBanner";
import StatsSection from "@/components/home/StatsSection";
import FeaturedIdeas from "@/components/home/FeaturedIdeas";
import HowItWorks from "@/components/home/HowItWorks";
import TopVotedIdeas from "@/components/home/TopVotedIdeas";
import TrendingSection from "@/components/home/TrendingSection";
import AIFeaturesSection from "@/components/home/AIFeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <StatsSection />
      <FeaturedIdeas />
      <HowItWorks />
      <TopVotedIdeas />
      <TrendingSection />
      <AIFeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
