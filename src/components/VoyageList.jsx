import React from 'react';
import { TripCard } from './TripCard';
import { sortVoyagesSmart } from '../data/tripsData';

/**
 * VoyageList component: renders a list of trips sorted by 'order' with smart tie-breaking (most recent first) and filtering archived.
 */
export function VoyageList({ trips = [], onOpenDetails, onOpenBookingModal, className = '' }) {
  // 1. Filtrer les voyages actifs (non archivés) & 2. Trier par 'order' intelligent
  const sortedVoyages = sortVoyagesSmart(trips);

  return (
    <div className={className || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-2"}>
      {sortedVoyages.map((voyage) => (
        <TripCard
          key={voyage.slug || voyage.id}
          trip={voyage}
          onOpenDetails={onOpenDetails}
          onOpenBookingModal={onOpenBookingModal}
        />
      ))}
    </div>
  );
}

export default VoyageList;
