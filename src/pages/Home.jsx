import React from 'react';
import { useOutletContext } from 'react-router-dom';
import HomePage from './HomePage';

export default function Home() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;
  return <HomePage onOpenContact={onOpenContact} />;
}
