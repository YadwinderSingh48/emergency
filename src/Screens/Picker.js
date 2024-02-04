import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Contacts from 'react-native-contacts';
import { useNavigation } from '@react-navigation/native'
import { request, PERMISSIONS } from 'react-native-permissions';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Picker = () => {
  const navigation = useNavigation();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // get contact permission
  useEffect(() => {
    requestContactsPermission();
  }, [])

  const requestContactsPermission = async () => {
    try {
      // Request permission for both Android and iOS
      const androidStatus = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      const iosStatus = await request(PERMISSIONS.IOS.CONTACTS);

      if (androidStatus === 'granted' || iosStatus === 'granted') {
        //console.log('Contacts permission granted');
        // Now you can fetch and display contacts
        fetchContacts();
      } else {
        console.log('Contacts permission denied');
        Alert.alert('Permission Required', 'Please allow contacts to continue');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
    }
  };
  // fetch contacts
  const fetchContacts = () => {
    setIsLoading(true)
    Contacts.getAll()
      .then((allContacts) => {
        const contactsWithSelection = allContacts.map(item => ({ ...item, isSelected: false }));

        setContacts(contactsWithSelection);
        setIsLoading(false);
       // console.log(contacts);
      })
      .catch((error) => {console.error('Error fetching contacts:', error)
          setIsLoading(false);
          Alert.alert('Permission Error', 'Error fetching contacts, check your permissions in settings or try again');
        });
    
  };
  // function for handle click on the list
  const handleClick = (getNumber) => {
    const updatedContacts = contacts.map(contact =>
      contact.phoneNumbers[0]?.number === getNumber ? { ...contact, isSelected: !contact.isSelected } : contact
    );

    setContacts(updatedContacts);
    const tickContacts = updatedContacts.filter((c => c.isSelected));
    setSelectedContacts(tickContacts);
    //console.log(tickContacts.length);
  }

  // change title of screen
  useEffect(() => {
    navigation.setOptions({
      title: `(${selectedContacts.length}) Selected`,
    });
  }, [selectedContacts]);
  
  // Get new access token on Expiration
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
  // Create selected contacts
    const createContacts = async () =>{
      if(selectedContacts !=''){
        setIsLoading(true);
        const accId = await AsyncStorage.getItem('AccountId');
        const cons = selectedContacts.map(contact=>{
              return ({
                "attributes": { "type":"Contact"},
                "LastName": contact.displayName,
                "phone": contact.phoneNumbers[0]?.number,
                "accountId": JSON.parse(accId)
              })
    })  
          const formattedData = JSON.stringify({"listobj":cons});
        console.log(formattedData);
       // POST api 
       try {
        //get the saved token 
        const authToken = await AsyncStorage.getItem('TOKEN');
        const apiUrl = 'https://react-dev-ed.develop.my.salesforce.com/services/apexrest/Contactt'
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        };
        const data = formattedData;
         const response = await fetch(apiUrl,{
            method:'POST',
            headers: headers,
            body: data
          });
          if(response.ok){
            const getresponse = await response.text();
            console.log(getresponse);
            setIsLoading(false);
          Alert.alert('Success','Contacts Created Successfully!');
          navigation.navigate('HomeScreen','refresh');
          }
          else if(response.status === 401){
            console.log('here')
               const newToken = await fetchtoken();
                console.log(newToken);
                if(newToken !='' && newToken !=undefined && newToken != null){
                return createContacts();
                }
                else{ Alert.alert('Unauthorized', 'Invalid Token'); setIsLoading(false); }
            } else{
              Alert.alert('Error', 'Something Went Wrong. Please try later...');
              setIsLoading(false);
            }
  
      }
      catch (error) {
        console.log(error)
          Alert.alert('Catch Error', 'Something Went Wrong. Check Your Details and try again');
          setIsLoading(false);
      }
      
      } else{Alert.alert("Invalid Selection","Please select contacts to continue") } 
    }



  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FlatList data={contacts}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => handleClick(item.phoneNumbers[0]?.number)}>
              <View style={[styles.list, item.isSelected && styles.selected]}>
                <View style={styles.imageView}>
                  <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
                </View>
                <View style={styles.contactInfo}>
                  <Text>{item.displayName}</Text>
                  <Text>{item.phoneNumbers[0]?.number}</Text>
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
      <View style={styles.bottomButtonContainer}>
        <Button title='Done' style={styles.btn} onPress={() => { createContacts(); }} />
       
        {/* <Button title='Done' style={styles.btn} onPress={() => { navigation.navigate('HomeScreen', { selectedContacts }); }} /> */}
      </View>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  )
}


export default Picker;

const styles = StyleSheet.create({
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
  tick: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
    marginVertical: 10
  },
  bottomButtonContainer: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,

  },
  btn: {
    width: '100%', // Use 100% to fill the container
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