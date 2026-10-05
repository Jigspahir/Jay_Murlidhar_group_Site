import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function JanSuvidha() {
  const context = useOutletContext();

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    document.title = "Jan Suvidha & Citizen Services | Jay Murlidhar Group";
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "Jay Murlidhar Computer provides trusted citizen and public service assistance, CSC solutions, RTO support, and business licensing."
      );
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  return <DomainDetailPage domainId="jan-suvidha" onOpenContact={context?.onOpenContact} />;
}
