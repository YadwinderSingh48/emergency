import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
//import axios from 'axios';

const GetToken = () => {
    const [token, setToken] = useState('');
    const generateToken = async () => {
        try {
            const authUrl = `https://login.salesforce.com/services/oauth2/token?`;
            const clientId = '3MVG9Kr5_mB04D14D.hLl3Q0oFhcPx_bIxRBctJfZhezQkjGcX4yIPdZB4r9GI_ePGxFtIAnNBHhJKTJ_7lNR';
            const clientSecret = 'AD0520E2EBFE1C8E1133666836BAF74D699A55A62E772FEAB7C1121672CFBAF5';

            const authData = {
                grant_type: 'password',
                client_id: clientId,
                client_secret: clientSecret,
                username: 'reactnativeproject@newapp.com',
                password: 'ReactApp@21MPHIQQiMSqoz1UmLwrSeT1q69',
            };
            const formData = Object.keys(authData)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(authData[key]))
            .join('&');

            const response = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });
            const responseData = await response.json();
            if (response.ok) {
                const accessToken = responseData.access_token;
                setToken(accessToken);
                await AsyncStorage.setItem('TOKEN', accessToken);
            } else {
                console.error('Error creating Salesforce account:', responseData);
                Alert.alert('An error occurred. Please try again later.');
                setToken('');
            }
            

        }
        catch (error) {
            console.error('Error creating Salesforce account:', error);
            Alert.alert('An error occurred. Please try again later.');
            setToken('');
        }
    }
    useEffect(() => {
        generateToken();
    }, [])

    return token;

}

export default GetToken;