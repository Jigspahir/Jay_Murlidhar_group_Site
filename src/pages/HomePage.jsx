import React from 'react';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import EducationTechnology from '../components/EducationTechnology';
import EducationSection from '../components/EducationSection';
import HowWeBuild from '../components/HowWeBuild';
import OurExperts from '../components/OurExperts';
import Careers from '../components/Careers';
import FinalCTA from '../components/FinalCTA';

export default function HomePage({ onOpenContact }) {
  return (
    <>
      {/* 02 HERO */}
      <HeroSection onOpenContact={onOpenContact} />

      {/* 03 GROUP INTRODUCTION */}
      <IntroSection />

      {/* 04 EDUCATION × TECHNOLOGY */}
      <EducationTechnology />

      {/* 05 EDUCATION SECTION */}
      <EducationSection />

      {/* 09 HOW WE BUILD */}
      <HowWeBuild />

      {/* 10 OUR EXPERTS */}
      <OurExperts onOpenContact={onOpenContact} />

      {/* 11 CAREERS */}
      <Careers onOpenContact={onOpenContact} />

      {/* 12 FINAL CTA */}
      <FinalCTA onOpenContact={onOpenContact} />
    </>
  );
}
