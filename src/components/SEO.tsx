import React, { useEffect } from 'react';
import { Trip } from '../types';

interface SEOProps {
  selectedTrip?: Trip | null;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string;
  baseUrl?: string;
}

const DEFAULT_TITLE = "Voyage Organisé depuis Casablanca & Rabat | Smart Orga";
const DEFAULT_DESCRIPTION = "Séjours et voyages organisés au Maroc au départ de Casablanca, Rabat et Marrakech. Réservation directe via WhatsApp.";
const DEFAULT_KEYWORDS = "voyage organisé casablanca, voyage organisé rabat, desert merzouga, dakhla lagon";
const DEFAULT_BASE_URL = "https://smartorga.ma";

export function SEO({
  selectedTrip,
  defaultTitle = DEFAULT_TITLE,
  defaultDescription = DEFAULT_DESCRIPTION,
  defaultKeywords = DEFAULT_KEYWORDS,
  baseUrl = DEFAULT_BASE_URL
}: SEOProps) {
  useEffect(() => {
    // 1. Calculate dynamic values
    let currentTitle = defaultTitle;
    let currentDescription = defaultDescription;
    let currentImage = `${baseUrl}/images/dakhla.jpg`;
    let currentUrl = `${baseUrl}/`;

    if (selectedTrip) {
      currentTitle = selectedTrip.seo_title?.trim() || `${selectedTrip.title} | Smart Orga`;
      currentDescription = selectedTrip.seo_description?.trim() || 
        `${selectedTrip.title} au départ de ${selectedTrip.departureCities?.join(', ') || 'Casablanca et Rabat'}. ${selectedTrip.duration} - ${selectedTrip.priceMAD} MAD. Réservez avec Smart Orga.`;
      if (selectedTrip.image) {
        currentImage = selectedTrip.image.startsWith('http') 
          ? selectedTrip.image 
          : `${baseUrl}${selectedTrip.image.startsWith('/') ? '' : '/'}${selectedTrip.image}`;
      }
      currentUrl = `${baseUrl}/?voyage=${encodeURIComponent(selectedTrip.id)}`;
    }

    // 2. Update document title
    document.title = currentTitle;

    // 3. Helper to update or create meta tags safely
    const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeName, attributeValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 4. Update standard meta tags
    setMetaTag('name', 'description', currentDescription);
    setMetaTag('name', 'keywords', defaultKeywords);

    // 5. Update Open Graph tags
    setMetaTag('property', 'og:title', currentTitle);
    setMetaTag('property', 'og:description', currentDescription);
    setMetaTag('property', 'og:image', currentImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', selectedTrip ? 'article' : 'website');

    // 6. Update Twitter tags
    setMetaTag('name', 'twitter:title', currentTitle);
    setMetaTag('name', 'twitter:description', currentDescription);
    setMetaTag('name', 'twitter:image', currentImage);

    // 7. Update canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

  }, [selectedTrip, defaultTitle, defaultDescription, defaultKeywords, baseUrl]);

  // Render native React 19 title and meta elements in document head as well
  return (
    <>
      <title>{selectedTrip ? (selectedTrip.seo_title || `${selectedTrip.title} | Smart Orga`) : defaultTitle}</title>
      <meta name="description" content={selectedTrip ? (selectedTrip.seo_description || defaultDescription) : defaultDescription} />
      <meta name="keywords" content={defaultKeywords} />
      <meta property="og:title" content={selectedTrip ? (selectedTrip.seo_title || `${selectedTrip.title} | Smart Orga`) : defaultTitle} />
      <meta property="og:description" content={selectedTrip ? (selectedTrip.seo_description || defaultDescription) : defaultDescription} />
    </>
  );
}

export default SEO;
