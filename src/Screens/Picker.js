import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Contacts from 'react-native-contacts';
import { useNavigation } from '@react-navigation/native'
import { request, PERMISSIONS } from 'react-native-permissions';
import { FlatList } from 'react-native-gesture-handler';


const Picker = () => {
  const navigation = useNavigation();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);

  // get contact permission
  useEffect(() => {
    requestContactsPermission();
  }, [])

  const requestContactsPermission = async () => {
    try {
      // Request permission for both Android and iOS
      const androidStatus = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      const iosStatus = await request(PERMISSIONS.IOS.CONTACTS);

      if (androidStatus === 'granted' || iosStatus === 'granted') {
        console.log('Contacts permission granted');
        // Now you can fetch and display contacts
        fetchContacts();
      } else {
        console.log('Contacts permission denied');
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
    }
  };
  // fetch contacts
  const fetchContacts = () => {
    Contacts.getAll()
      .then((allContacts) => {
        const contactsWithSelection = allContacts.map(item => ({ ...item, isSelected: false }));

        setContacts(contactsWithSelection);
        console.log(contacts);
      })
      .catch((error) => console.error('Error fetching contacts:', error));
  };
  // function for handle click on the list
  const handleClick = (getNumber) => {
    const updatedContacts = contacts.map(contact =>
      contact.phoneNumbers[0].number === getNumber ? { ...contact, isSelected: !contact.isSelected } : contact
    );

    setContacts(updatedContacts);
    const tickContacts = updatedContacts.filter((c => c.isSelected));
    setSelectedContacts(tickContacts);
    console.log(tickContacts.length);
  }

  // change title of screen
  useEffect(() => {
    navigation.setOptions({
      title: `(${selectedContacts.length}) Selected`,
    });
  }, [selectedContacts]);

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FlatList data={contacts}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => handleClick(item.phoneNumbers[0].number)}>
              <View style={[styles.list, item.isSelected && styles.selected]}>
                <View style={styles.imageView}>
                  <Image source={require('../assets/icons/profile.png')} style={styles.img}></Image>
                </View>
                <View style={styles.contactInfo}>
                  <Text>{item.displayName}</Text>
                  <Text>{item.phoneNumbers[0].number}</Text>
                </View>
                <View style={styles.checkBox}>
                  {item.isSelected && (
                    <Image source={require('../assets/icons/checkmark.png')} style={styles.tick}></Image>
                  )}
                </View>
              </View>
            </TouchableOpacity>

          )
        }}
      ></FlatList>
      <View style={styles.bottomButtonContainer}>
        <Button title='Done' style={styles.btn} onPress={() => { navigation.navigate('HomeScreen', { selectedContacts }); }} />
      </View>
    </View>
  )
}


export default Picker;

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
  selected: {
    backgroundColor: '#89CFF0'
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
    width: '100%', // Use 100% to fill the container
  },
})