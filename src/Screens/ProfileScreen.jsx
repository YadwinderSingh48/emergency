import { StyleSheet, Text, View, Image , TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
      <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
      </View>
      <View>
      <Text style={styles.nameText}>Welcome</Text>
      </View>
      <TouchableOpacity style={{padding:15 , borderTopWidth:0.5,borderColor:'grey',borderBottomWidth:0.5,marginVertical:40,width:'85%', alignItems:'flex-start'}} onPress={()=>{navigation.navigate('Home')}}> 
        <View >
          <Text style={{fontSize:20,color:'black'}}>Track Location</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
   
    
  },
  img:{
    height:150,
    width:150
  },
  nameText:{
    fontSize:25,
    fontWeight:'bold',
    color:'black',
    marginTop:10,
    marginBottom:5
  }
})