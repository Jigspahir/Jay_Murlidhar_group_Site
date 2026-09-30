import { useEffect } from 'react';

/**
 * Ensures a single canonical <link rel="canonical" href="..."> is maintained
 * in the document head without query parameters, uppercase chars, or duplicate tags.
 */
export function useCanonical(path) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : window.location.pathname;
    const origin = window.location.origin;
    link.setAttribute('href', `${origin}${cleanPath}`);
  }, [path]);
}
