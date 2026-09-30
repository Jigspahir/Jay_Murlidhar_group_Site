import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharInfra() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-infra" onOpenContact={context?.onOpenContact} />;
}
