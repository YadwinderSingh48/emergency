import { StyleSheet, Text, View , Image} from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'

const CustomTextInput = ({placeholder,icon,type,value,onChangeText,keyboardType}) => {
  return (
    <View style={styles.textBox}>
      <Image source={icon} style={styles.iconImage}></Image>
    <TextInput placeholder={placeholder}
                value={value} onChangeText={(txt)=>{onChangeText(txt)}}
                style={styles.input} secureTextEntry={type? true : false} keyboardType={keyboardType?keyboardType:'default'} ></TextInput>
        
    </View>

    
  )
}

export default CustomTextInput

const styles = StyleSheet.create({
    input:{
        width:'80%',
        alignSelf:'center',
        fontSize:16
        
        
    },
    textBox:{
      width:'85%',
      flexDirection:'row',
      justifyContent:'center',
      borderWidth:0.7,
      alignItems:'center',
      borderRadius:14,
      borderColor:'black',
      marginVertical:10,
     // height:50
    },
    iconImage:{
      width:22,
      height:22,
      marginHorizontal:5
    }
})