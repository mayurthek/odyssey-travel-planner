import React from 'react';
import { Printer, Share2, Compass, Home, MapPin, DollarSign, Calendar } from 'lucide-react';
import { useTrip } from '../hooks/trip-context';
import { useToast } from './ui/toast';
import Modal from './ui/modal';

interface SummaryDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ isOpen, onClose }) => {
  const { destination, days, bookmarkedAttractions, budgetBreakdown, budgetSettings } = useTrip();
  const { toast } = useToast();

  if (!destination) return null;

  const handleCopyLink = () => {
    // Generate simulated shareable link incorporating coordinates and days
    const mockLink = `${window.location.origin}/trip?city=${encodeURIComponent(
      destination.name
    )}&lat=${destination.coordinates.lat}&lng=${destination.coordinates.lng}&days=${
      budgetSettings.durationDays
    }`;

    navigator.clipboard.writeText(mockLink);
    toast('Trip planning sharing link copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    // Print window triggers standard vector PDF conversion
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trip Summary Dashboard" size="max">
      {/* Container */}
      <div className="flex flex-col h-full font-sans select-none overflow-hidden print:p-0">
        
        {/* Top Control HUD Action Bar (hidden when printing) */}
        <div className="p-4 bg-stone-50 border-b border-stone-200/50 flex gap-2 justify-end print:hidden">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-4 border border-stone-200/80 bg-white hover:border-stone-300 text-stone-650 hover:text-stone-900 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 active:scale-95"
          >
            <Share2 size={13} />
            Copy Shareable Link
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
          >
            <Printer size={13} />
            Print / Save as PDF
          </button>
        </div>

        {/* Printable Document Leaflet Sheet */}
        <div className="p-8 bg-white overflow-y-auto max-h-[78vh] print:max-h-none print:overflow-visible space-y-8 print:p-0">
          
          {/* Header section */}
          <div className="border-b border-stone-200/80 pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Compass size={14} className="stroke-[1.8]" />
                Journey Itinerary
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight font-sans">
                Odyssey to {destination.name}
              </h2>
              <p className="text-[10px] text-stone-400 font-medium tracking-wide mt-1">
                Geocoding center: {destination.coordinates.lat.toFixed(4)}&deg;N, {destination.coordinates.lng.toFixed(4)}&deg;E &bull; {destination.country}
              </p>
            </div>

            <div className="flex gap-4 text-left border-t md:border-t-0 md:border-l border-stone-200/80 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-stone-450 block">Duration</span>
                <span className="text-sm font-bold text-stone-800 mt-0.5 block flex items-center gap-1">
                  <Calendar size={12} className="text-stone-400" />
                  {budgetSettings.durationDays} Days
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-stone-455 block">Estimated Budget</span>
                <span className="text-sm font-bold text-stone-900 mt-0.5 block flex items-center gap-0.5">
                  <DollarSign size={12} className="text-stone-400" />
                  ${budgetBreakdown.total}
                </span>
              </div>
            </div>
          </div>

          {/* Grid info overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Daily timelines (span 2 columns) */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-450 border-b border-stone-100 pb-2">
                Daily Schedules
              </h3>

              {days.map((day) => (
                <div key={`summary-day-${day.dayNumber}`} className="space-y-3.5">
                  <h4 className="text-[11px] font-bold text-stone-800 bg-stone-50 border border-stone-200/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                    Day {day.dayNumber} Plans
                  </h4>
                  
                  {day.activities.length === 0 ? (
                    <p className="text-[10px] text-stone-400 italic pl-4">No scheduled activities for this day.</p>
                  ) : (
                    <div className="pl-4 border-l border-stone-200/60 space-y-3">
                      {day.activities.map((act, idx) => (
                        <div key={`summary-act-${act.id}`} className="relative pl-3">
                          <div className="absolute -left-[19.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-stone-400 border border-white" />
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-stone-800">
                              {idx + 1}. {act.name}
                            </span>
                            <span className="text-[10px] text-stone-450 font-bold whitespace-nowrap bg-stone-100/70 border border-stone-200/30 px-1.5 py-0.2 rounded">
                              {act.timeOfDay} &bull; {act.duration}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                              {act.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right columns: Bookmarks & Budget details */}
            <div className="space-y-6">
              {/* Budget details */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-450 border-b border-stone-100 pb-2">
                  Expense Summary
                </h3>
                <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-4 space-y-3 text-[11px]">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="flex items-center gap-1.5"><Home size={12} className="text-stone-400" /> Accommodation</span>
                    <span className="font-bold text-stone-800">${budgetBreakdown.accommodation}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500 border-t border-stone-200/30 pt-2.5">
                    <span>Dining ({budgetSettings.foodPreference})</span>
                    <span className="font-bold text-stone-800">${budgetBreakdown.food}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500 border-t border-stone-200/30 pt-2.5">
                    <span>Transit ({budgetSettings.transportType})</span>
                    <span className="font-bold text-stone-800">${budgetBreakdown.transportation}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500 border-t border-stone-200/30 pt-2.5">
                    <span>Attractions entries</span>
                    <span className="font-bold text-stone-800">${budgetBreakdown.attractions}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-stone-800 font-bold border-t border-stone-200/80 pt-3 text-xs">
                    <span>Total Estimate</span>
                    <span className="text-stone-900">${budgetBreakdown.total}</span>
                  </div>
                  <div className="text-[9px] text-stone-400 text-center italic mt-1.5 block">
                    Calculated average: ${budgetBreakdown.dailyAverage} / day
                  </div>
                </div>
              </div>

              {/* Bookmarks */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-450 border-b border-stone-100 pb-2">
                  Saved Bookmarks
                </h3>
                {bookmarkedAttractions.length === 0 ? (
                  <p className="text-[10px] text-stone-450 italic">No bookmarked sights saved.</p>
                ) : (
                  <ul className="space-y-2 text-[11px] text-stone-500 pl-1">
                    {bookmarkedAttractions.map((attr) => (
                      <li key={`summary-book-${attr.id}`} className="flex items-center gap-2 border-b border-stone-100 pb-1.5 last:border-0">
                        <MapPin size={11} className="text-stone-400 flex-shrink-0" />
                        <span className="font-semibold text-stone-750 truncate">{attr.name}</span>
                        <span className="text-[9px] text-stone-400 bg-stone-50 border border-stone-200 px-1 py-0.2 rounded font-bold ml-auto flex-shrink-0">
                          {attr.category}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>

          {/* Footer branding */}
          <div className="border-t border-stone-200/60 pt-6 text-center text-stone-400 text-[10px] tracking-wide font-medium flex justify-between items-center">
            <span>Odyssey Travel Planner &copy; 2026</span>
            <span className="text-stone-300">Drafted on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

        </div>

      </div>
    </Modal>
  );
};
export default SummaryDashboard;
