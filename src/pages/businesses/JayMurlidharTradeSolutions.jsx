import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharTradeSolutions() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-trade-solutions" onOpenContact={context?.onOpenContact} />;
}
