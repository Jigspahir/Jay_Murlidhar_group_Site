import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function Insurance() {
  const context = useOutletContext();
  return <DomainDetailPage domainId="insurance" onOpenContact={context?.onOpenContact} />;
}
