import { useState, useCallback } from 'react';
import { CitySuggestion } from '../types';

export const useGeocoding = () => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Nominatim search endpoint, querying for city locations
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&featuretype=settlement&addressdetails=1&limit=5`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'OdysseyTravelPlanner/1.0 (mayuresh.projects@travel.planner)',
        },
      });

      if (!response.ok) {
        throw new Error('Geocoding search failed. Please try again.');
      }

      const data = await response.json();

      const parsed: CitySuggestion[] = data.map((item: any) => {
        const address = item.address || {};
        const city = address.city || address.town || address.village || address.municipality || item.display_name.split(',')[0];
        const country = address.country || '';
        
        return {
          name: city,
          displayName: item.display_name,
          country,
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          },
        };
      });

      // Filter duplicates by name + country
      const unique = parsed.filter(
        (val, index, self) =>
          self.findIndex((t) => t.name === val.name && t.country === val.country) === index
      );

      setSuggestions(unique);
    } catch (err: any) {
      console.error('Error fetching geocoding suggestions:', err);
      setError(err.message || 'Failed to lookup destination.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    clearSuggestions: () => setSuggestions([]),
  };
};
