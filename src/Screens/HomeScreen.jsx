import { StyleSheet, Text, View, Pressable, Modal, TouchableOpacity, ActivityIndicator, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, set } from "firebase/database";
import {db} from '../components/firebaseconfig';
import { getLocationPermissionAndWatch } from '../components/LocationService';
import { useLocation } from '../components/LocationContext';

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [prior,setPrior]= useState('');
  const [link,setLink]=useState('');
  //const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [isLive, setisLive] = useState(false);
  
  const {location} = useLocation();
  
  // modal function 
  const renderModel = () => {
    return (
      <Modal visible={modalVisible} transparent={true} animationType='slide'>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, width: '100%', height: '90%', position: 'absolute', bottom: 0 }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { setModalVisible(false) }}>
              <Ionicons name='close-outline' size={40} color={'black'} ></Ionicons>
            </TouchableOpacity>
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <WebView
          source={{ html: `<iframe src="https://maps.google.com/maps?q=${location.latitude}, ${location.longitude}&z=20&output=embed" width="100%" height="100%" frameborder="0" style="border:0"></iframe>` }}

        />
      </View>
      <Button title='Share Location' style={{margin:10,padding:10}} onPress={()=>{sendEmail(prior,link)}} ></Button>
          </View>
          
        </View>
      </Modal>)
  }

  // current location send
  const currentLocation = (priority)=>{
    setModalVisible(true);
    const mapLink = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
    setLink(mapLink);
    setPrior(priority);
  }

  // live location send
  useEffect(() => {
    if(isLive){
    postData(true,location.latitude,location.longitude);
    }
    else{
      postData(false,null,null);
    }
  }, [isLive, location])

  const liveLocation = ()=>{
      if(isLive){
       console.log('live')
      }
  }
  // send data to firebase database
  const postData = async(sharing,lat,long)=>{
    const accId = await AsyncStorage.getItem('AccountId')
    // const accId = 123456;
     set(ref(db, 'users/' + accId), {
       sharing: sharing,
       latitude: lat,
       longitude: long,
    
     })
     .then(()=>{
     console.log('data updated...')
     })
     .catch((error) =>{
       console.log(error);
     });
   }
// stop sharing live location
const stopSharing = () =>{
  setisLive(false);
  postData(false,null,null);
}
  // Send Email.......................
    const sendEmail = async(priority,link)=>{
      try{
      const authToken = await AsyncStorage.getItem('TOKEN');
      const accountId = await AsyncStorage.getItem('AccountId');
      const apiUrl = 'https://react-dev-ed.develop.my.salesforce.com/services/apexrest/location'
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      };
      const accId = JSON.parse(accountId);
      const data = {
          "priority": priority,
          "accId": accId,
          "link": link
        }
       const response = await fetch(apiUrl,{
          method:'POST',
          headers: headers,
          body: JSON.stringify(data)
        });
        // const getresponse = await response.text();
        // console.log(getresponse);
        if(response.ok){
          const getresponse = await response.text();
          console.log(getresponse);
        if(getresponse !=null && getresponse != '' && getresponse != undefined){
       
        setIsLoading(false);
        setModalVisible(false);
        Alert.alert('Success','Location Sent Succesfully');
        } else{
          Alert.alert('Error', 'Error Occured')
          setIsLoading(false);
          setModalVisible(false);
        }
      }
        else if(response.status === 401){
          console.log('here')
             const newToken = await fetchtoken();
             // console.log(newToken);
              if(newToken !='' && newToken !=undefined && newToken != null){
              return sendEmail();
              }
              else{ Alert.alert('Unauthorized', 'Invalid Token'); setIsLoading(false); setModalVisible(false); }
          } else{
            Alert.alert('Error', 'Something Went Wrong. Check Your Details and try again');
            setIsLoading(false);
            setModalVisible(false);
          }

    }
    catch (error) {
      console.log(error)
        Alert.alert('Catch Error', 'Something Went Wrong. Check Your Details and try again');
        setIsLoading(false);
    }
    }
// fetch token
const fetchtoken = async ()=>{
  try {
    const authUrl = `https://login.salesforce.com/services/oauth2/token?`;
    const clientId = '3MVG9Kr5_mB04D14D.hLl3Q0oFhcPx_bIxRBctJfZhezQkjGcX4yIPdZB4r9GI_ePGxFtIAnNBHhJKTJ_7lNR';
    const clientSecret = 'AD0520E2EBFE1C8E1133666836BAF74D699A55A62E772FEAB7C1121672CFBAF5';

    const authData = {
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: 'reactnativeproject@newapp.com',
        password: 'ReactApp@21MPHIQQiMSqoz1UmLwrSeT1q69',
    };
    const formData = Object.keys(authData)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(authData[key]))
    .join('&');

    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });
    const responseData = await response.json();
    if (response.ok) {
        const accessToken = responseData.access_token;
       console.log(response);
       console.log(accessToken);
       console.log(responseData);
        await AsyncStorage.setItem('TOKEN', accessToken);
        return accessToken;
    } else {
        console.error('Error creating Salesforce account:', responseData);
        await AsyncStorage.setItem('TOKEN', '');
        Alert.alert('An error occurred. Please try again later.');
       return '';
    }
}
catch (error) {
    console.error('Error creating Salesforce account:', error);
    await AsyncStorage.setItem('TOKEN', '');
    Alert.alert('An error occurred. Please try again later.');
    return '';
}
}
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
      <View style={styles.container}>

        <View>
          <TouchableOpacity style={styles.circle} onPress={() => { setisLive(true); liveLocation() }}></TouchableOpacity>
          <TouchableOpacity style={[styles.circle, { backgroundColor: 'orange' }]} onPress={() => { currentLocation('Yellow') }} ></TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={[styles.circle, { backgroundColor: 'blue' }]} onPress={() => { currentLocation('blue') }} ></TouchableOpacity>
          <TouchableOpacity style={[styles.circle, { backgroundColor: 'green' }]} onPress={() => { currentLocation('green') }} ></TouchableOpacity>
        </View>


      </View>
        <View>
          <Text>Live Location sharing started {location?.latitude} {location?.longitude}</Text>
          <Button title='Stop Sharing' onPress={()=>{stopSharing();}}></Button>
        </View>
      {modalVisible && (renderModel())}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
     
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
    borderRadius: 90,
    margin: 20
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})