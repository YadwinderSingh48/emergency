// LocationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLocationPermissionAndWatch } from './LocationService';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  // Fetch location when the component mounts
  useEffect(() => {
    const cleanupWatcher = getLocationPermissionAndWatch(newLocation => {
      setLocation(newLocation);
    });

    return () => {
      cleanupWatcher();
    };
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
