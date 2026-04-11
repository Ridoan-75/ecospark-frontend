import HeroBanner from "@/components/home/HeroBanner";
import FeaturedIdeas from "@/components/home/FeaturedIdeas";
import HowItWorks from "@/components/home/HowItWorks";
import StatsSection from "@/components/home/StatsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <StatsSection />
      <FeaturedIdeas />
      <HowItWorks />
      <NewsletterSection />
    </>
  );
}