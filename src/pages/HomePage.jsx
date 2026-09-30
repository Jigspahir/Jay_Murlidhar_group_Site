import React from 'react';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import EducationTechnology from '../components/EducationTechnology';
import EducationSection from '../components/EducationSection';
import TechnologySection from '../components/TechnologySection';
import ServicesPreview from '../components/ServicesPreview';
import BusinessEcosystem from '../components/BusinessEcosystem';
import HowWeBuild from '../components/HowWeBuild';
import NextGeneration from '../components/NextGeneration';
import Careers from '../components/Careers';
import FinalCTA from '../components/FinalCTA';

export default function HomePage({ onOpenContact }) {
  return (
    <main className="flex-1">
      {/* 02 HERO */}
      <HeroSection onOpenContact={onOpenContact} />

      {/* 03 GROUP INTRODUCTION */}
      <IntroSection />

      {/* 04 EDUCATION × TECHNOLOGY */}
      <EducationTechnology />

      {/* 05 EDUCATION SECTION */}
      <EducationSection />

      {/* 06 TECHNOLOGY SECTION */}
      <TechnologySection />

      {/* 07 VERIFIED CLIENT SERVICES PREVIEW */}
      <ServicesPreview />

      {/* 08 BUSINESS ECOSYSTEM DIRECTORY */}
      <BusinessEcosystem />

      {/* 09 HOW WE BUILD */}
      <HowWeBuild />

      {/* 11 NEXT GENERATION */}
      <NextGeneration />

      {/* 12 CAREERS */}
      <Careers onOpenContact={onOpenContact} />

      {/* 13 FINAL CTA */}
      <FinalCTA onOpenContact={onOpenContact} />
    </main>
  );
}
