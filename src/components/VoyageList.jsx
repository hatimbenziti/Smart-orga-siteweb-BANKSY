import React from 'react';
import { TripCard } from './TripCard';
import { sortTripsByOrderSettings } from '../data/tripsData';

/**
 * VoyageList component: renders a list of trips sorted according to order-settings.json or 'ordre' ascending.
 */
export function VoyageList({ trips = [], onOpenDetails, onOpenBookingModal, className = '' }) {
  const sortedTrips = sortTripsByOrderSettings(trips);

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
