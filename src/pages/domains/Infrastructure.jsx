import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function Infrastructure() {
  const context = useOutletContext();
  return <DomainDetailPage domainId="infrastructure" onOpenContact={context?.onOpenContact} />;
}
