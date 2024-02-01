import { Alert, StyleSheet, Text, View } from 'react-native'
import { React, useState } from 'react'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [badDetails, setBadDetails] = useState(true);
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
    try {
     
        await AsyncStorage.setItem('NAME', name);
        await AsyncStorage.setItem('EMAIL', email);
        await AsyncStorage.setItem('PHONE', phone);
        await AsyncStorage.setItem('PASSWORD', password);
        Alert.alert('Success','Account Created Successfully! Please login to continue');
        navigation.goBack();
    
    }
    catch (error) {
        Alert.alert('Error', 'Something Went Wrong');
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
  }
})