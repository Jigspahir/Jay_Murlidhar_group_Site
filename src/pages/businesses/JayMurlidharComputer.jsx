import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CompanyDetailPage from '../CompanyDetailPage';

export default function JayMurlidharComputer() {
  const context = useOutletContext();
  return <CompanyDetailPage companySlug="jay-murlidhar-computer" onOpenContact={context?.onOpenContact} />;
}
