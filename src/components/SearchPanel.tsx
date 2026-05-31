import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, Bookmark, Plus, MapPin, Compass, History } from 'lucide-react';
import { useTrip } from '../hooks/trip-context';
import { useGeocoding } from '../hooks/use-geocoding';
import { useToast } from './ui/toast';
import { Attraction } from '../types';
import Tabs from './ui/tabs';

export const SearchPanel: React.FC = () => {
  const { 
    destination, 
    setDestination, 
    allAttractions, 
    bookmarkedAttractions, 
    toggleBookmark, 
    addActivityToDay, 
    activeDay,
    loadingAttractions,
    searchHistory,
    setActiveAttraction
  } = useTrip();

  const { toast } = useToast();
  const { suggestions, loading: geocodingLoading, fetchSuggestions, clearSuggestions } = useGeocoding();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce geocoding suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        fetchSuggestions(searchQuery);
      } else {
        clearSuggestions();
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions, clearSuggestions]);

  // Click outside to close geocoding dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Category tags
  const categories = [
    { id: 'All', label: 'Explore' },
    { id: 'History', label: 'History' },
    { id: 'Nature', label: 'Nature' },
    { id: 'Art', label: 'Art' },
    { id: 'Culinary', label: 'Culinary' },
    { id: 'Bookmarked', label: 'Bookmarks', icon: <Bookmark size={11} className="fill-current" /> }
  ];

  // Filter attractions
  const filteredAttractions = allAttractions.filter(attr => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Bookmarked') {
      return bookmarkedAttractions.some(item => item.id === attr.id);
    }
    return attr.category === activeCategory;
  });

  const handleSelectCity = (city: any) => {
    setDestination(city);
    setSearchQuery('');
    setShowDropdown(false);
    toast(`Welcome to ${city.name}. We geocoded the city and prepared attractions!`, 'success');
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 border-r border-stone-200/60 font-sans select-none overflow-hidden">
      {/* 1. Top Logo Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-stone-200/50 bg-white/70 backdrop-blur-md">
        <Compass size={18} className="text-stone-900 animate-pulse" />
        <h1 className="text-sm font-bold tracking-wider uppercase text-stone-900">
          Odyssey
        </h1>
        <span className="text-[9px] bg-stone-150 text-stone-600 font-bold px-1.5 py-0.5 rounded border border-stone-200/30 uppercase tracking-widest ml-auto">
          Beta
        </span>
      </div>

      {/* 2. Destination Search Input Container */}
      <div className="p-5 bg-white border-b border-stone-200/40 relative z-[200]">
        <div className="relative" ref={dropdownRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
          <input
            type="text"
            placeholder="Search a city... (e.g. Paris, Tokyo)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full text-xs py-3.5 pl-10 pr-4 bg-stone-50 border border-stone-200/80 rounded-xl focus:outline-none focus:border-stone-400 focus:bg-white transition-all duration-200 text-stone-800 placeholder-stone-400"
          />

          {/* Search suggestions geocoded list dropdown */}
          {showDropdown && (searchQuery.trim().length >= 3 || searchHistory.length > 0) && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-xl shadow-premium overflow-hidden max-h-60 overflow-y-auto">
              {geocodingLoading ? (
                <div className="flex items-center justify-center py-5 text-stone-400 text-xs gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
                  Searching coordinates...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <button
                    key={`sug-${idx}`}
                    onClick={() => handleSelectCity(item)}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-3 hover:bg-stone-50 text-xs text-stone-750 font-medium transition-colors border-b border-stone-100 last:border-0"
                  >
                    <MapPin size={13} className="text-stone-400" />
                    <div>
                      <span className="font-bold text-stone-900 block">{item.name}</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5 line-clamp-1">{item.displayName}</span>
                    </div>
                  </button>
                ))
              ) : searchQuery.trim().length >= 3 ? (
                <div className="py-4 text-center text-xs text-stone-400 italic">
                  No matching cities found.
                </div>
              ) : null}

              {/* Search History */}
              {!geocodingLoading && searchHistory.length > 0 && searchQuery.trim().length < 3 && (
                <div>
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100">
                    <History size={11} />
                    Recent Journeys
                  </div>
                  {searchHistory.map((item, idx) => (
                    <button
                      key={`hist-${idx}`}
                      onClick={() => handleSelectCity(item)}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-3 hover:bg-stone-50 text-xs text-stone-650 font-medium transition-colors border-b border-stone-100 last:border-0"
                    >
                      <MapPin size={12} className="text-stone-400" />
                      <div>
                        <span className="font-bold text-stone-850 block">{item.name}</span>
                        <span className="text-[9px] text-stone-400">{item.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Discover Panel Container */}
      {!destination ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-400">
          <Compass size={32} className="text-stone-300 mb-3 stroke-[1.2]" />
          <p className="text-xs font-semibold text-stone-500 mb-1">
            Where is your next odyssey?
          </p>
          <p className="text-[10px] text-stone-400 max-w-[200px] leading-relaxed">
            Search and select a city above to visualize its maps, discover sights, and coordinate budgets.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Active Category tab controller */}
          <div className="px-5 pt-4 bg-white border-b border-stone-200/30">
            <Tabs 
              tabs={categories} 
              activeTab={activeCategory} 
              onChange={(id) => setActiveCategory(id)} 
              className="w-full"
            />
          </div>

          {/* Discovery Scroll List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {loadingAttractions ? (
              // Skeleton loaders
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={`sk-${idx}`} className="bg-white border border-stone-200/60 rounded-xl p-3.5 space-y-2.5 animate-pulse">
                  <div className="h-28 bg-stone-100 rounded-lg w-full"></div>
                  <div className="h-3 bg-stone-150 rounded w-1/3"></div>
                  <div className="h-4 bg-stone-150 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-150 rounded w-1/2"></div>
                </div>
              ))
            ) : filteredAttractions.length > 0 ? (
              filteredAttractions.map((attr) => {
                const isBookmarked = bookmarkedAttractions.some(item => item.id === attr.id);
                return (
                  <div
                    key={`card-${attr.id}`}
                    className="bg-white border border-stone-200/60 hover:border-stone-300 rounded-xl overflow-hidden shadow-subtle hover:shadow-[0_4px_12px_rgba(28,25,23,0.03)] transition-all duration-250 flex flex-col group"
                  >
                    {/* Picture Card header */}
                    <div 
                      onClick={() => setActiveAttraction(attr)}
                      className="relative h-32 w-full overflow-hidden cursor-pointer bg-stone-100"
                    >
                      <img
                        src={attr.image}
                        alt={attr.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      
                      {/* Category Label */}
                      <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-[9px] uppercase font-bold text-stone-600 px-2 py-0.5 rounded border border-white/50">
                        {attr.category}
                      </span>

                      {/* Bookmark icon toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(attr);
                          toast(
                            isBookmarked ? `${attr.name} removed from bookmarks.` : `${attr.name} saved to bookmarks!`,
                            'info'
                          );
                        }}
                        className={`absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-stone-500 hover:text-stone-850 hover:bg-white shadow-sm border border-stone-100/50 transition-all duration-150 ${
                          isBookmarked ? 'text-stone-800 fill-stone-800' : ''
                        }`}
                        aria-label="Bookmark attraction"
                      >
                        <Bookmark size={12} className={isBookmarked ? 'fill-stone-800' : ''} />
                      </button>
                    </div>

                    {/* Content body */}
                    <div className="p-3.5 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 
                          onClick={() => setActiveAttraction(attr)}
                          className="text-xs font-bold text-stone-900 group-hover:text-stone-950 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {attr.name}
                        </h4>
                        
                        {/* Rating indicator */}
                        <div className="flex items-center gap-0.5 text-stone-700 flex-shrink-0">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold">{attr.rating}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-400 line-clamp-2 mt-1.5 leading-normal">
                        {attr.description}
                      </p>

                      {/* Utility Footer row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                        <span className="text-[10px] text-stone-400 font-medium">
                          {attr.avgDuration} &bull; <span className="font-bold text-stone-500">{attr.priceRange}</span>
                        </span>

                        <button
                          onClick={() => {
                            addActivityToDay(activeDay, attr);
                            toast(`${attr.name} added to Day ${activeDay} schedule!`, 'success');
                          }}
                          className="flex items-center gap-1 text-[10px] bg-stone-900 text-stone-50 hover:bg-stone-850 font-semibold px-2.5 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all duration-150"
                        >
                          <Plus size={11} />
                          Add to Itinerary
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-stone-400">
                <Compass size={24} className="mx-auto text-stone-250 mb-2 stroke-[1.2]" />
                <p className="text-[10px] font-semibold text-stone-500">
                  {activeCategory === 'Bookmarked' ? 'No bookmarks saved yet' : 'No matches in this category'}
                </p>
                <p className="text-[9px] text-stone-450 mt-0.5">
                  {activeCategory === 'Bookmarked' 
                    ? 'Click the bookmark banner on card headings to save sights here.' 
                    : 'Try checking another tag.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchPanel;
