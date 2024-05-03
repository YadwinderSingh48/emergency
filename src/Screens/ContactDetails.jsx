import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Linking, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialIcons from 'react-native-vector-icons/FontAwesome';
import { ref, set, onValue } from "firebase/database";
import { db } from '../components/firebaseconfig';
import { useLocation } from '../components/LocationContext';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const ContactDetails = ({ route }) => {
    const [conLat, setConLat] = useState(0);
    const [conLong, setConLong] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const { contactData } = route.params;
    const { location } = useLocation();
   // console.log(contactData);

    useEffect(() => {
        getLocation();
    }, [])
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [])

    //check if user is sharing location
    const getLocation = () => {
        if (contactData.Status == 'RED') {

            console.log('location is')
            console.log(location)
            console.log(contactData.Account)
            const myId = JSON.stringify(contactData.Account);
            console.log(myId)
            const userId = JSON.stringify(contactData.AccountId);
            const starCountRef = ref(db, myId + '/' + contactData.AccountId + '/');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                console.log(snapshot)
                if (data != '' && data != null && data != undefined) {
                    if (data.sharing == true) {
                        const latt = data.latitude;
                        const long = data.longitude;
                        console.log(latt);
                        setConLat(latt);
                        setConLong(long);

                    } else {
                        setConLat(0);
                        setConLong(0);
                    }

                } else {
                    setConLat(0);
                    setConLong(0);
                }
            });
        }
    }
    const checkRedndering = () => {
        //  console.log('here')
        if (conLat != 0 && conLong != 0) {

            return (
                <View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Chat",contactData)} style={{width:'80%',height:50,borderWidth:1,borderRadius:10,marginTop:10,justifyContent:'center',backgroundColor:"#dfdfdf"}}>
                        <Image source={require('../assets/icons/message.png')} style={{height:34,width:34,alignSelf:'center'}} />
                    </TouchableOpacity>
                <MapView
                    style={[styles.map]}
                    initialRegion={{
                        latitude: conLat,
                        longitude: conLong,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation
                    loadingEnabled={true}
                >
                    {/* <Marker
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title="Current Location"
                        description="This is where I am"
                      /> */}
                    <Marker
                        coordinate={{ latitude: conLat, longitude: conLong }}
                        title={contactData.Name}
                        description="Contact is Here"
                    />
                    {/* <Polyline
                        coordinates={[
                            { latitude: location?.latitude, longitude: location?.longitude },
                            { latitude: conLat, longitude: conLong }
                        ]}
                        strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeWidth={6}
                        geodesic={false}
                    /> */}
                    {/* <MapViewDirections
                           origin={{ latitude: location.latitude, longitude: location.longitude }}
                           destination={{ latitude: 30.929463, longitude: 74.612839 }}
                            apikey={'AIzaSyBCniUNc5X63vxNDe8RKIdef_5uWPquUk0'}
                             /> */}
                </MapView>
                </View>

            )

        }
        if (contactData.Status != 'GREY') {
            return (
                <View style={{ height: 300, alignItems: 'center', top: 60 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{contactData.Name} Have not Shared anything</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate("Chat",contactData)} style={{width:'80%',height:50,borderWidth:1,borderRadius:10,marginTop:10,justifyContent:'center',backgroundColor:"#dfdfdf",alignSelf:'center',alignItems:'center'}}>
                        <Image source={require('../assets/icons/message.png')} style={{height:34,width:34,alignSelf:'center'}} />
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{ height: 300, alignItems: 'center', top: 60 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{contactData.Name} havn't using the app. Invite him to join</Text>
                    <Button title='Invite Now' style={{ marginTop: 40, padding: 10 }} onPress={() => { handleSendMessage(contactData.Phone) }} ></Button>
                </View>
            )
        }
    }
    const handleSendMessage = (phone) => {
        const message = 'Hey download this app to connect me {appLink}';
        //const number = '+1234567890'; 

        // Prompt the user to open the SMS app
        const url = `sms:${phone}?body=${message}?`;
        Linking.openURL(url);
    }
    return (
        <View style={{display:'flex', height:'100%',flexDirection:'coloumn',justifyContent:"space-between"}}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                <MaterialIcons name="user" size={25} color={'black'} />
                <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold', marginTop: 5, marginLeft: 5 }}>Profile</Text>
            </View>

            <View style={styles.container}>
                <View style={{}}>
                    <Image source={require('../assets/icons/profile.png')} style={styles.profileIcon} />
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', textAlign: 'center' }}>{contactData.Name}</Text>
                </View>
                <View style={styles.donutContainer}>
                    <View style={[styles.circle, { borderColor: contactData.Status.toLowerCase() }]}>
                        <TouchableOpacity style={styles.status}>
                            <Text style={[styles.heading, { color: contactData.Status.toLowerCase() }]}>
                                {contactData.Status === 'GREY' ? 'not exist' : contactData.Status}

                            </Text>
                            
                        </TouchableOpacity>
                    </View>
                </View>
                
            </View>
            <View style={{ height: '80%' }}>
                {checkRedndering()}
                {isLoading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            </View>


        </View>
    )
}

export default ContactDetails

const styles = StyleSheet.create({
    profileIcon: {
        width: 120,
        height: 120,
        margin: 10
    },
    container: {
        display: 'flex',
        borderWidth: 0.1,
        elevation: 2,
        flexDirection: 'row',
        paddingHorizontal: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        // borderRadius:10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.5,
        // shadowRadius: 12,
    },
    heading: {
        fontSize: 19,
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    circle: {
        textAlign: 'center',
        height: 150,
        width: 150,
        borderWidth: 20,
        borderRadius: 75,
        marginRight: 10,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',


    },
    donutContainer: {
    },
    subheading: {
        fontSize: 15,
        fontWeight: '500'
    },
    status: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        display: 'flex',
        width: '100%',
        height: '100%',
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