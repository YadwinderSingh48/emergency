import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [badDetails,setBadDetails] = useState('');
    const navigation = useNavigation();
  const validation=()=>{
    if(email!=''&&password!=''){
        setBadDetails(false);
        login();
} else{
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
  // login 
  const login = async ()=>{
        try {
            if(!badDetails){
            const getEmail = await AsyncStorage.getItem('EMAIL');
            const getPassword = await AsyncStorage.getItem('PASSWORD');
            if(email === getEmail && password === getPassword){
                await AsyncStorage.setItem('isLoggedIn', 'true');
                navigation.replace('HomeScreen')
            }else{
                Alert.alert('Invalid Credentials', 'Email or Password is incorrect, Please try again');
            }
        } else{
            Alert.alert('Missing Credentials', 'Please fill all the details');
        }

            
        } catch (error) {
            Alert.alert('Error !', 'Something went wrong, Please try again later');
        }
            
  }
  return (
    <View style={styles.container}>
     
            <Text style={styles.loginText}>Login Here</Text>

          <CustomTextInput placeholder={'Email'} icon={require('../assets/icons/mail.png')} value={email} onChangeText={txt=>{setEmail(txt)}} keyboardType={'email-address'} ></CustomTextInput>
          <CustomTextInput placeholder={'Password'} icon={require('../assets/icons/key.png')} type={'password'} value={password} onChangeText={txt=>{setPassword(txt)}}></CustomTextInput>
            <CustomButton title={'Login'} bgColor={'black'} textColor={'white'} onPress={()=>{validation()}} ></CustomButton>
            <Text style={styles.signUp} onPress={()=>{navigation.navigate('SignupScreen')}}> create new account?</Text>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
       // width:'100%'
    },
    loginText:{
        fontSize:25,
        fontWeight:'bold',
        marginBottom:10
    },
    signUp:{
        fontSize:18,
        fontWeight:'600',
       // color:'black',
        marginTop:40,
        textDecorationLine:'underline'
    }
})