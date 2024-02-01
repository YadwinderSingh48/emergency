import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CustomButton = ({onPress,title,bgColor,textColor}) => {
  return (
    <View style={{width:'85%', marginTop:10}}>

        <TouchableOpacity style={{backgroundColor:bgColor,
                                    justifyContent:'center',
                                    alignItem:'center', borderRadius:5,
                                paddingVertical:14, }} 
                                    onPress={()=>{onPress()}}
                                    >
      <Text style={{color:textColor, textAlign:'center'}}>{title}</Text>
        </TouchableOpacity>
                                        </View>

    
  )
}

export default CustomButton

const styles = StyleSheet.create({
    
})