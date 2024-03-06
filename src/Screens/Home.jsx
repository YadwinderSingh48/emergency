import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, Button, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialIcons from 'react-native-vector-icons/FontAwesome';
import Contacts from '../components/Contacts';
import Recents from '../components/Recents';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { useLocation } from '../components/LocationContext';
import { ref, set } from "firebase/database";
import {db} from '../components/firebaseconfig';
import GetToken from '../components/GetToken';


const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState('GREEN');
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sharingIds, setSharingIds] = useState([]);
  const {location} = useLocation();
  const [accName, setAccName] = useState('')

   // live location send
   useEffect(() => {
    
    if(status === 'RED' && sharingIds.length>0){
      sharingIds.forEach(id => {
        console.log(id);
        postData(true,location.latitude,location.longitude,id);
        
      });
    }
    else{
      sharingIds.forEach(id => {
        postData(false,null,null,id);
      });
        
    }
  }, [sharingIds, location])
  const tokn = async ()=>{
    var token = await GetToken()
    console.log(token);
  }
  useEffect(() => {
//tokn();
    accDetails();
  }, [])
  

  // send data to firebase database
  const postData = async(sharing,lat,long,id)=>{
    const accId = await AsyncStorage.getItem('AccountId')
    // const accId = 123456;
     set(ref(db,accId +'/'+ id), {
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
// get name 
const accDetails = async()=>{
  const accessToken = await AsyncStorage.getItem('TOKEN') ; // Replace with your Salesforce access token
  const instanceUrl = 'https://react-dev-ed.develop.my.salesforce.com'; // Replace with your Salesforce instance URL
  const accId = await AsyncStorage.getItem('AccountId');
  const accountId = JSON.parse(accId);
  const url = `${instanceUrl}/services/data/v60.0/sobjects/Account/${accountId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
   // console.log(accountData)
    if (response.ok) {
      const accountData = await response.json();
      const accountName = accountData.Name;
      console.log('Account Name:', accountName);
      setAccName(accountName);
      return accountName;
    } else {
      console.error('Error fetching account data:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
  //render modal 
  const renderModel = () => {
    return (
      <Modal visible={modalVisible} transparent={true} animationType='slide'>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, width: '100%', height: '95%', position: 'absolute', bottom: 0 }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { setModalVisible(false) }}>
              <Ionicons name='close-outline' size={40} color={'black'} ></Ionicons>
            </TouchableOpacity>
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }} >
                <TouchableOpacity onPress={() => { setStatus('RED') }}>
                  <View style={[styles.colours, { backgroundColor: 'red' }]}>
                    {status === 'RED' && (<View style={styles.selectedColor}>
                      <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                    </View>)}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setStatus('GREEN') }}>
                  <View style={[styles.colours, { backgroundColor: 'green' }]}>
                    {status === 'GREEN' && (<View style={styles.selectedColor}>
                      <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                    </View>)}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setStatus('BLUE') }}>
                  <View style={[styles.colours, { backgroundColor: 'blue' }]}>
                    {status === 'BLUE' && (<View style={styles.selectedColor}>
                      <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                    </View>)}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setStatus('ORANGE') }}>
                  <View style={[styles.colours, { backgroundColor: 'orange' }]}>
                    {status === 'ORANGE' && (<View style={styles.selectedColor}>
                      <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                    </View>)}
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <FlatList style={{ marginTop: 20, borderTopWidth: 0.5 }} data={contacts}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity onPress={() => handleClick(item?.Phone)}>
                        <View style={[styles.list, item.isSelected && styles.selected]}>
                          <View style={styles.imageView}>
                            <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
                          </View>
                          <View style={styles.contactInfo}>
                            <Text>{item.Name}</Text>
                            <Text>{item?.Phone}</Text>
                          </View>
                          <View style={styles.checkBox}>
                            {item.isSelected && (
                              <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>

                    )
                  }}
                ></FlatList>
              </View>
            </View>
            <Button title='Done' style={{ margin: 10, padding: 10 }} onPress={() => { handleSharing() }} ></Button>
          </View>
          {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
        </View>
      </Modal>)
  }
  // Get the contacts associated with account
  const getContacts = async () => {
    setIsLoading(true);
    const accountId = await AsyncStorage.getItem('AccountId');
    try {
      //get the saved token 
      const authToken = await AsyncStorage.getItem('TOKEN');
      const apiUrl = 'https://react-dev-ed.develop.my.salesforce.com/services/apexrest/GetContact'
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };
      const data = JSON.parse(accountId);
      // console.log(authToken)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ "accId": data })
      });

      // console.log(await response.text());
      if (response.ok) {
        const getresponse = await response.text();
        // console.log(getresponse);
        setIsLoading(false);
        const formattedResponse = JSON.parse(getresponse);
        // console.log(formattedResponse);
        const fetchContacts = formattedResponse.map(contact => {
          return {
            'Name': contact.Name,
            'Phone': contact.Phone,
            'isSelected': false
          }
        })
        setContacts(fetchContacts);
        // console.log(setContacts);
        setModalVisible(true);

      }
      else if (response.status === 401) {
        console.log('here')
        const newToken = await fetchtoken();
        //   console.log(newToken);
        if (newToken != '' && newToken != undefined && newToken != null) {
          return getContacts();
        }
        else { Alert.alert('Unauthorized', 'Invalid Token'); setIsLoading(false); }
      } else {
        Alert.alert('Error', 'Something Went Wrong. Please try later...');
        setIsLoading(false);
      }

    }
    catch (error) {
      console.log(error)
      Alert.alert('Catch Error', 'Something Went Wrong. please try later');
      setIsLoading(false);
    }

  }

  // Handle Selecteion and Unselection of contacts
  const handleClick = (getNumber) => {
    const updatedContacts = contacts.map(contact =>
      contact?.Phone === getNumber ? { ...contact, isSelected: !contact.isSelected } : contact
    );

    setContacts(updatedContacts);
    const tickContacts = updatedContacts.filter((c => c.isSelected));
    setSelectedContacts(tickContacts);
    console.log(tickContacts.length);
  }

  //handle the sharing functionality
  const handleSharing = async () => {
    if (selectedContacts.length > 0) {
      let selections = [];
      selectedContacts.map(contact=>{ selections.push(contact.Phone)})
      console.log(selections);
      setIsLoading(true);
      if (status != '' && status != null && status != undefined) {
        try {
          const authToken = await AsyncStorage.getItem('TOKEN');
          const accountId = await AsyncStorage.getItem('AccountId');
          const apiUrl = `https://react-dev-ed.develop.my.salesforce.com/services/apexrest/status`
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          };
          const accId = JSON.parse(accountId);
          console.log(accId);
          
          const data = {
            "status": status,
            "contacts":selections,
            "accId":accId
          }
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
          });
          // const getresponse = await response.text();
          // console.log(getresponse);
          if (response.ok) {
            const getresponse = await response.text();
            console.log(getresponse);
            setIsLoading(false);
           // Alert.alert('Success', 'Location Sent Succesfully');
            if (getresponse != null && getresponse != '' && getresponse != undefined) {
              setIsLoading(false);
              setModalVisible(false);
              setSharingIds(JSON.parse(getresponse));
              Alert.alert('Success','Status Updated Successfully.');
            }
            else {
              Alert.alert('Error', 'No Account Records found for your contacts');
              setIsLoading(false);
              setModalVisible(false);
            }
          }
          else if (response.status === 401) {
            console.log('here')
            const newToken = await fetchtoken();
            // console.log(newToken);
            if (newToken != '' && newToken != undefined && newToken != null) {
              return handleSharing();
            }
            else { Alert.alert('Unauthorized', 'Invalid Token'); setIsLoading(false); setModalVisible(false); }
          } else {
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
    } else {
      setIsLoading(false);
      Alert.alert('Error', 'Please Select Atleast one Contact');

    }
  }
  // let color = status.toLowerCase();
  return (
    <View style={{ height: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
        <MaterialIcons name="user" size={25} color={'black'} />
        <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold', marginTop: 5, marginLeft: 5 }}>Profile</Text>
      </View>

      <View style={styles.container}>
        <View style={{}}>
          <Image source={require('../assets/icons/profile.png')} style={styles.profileIcon} />
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Hello {accName} !</Text>
        </View>
        <View style={styles.donutContainer}>
          <View style={[styles.circle, { borderColor: status.toLowerCase() }]}>
            <TouchableOpacity style={styles.status} onPress={() => getContacts()}>
              <Text style={[styles.heading, { color: status.toLowerCase() }]}>
                {status}
              </Text>
              <Text style={styles.subheading}>
                Tap to change
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20, height: '40%' }} >
        <Contacts />
      </View>
      <View style={{ marginTop: 20, height: '40%' }} >
        <Recents />
      </View>
      {renderModel()}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  )
}
export default Home


const styles = StyleSheet.create({
  profileIcon: {
    width: 120,
    height: 120,
    margin: 10
  },
  container: {
    display: 'flex',
    borderWidth: 0.1,
    elevation: 2,
    flexDirection: 'row',
    paddingHorizontal: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    // borderRadius:10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 12,
  },
  heading: {
    fontSize: 19,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  circle: {
    textAlign: 'center',
    height: 150,
    width: 150,
    borderWidth: 20,
    borderRadius: 75,
    marginRight: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',


  },
  donutContainer: {
  },
  subheading: {
    fontSize: 15,
    fontWeight: '500'
  },
  status: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  colours: {
    width: 70,
    height: 70,
    borderRadius: 35,

  },
  selectedColor: {

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',

    borderRadius: 35
  },
  tick: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
    marginVertical: 10
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // alignSelf:'center',
    width: '100%',
    backgroundColor: '#fbfcfb',

  },
  img: {
    height: 50,
    width: 50,
    marginHorizontal: 10,
    marginVertical: 10
  },
  contactInfo: {
    flex: 1, marginLeft: 10
  },
  checkBox: {
    marginRight: 30
  },
  imageView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selected: {
    backgroundColor: '#89CFF0'
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
