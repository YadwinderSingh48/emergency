import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { ref, set, onValue, push, update,off } from "firebase/database";
import { db } from '../components/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

const Chat = ({route}) => {
  const navigation = useNavigation();
   //const {contactData} = route.params;
    const chatData = route.params;
    let chatId;
    if(chatData.AccountId > chatData.Account){
      chatId = chatData.AccountId +'-'+ chatData.Account;
    }
    else {
      chatId = chatData.Account +'-'+ chatData.AccountId;
    }
    console.log(chatId);
    const [messages, setMessages] = useState([]);

   
      useEffect(() => {
    
        // Set up Firebase listener for messages
        const messagesRef = ref(db,`messages/${chatId}`);
        const messagesListener =  onValue(messagesRef, (snapshot) => {
          if (snapshot.exists()) {
            const messageData = snapshot.val();
            const messageList = Object.values(messageData);
            setMessages(messageList.reverse()); // Reverse the order to display latest message at bottom
          }
        });
    
        // Clean up listener on unmount
        return () =>  off(messagesRef, 'value', messagesListener);;
      }, [chatId]);

      useEffect(() => {
        navigation.setOptions({
          title: chatData.Name,
        });
      }, []);

    //  push(ref(db, `Chats/${chatData.AccountId}-${chatData.Account}`), messageObject )
      const onSend = async (newMessages = []) => {
        // Add new message to Firebase
        const message = newMessages[0];
        await push(ref(db, `messages/${chatId}`), {
          _id: message._id,
          text: message.text,
          createdAt: {
            '.sv': 'timestamp' // Use Firebase's server timestamp feature
          },
          user: message.user
        } )
      
      }
     
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
  <GiftedChat
  messages={messages}
  onSend={messageInfo => onSend(messageInfo)}
  user={{
    _id: chatData.AccountId,
  }}
  isAnimated={true}
  renderAvatar={null}
    />
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({})