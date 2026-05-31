import React, { useState } from 'react';
import { Trash2, Plus, Calendar, Clock, Edit3, ArrowUp, ArrowDown } from 'lucide-react';
import { useTrip } from '../hooks/trip-context';
import { useToast } from './ui/toast';
import { Activity } from '../types';

export const ItineraryBuilder: React.FC = () => {
  const {
    days,
    activeDay,
    setActiveDay,
    setDurationDays,
    removeActivityFromDay,
    reorderActivities,
    moveActivityBetweenDays,
    addCustomActivity,
  } = useTrip();

  const { toast } = useToast();
  
  // Custom Activity Inputs
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<Activity['category']>('Leisure');
  const [isAdding, setIsAdding] = useState(false);

  // Active day's activities
  const activeDayObj = days.find(d => d.dayNumber === activeDay);
  const activeActivities = activeDayObj?.activities || [];

  // HTML5 Drag and Drop handlers
  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);
  const [draggedFromDay, setDraggedFromDay] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, activityId: string, dayNum: number) => {
    setDraggedActivityId(activityId);
    setDraggedFromDay(dayNum);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add custom styled dragging class to target
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-ghost');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-ghost');
    setDraggedActivityId(null);
    setDraggedFromDay(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDropOnDayTab = (e: React.DragEvent, targetDayNum: number) => {
    e.preventDefault();
    if (draggedActivityId && draggedFromDay && draggedFromDay !== targetDayNum) {
      // Move to the end of target day
      const targetDayObj = days.find(d => d.dayNumber === targetDayNum);
      const targetIndex = targetDayObj ? targetDayObj.activities.length : 0;
      
      moveActivityBetweenDays(draggedFromDay, targetDayNum, draggedActivityId, targetIndex);
      toast(`Activity moved to Day ${targetDayNum}!`, 'success');
    }
    setDragOverIndex(null);
  };

  const handleDropOnActivity = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedActivityId && draggedFromDay) {
      if (draggedFromDay === activeDay) {
        // Reordering within the same day
        const sourceIndex = activeActivities.findIndex(act => act.id === draggedActivityId);
        if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
          reorderActivities(activeDay, sourceIndex, targetIndex);
        }
      } else {
        // Moving from another day to a specific index on active day
        moveActivityBetweenDays(draggedFromDay, activeDay, draggedActivityId, targetIndex);
        toast(`Activity shifted from Day ${draggedFromDay} to Day ${activeDay}!`, 'success');
      }
    }
    setDragOverIndex(null);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addCustomActivity(activeDay, customName.trim(), customCategory);
    toast(`Custom activity "${customName}" added to Day ${activeDay}.`, 'success');
    setCustomName('');
    setIsAdding(false);
  };

  // Adjust duration controls
  const handleIncreaseDays = () => {
    if (days.length < 10) {
      setDurationDays(days.length + 1);
      toast(`Trip duration extended to ${days.length + 1} days.`, 'info');
    }
  };

  const handleDecreaseDays = () => {
    if (days.length > 1) {
      setDurationDays(days.length - 1);
      toast(`Trip duration shortened to ${days.length - 1} days.`, 'info');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-stone-200/60 font-sans select-none overflow-hidden">
      {/* 1. Header controls */}
      <div className="px-5 py-4 border-b border-stone-200/50 flex justify-between items-center bg-stone-50/50">
        <div className="flex items-center gap-1.5">
          <Calendar size={15} className="text-stone-500" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-stone-500">
            Trip Builder
          </h2>
        </div>

        {/* Days count adjuster */}
        <div className="flex items-center gap-1 border border-stone-200/80 rounded-lg p-0.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <button
            onClick={handleDecreaseDays}
            disabled={days.length <= 1}
            className="w-5 h-5 flex items-center justify-center rounded text-stone-500 hover:text-stone-800 disabled:opacity-30 hover:bg-stone-50"
            title="Remove day"
          >
            &minus;
          </button>
          <span className="text-[10px] font-bold text-stone-700 px-1 select-none">
            {days.length}d
          </span>
          <button
            onClick={handleIncreaseDays}
            disabled={days.length >= 10}
            className="w-5 h-5 flex items-center justify-center rounded text-stone-500 hover:text-stone-800 disabled:opacity-30 hover:bg-stone-50"
            title="Add day"
          >
            +
          </button>
        </div>
      </div>

      {/* 2. Days selector tabs (supports drop moves!) */}
      <div className="px-5 py-3 border-b border-stone-200/30 bg-white overflow-x-auto flex gap-1 scrollbar-none">
        {days.map((day) => {
          const isActive = day.dayNumber === activeDay;
          return (
            <button
              key={`day-tab-${day.dayNumber}`}
              onClick={() => setActiveDay(day.dayNumber)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnDayTab(e, day.dayNumber)}
              className={`flex-shrink-0 text-[10px] font-bold px-3 py-2 rounded-lg border transition-all duration-200 ${
                isActive
                  ? 'bg-stone-900 border-stone-900 text-stone-50 shadow-sm'
                  : 'bg-stone-50 border-stone-200/60 hover:border-stone-300 text-stone-500 hover:text-stone-800 hover:bg-stone-100/50'
              }`}
            >
              Day {day.dayNumber}
            </button>
          );
        })}
      </div>

      {/* 3. Timeline Schedule Body */}
      <div className="flex-1 overflow-y-auto px-5 py-6 relative">
        {activeActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-stone-400">
            <Clock size={24} className="text-stone-300 mb-2 stroke-[1.2]" />
            <p className="text-[10px] font-semibold text-stone-500">
              No plans scheduled for Day {activeDay}
            </p>
            <p className="text-[9px] text-stone-400 max-w-[180px] leading-relaxed mt-0.5">
              Click "+ Add to Itinerary" on attractions, or tap the button below to add custom notes.
            </p>
          </div>
        ) : (
          <div className="relative pl-4 border-l border-stone-200/80 space-y-5">
            {activeActivities.map((act, index) => (
              <div
                key={act.id}
                draggable
                onDragStart={(e) => handleDragStart(e, act.id, activeDay)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDropOnActivity(e, index)}
                className={`relative group bg-white border border-stone-200/65 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] transition-all duration-200 hover:border-stone-300 cursor-grab active:cursor-grabbing ${
                  dragOverIndex === index ? 'border-t-2 border-t-stone-900 pt-5' : ''
                }`}
              >
                {/* Timeline node dot */}
                <div className="absolute -left-[20.5px] top-4 w-2 h-2 rounded-full border border-white bg-stone-900 shadow-sm" />

                {/* Card layout header */}
                <div className="flex items-start gap-1.5 justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="flex items-center justify-center bg-stone-100 text-stone-650 text-[9px] font-bold w-4 h-4 rounded-full flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-[10px] text-stone-400 font-bold flex items-center gap-1 flex-shrink-0">
                      <Clock size={10} />
                      {act.timeOfDay}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-stone-400 bg-stone-50 border border-stone-150 px-1 py-0.2 rounded flex-shrink-0">
                      {act.category}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      removeActivityFromDay(activeDay, act.id);
                      toast(`Removed "${act.name}" from itinerary.`, 'info');
                    }}
                    className="text-stone-400 hover:text-rose-600 p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
                    title="Delete activity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Name */}
                <h4 className="text-xs font-bold text-stone-850 block mt-2 pr-4 leading-snug line-clamp-1">
                  {act.name}
                </h4>

                {/* Reorder Utility buttons for accessibility/mobile (where drag and drop is hard) */}
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100">
                  <span className="text-[9px] text-stone-400 italic font-medium flex-1">
                    {act.duration || '1 hour'}
                  </span>
                  
                  {/* Shifts */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => index > 0 && reorderActivities(activeDay, index, index - 1)}
                      disabled={index === 0}
                      className="w-4 h-4 flex items-center justify-center rounded text-stone-400 hover:text-stone-850 hover:bg-stone-50 disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      onClick={() => index < activeActivities.length - 1 && reorderActivities(activeDay, index, index + 1)}
                      disabled={index === activeActivities.length - 1}
                      className="w-4 h-4 flex items-center justify-center rounded text-stone-400 hover:text-stone-850 hover:bg-stone-50 disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Timeline footer custom entry form */}
      <div className="p-4 border-t border-stone-200/50 bg-stone-50/50">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold py-2.5 bg-white border border-stone-200/80 hover:border-stone-300 text-stone-600 hover:text-stone-850 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200"
          >
            <Plus size={13} />
            Add Custom Activity
          </button>
        ) : (
          <form onSubmit={handleAddCustom} className="bg-white border border-stone-200 rounded-xl p-3 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400">
                New Custom Activity
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-[9px] text-stone-400 hover:text-stone-600 font-bold"
              >
                Cancel
              </button>
            </div>
            
            <input
              type="text"
              placeholder="e.g. Lunch at Cafe, Hotel Check-in"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200/80 rounded-lg focus:outline-none focus:border-stone-400 text-stone-800"
              autoFocus
            />
            
            <div className="flex gap-2">
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as any)}
                className="flex-1 text-[10px] p-2 bg-stone-50 border border-stone-200/80 rounded-lg focus:outline-none focus:border-stone-400 text-stone-650 font-medium"
              >
                <option value="Leisure">Leisure / Free Time</option>
                <option value="Culinary">Dining / Culinary</option>
                <option value="History">Historic Sight</option>
                <option value="Nature">Nature / Outdoors</option>
                <option value="Travel">Transit / Travel</option>
                <option value="Rest">Rest / Sleep</option>
              </select>

              <button
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-0.5"
              >
                <Plus size={11} />
                Add
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ItineraryBuilder;
