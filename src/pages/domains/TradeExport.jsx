import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function TradeExport() {
  const context = useOutletContext();
  return <DomainDetailPage domainId="trade" onOpenContact={context?.onOpenContact} />;
}
