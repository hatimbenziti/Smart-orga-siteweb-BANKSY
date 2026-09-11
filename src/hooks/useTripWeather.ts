import { useState, useEffect, useMemo } from 'react';
import { Trip } from '../types';
import {
  TripWeatherReport,
  getComputedTripDepartureDate,
  getFallbackWeather,
  fetchTripWeather
} from '../services/tripWeatherService';

export function useTripWeather(trip: Trip | null) {
  const departureInfo = useMemo(() => {
    if (!trip) return null;
    return getComputedTripDepartureDate(trip);
  }, [trip?.id, trip?.nextDate, trip?.isWeekly]);

  const [weather, setWeather] = useState<TripWeatherReport | null>(() => {
    if (!trip || !departureInfo) return null;
    return getFallbackWeather(trip, departureInfo.date);
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!trip || !departureInfo) return;

    let isMounted = true;
    setLoading(true);

    fetchTripWeather(trip, departureInfo.date)
      .then((report) => {
        if (isMounted) {
          setWeather(report);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setWeather(getFallbackWeather(trip, departureInfo.date));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [trip?.id, trip?.destination, trip?.region, departureInfo?.date.getTime()]);

  return {
    weather,
    departureDate: departureInfo?.date || null,
    isDynamic: departureInfo?.isDynamic || false,
    loading
  };
}
