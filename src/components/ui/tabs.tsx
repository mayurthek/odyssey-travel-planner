import React from 'react';

export interface TabItem {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string | number;
  onChange: (id: any) => void;
  className?: string;
  variant?: 'line' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'line'
}) => {
  if (variant === 'pill') {
    return (
      <div className={`flex p-1 bg-stone-100/80 rounded-lg border border-stone-200/30 gap-0.5 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center justify-center flex-1 gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 select-none ${
                isActive
                  ? 'bg-white text-stone-900 border border-stone-200/50 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
              }`}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex border-b border-stone-200/60 gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 -mb-[1.5px] transition-all duration-200 select-none outline-none ${
              isActive
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-600 hover:border-stone-200'
            }`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
export default Tabs;
