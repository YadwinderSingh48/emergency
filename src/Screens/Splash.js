import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Splash = () => {
    const navigation = useNavigation();
    useEffect(() => {
    setTimeout(()=>{
        //navigation.navigate('LoginScreen')
        session();
    },3000)
    }, [])
    const session = async ()=>{
      const getEmail = await AsyncStorage.getItem('EMAIL');
      const getPassword = await AsyncStorage.getItem('PASSWORD');
      const getLogin = await AsyncStorage.getItem('isLoggedIn');
      if(getLogin==='true' && getLogin!=null && getLogin != '' && getLogin != undefined){
        if(getEmail!=null && getEmail != '' && getEmail != undefined){
          if(getPassword!=null && getPassword != '' && getPassword != undefined){
            navigation.replace('HomeScreen');
          }
          else{
            navigation.replace('LoginScreen');
          }
        }
        else{
          navigation.replace('LoginScreen');
        }
      }
      else{
        navigation.replace('LoginScreen');
      }
    }
  return (
    <View style={styles.container}>
      <Text style={styles.logoText} >Welcome...</Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    logoText:{
        fontSize:40,
        fontWeight:'bold',
        color:'black'
    }
})