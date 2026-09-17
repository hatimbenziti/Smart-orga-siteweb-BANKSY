import React from 'react';
import { TripCard } from './TripCard';
import { sortVoyagesByOrder } from '../data/tripsData';

/**
 * VoyageList component: renders a list of trips sorted by order.json index and filtering archived.
 */
export function VoyageList({ trips = [], onOpenDetails, onOpenBookingModal, className = '' }) {
  // 1. Filtrer les voyages non archivés
  const activeVoyages = trips.filter((voyage) => !voyage.archived);

  // 2. Trier selon la position du slug dans la liste order.json
  const sortedVoyages = sortVoyagesByOrder(activeVoyages);

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
