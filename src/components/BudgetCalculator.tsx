import React from 'react';
import { DollarSign, Home, Utensils, Car, Compass } from 'lucide-react';
import { useTrip } from '../hooks/trip-context';
import Slider from './ui/slider';
import { FoodPreference, TransportType } from '../types';

export const BudgetCalculator: React.FC = () => {
  const { budgetSettings, budgetBreakdown, updateBudgetSettings } = useTrip();

  const foodToggles: { id: FoodPreference; label: string; desc: string }[] = [
    { id: 'Street Food', label: 'Street', desc: '~$25/day' },
    { id: 'Casual Dining', label: 'Casual', desc: '~$55/day' },
    { id: 'Fine Dining', label: 'Premium', desc: '~$130/day' },
    { id: 'Mixed', label: 'Mixed', desc: '~$65/day' },
  ];

  const transportToggles: { id: TransportType; label: string; desc: string }[] = [
    { id: 'Walking', label: 'Walking', desc: '$0/day' },
    { id: 'Public Transit', label: 'Transit', desc: '~$12/day' },
    { id: 'Car Rental', label: 'Rental', desc: '~$65/day' },
    { id: 'Taxi/Rideshare', label: 'Ride', desc: '~$40/day' },
  ];

  // Percentages for bar chart segment visualization
  const getPercentage = (value: number) => {
    if (budgetBreakdown.total === 0) return 0;
    return Math.round((value / budgetBreakdown.total) * 100);
  };

  const pct = {
    accommodation: getPercentage(budgetBreakdown.accommodation),
    food: getPercentage(budgetBreakdown.food),
    transportation: getPercentage(budgetBreakdown.transportation),
    attractions: getPercentage(budgetBreakdown.attractions),
  };

  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-subtle font-sans select-none flex flex-col gap-5">
      {/* 1. Header */}
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        <DollarSign size={16} className="text-stone-500" />
        <h3 className="text-xs uppercase font-bold tracking-wider text-stone-500">
          Estimated Budget
        </h3>
      </div>

      {/* 2. Controls Grid */}
      <div className="space-y-4">
        {/* Accommodation night slider */}
        <Slider
          min={30}
          max={600}
          step={10}
          value={budgetSettings.accommodationCostPerNight}
          onChange={(val) => updateBudgetSettings({ accommodationCostPerNight: val })}
          label="Accommodation Cost per Night"
          suffix=" $/night"
        />

        {/* Food preference picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
            Dining Plan
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {foodToggles.map((item) => {
              const isSelected = budgetSettings.foodPreference === item.id;
              return (
                <button
                  key={`food-${item.id}`}
                  onClick={() => updateBudgetSettings({ foodPreference: item.id })}
                  className={`flex flex-col text-left px-3 py-2 border rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-stone-50 shadow-sm'
                      : 'bg-stone-50 border-stone-200/60 hover:border-stone-300 text-stone-500 hover:text-stone-850 hover:bg-stone-100/50'
                  }`}
                >
                  <span className="text-[11px] font-semibold">{item.label}</span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transportation Picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
            Transportation Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {transportToggles.map((item) => {
              const isSelected = budgetSettings.transportType === item.id;
              return (
                <button
                  key={`trans-${item.id}`}
                  onClick={() => updateBudgetSettings({ transportType: item.id })}
                  className={`flex flex-col text-left px-3 py-2 border rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-stone-50 shadow-sm'
                      : 'bg-stone-50 border-stone-200/60 hover:border-stone-300 text-stone-500 hover:text-stone-850 hover:bg-stone-100/50'
                  }`}
                >
                  <span className="text-[11px] font-semibold">{item.label}</span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Extra buffer slider */}
        <Slider
          min={0}
          max={500}
          step={20}
          value={budgetSettings.customAttractionsCost}
          onChange={(val) => updateBudgetSettings({ customAttractionsCost: val })}
          label="Buffer Shopping/Activity Cost"
          suffix=" $"
        />
      </div>

      {/* 3. Bar segment chart visualization */}
      <div className="mt-2 pt-4 border-t border-stone-100 space-y-4">
        {/* Stacked segment timeline bar */}
        <div className="flex h-2.5 rounded-full overflow-hidden w-full bg-stone-100 select-none">
          {budgetBreakdown.accommodation > 0 && (
            <div 
              style={{ width: `${pct.accommodation}%` }} 
              className="bg-stone-900 transition-all duration-300"
              title={`Accommodation: $${budgetBreakdown.accommodation} (${pct.accommodation}%)`}
            />
          )}
          {budgetBreakdown.food > 0 && (
            <div 
              style={{ width: `${pct.food}%` }} 
              className="bg-[#8C8275] transition-all duration-300" // SandDark accent
              title={`Food: $${budgetBreakdown.food} (${pct.food}%)`}
            />
          )}
          {budgetBreakdown.transportation > 0 && (
            <div 
              style={{ width: `${pct.transportation}%` }} 
              className="bg-[#1B2A4A] transition-all duration-300" // Navy accent
              title={`Transportation: $${budgetBreakdown.transportation} (${pct.transportation}%)`}
            />
          )}
          {budgetBreakdown.attractions > 0 && (
            <div 
              style={{ width: `${pct.attractions}%` }} 
              className="bg-[#2D4A3E] transition-all duration-300" // Forest accent
              title={`Attractions: $${budgetBreakdown.attractions} (${pct.attractions}%)`}
            />
          )}
        </div>

        {/* Breakdown details */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[10px] text-stone-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-900" />
            <Home size={11} className="text-stone-400" />
            <span className="truncate flex-1">Stay</span>
            <span className="font-bold text-stone-800">${budgetBreakdown.accommodation}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8C8275]" />
            <Utensils size={11} className="text-stone-400" />
            <span className="truncate flex-1">Dining</span>
            <span className="font-bold text-stone-800">${budgetBreakdown.food}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1B2A4A]" />
            <Car size={11} className="text-stone-400" />
            <span className="truncate flex-1">Transit</span>
            <span className="font-bold text-stone-800">${budgetBreakdown.transportation}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2D4A3E]" />
            <Compass size={11} className="text-stone-400" />
            <span className="truncate flex-1">Sights</span>
            <span className="font-bold text-stone-800">${budgetBreakdown.attractions}</span>
          </div>
        </div>

        {/* Total Cost Board */}
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/50 flex justify-between items-center mt-1">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block">
              Estimated Total
            </span>
            <span className="text-lg font-bold text-stone-900 font-sans mt-0.5 block">
              ${budgetBreakdown.total}
            </span>
          </div>

          <div className="text-right border-l border-stone-200/80 pl-4">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block">
              Daily Average
            </span>
            <span className="text-xs font-bold text-stone-750 block mt-0.5">
              ${budgetBreakdown.dailyAverage} / day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BudgetCalculator;
