import { Button, StyleSheet, Text, View, TouchableOpacity, Image, Alert , ActivityIndicator} from 'react-native'
import { React, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
const HomeScreen = ({ navigation, route }) => {
  
  // handle and store get data from contact picker screen
  const [contacts, setContacts] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    getContacts();
    if(route.params=='refresh'){
      getContacts();
      
    }
    }, [route.params]);
   // fetch new token
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

  // Get the contacts associated with account
      const getContacts = async () =>{
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
            
             const response = await fetch(apiUrl,{
                method:'POST',
                headers: headers,
                body: JSON.stringify({"accId":data})
              });
              if(response.ok){
                const getresponse = await response.text();
               // console.log(getresponse);
                setIsLoading(false);
                const formattedResponse = JSON.parse(getresponse);
               // console.log(formattedResponse);
                const fetchContacts = formattedResponse.map(contact=>{
                  return {
                    'Name':contact.Name,
                    'Phone':contact.Phone
                  }
                })
                setContacts(fetchContacts);
               // console.log(setContacts);
                
                
              }
              else if(response.status === 401){
                console.log('here')
                   const newToken = await fetchtoken();
                 //   console.log(newToken);
                    if(newToken !='' && newToken !=undefined && newToken != null){
                    return getContacts();
                    }
                    else{ Alert.alert('Unauthorized', 'Invalid Token'); setIsLoading(false); }
                } else{
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

  return (

    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FlatList data={contacts}
        renderItem={({ item, index }) => {
          return (

            <View style={[styles.list]}>
              <View style={styles.imageView}>
                <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
              </View>
              <View style={styles.contactInfo}>
                <Text>{item.Name}</Text>
                <Text>{item.Phone}</Text>
              </View>
              <View style={styles.checkBox}>
                {!item.isSelected && (
                  <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                )}
              </View>
            </View>



          )
        }}
      ></FlatList>
      {contacts.length == 0 ? (<Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18 }}>No Contact Selected</Text>) : ''}
      <View style={styles.bottomButtonContainer}>
        <Button title='Add Contacts' style={styles.btn} onPress={() => {
          navigation.navigate('Picker')
        }} />
      
      </View>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  )
}

export default HomeScreen;

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
    width: '100%',
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
});