import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  suffix?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  suffix = '',
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || suffix) && (
        <div className="flex justify-between items-center text-xs text-stone-500 font-medium select-none">
          {label && <span>{label}</span>}
          <span className="font-semibold text-stone-800">{value}{suffix}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-900 focus:outline-none transition-all duration-200 focus:ring-1 focus:ring-stone-400"
        style={{
          background: `linear-gradient(to right, #1C1917 0%, #1C1917 ${((value - min) / (max - min)) * 100}%, #E7E5E4 ${((value - min) / (max - min)) * 100}%, #E7E5E4 100%)`
        }}
      />
    </div>
  );
};
export default Slider;
