import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainDetailPage from '../DomainDetailPage';

export default function Technology() {
  const context = useOutletContext();

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    document.title = "Super Intelligence & Digital Technology | Jay Murlidhar Group";
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "Jay Murlidhar Group explores next-generation intelligence, intelligent automation, software, cloud and data-driven digital experiences."
      );
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  return <DomainDetailPage domainId="technology" onOpenContact={context?.onOpenContact} />;
}
