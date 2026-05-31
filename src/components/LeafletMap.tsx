import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTrip } from '../hooks/trip-context';
import { Coordinates } from '../types';

// Map controller to handle panning/zooming when destination changes
const MapController: React.FC<{ center: Coordinates }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center, map]);

  return null;
};

export const LeafletMap: React.FC = () => {
  const { destination, days, allAttractions, activeDay, setActiveAttraction } = useTrip();

  // Coordinates default to Paris (romantic starting point) if no city is searched
  const centerCoords = destination?.coordinates || { lat: 48.8566, lng: 2.3522 };

  // Collect all activities scheduled for the active day to render visual numbered markers
  const activeDayActivities = days.find(d => d.dayNumber === activeDay)?.activities || [];

  // Create minimal numbered custom icon
  const createNumberedIcon = (num: number, isActive: boolean) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="custom-marker-pin ${isActive ? 'active' : ''}">
          <span>${num}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  // Create subtle dot icon for general attractions not yet in itinerary
  const createDotIcon = (category: string) => {
    const colors: Record<string, string> = {
      History: '#78716C', // Slate/warm stone
      Nature: '#2D4A3E', // Forest Green
      Art: '#1B2A4A', // Muted Navy
      Culinary: '#8C8275', // SandDark
      Architecture: '#2D2D2D', // Charcoal
    };
    const color = colors[category] || '#1C1917';
    
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="w-4 h-4 rounded-full border-2 border-white shadow-md hover:scale-125 transition-all duration-150" 
             style="background-color: ${color}">
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8],
    });
  };

  return (
    <div className="relative w-full h-full select-none">
      <MapContainer
        center={[centerCoords.lat, centerCoords.lng]}
        zoom={13}
        zoomControl={false}
        className="w-full h-full"
      >
        {/* Sleek, desaturated CartoDB Positron theme for pure Apple Maps / Airbnb minimalism */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapController center={centerCoords} />

        {/* 1. Render all general attractions as desaturated dot pins */}
        {allAttractions
          .filter(attr => !activeDayActivities.some(act => act.attractionId === attr.id))
          .map((attr) => (
            <Marker
              key={`attr-pin-${attr.id}`}
              position={[attr.coordinates.lat, attr.coordinates.lng]}
              icon={createDotIcon(attr.category)}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <span className="text-[10px] uppercase font-bold tracking-wide text-stone-400 block mb-0.5">
                    {attr.category}
                  </span>
                  <span className="text-xs font-semibold text-stone-900 block mb-1">
                    {attr.name}
                  </span>
                  <button
                    onClick={() => setActiveAttraction(attr)}
                    className="text-[10px] text-stone-600 hover:text-stone-950 font-bold underline transition-colors"
                  >
                    View details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 2. Render active day's planned activities as prominent numbered pins */}
        {activeDayActivities
          .filter(act => act.coordinates)
          .map((act, index) => (
            <Marker
              key={`act-pin-${act.id}`}
              position={[act.coordinates!.lat, act.coordinates!.lng]}
              icon={createNumberedIcon(index + 1, true)}
              zIndexOffset={1000} // Keeps itinerary items always stacked on top
            >
              <Popup>
                <div className="p-1 font-sans">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="flex items-center justify-center bg-stone-900 text-stone-100 text-[10px] font-bold w-4 h-4 rounded-full">
                      {index + 1}
                    </span>
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Day {activeDay} Schedule &bull; {act.timeOfDay}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-stone-900 block">
                    {act.name}
                  </span>
                  {act.notes && (
                    <span className="text-[10px] text-stone-500 block italic mt-1 leading-normal">
                      "{act.notes}"
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      
      {/* Zoom HUD controller absolute on top of Leaflet canvas */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1 shadow-subtle border border-stone-200/50 bg-white/90 backdrop-blur-md p-1 rounded-lg">
        <button
          onClick={() => {
            // Find map instance and zoom in
            const mapEl = document.querySelector('.leaflet-container');
            if (mapEl) {
              const map = (mapEl as any)._leaflet_map;
              if (map) map.zoomIn();
            }
          }}
          className="flex items-center justify-center w-8 h-8 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-sans text-lg font-bold"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => {
            const mapEl = document.querySelector('.leaflet-container');
            if (mapEl) {
              const map = (mapEl as any)._leaflet_map;
              if (map) map.zoomOut();
            }
          }}
          className="flex items-center justify-center w-8 h-8 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-sans text-lg font-bold"
          aria-label="Zoom out"
        >
          &minus;
        </button>
      </div>
    </div>
  );
};
export default LeafletMap;
