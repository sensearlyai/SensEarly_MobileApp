import { CometChat } from "@cometchat/chat-sdk-react-native";
import {
  CometChatConversationsWithMessages,
  CometChatListStylesInterface,
  CometChatMessages,
  ConversationsConfigurationInterface,
  MessageHeaderConfigurationInterface,
  MessageListConfigurationInterface,
  MessagesConfigurationInterface,
  UsersConfigurationInterface
} from "@cometchat/chat-uikit-react-native";
import { ContactsConfigurationInterface } from "@cometchat/chat-uikit-react-native/src/CometChatContacts/ContactsConfiguration";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Import useNavigation
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export const Chat = () => {
  const [user, setChatUser] = useState<CometChat.User | undefined>(undefined);
  const [loading, setLoading] = useState(true); // Track loading state
  const [selectedUser, setSelectedUser] = useState<CometChat.User | null>(null); // Store selected user
  const [conversationsConfiguration, setConversationsConfiguration] = useState<ConversationsConfigurationInterface | undefined>(undefined);

  const navigation = useNavigation(); // Use the hook to get navigation object

  useEffect(() => {
    const getUser = async () => {
      try {
        const uid = await AsyncStorage.getItem("UID");
        console.log(uid,'chatid')
        if (uid) {
          fetchUser(uid);
        } else {
          console.error("UID is missing");
        }
      } catch (error) {
        console.error("Error getting UID:", error);
      }
    };
    getUser(); // Call the async function
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        try {
          const uid = await AsyncStorage.getItem("UID");
          console.log(uid, 'chatid');
          if (uid) {
            fetchUser(uid);
          } else {
            console.error("UID is missing");
          }
        } catch (error) {
          console.error("Error getting UID:", error);
        }
      };
  
      // Fetch user and apply conversations filter whenever screen is focused
      getUser();
    }, [])
  );
  
 


  const fetchUser = async (uid: string) => {
    try {
      if (uid) {
        const fetchedUser = await CometChat.getUser(uid);
        setChatUser(fetchedUser);
        const userTags = ["Doctor"];
        const conversationsRequestBuilder = new CometChat.ConversationsRequestBuilder()
          .setUserTags(userTags)
          .withTags(true)
          .setLimit(1);
          const updatedConversationsConfiguration: ConversationsConfigurationInterface = {
            conversationsRequestBuilder: conversationsRequestBuilder,
          };
      
          // Update the configuration state with the new filter applied
          setConversationsConfiguration(updatedConversationsConfiguration);
      } else {
        console.error("UID is missing");
        setConversationsConfiguration(undefined);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };
  const messagesConfiguration: MessagesConfigurationInterface = {
    hideMessageComposer: true,
    disableTyping: false,
  };


  // Handle when a conversation is clicked
  const onPressHandler = (conversationClicked: CometChat.Conversation) => {
    const selectedUser = conversationClicked.getConversationWith() as CometChat.User;
    setSelectedUser(selectedUser);
  };

  // let userTags = ["Doctor"];
  // const conversationsRequestBuilder = new CometChat.ConversationsRequestBuilder();
  // conversationsRequestBuilder.setUserTags(userTags)
  // .setLimit(5);
  // const conversationsConfiguration: ConversationsConfigurationInterface = {
  //   conversationsRequestBuilder: conversationsRequestBuilder,
  // }

  // When coming back to the chat screen, reset to show conversations
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //   // Reset selected user on screen focus
  //   if (selectedUser) {
  //     setSelectedUser(selectedUser);
  //   }else{
  //     setSelectedUser(null);
  //   }
  //   });
  //   return unsubscribe; // Cleanup listener when component unmounts
  // }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const messageHeaderConfiguration : MessageHeaderConfigurationInterface = {
    //config
    hideBackIcon:true
 } 

 const contactsConfiguration: ContactsConfigurationInterface = {
  selectionLimit	:1,
  hideSubmit:true,
  tabVisibility:'groups'
}
  // return (

  //   <>
  //     {selectedUser ? (
  //       // <CometChatUsersWithMessages
  //       //   user={selectedUser}
  //       //   messagesConfigurations={messagesConfiguration}
  //       //   usersConfiguration={usersConfiguration}
  //       // />
  //       <CometChatMessages
       
  //       user={selectedUser}
  //       hideMessageComposer={true}
  //       messageListConfiguration={messageListConfiguration}
  //       messageHeaderConfiguration={messageHeaderConfiguration}
  //     />
  //     ) : (
  //       <CometChatConversations conversationsRequestBuilder={conversationsRequestBuilder} onItemPress={onPressHandler} />
  //     )}
  //   </>
  // );
  // return (
  //   <CometChatConversationsWithMessages
  //     user={user}
  //     conversationsConfiguration={conversationsConfiguration}
  //     messagesConfigurations={messagesConfiguration}
  //     startConversationConfiguration={contactsConfiguration}
  //   />
  // );  

    return (
      <>
        {user && (
          // <CometChatConversationsWithMessages  />
          // <CometChatMessageList user={user} />
          // <CometChatUsersWithMessages user={user}
          // // messagesConfigurations={messagesConfiguration}
          // usersConfiguration={usersConfiguration} ></CometChatUsersWithMessages>
          <CometChatMessages
          hideMessageComposer={true}
            // messagesStyle={messageListStyle}
            user={user}
            // messageListConfiguration={messageListConfiguration}
            // messageComposerConfiguration={messageComposerConfiguration}
          />
        )}
      </>
    );
};

