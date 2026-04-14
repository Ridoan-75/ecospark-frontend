import HeroBanner from "@/components/home/HeroBanner";
import FeaturedIdeas from "@/components/home/FeaturedIdeas";
import StatsSection from "@/components/home/StatsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <StatsSection />
      <FeaturedIdeas />
      <NewsletterSection />
    </>
  );
}