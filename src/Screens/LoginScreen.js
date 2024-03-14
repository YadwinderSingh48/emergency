import { Alert, StyleSheet, Text, View , ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {GetToken} from '../components/GetToken'
const LoginScreen = () => {
 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badDetails, setBadDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
  const validation = () => {
    if (email != '' && password != '') {
      setBadDetails(false);
      login();
    } else {
      setBadDetails(true);
      Snackbar.show({
        text: 'Enter Correct Details',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'black', // Custom background color
        action: {
          text: 'OK',
          textColor: 'red',
          onPress: () => {
            Snackbar.dismiss();
          },
        },
      });

    }
  }

   // get new access token when it expires
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

  // login 
  const login = async () => {
    setIsLoading(true);
    try {
      //get the saved token 
      const authToken = await AsyncStorage.getItem('TOKEN');
      const apiUrl = 'https://react-dev-ed.develop.my.salesforce.com/services/apexrest/login'
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      };
      const data = {
          "email": email,
          "password" : password
        }
       const response = await fetch(apiUrl,{
          method:'POST',
          headers: headers,
          body: JSON.stringify(data)
        });
       // const getresponse = await response.text();
        console.log(response);
        if(response.ok){
          const getresponse = await response.text();
          if(getresponse!='' &&getresponse!=null && getresponse != undefined){
            await AsyncStorage.setItem('isLoggedIn', 'true');

            // needs to change and this are copied from signupscreen
            
            await AsyncStorage.setItem('EMAIL', email);
          
            await AsyncStorage.setItem('PASSWORD', password);
            await AsyncStorage.setItem('AccountId', getresponse);
            //******************************************** */
            setIsLoading(false);
            navigation.replace('Home')
          } else{
            Alert.alert('Invaid Credentials', 'Check your email and password and try again...');
            setIsLoading(false);
          }
          
        }
        else if(response.status === 401){
          console.log('here')
             const newToken = await fetchtoken();
             // console.log(newToken);
              if(newToken !='' && newToken !=undefined && newToken != null){
              return login();
              }
              else{ Alert.alert('Unauthorized', 'Invalid Token'); setIsLoading(false); }
          } else{
            Alert.alert('Error', 'Something Went Wrong. Check Your Details and try again');
            setIsLoading(false);
          }

    }
    catch (error) {
      console.log(error)
        Alert.alert('Catch Error', 'Something Went Wrong. Check Your Details and try again');
        setIsLoading(false);
    }
    // try {
    //   if (!badDetails) {
    //     const getEmail = await AsyncStorage.getItem('EMAIL');
    //     const getPassword = await AsyncStorage.getItem('PASSWORD');
    //     if (email === getEmail && password === getPassword) {
    //       await AsyncStorage.setItem('isLoggedIn', 'true');
    //       navigation.replace('HomeScreen')
    //     } else {
    //       Alert.alert('Invalid Credentials', 'Email or Password is incorrect, Please try again');
    //     }
    //   } else {
    //     Alert.alert('Missing Credentials', 'Please fill all the details');
    //   }



    // } catch (error) {
    //   Alert.alert('Error !', 'Something went wrong, Please try again later');
    // }

  }
  // const test = async ()=>{ console.log(await AsyncStorage.getItem('TOKEN'))}
  return (
    <View style={styles.container}>

      <Text style={styles.loginText}>Login Here</Text>

      <CustomTextInput placeholder={'Email'} icon={require('../assets/icons/mail.png')} value={email} onChangeText={txt => { setEmail(txt) }} keyboardType={'email-address'} ></CustomTextInput>
      <CustomTextInput placeholder={'Password'} icon={require('../assets/icons/key.png')} type={'password'} value={password} onChangeText={txt => { setPassword(txt) }}></CustomTextInput>
      <CustomButton title={'Login'} bgColor={'black'} textColor={'white'} onPress={() => { validation() }} ></CustomButton>
      {/* <CustomButton title={'Just test'} bgColor={'black'} textColor={'white'} onPress={() => {GetToken()}} ></CustomButton> */}
      <Text style={styles.signUp} onPress={() => { navigation.navigate('SignupScreen') }}> create new account?</Text>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // width:'100%'
  },
  loginText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  signUp: {
    fontSize: 18,
    fontWeight: '600',
    // color:'black',
    marginTop: 40,
    textDecorationLine: 'underline'
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