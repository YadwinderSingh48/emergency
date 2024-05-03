import { StyleSheet, Text, View, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { FlatList } from 'react-native-gesture-handler'

const Recents = (props) => {
    console.log(props.notifications)
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headers}>
                <Text style={styles.heading}>Notifications</Text>
                <TouchableOpacity onPress={props.reload}>
                    <MaterialIcons name="refresh" size={35} color={'black'} />
                </TouchableOpacity>
            </View>
            <FlatList data={props.notifications} nestedScrollEnabled={true} style={{flexGrow:1}}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={[styles.list]}  >
              <View style={styles.imageView}>
                <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
              </View>
              <View style={styles.contactInfo}>
                <Text style={{color:'black'}}>{item.Name}</Text>
                <Text style={{fontWeight:'500'}}> Updated: {item.TimeStamp} min ago</Text>
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
            <Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18, marginTop:30 }}>No Recent Notifications</Text>
        </View>
    )
}

export default Recents

const styles = StyleSheet.create({
    mainContainer: {
        borderWidth: 1,
        marginHorizontal: 10,
        //marginVertical: 5,
        borderRadius: 10,
        height:'100%'
    },
    headers: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 0.5
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        width: '80%'
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
})