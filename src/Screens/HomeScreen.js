import { Button, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { React, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
const HomeScreen = ({ navigation, route }) => {
  // handle and store get data from contact picker screen
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    if (route.params?.selectedContacts) {
      const receivedSelectedContacts = route.params.selectedContacts;
      // Handle the receivedSelectedContacts data as needed
      console.log('Received selectedContacts:', receivedSelectedContacts);
      setContacts(receivedSelectedContacts);
    }
  }, [route.params?.selectedContacts]);

  return (

    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FlatList data={contacts}
        renderItem={({ item, index }) => {
          return (

            <View style={[styles.list]}>
              <View style={styles.imageView}>
                <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
              </View>
              <View style={styles.contactInfo}>
                <Text>{item.displayName}</Text>
                <Text>{item.phoneNumbers[0].number}</Text>
              </View>
              <View style={styles.checkBox}>
                {!item.isSelected && (
                  <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                )}
              </View>
            </View>



          )
        }}
      ></FlatList>
      {contacts.length == 0 ? (<Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18 }}>No Contact Selected</Text>) : ''}
      <View style={styles.bottomButtonContainer}>
        <Button title='Add Contacts' style={styles.btn} onPress={() => {
          navigation.navigate('Picker')
        }} />
      </View>
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
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
    height: 30,
    width: 30,
    marginHorizontal: 10,
    marginVertical: 10
  },
  bottomButtonContainer: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,

  },
  btn: {
    width: '100%',
  },
});