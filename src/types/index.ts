export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Attraction {
  id: string;
  name: string;
  rating: number;
  category: 'History' | 'Nature' | 'Art' | 'Culinary' | 'Architecture' | 'Shopping' | 'Leisure';
  description: string;
  image: string;
  coordinates: Coordinates;
  reviewsCount: number;
  avgDuration: string; // e.g. "2 hours"
  priceRange: 'Free' | '$' | '$$' | '$$$';
}

export interface Activity {
  id: string;
  name: string;
  category: Attraction['category'] | 'Travel' | 'Rest' | 'Other';
  description?: string;
  image?: string;
  coordinates?: Coordinates;
  timeOfDay?: string; // e.g. "09:00"
  duration?: string;
  notes?: string;
  attractionId?: string; // Reference to original attraction if linked
}

export interface ItineraryDay {
  dayNumber: number;
  activities: Activity[];
}

export type BudgetTier = 'Budget' | 'Balanced' | 'Luxury';
export type TransportType = 'Walking' | 'Public Transit' | 'Car Rental' | 'Taxi/Rideshare';
export type FoodPreference = 'Street Food' | 'Casual Dining' | 'Fine Dining' | 'Mixed';

export interface BudgetSettings {
  durationDays: number;
  accommodationCostPerNight: number;
  foodPreference: FoodPreference;
  transportType: TransportType;
  customAttractionsCost: number;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  attractions: number;
  total: number;
  dailyAverage: number;
}

export interface WeatherInfo {
  currentTemp: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  airQuality?: string;
  forecast: {
    date: string;
    tempMax: number;
    tempMin: number;
    conditionCode: number;
  }[];
}

export interface CitySuggestion {
  name: string;
  displayName: string;
  country: string;
  coordinates: Coordinates;
}

export interface TripState {
  destination: CitySuggestion | null;
  days: ItineraryDay[];
  bookmarkedAttractions: Attraction[];
  allAttractions: Attraction[];
  activeDay: number;
  budgetSettings: BudgetSettings;
  activeAttraction: Attraction | null;
  loadingAttractions: boolean;
  searchHistory: CitySuggestion[];
}
