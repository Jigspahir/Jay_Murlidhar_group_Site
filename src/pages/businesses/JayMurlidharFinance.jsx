import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharFinance() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-finance" onOpenContact={context?.onOpenContact} />;
}
