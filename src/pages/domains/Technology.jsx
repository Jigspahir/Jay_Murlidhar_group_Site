import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function Technology() {
  const context = useOutletContext();
  return <DomainDetailPage domainId="technology" onOpenContact={context?.onOpenContact} />;
}
