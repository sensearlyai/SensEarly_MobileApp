import { CometChat } from "@cometchat/chat-sdk-react-native";
import {
  CometChatListStylesInterface,
  CometChatMessageComposer, CometChatMessages, MessageComposerConfigurationInterface, MessageComposerStyleInterface, MessageListConfigurationInterface,
  MessagesConfigurationInterface,
  MessageStyleInterface,
  UsersConfigurationInterface
} from "@cometchat/chat-uikit-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native"; // For loading state

export const SupportChat = ({ nav }: any) => {
  const [user, setChatUser] = useState<CometChat.User | undefined>(undefined);
  const [loading, setLoading] = useState(true); // Track loading state
  const [data, setData]: any = useState(null);
  const uid = AsyncStorage.getItem("userId");
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      return userId;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  };
  const getUser = async () => {
    const user = await CometChat.getUser(102);
    setChatUser(user);
  };
  useEffect(() => {
    // getUser();
    fetchUser('206');
    // console.log(uid, "uidd");
    // CometChat.getUser(uid).then((user) => {
    //   setChatUser(user);
  }, []);

//   const loadUserDetails = () => {
//     getUserId().then(async (userId: any) => {
//       const baseUrl = await AsyncStorage.getItem('baseUrl');
//       const url = baseUrl + `user/loadUser/` + userId;
//       setLoading(true);
//       getAccessToken().then(token => {
//         if (token) {
//           fetch(url, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`,
//             },
//           })
//             .then(response => {
//               if (!response.ok) {
//                 throw new Error('Network response was not ok');
//               }
//               return response.json();
//             })
//             .then(data => {
//               setLoading(false);
//               setData(data);
//               console.log(data.createdBy.toString(), 'dataaaa');
//               // Pass 'createdBy' directly to fetchUser
//               fetchUser(data.createdBy.toString());
//             })
//             .catch((error: any) => {
//               setLoading(false);
//               console.error("Error loading user details:", error);
//             });
//         } else {
//           console.error('Access token not found');
//         }
//       });
//     });
//   };
  
  const fetchUser = async (uid: any) => {
    try {
      if (uid) {
        console.log(uid);
        const fetchedUser = await CometChat.getUser(uid);
        console.log(fetchedUser);
        setChatUser(fetchedUser);
      } else {
        console.error("UID is missing");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  }
  const getUnreadMessageCount = async (uid: any, limit: number = 30) => {
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(uid)
      .setUnread(true)
      .setLimit(limit)
      .build();
  
    try {
      const messages = await messagesRequest.fetchPrevious();
      console.log("Message list fetched:", messages);
    } catch (error) {
      console.log("Message fetching failed with error:", error);
    }
  };
  

  const messageComposerStyle: MessageComposerStyleInterface = {
    backgroundColor: "#fffcff",
    inputBackground: "#e2d5e8",
    textColor: "#ff299b",
    sendIconTint: "#ff0088",
  };

  const messageListStyle: MessageStyleInterface = {
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
  };

  const messageListConfiguration: MessageListConfigurationInterface = {
    messageListStyle: messageListStyle,
  };

  const messageComposerConfiguration: MessageComposerConfigurationInterface = {
    messageComposerStyle: messageComposerStyle,
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const customComposerView = ({user, group} : {user?: CometChat.User| undefined, group?: CometChat.Group | undefined}) => {
    return (
     <CometChatMessageComposer
         user={user}
         messageComposerStyle={messageComposerStyle}>
     </CometChatMessageComposer>
    )
  }
   const usersRequestBuilder = new CometChat.UsersRequestBuilder()
    .setLimit(5)
    .friendsOnly(true);

    // usersRequestBuilder.build().fetchNext().then(users => {
    //   console.log(users, "Fetched Users");
    //   setData(users);  // Check if data contains users
    // }).catch(error => {
    //   console.error("Error fetching users:", error);
    // });
    const userStyle :CometChatListStylesInterface ={
      background: "#ddd7f7",
      titleColor: "#6851D6",
    };
    
  const usersConfiguration: UsersConfigurationInterface = {
    usersStyle:userStyle,
    usersRequestBuilder: usersRequestBuilder,    
  };

  const messagesConfiguration: MessagesConfigurationInterface = {
    hideMessageComposer: true,
    disableTyping: false,

  };
  return (
    <>
      {user && (
        // <CometChatConversationsWithMessages  />
        // <CometChatMessageList user={user} />
        // <CometChatUsersWithMessages user={user}
        // // messagesConfigurations={messagesConfiguration}
        // usersConfiguration={usersConfiguration} ></CometChatUsersWithMessages>
        <CometChatMessages
          // messagesStyle={messageListStyle}
          user={user}
          // messageListConfiguration={messageListConfiguration}
          // messageComposerConfiguration={messageComposerConfiguration}
        />
      )}
    </>
  );
};
