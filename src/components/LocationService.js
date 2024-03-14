// LocationService.js
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';

export const getLocationPermissionAndWatch = (setLocationCallback) => {
  const startWatchingLocation = () => {
    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        //console.log('Location updated:', { latitude, longitude });
        setLocationCallback({ latitude, longitude });
      },
      error => console.log('Error getting location:', error),
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 100, distanceFilter: 1, useSignificantChanges: false,
      showsBackgroundLocationIndicator: true // Show location indicator on iOS 
    }
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  };

  const requestLocationPermission = async () => {
    try {
      const androidStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      const iosStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (androidStatus === 'granted' || iosStatus === 'granted') {
        console.log('Location permission accessed');
        return startWatchingLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return requestLocationPermission();
};
