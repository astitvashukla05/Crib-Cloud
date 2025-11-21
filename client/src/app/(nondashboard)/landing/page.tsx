import React from 'react';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import DiscoverSection from './DiscoverSection';
import CallToActionSection from './CallToActionSection';
import FooterSection from './Footer';

const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
