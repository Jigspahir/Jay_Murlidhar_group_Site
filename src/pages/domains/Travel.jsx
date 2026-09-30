import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function Travel() {
  const context = useOutletContext();
  return <DomainDetailPage domainId="travel" onOpenContact={context?.onOpenContact} />;
}
