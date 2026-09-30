import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharExports() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-exports" onOpenContact={context?.onOpenContact} />;
}
