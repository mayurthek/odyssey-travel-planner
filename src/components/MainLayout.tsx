import React, { useState } from 'react';
import { Compass, Calendar, DollarSign, CloudSun, FileText, ChevronDown, ChevronUp, Map, Search, List } from 'lucide-react';
import { useTrip } from '../hooks/trip-context';
import SearchPanel from './SearchPanel';
import LeafletMap from './LeafletMap';
import ItineraryBuilder from './ItineraryBuilder';
import ItineraryBoard from './ItineraryBoard';
import BudgetCalculator from './BudgetCalculator';
import WeatherPanel from './WeatherPanel';
import SummaryDashboard from './SummaryDashboard';
import Tabs from './ui/tabs';

export const MainLayout: React.FC = () => {
  const { destination, clearTrip } = useTrip();

  // Right sidebar tab toggle for Desktop
  const [rightActiveTab, setRightActiveTab] = useState<'schedule' | 'budget' | 'weather'>('schedule');

  // Center Perspective View (Map Canvas vs visual Kanban board)
  const [centerView, setCenterView] = useState<'map' | 'board'>('map');

  // Mobile layout state management
  const [mobileTab, setMobileTab] = useState<'explore' | 'schedule' | 'budget' | 'weather'>('explore');
  const [mobileMapExpanded, setMobileMapExpanded] = useState(true);

  // Summary Dashboard modal open trigger
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const rightTabs = [
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={12} /> },
    { id: 'budget', label: 'Budget', icon: <DollarSign size={12} /> },
    { id: 'weather', label: 'Weather', icon: <CloudSun size={12} /> },
  ];

  const mobileTabs = [
    { id: 'explore', label: 'Explore', icon: <Compass size={12} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={12} /> },
    { id: 'budget', label: 'Budget', icon: <DollarSign size={12} /> },
    { id: 'weather', label: 'Weather', icon: <CloudSun size={12} /> },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-stone-50 overflow-hidden font-sans select-none print:bg-white">
      
      {/* ================= DESKTOP LAYOUT (>= 1024px) ================= */}
      <div className="hidden lg:grid grid-cols-12 h-full w-full overflow-hidden print:hidden">
        
        {/* 1. LEFT PANEL (33.3% column ratio - span 4 of 12) */}
        <div className="col-span-4 h-full overflow-hidden flex flex-col">
          <SearchPanel />
        </div>

        {/* 2. CENTER PANEL (41.7% column ratio - span 5 of 12) */}
        <div className="col-span-5 h-full relative flex flex-col border-r border-stone-200/60 overflow-hidden">
          
          {/* Floating Navigation / Action bar at top of Map */}
          {destination && (
            <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center bg-white/90 backdrop-blur-md border border-stone-200/70 py-2.5 px-4 rounded-xl shadow-subtle">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                <span className="text-xs font-bold text-stone-900 pr-1 truncate max-w-[90px] md:max-w-[150px]">
                  Drafting {destination.name}
                </span>
                <span className="text-[10px] text-stone-400 font-semibold border-l border-stone-200 pl-2 hidden sm:inline">
                  {destination.country}
                </span>
              </div>

              {/* View perspective toggles (Map vs Kanban Board) */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] mx-2">
                <button
                  onClick={() => setCenterView('map')}
                  className={`flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-1.5 rounded-md transition-all duration-150 select-none outline-none ${
                    centerView === 'map'
                      ? 'bg-white text-stone-900 border border-stone-200/30 shadow-sm font-bold'
                      : 'text-stone-500 hover:text-stone-850 hover:bg-stone-50/50'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setCenterView('board')}
                  className={`flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-1.5 rounded-md transition-all duration-150 select-none outline-none ${
                    centerView === 'board'
                      ? 'bg-white text-stone-900 border border-stone-200/30 shadow-sm font-bold'
                      : 'text-stone-500 hover:text-stone-850 hover:bg-stone-50/50'
                  }`}
                >
                  Board View
                </button>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsSummaryOpen(true)}
                  className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-850 text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
                >
                  <FileText size={11} />
                  Trip Summary
                </button>
                
                <button
                  onClick={clearTrip}
                  className="text-[9px] uppercase tracking-wider font-bold text-stone-400 hover:text-stone-700 hover:bg-stone-50 px-2 py-1.5 border border-stone-250/20 rounded-lg transition-all duration-150"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Main Center Display Area (Leaflet Canvas vs Visual Column Board) */}
          <div className="flex-1 w-full h-full overflow-hidden">
            {centerView === 'map' ? (
              <LeafletMap />
            ) : (
              <div className="w-full h-full bg-stone-50 p-5 pt-20">
                <ItineraryBoard />
              </div>
            )}
          </div>
        </div>

        {/* 3. RIGHT PANEL (25% column ratio - span 3 of 12) */}
        <div className="col-span-3 h-full overflow-hidden flex flex-col bg-white">
          {/* Navigation tabs at top of Right sidebar */}
          <div className="px-5 pt-4 border-b border-stone-250/20 bg-stone-50/20">
            <Tabs
              tabs={rightTabs}
              activeTab={rightActiveTab}
              onChange={(id) => setRightActiveTab(id)}
              className="w-full"
            />
          </div>

          {/* Dynamic Tab Body Container */}
          <div className="flex-1 overflow-hidden min-h-0 bg-white">
            {!destination ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center text-stone-400">
                <Calendar size={28} className="text-stone-300 mb-2 stroke-[1.2]" />
                <p className="text-xs font-semibold text-stone-500">
                  Planning Engine Off
                </p>
                <p className="text-[10px] text-stone-400 max-w-[170px] mt-0.5 leading-relaxed">
                  Search and lock in a city in the explorer sidebar to fire up schedule planners.
                </p>
              </div>
            ) : rightActiveTab === 'schedule' ? (
              <ItineraryBuilder />
            ) : rightActiveTab === 'budget' ? (
              <div className="p-5 h-full overflow-y-auto">
                <BudgetCalculator />
              </div>
            ) : (
              <div className="p-5 h-full overflow-y-auto">
                <WeatherPanel />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ================= MOBILE LAYOUT (< 1024px) ================= */}
      <div className="flex lg:hidden flex-col h-full w-full overflow-hidden bg-stone-50 print:hidden">
        
        {/* Mobile Header */}
        <div className="px-4 py-3.5 bg-white border-b border-stone-200/50 flex justify-between items-center shadow-subtle z-[500]">
          <div className="flex items-center gap-1.5">
            <Compass size={16} className="text-stone-900" />
            <h1 className="text-xs uppercase tracking-wider font-extrabold text-stone-950 font-sans">
              Odyssey
            </h1>
            {destination && (
              <span className="text-[10px] font-bold text-stone-500 border-l border-stone-200 pl-2 max-w-[120px] truncate">
                {destination.name}
              </span>
            )}
          </div>
          
          {destination && (
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => setIsSummaryOpen(true)}
                className="flex items-center gap-1 bg-stone-900 text-stone-50 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
              >
                <FileText size={10} />
                Summary
              </button>
              <button
                onClick={clearTrip}
                className="text-[9px] text-stone-400 font-bold uppercase tracking-wider hover:bg-stone-50 px-2 py-1.5 border border-stone-250/20 rounded-lg"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Collapsible interactive map container */}
        {destination && (
          <div className="relative border-b border-stone-200/60 z-[300]" style={{ height: mobileMapExpanded ? '30vh' : '6vh' }}>
            <div className="w-full h-full">
              <LeafletMap />
            </div>
            
            {/* Toggle collapse */}
            <button
              onClick={() => setMobileMapExpanded(!mobileMapExpanded)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1 px-3 py-1 bg-white/95 border border-stone-200/70 text-stone-600 hover:text-stone-900 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-subtle backdrop-blur"
            >
              {mobileMapExpanded ? (
                <>
                  <ChevronUp size={10} />
                  Collapse Map
                </>
              ) : (
                <>
                  <ChevronDown size={10} />
                  Expand Map
                </>
              )}
            </button>
          </div>
        )}

        {/* Core content scroll sheet */}
        <div className="flex-1 overflow-hidden min-h-0 bg-white relative">
          {!destination ? (
            <SearchPanel />
          ) : (
            <div className="h-full flex flex-col">
              
              {/* Pill navigation tabs at top of mobile bottom sheet */}
              <div className="px-4 py-2 border-b border-stone-100 bg-stone-50/50">
                <Tabs
                  tabs={mobileTabs}
                  activeTab={mobileTab}
                  onChange={(id) => setMobileTab(id)}
                  variant="pill"
                  className="w-full"
                />
              </div>

              {/* Dynamic mobile view */}
              <div className="flex-1 overflow-y-auto">
                {mobileTab === 'explore' && <SearchPanel />}
                {mobileTab === 'schedule' && <ItineraryBuilder />}
                {mobileTab === 'budget' && (
                  <div className="p-4">
                    <BudgetCalculator />
                  </div>
                )}
                {mobileTab === 'weather' && (
                  <div className="p-4">
                    <WeatherPanel />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ================= DYNAMIC SUMMARY MODAL ================= */}
      <SummaryDashboard isOpen={isSummaryOpen} onClose={() => setIsSummaryOpen(false)} />

    </div>
  );
};
export default MainLayout;
