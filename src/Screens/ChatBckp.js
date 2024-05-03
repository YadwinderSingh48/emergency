import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat';
import { ref, set, onValue, push, update } from "firebase/database";
import { db } from '../components/firebaseconfig';

const Chat = ({route}) => {
   //const {contactData} = route.params;
    const chatData = route.params;
    const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     const starCountRef = ref(db, `Chats/${chatData.AccountId}-${chatData.Account}`);
    //     onValue(starCountRef, (snapshot) => {
    //         const data = snapshot.val();
    //         var m = [];
    //        for (const key in data) {
    //         if (data.hasOwnProperty(key)) {
    //           const item = data[key];
    //           console.log("Item ID:", item);
    //           m.push(item);
    //           // Access other properties as needed
    //         }
    //       }
    //       setMessages(m);
    //        //const data;
    //       //  setMessages(data)
    //     });
    //     setMessages([
    //       {
    //         _id: 1,
    //         text: 'Hello developer',
    //         createdAt: new Date(),
    //         user: {
    //           _id: chatData.Account,
    //           name: 'React Native',
    //           avatar: 'https://placeimg.com/140/140/any',
    //         },
    //       },
    //     ])
    //   }, [])
      const onSend = useCallback((messageInfo = []) => {
        console.log(messageInfo[0].user._id)
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messageInfo),  
        );
        const messageObject = {
            _id: messageInfo[0]._id,
            text: messageInfo[0].text,
            createdAt: new Date(),
            user: {
              _id: messageInfo[0].user._id,
            },
          };

          // firebase
        push(ref(db, `Chats/${chatData.AccountId}-${chatData.Account}`), messageObject ) .then(() => {
            console.log('data updated...')
          })
          .catch((error) => {
            console.log(error);
          })
      }, [])

  return (
  <GiftedChat 
  
      messages={messages}
      onSend={messageInfo => onSend(messageInfo)}
      user={{
        _id: chatData.AccountId,
      }}
      containerStyle={{ backgroundColor: 'lightblue' }} 
    />
  )
}

export default Chat

const styles = StyleSheet.create({})