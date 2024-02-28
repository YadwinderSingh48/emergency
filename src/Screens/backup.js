import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ref, set, onValue  } from "firebase/database";
import {db} from '../components/firebaseconfig';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';


const Tracker = () => {

  //  const [conLocation,setConLocation] = useState({clatitude:0, clongitude:0})
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        const requestLocationPermission = async () => {
          try {
            // Request permission for both Android and iOS
            const androidStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            const iosStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      
            if (androidStatus === 'granted' || iosStatus === 'granted') {
                console.log('Location permission accessed');
             getCurrentLocation();
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    
    // Get Current Location
    const getCurrentLocation = () => {
        const watchId = Geolocation.watchPosition(
            position => {
                console.log(position); 
                const { latitude, longitude } = position.coords;
                console.log('fnc called succesfully')
                setLocation({ latitude, longitude });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 1000, maximumAge: 100, distanceFilter: 1 }
          );
      
          return () => {
            Geolocation.clearWatch(watchId);
          };
        };
          // Request location permission when the component mounts
          requestLocationPermission();
      }, [])
    
    const region = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

//     useEffect(() => {
//         const starCountRef = ref(db, 'users/"001F900001il3yTIAQ"/');
//     onValue(starCountRef, (snapshot) => {
//       const data = snapshot.val();
//    console.log(data)
//    if(data !='' && data != null && data != undefined){
//     const latt = data.latitude;
//     const long = data.longitude;
//         setConLocation({latt,long})
//    }
//     });
    
//     }, [])
    
  
  return (
    <View style={styles.container}>
        <Text> latitude: {location.latitude}</Text>
        <Text> longitude : {location.longitude}</Text>
        {/* <Text> conlatitude : {conLocation.clatitude}</Text> */}
        {/* <Text> conlongitude : {conLocation.clongitude}</Text> */}

   
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
        width: '100%',
        height: '100%',
      },
})