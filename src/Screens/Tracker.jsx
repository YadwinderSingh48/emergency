import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ref, set, onValue } from "firebase/database";
import { db } from '../components/firebaseconfig';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { getLocationPermissionAndWatch } from '../components/LocationService';
import { useLocation } from '../components/LocationContext';
import MapViewDirections from 'react-native-maps-directions';

const Tracker = () => {

  const [conLat, setConLat] = useState(0);
  const [conLong, setConLong] = useState(0);
  //  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const { location } = useLocation();

  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    const starCountRef = ref(db, 'users/"001F900001il3yTIAQ"/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      if (data != '' && data != null && data != undefined) {
        const latt = data.latitude;
        const long = data.longitude;
        setConLat(latt);
        setConLong(long);

      }
      console.log(data);
    });
  }, [])


  return (
    <View style={styles.container}>
      <Text> latitude: {location?.latitude}</Text>
      <Text> longitude : {location?.longitude}</Text>
      <Text> conlatitude : {conLat}</Text>
      <Text> conlongitude : {conLong}</Text>

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
        >
          {/* <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Current Location"
            description="This is where I am"
          /> */}
          <Marker
            coordinate={{ latitude: conLat, longitude: conLong }}
            title="Current Location"
            description="This is where I contact"
          />
          <Polyline
            coordinates={[
              { latitude: location.latitude, longitude: location.longitude },
              { latitude: 30.929463, longitude: 74.612839 }
            ]}
            strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
            geodesic={false}
          />
          {/* <MapViewDirections
               origin={{ latitude: location.latitude, longitude: location.longitude }}
               destination={{ latitude: 30.929463, longitude: 74.612839 }}
                apikey={'AIzaSyBCniUNc5X63vxNDe8RKIdef_5uWPquUk0'}
                 /> */}
        </MapView>
      )}

    </View>
  )
}

export default Tracker

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})

