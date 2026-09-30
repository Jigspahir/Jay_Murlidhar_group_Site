import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharMobile() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-mobile-accessories" onOpenContact={context?.onOpenContact} />;
}
