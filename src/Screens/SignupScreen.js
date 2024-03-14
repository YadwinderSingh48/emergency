import { Alert, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { React, useState } from 'react'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import GetToken from '../components/GetToken'

const SignupScreen = () => {

  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [badDetails, setBadDetails] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  //validation
  const validation = () => {
    if (name != '' && email != '' && phone != '' && password != '' && confirmPassword != '') {
      if (password === confirmPassword) {
        setBadDetails(false);
        saveData();
          
      } else {
        setBadDetails(true);
        Snackbar.show({
          text: `Passwords didn't match`,
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
    } else {
      setBadDetails(true);
      Snackbar.show({
        text: 'Please Enter All Details',
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

  // Save Data
  const saveData = async () => {
    setIsLoading(true);
    try {
      //get the saved token 
      const authToken = await AsyncStorage.getItem('TOKEN');
      const apiUrl = 'https://react-dev-ed.develop.my.salesforce.com/services/apexrest/Account'
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      };
      const data = {
          "name": name,
          "phone": phone,
          "email": email,
          "password" : password
        }
       const response = await fetch(apiUrl,{
          method:'POST',
          headers: headers,
          body: JSON.stringify(data)
        });
        if(response.ok){
          const getresponse = await response.text();
          console.log(getresponse);
        if(getresponse !=null && getresponse != '' && getresponse != undefined){
        await AsyncStorage.setItem('NAME', name);
        await AsyncStorage.setItem('EMAIL', email);
        await AsyncStorage.setItem('PHONE', phone);
        await AsyncStorage.setItem('PASSWORD', password);
        await AsyncStorage.setItem('AccountId', getresponse);
        setIsLoading(false);
        Alert.alert('Success','Account Created Successfully! Please login to continue');
        navigation.goBack();
        } else{
          Alert.alert('Email Error', 'Either Email or Phone is used by another Acoount. Pleasy try with a different Phone or Email')
          setIsLoading(false);
        }
      }
        else if(response.status === 401){
          console.log('here')
             const newToken = await fetchtoken();
             // console.log(newToken);
              if(newToken !='' && newToken !=undefined && newToken != null){
              return saveData();
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
  }
  return (
    <View style={styles.container}>

      <Text style={styles.loginText}>SignUp Here</Text>

      <CustomTextInput placeholder={'Name'} icon={require('../assets/icons/name.png')} value={name} onChangeText={txt => { setName(txt) }}></CustomTextInput>
      <CustomTextInput placeholder={'Email'} icon={require('../assets/icons/mail.png')} keyboardType={'email-address'} value={email} onChangeText={txt => { setEmail(txt) }} ></CustomTextInput>
      <CustomTextInput placeholder={'Phone'} icon={require('../assets/icons/phone.png')} keyboardType={'number-pad'} value={phone} onChangeText={txt => { setPhone(txt) }}></CustomTextInput>
      <CustomTextInput placeholder={'Password'} icon={require('../assets/icons/key.png')} type={'password'} value={password} onChangeText={txt => { setPassword(txt) }} ></CustomTextInput>
      <CustomTextInput placeholder={'Confirm Password'} icon={require('../assets/icons/key.png')} type={'password'} value={confirmPassword} onChangeText={txt => { setConfirmPassword(txt) }}></CustomTextInput>
      <CustomButton title={'SignUp'} bgColor={'black'} textColor={'white'} onPress={() => { validation() }} ></CustomButton>
      <Text style={styles.signUp} onPress={() => { navigation.goBack() }}> already have account?</Text>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  )
}

export default SignupScreen

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