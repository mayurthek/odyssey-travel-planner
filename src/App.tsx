import React from 'react';
import { TripProvider } from './hooks/trip-context';
import { ToastProvider } from './components/ui/toast';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <ToastProvider>
      <TripProvider>
        <MainLayout />
      </TripProvider>
    </ToastProvider>
  );
}

export default App;
