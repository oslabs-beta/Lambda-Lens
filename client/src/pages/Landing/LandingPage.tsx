import Navbar from './Navbar/Navbar';
import Hero from './Hero/Hero';
import Features from './Features/Features';
import HowItWorks from './HowItWorks/HowItWorks';
import FAQ from './FAQ/FAQ';
import CTA from './CTA/CTA';
import Footer from './Footer/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-light-cont-l dark:bg-dark-cont-l text-light-text-prim dark:text-dark-text-prim font-sans transition-colors">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;