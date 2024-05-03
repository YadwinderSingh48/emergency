import { Button, StyleSheet, Text, View, TouchableOpacity, Image, Alert , ActivityIndicator} from 'react-native'
import { React, memo, useEffect, useState, useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { request, PERMISSIONS } from 'react-native-permissions';
import  Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ref, set, onValue } from "firebase/database";
import { db } from './firebaseconfig';


const Contacts = () => {
  const navigation = useNavigation()
    const [contacts, setContacts] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
let count = 1
  useEffect(() => {
    if(count == 1){
      getContacts();
    }
count++ ;
   // getLiveStatusDb();
  }, [])
  
 

  const getLiveStatusDb = (getCons) =>{
   // console.log(getCons)
        const starCountRef = ref(db, 'user');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(data["001F900001jKWhuIAG"].Status);
            if(data !=null && data !=undefined && data !=''){
            
              //console.log(getCons)
              const updatedContacts = getCons.map((c) =>{
                  if(c.Account !=null && c.Account !=undefined && c.Account != ''){
                    const idData = data[c.Account] ;
                    if(idData !=null && idData !=undefined && idData){
                      //console.log(idData.Status);
                      return (
                        { ...c, Status: idData.Status }
                      )
                    }
                    else {
                      return c ;
                    }
                  }
                  else{
                    return c ;
                  }
                }
              );
               setContacts(updatedContacts);
             // return updatedContacts;
            }
    })
  }
  
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
  const getContacts = useCallback( async () =>{
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
        
         const response = await fetch(apiUrl,{
            method:'POST',
            headers: headers,
            body: JSON.stringify({"accId":data})
          });
         // console.log(await response.text());
          if(response.ok){
            const getresponse = await response.text();
           // console.log(getresponse);
            setIsLoading(false);
            const formattedResponse = JSON.parse(getresponse);
           // console.log(formattedResponse);
            var fetchContacts = formattedResponse.map(contact=>{
              return {
                'Name':contact.Name,
                'Phone':contact.Phone,
                'Status':contact?.Description,
                'Account':contact?.Title,
                'AccountId':contact?.AccountId
              }
            })

            // sort the contacts
            const sortedContacts = fetchContacts.slice().sort((a, b) => {
              const nameA = a.Name.toUpperCase(); // Ignore case during comparison
              const nameB = b.Name.toUpperCase();
              // check if status grey put them at last
              if (a.Status === 'GREY' && b.Status !== 'GREY') {
                return 1;
              }
              if (a.Status !== 'GREY' && b.Status === 'GREY') {
                return -1;
              }
              // put other status items as alphabatical order
              if (nameA < nameB) {
                return -1; // a should come before b in the sorted order
              }
              if (nameA > nameB) {
                return 1; // a should come after b in the sorted order
              }
              return 0; // a and b are equal in terms of sorting
            });
            setContacts(sortedContacts);
           //console.log(fetchContacts);
            setTimeout(()=>{
              getLiveStatusDb(sortedContacts);
            },4000);
            
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

  },[]);
// navigate to the detail contact screen
const NavigateToContact= (name,phone,status,account,accountId)=>{
    let contactData = {
      Name:name,
      Phone:phone,
      Status:status,
      Account:account,
      AccountId:accountId
    }
    navigation.navigate('ContactDetails',{contactData})
}

  return (
    <View style={styles.mainContainer}>
        <View style={styles.headers}>
      <Text style={styles.heading}>My Contacts</Text>
      <TouchableOpacity style={{marginRight:5}} onPress={()=>{getContacts()}}>
      <MaterialIcons name="refresh" size={35} color={'black'} />
      </TouchableOpacity>
      <TouchableOpacity  onPress={()=>{navigation.navigate('Picker')}}>
      <MaterialIcons name="add" size={35} color={'black'}  />
      </TouchableOpacity>
        </View>
        <FlatList data={contacts} nestedScrollEnabled={true} style={{flexGrow:1}}
        renderItem={({ item, index }) => {
          return (

            <TouchableOpacity style={[styles.list]} onPress={()=>{NavigateToContact(item.Name,item.Phone,item.Status,item.Account,item.AccountId)}} >
              <View style={styles.imageView}>
                <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
              </View>
              <View style={styles.contactInfo}>
                <Text>{item.Name}</Text>
                <Text>{item.Phone}</Text>
              </View>
              <View style={styles.checkBox}>
                {/* {!item.isSelected && (
                  <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                )} */}
                <View style={[styles.tick, {borderRadius:15, backgroundColor:(item?.Status).toLowerCase()}]}></View>
              </View>
            </TouchableOpacity>
        )
        }}
      ></FlatList>
      {contacts.length == 0 ? (<Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18 }}>No Contact Selected</Text>) : (<Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18 }}>No More Contacts</Text>)}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  )
}

export default memo(Contacts)

const styles = StyleSheet.create({
  mainContainer:{
    borderWidth:1,
    marginHorizontal:10,
    marginVertical:5,
    borderRadius:10,
    height:'100%'
  },
  headers:{
      flexDirection:'row',
      alignItems:'center',
      paddingVertical:5,
      paddingHorizontal:10,
      justifyContent:'flex-end',
      borderBottomWidth:0.5
  },
  heading:{
    fontSize:25,
    fontWeight:'bold',
    color:'black',
    width:'80%'
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

  tick: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius:15
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
  selectedColor:{
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }
})