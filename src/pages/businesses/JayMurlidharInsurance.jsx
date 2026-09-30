import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharInsurance() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-insurance" onOpenContact={context?.onOpenContact} />;
}
