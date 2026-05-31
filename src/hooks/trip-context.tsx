import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  TripState, 
  CitySuggestion, 
  Attraction, 
  ItineraryDay, 
  Activity, 
  BudgetSettings, 
  BudgetBreakdown, 
  Coordinates,
  FoodPreference,
  TransportType
} from '../types';
import { getAttractionsForCity } from '../services/attraction-service';

interface TripContextProps extends TripState {
  setDestination: (city: CitySuggestion | null) => void;
  setDurationDays: (days: number) => void;
  toggleBookmark: (attraction: Attraction) => void;
  addActivityToDay: (dayNumber: number, attraction: Attraction) => void;
  addCustomActivity: (dayNumber: number, name: string, category: Activity['category']) => void;
  removeActivityFromDay: (dayNumber: number, activityId: string) => void;
  reorderActivities: (dayNumber: number, fromIndex: number, toIndex: number) => void;
  moveActivityBetweenDays: (fromDay: number, toDay: number, activityId: string, toIndex: number) => void;
  setActiveDay: (day: number) => void;
  updateBudgetSettings: (settings: Partial<BudgetSettings>) => void;
  setActiveAttraction: (attraction: Attraction | null) => void;
  budgetBreakdown: BudgetBreakdown;
  clearTrip: () => void;
}

const defaultBudgetSettings: BudgetSettings = {
  durationDays: 3,
  accommodationCostPerNight: 120,
  foodPreference: 'Casual Dining',
  transportType: 'Public Transit',
  customAttractionsCost: 0,
};

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const STORAGE_KEY = 'odyssey_active_trip';

  // 1. Initial State Load
  const [destination, setDestinationState] = useState<CitySuggestion | null>(null);
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [bookmarkedAttractions, setBookmarkedAttractions] = useState<Attraction[]>([]);
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>(defaultBudgetSettings);
  const [activeAttraction, setActiveAttraction] = useState<Attraction | null>(null);
  const [loadingAttractions, setLoadingAttractions] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<CitySuggestion[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.destination) setDestinationState(parsed.destination);
        if (parsed.days) setDays(parsed.days);
        if (parsed.bookmarkedAttractions) setBookmarkedAttractions(parsed.bookmarkedAttractions);
        if (parsed.allAttractions) setAllAttractions(parsed.allAttractions);
        if (parsed.activeDay) setActiveDay(parsed.activeDay);
        if (parsed.budgetSettings) setBudgetSettings(parsed.budgetSettings);
        if (parsed.searchHistory) setSearchHistory(parsed.searchHistory);
      }
    } catch (e) {
      console.error('Failed to load active trip state from localstorage:', e);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      if (destination) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          destination,
          days,
          bookmarkedAttractions,
          allAttractions,
          activeDay,
          budgetSettings,
          searchHistory,
        }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save active trip state to localstorage:', e);
    }
  }, [destination, days, bookmarkedAttractions, allAttractions, activeDay, budgetSettings, searchHistory]);

  // 2. Select Destination
  const setDestination = (city: CitySuggestion | null) => {
    setDestinationState(city);
    
    if (!city) {
      setDays([]);
      setBookmarkedAttractions([]);
      setAllAttractions([]);
      setActiveAttraction(null);
      return;
    }

    // Add to history
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.displayName !== city.displayName);
      return [city, ...filtered].slice(0, 5);
    });

    setLoadingAttractions(true);
    
    // Fetch attractions (local curated or dynamic geocoded fallback)
    setTimeout(() => {
      try {
        const attractions = getAttractionsForCity(city.name, city.coordinates);
        setAllAttractions(attractions);
        
        // Auto-initialize Itinerary Days based on current settings
        const initialDays: ItineraryDay[] = Array.from(
          { length: budgetSettings.durationDays }, 
          (_, idx) => ({
            dayNumber: idx + 1,
            activities: [],
          })
        );
        
        // Automatically inject first 2 popular attractions into first day as starter activities
        if (attractions.length > 0) {
          initialDays[0].activities.push({
            id: `act-auto-0`,
            name: attractions[0].name,
            category: attractions[0].category,
            description: attractions[0].description,
            image: attractions[0].image,
            coordinates: attractions[0].coordinates,
            timeOfDay: '09:30',
            duration: attractions[0].avgDuration,
            attractionId: attractions[0].id,
          });
        }
        if (attractions.length > 1) {
          initialDays[0].activities.push({
            id: `act-auto-1`,
            name: attractions[1].name,
            category: attractions[1].category,
            description: attractions[1].description,
            image: attractions[1].image,
            coordinates: attractions[1].coordinates,
            timeOfDay: '14:00',
            duration: attractions[1].avgDuration,
            attractionId: attractions[1].id,
          });
        }

        setDays(initialDays);
        setActiveDay(1);
        setBookmarkedAttractions([]); // Clear bookmarks for new city
        setActiveAttraction(null);
      } catch (err) {
        console.error('Error populating attractions:', err);
      } finally {
        setLoadingAttractions(false);
      }
    }, 400); // Subtle loader aesthetic
  };

  // 3. Set Duration (Add or remove itinerary days)
  const setDurationDays = (daysCount: number) => {
    const cleanDays = Math.max(1, Math.min(10, daysCount));
    
    setBudgetSettings(prev => ({ ...prev, durationDays: cleanDays }));
    
    setDays(prev => {
      if (prev.length === cleanDays) return prev;
      
      if (prev.length < cleanDays) {
        // Append empty days
        const additional = Array.from(
          { length: cleanDays - prev.length },
          (_, idx) => ({
            dayNumber: prev.length + idx + 1,
            activities: [],
          })
        );
        return [...prev, ...additional];
      } else {
        // Cut trailing days (keeps existing items safe up to the boundary)
        return prev.slice(0, cleanDays);
      }
    });

    if (activeDay > cleanDays) {
      setActiveDay(cleanDays);
    }
  };

  // 4. Toggle bookmark
  const toggleBookmark = (attraction: Attraction) => {
    setBookmarkedAttractions(prev => {
      const isBookmarked = prev.some(item => item.id === attraction.id);
      if (isBookmarked) {
        return prev.filter(item => item.id !== attraction.id);
      } else {
        return [...prev, attraction];
      }
    });
  };

  // 5. Add attraction to a specific day
  const addActivityToDay = (dayNumber: number, attraction: Attraction) => {
    setDays(prev => 
      prev.map(day => {
        if (day.dayNumber !== dayNumber) return day;

        // Avoid adding duplicate attraction in the same day (can be added on other days)
        if (day.activities.some(act => act.attractionId === attraction.id)) {
          return day;
        }

        // Standard timing calculation based on existing list length
        const baseHour = 9 + day.activities.length * 2.5;
        const formattedTime = `${String(Math.floor(baseHour)).padStart(2, '0')}:00`;

        const newActivity: Activity = {
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: attraction.name,
          category: attraction.category,
          description: attraction.description,
          image: attraction.image,
          coordinates: attraction.coordinates,
          timeOfDay: formattedTime,
          duration: attraction.avgDuration,
          attractionId: attraction.id,
        };

        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      })
    );
  };

  // 6. Add a custom generic note/activity (Flight, Lunch, Rest, Custom sights)
  const addCustomActivity = (dayNumber: number, name: string, category: Activity['category']) => {
    setDays(prev =>
      prev.map(day => {
        if (day.dayNumber !== dayNumber) return day;

        const baseHour = 9 + day.activities.length * 2.5;
        const formattedTime = `${String(Math.floor(baseHour)).padStart(2, '0')}:00`;

        const newActivity: Activity = {
          id: `act-custom-${Date.now()}`,
          name,
          category,
          timeOfDay: formattedTime,
          duration: '1 hour',
        };

        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      })
    );
  };

  // 7. Remove activity from day
  const removeActivityFromDay = (dayNumber: number, activityId: string) => {
    setDays(prev => 
      prev.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          activities: day.activities.filter(act => act.id !== activityId),
        };
      })
    );
  };

  // 8. Reorder activities within a single day
  const reorderActivities = (dayNumber: number, fromIndex: number, toIndex: number) => {
    setDays(prev => 
      prev.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        
        const list = [...day.activities];
        const [moved] = list.splice(fromIndex, 1);
        list.splice(toIndex, 0, moved);

        // Adjust schedule times cleanly for elegant visual timelines
        const updatedList = list.map((act, index) => {
          const hour = 9 + index * 2.5;
          const timeOfDay = `${String(Math.floor(hour)).padStart(2, '0')}:00`;
          return { ...act, timeOfDay };
        });

        return {
          ...day,
          activities: updatedList,
        };
      })
    );
  };

  // 9. Move activities between separate days
  const moveActivityBetweenDays = (
    fromDay: number, 
    toDay: number, 
    activityId: string, 
    toIndex: number
  ) => {
    setDays(prev => {
      // Find the activity to move
      const originDay = prev.find(d => d.dayNumber === fromDay);
      if (!originDay) return prev;
      
      const activityToMove = originDay.activities.find(act => act.id === activityId);
      if (!activityToMove) return prev;

      return prev.map(day => {
        if (day.dayNumber === fromDay) {
          // Remove from source
          return {
            ...day,
            activities: day.activities.filter(act => act.id !== activityId),
          };
        }
        
        if (day.dayNumber === toDay) {
          // Add to destination
          const list = [...day.activities];
          
          // Insert at specified index
          list.splice(toIndex, 0, activityToMove);

          // Clean schedule times
          const updatedList = list.map((act, index) => {
            const hour = 9 + index * 2.5;
            const time = `${String(Math.floor(hour)).padStart(2, '0')}:00`;
            return { ...act, timeOfDay: time };
          });

          return {
            ...day,
            activities: updatedList,
          };
        }

        return day;
      });
    });
  };

  // 10. Update general budget values
  const updateBudgetSettings = (settings: Partial<BudgetSettings>) => {
    setBudgetSettings(prev => {
      const merged = { ...prev, ...settings };
      // Sync duration with day count if duration is modified
      if (settings.durationDays !== undefined && settings.durationDays !== prev.durationDays) {
        setDurationDays(settings.durationDays);
      }
      return merged;
    });
  };

  // 11. Clear Trip State
  const clearTrip = () => {
    setDestinationState(null);
    setDays([]);
    setBookmarkedAttractions([]);
    setAllAttractions([]);
    setActiveAttraction(null);
    setBudgetSettings(defaultBudgetSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  // 12. Calculate Live Expense breakdown
  const budgetBreakdown = useMemo((): BudgetBreakdown => {
    const totalDays = budgetSettings.durationDays;
    
    // Accommodation cost
    const accommodation = totalDays * budgetSettings.accommodationCostPerNight;

    // Food preferences
    const foodCostMap: Record<FoodPreference, number> = {
      'Street Food': 25,
      'Casual Dining': 55,
      'Fine Dining': 130,
      'Mixed': 65,
    };
    const food = totalDays * foodCostMap[budgetSettings.foodPreference];

    // Transportation tiers
    const transportCostMap: Record<TransportType, number> = {
      'Walking': 0,
      'Public Transit': 12,
      'Car Rental': 65,
      'Taxi/Rideshare': 40,
    };
    const transportation = totalDays * transportCostMap[budgetSettings.transportType];

    // Count attractions that cost money
    let entryFeesTotal = 0;
    days.forEach(day => {
      day.activities.forEach(act => {
        if (act.attractionId) {
          const original = allAttractions.find(a => a.id === act.attractionId);
          if (original) {
            const tierCost: Record<Attraction['priceRange'], number> = {
              'Free': 0,
              '$': 15,
              '$$': 30,
              '$$$': 75,
            };
            entryFeesTotal += tierCost[original.priceRange];
          }
        }
      });
    });

    const attractions = entryFeesTotal + budgetSettings.customAttractionsCost;
    const total = accommodation + food + transportation + attractions;
    const dailyAverage = totalDays > 0 ? Math.round(total / totalDays) : 0;

    return {
      accommodation,
      food,
      transportation,
      attractions,
      total,
      dailyAverage,
    };
  }, [days, allAttractions, budgetSettings]);

  return (
    <TripContext.Provider value={{
      destination,
      days,
      bookmarkedAttractions,
      allAttractions,
      activeDay,
      budgetSettings,
      activeAttraction,
      loadingAttractions,
      searchHistory,
      setDestination,
      setDurationDays,
      toggleBookmark,
      addActivityToDay,
      addCustomActivity,
      removeActivityFromDay,
      reorderActivities,
      moveActivityBetweenDays,
      setActiveDay,
      updateBudgetSettings,
      setActiveAttraction,
      budgetBreakdown,
      clearTrip,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be utilized within a TripProvider');
  }
  return context;
};
