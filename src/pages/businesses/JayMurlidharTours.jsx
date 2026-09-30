import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharTours() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-tours" onOpenContact={context?.onOpenContact} />;
}
