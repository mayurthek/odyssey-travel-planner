import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'max';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  // Keypress and scroll locks
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    max: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Glassmorphic Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Dialog Body */}
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-white border border-stone-200/80 rounded-xl shadow-premium overflow-hidden z-10 transition-all duration-300 flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header container */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200/50 bg-stone-50/50">
          {title ? (
            <h3 className="text-xs tracking-wider uppercase font-semibold text-stone-500 font-sans">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 hover:bg-stone-100 p-1.5 rounded-lg transition-all duration-150 outline-none"
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>
        
        {/* Scrollable contents */}
        <div className="overflow-y-auto flex-1 font-sans">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
