import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, MapPin, Compass, Image } from 'lucide-react';
import { useTrip } from '../hooks/trip-context';
import { useToast } from './ui/toast';
import { Activity } from '../types';

export const ItineraryBoard: React.FC = () => {
  const {
    days,
    removeActivityFromDay,
    reorderActivities,
    moveActivityBetweenDays,
    addCustomActivity,
    setActiveDay,
  } = useTrip();

  const { toast } = useToast();
  
  // Drag states
  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);
  const [draggedFromDay, setDraggedFromDay] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<{ day: number; index: number } | null>(null);

  // Custom inline addition states
  const [addingToDay, setAddingToDay] = useState<number | null>(null);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<Activity['category']>('Leisure');

  const handleDragStart = (e: React.DragEvent, activityId: string, dayNum: number) => {
    setDraggedActivityId(activityId);
    setDraggedFromDay(dayNum);
    e.dataTransfer.effectAllowed = 'move';
    
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-ghost');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-ghost');
    setDraggedActivityId(null);
    setDraggedFromDay(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, dayNum: number) => {
    e.preventDefault();
    setDragOverColumn(dayNum);
  };

  const handleDragOverCard = (e: React.DragEvent, dayNum: number, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex({ day: dayNum, index });
    setDragOverColumn(dayNum);
  };

  const handleDropOnColumn = (e: React.DragEvent, targetDayNum: number) => {
    e.preventDefault();
    
    if (draggedActivityId && draggedFromDay) {
      const targetDayObj = days.find(d => d.dayNumber === targetDayNum);
      const targetIndex = targetDayObj ? targetDayObj.activities.length : 0;
      
      if (draggedFromDay !== targetDayNum) {
        moveActivityBetweenDays(draggedFromDay, targetDayNum, draggedActivityId, targetIndex);
        toast(`Activity moved to Day ${targetDayNum}!`, 'success');
      }
    }
    
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleDropOnCard = (e: React.DragEvent, targetDayNum: number, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedActivityId && draggedFromDay) {
      if (draggedFromDay === targetDayNum) {
        // Reorder within the same day
        const dayObj = days.find(d => d.dayNumber === targetDayNum);
        const sourceIndex = dayObj?.activities.findIndex(act => act.id === draggedActivityId) ?? -1;
        if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
          reorderActivities(targetDayNum, sourceIndex, targetIndex);
        }
      } else {
        // Move from another day to a specific index
        moveActivityBetweenDays(draggedFromDay, targetDayNum, draggedActivityId, targetIndex);
        toast(`Activity moved to Day ${targetDayNum} at spot ${targetIndex + 1}!`, 'success');
      }
    }
    
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleAddCustom = (e: React.FormEvent, dayNum: number) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addCustomActivity(dayNum, customName.trim(), customCategory);
    toast(`Added "${customName}" to Day ${dayNum} Board.`, 'success');
    setCustomName('');
    setAddingToDay(null);
  };

  return (
    <div className="flex gap-5 h-full w-full overflow-x-auto pb-4 pt-1 font-sans select-none items-start scrollbar-thin">
      {days.map((day) => {
        const isColumnHovered = dragOverColumn === day.dayNumber;
        const activities = day.activities;

        return (
          <div
            key={`board-day-${day.dayNumber}`}
            onDragOver={(e) => handleDragOverColumn(e, day.dayNumber)}
            onDrop={(e) => handleDropOnColumn(e, day.dayNumber)}
            className={`flex-shrink-0 w-80 bg-stone-100/70 border rounded-2xl flex flex-col max-h-full overflow-hidden transition-all duration-200 ${
              isColumnHovered 
                ? 'border-stone-400 bg-stone-100 shadow-[0_2px_12px_rgba(28,25,23,0.03)]' 
                : 'border-stone-200/50'
            }`}
          >
            {/* Column Header */}
            <div 
              onClick={() => setActiveDay(day.dayNumber)}
              className="p-4 border-b border-stone-200/40 flex justify-between items-center bg-white/40 cursor-pointer hover:bg-white/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-stone-500" />
                <h3 className="text-xs font-bold text-stone-850">
                  Day {day.dayNumber}
                </h3>
              </div>
              <span className="text-[9px] font-bold text-stone-400 bg-stone-200/50 px-2 py-0.5 rounded-full">
                {activities.length} planned
              </span>
            </div>

            {/* Column Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[150px]">
              {activities.length === 0 ? (
                <div className="py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center p-4">
                  <Clock size={16} className="text-stone-300 mb-1.5 stroke-[1.2]" />
                  <p className="text-[10px] font-medium text-stone-400">Empty Day</p>
                  <p className="text-[9px] text-stone-400 mt-0.5 leading-normal max-w-[150px]">
                    Drag activities here or click below.
                  </p>
                </div>
              ) : (
                activities.map((act, index) => {
                  const isCardHovered = dragOverIndex?.day === day.dayNumber && dragOverIndex?.index === index;
                  return (
                    <div
                      key={act.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, act.id, day.dayNumber)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOverCard(e, day.dayNumber, index)}
                      onDrop={(e) => handleDropOnCard(e, day.dayNumber, index)}
                      className={`relative bg-white border border-stone-200/60 hover:border-stone-350 rounded-xl p-3 shadow-subtle hover:shadow-[0_4px_12px_rgba(28,25,23,0.03)] cursor-grab active:cursor-grabbing group transition-all duration-200 flex gap-3 ${
                        isCardHovered ? 'border-t-2 border-t-stone-900 pt-4' : ''
                      }`}
                    >
                      {/* Left Thumbnail (if available) */}
                      {act.image ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                          <img 
                            src={act.image} 
                            alt={act.name} 
                            className="w-full h-full object-cover"
                            loading="lazy" 
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-stone-50 border border-stone-150 flex items-center justify-center flex-shrink-0 text-stone-400">
                          <Image size={15} className="stroke-[1.2]" />
                        </div>
                      )}

                      {/* Right Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Header row */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] text-stone-400 font-bold flex items-center gap-0.5">
                              <Clock size={8} />
                              {act.timeOfDay}
                            </span>
                            
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-stone-400 bg-stone-50 border border-stone-150 px-1 rounded">
                              {act.category}
                            </span>
                          </div>

                          {/* Activity title */}
                          <h4 className="text-[11px] font-bold text-stone-850 block mt-1 line-clamp-1 leading-snug">
                            {act.name}
                          </h4>
                        </div>

                        {/* Card footer details */}
                        <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-stone-100/50">
                          <span className="text-[9px] text-stone-400 italic">
                            {act.duration || '1 hour'}
                          </span>
                          
                          <button
                            onClick={() => {
                              removeActivityFromDay(day.dayNumber, act.id);
                              toast(`Removed "${act.name}" from itinerary.`, 'info');
                            }}
                            className="text-stone-400 hover:text-rose-600 p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
                            title="Delete activity"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Column Footer Addition */}
            <div className="p-3 border-t border-stone-200/30 bg-white/40">
              {addingToDay !== day.dayNumber ? (
                <button
                  onClick={() => {
                    setAddingToDay(day.dayNumber);
                    setCustomName('');
                  }}
                  className="flex items-center justify-center gap-1 w-full text-[10px] py-2 bg-white border border-stone-250/30 hover:border-stone-300 text-stone-500 hover:text-stone-800 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-150"
                >
                  <Plus size={11} />
                  Add Plan
                </button>
              ) : (
                <form onSubmit={(e) => handleAddCustom(e, day.dayNumber)} className="bg-white border border-stone-200 rounded-xl p-2.5 space-y-2 shadow-sm animate-slide-in">
                  <input
                    type="text"
                    placeholder="e.g. Visit local cafe, Museum checkout"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-[10px] p-1.5 bg-stone-50 border border-stone-200/80 rounded-lg focus:outline-none focus:border-stone-400 text-stone-800"
                    autoFocus
                  />
                  
                  <div className="flex gap-1.5">
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as any)}
                      className="flex-1 text-[9px] p-1.5 bg-stone-50 border border-stone-200/80 rounded-lg focus:outline-none focus:border-stone-400 text-stone-600 font-medium"
                    >
                      <option value="Leisure">Leisure / Free</option>
                      <option value="Culinary">Dining</option>
                      <option value="History">History</option>
                      <option value="Nature">Nature</option>
                      <option value="Travel">Transit</option>
                      <option value="Rest">Rest</option>
                    </select>

                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-stone-800 text-white text-[9px] font-semibold px-2.5 py-1 rounded-lg active:scale-95 transition-all duration-150"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingToDay(null)}
                      className="text-[9px] text-stone-400 hover:text-stone-600 px-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ItineraryBoard;
