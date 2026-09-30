import React from 'react';
import { useOutletContext } from 'react-router-dom';
import EcosystemPage from './EcosystemPage';

export default function Ecosystem() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;
  return <EcosystemPage onOpenContact={onOpenContact} />;
}
