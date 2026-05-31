import React from 'react';
import { CloudSun, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, ShieldAlert, CloudFog } from 'lucide-react';
import { useTrip } from '../hooks/trip-context';
import { useWeather, getWeatherCondition } from '../hooks/use-weather';

export const WeatherPanel: React.FC = () => {
  const { destination } = useTrip();
  const { weather, loading, error } = useWeather(destination ? destination.coordinates : null);

  // Return desaturated thin line icons depending on WMO codes
  const getWeatherIcon = (code: number, size = 18) => {
    if (code === 0) return <Sun size={size} className="text-stone-700 stroke-[1.5]" />;
    if (code >= 1 && code <= 3) return <CloudSun size={size} className="text-stone-600 stroke-[1.5]" />;
    if (code === 45 || code === 48) return <CloudFog size={size} className="text-stone-500 stroke-[1.5]" />;
    if (code >= 51 && code <= 55) return <CloudRain size={size} className="text-stone-500 stroke-[1.5]" />;
    if (code >= 61 && code <= 65) return <CloudRain size={size} className="text-stone-600 stroke-[1.5]" />;
    if (code >= 71 && code <= 75) return <CloudSnow size={size} className="text-stone-400 stroke-[1.5]" />;
    if (code >= 80 && code <= 82) return <CloudRain size={size} className="text-stone-600 stroke-[1.5]" />;
    if (code >= 95 && code <= 99) return <CloudLightning size={size} className="text-stone-700 stroke-[1.5]" />;
    return <Cloud size={size} className="text-stone-500 stroke-[1.5]" />;
  };

  if (!destination) return null;

  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-subtle font-sans select-none flex flex-col gap-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <CloudSun size={16} className="text-stone-500" />
          <h3 className="text-xs uppercase font-bold tracking-wider text-stone-500">
            Weather Forecast
          </h3>
        </div>
        <span className="text-[9px] uppercase font-bold text-stone-400">
          Live &bull; {destination.name}
        </span>
      </div>

      {/* 2. Body States */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2.5 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-stone-100" />
          <div className="h-3 bg-stone-100 rounded w-1/4" />
          <div className="h-2 bg-stone-100 rounded w-1/3" />
        </div>
      ) : error ? (
        <div className="py-6 text-center text-xs text-rose-500 font-medium flex items-center justify-center gap-1.5 bg-rose-50/50 border border-rose-100 rounded-xl">
          <ShieldAlert size={14} />
          {error}
        </div>
      ) : weather ? (
        <div className="space-y-4">
          {/* Main temperature block */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.conditionCode, 32)}
              <div>
                <span className="text-2xl font-bold text-stone-900 block tracking-tighter">
                  {weather.currentTemp}&deg;C
                </span>
                <span className="text-[10px] text-stone-450 font-bold tracking-wide uppercase mt-0.5 block">
                  {weather.condition}
                </span>
              </div>
            </div>
            
            {/* dynamic subtitle statement */}
            <div className="text-right">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">
                Air Quality
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold mt-1 block">
                {weather.airQuality}
              </span>
            </div>
          </div>

          {/* Mini attributes grids */}
          <div className="grid grid-cols-2 gap-2 border-t border-b border-stone-100 py-3.5">
            <div className="flex items-center gap-2 text-[10px] text-stone-500">
              <Droplets size={13} className="text-stone-400" />
              <span>Humidity</span>
              <span className="font-bold text-stone-800 ml-auto">{weather.humidity}%</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-stone-500 border-l border-stone-100 pl-3">
              <Wind size={13} className="text-stone-400" />
              <span>Wind Speed</span>
              <span className="font-bold text-stone-800 ml-auto">{weather.windSpeed} km/h</span>
            </div>
          </div>

          {/* 5 day horizontal forecast list */}
          <div className="space-y-2.5">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              5-Day Outlook
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {weather.forecast.map((day, idx) => (
                <div
                  key={`fore-${idx}`}
                  className="bg-stone-50 border border-stone-200/50 rounded-xl p-2.5 flex flex-col items-center text-center flex-1 min-w-[70px] select-none"
                >
                  <span className="text-[9px] font-bold text-stone-400 uppercase block mb-1">
                    {day.date.split(',')[0]}
                  </span>
                  
                  <span className="my-1.5">{getWeatherIcon(day.conditionCode, 15)}</span>
                  
                  <span className="text-[10px] font-bold text-stone-800 mt-1">
                    {day.tempMax}&deg; <span className="text-stone-400 font-normal">{day.tempMin}&deg;</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-stone-400 italic">
          No forecast indices populated.
        </div>
      )}
    </div>
  );
};
export default WeatherPanel;
