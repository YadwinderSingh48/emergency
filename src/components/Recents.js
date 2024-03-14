import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const Recents = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headers}>
                <Text style={styles.heading}>Notifications</Text>
                <TouchableOpacity onPress={() => { console.log('Notification Refreshed') }}>
                    <MaterialIcons name="refresh" size={35} color={'black'} />
                </TouchableOpacity>
            </View>
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
})