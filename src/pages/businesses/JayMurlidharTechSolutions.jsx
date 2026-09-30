import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharTechSolutions() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-tech-solutions" onOpenContact={context?.onOpenContact} />;
}
