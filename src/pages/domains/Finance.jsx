import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function Finance() {
  const context = useOutletContext();
  return <DomainDetailPage domainId="finance" onOpenContact={context?.onOpenContact} />;
}
