import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function Retail() {
  const context = useOutletContext();
  return <DomainDetailPage domainId="retail" onOpenContact={context?.onOpenContact} />;
}
