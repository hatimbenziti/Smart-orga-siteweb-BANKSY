import React from 'react';
import { TripCard } from './TripCard';

/**
 * VoyageList component: renders a list of trips sorted by 'ordre' ascending.
 */
export function VoyageList({ trips = [], onOpenDetails, onOpenBookingModal, className = '' }) {
  const sortedTrips = [...trips].sort((a, b) => {
    const ordA = a.ordre ?? a.order ?? 99;
    const ordB = b.ordre ?? b.order ?? 99;
    return ordA - ordB;
  });

  return (
    <div className={className || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-2"}>
      {sortedTrips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onOpenDetails={onOpenDetails}
          onOpenBookingModal={onOpenBookingModal}
        />
      ))}
    </div>
  );
}

export default VoyageList;
