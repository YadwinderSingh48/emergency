//import { View, Text } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
//import axios from 'axios';


  //  const [token, setToken] = useState('');
    const GetToken = async () => {
        const [token, setToken] = useState('');
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
                console.log(accessToken);
                return accessToken
            } else {
                console.error('Error getting token:', responseData);
                Alert.alert('An error occurred. Please try again later.');
                setToken('');
                return null
            }
            

        }
        catch (error) {
            console.error('Error getting token: ', error);
            Alert.alert('An error occurred. Please try again later.');
            setToken('');
            return null
        }
    }
  



export default GetToken;