import { faAngleLeft, faArrowTrendUp, faCircleInfo, faCircleUser, faCircleXmark, faComments, faListCheck, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Colors from '../constant/colors';
import { DailyTask } from '../screens/dailyTask';
import { Dashboard } from '../screens/dashboard';
import { Profile } from '../screens/profile';
import { Temperature } from '../screens/temperature';
import { Weight } from '../screens/weight';
import styles from '../styles/styles';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BP } from '../screens/bp';
import { Chat } from '../screens/chat';
import { SupportChat } from '../screens/chat/indes';
import { DailyPic } from '../screens/dailyPic';
import { DailyQuestionarie } from '../screens/dailyQuestionarie';
import { EditProfile } from '../screens/editProfile';
import StroopTest from '../screens/stroopTest';
import { Table, Rows } from 'react-native-table-component';
import { CrendentialsContext } from '../constant/CredentialsContext';

interface AboutModalProps {
  aboutModalVisible: boolean;
  setAboutModalVisible: (visible: boolean) => void;
}
interface SupportModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}
interface MessageModalProps {
  messageModalVisible: boolean;
  setMessageModalVisible: (visible: boolean) => void;
}
const Tab = createBottomTabNavigator();
const MessageModal: React.FC<MessageModalProps> = ({ messageModalVisible, setMessageModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={messageModalVisible}
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        setMessageModalVisible(false);
      }}
    >
      <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', height: '90%' }}>
          <View style={{
            width: '98%',
            height: '95%',
            backgroundColor: 'white',
            paddingVertical: 10
          }}>
            <Chat />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Pressable
              style={styles.modalButton}
              onPress={() => setMessageModalVisible(false)}  // Close modal when pressed
            >
              <FontAwesomeIcon icon={faCircleXmark} size={24} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const SupportModal: React.FC<SupportModalProps> = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        setModalVisible(false);
      }}>
      <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', height: '90%' }}>
          <View style={{
            width: '98%',
            height: '95%',
            backgroundColor: 'white',
            paddingVertical: 10
          }}>
            <SupportChat />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}  // Close modal when pressed
            >
              <FontAwesomeIcon icon={faCircleXmark} size={24} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const AboutModal: React.FC<AboutModalProps> = ({ aboutModalVisible, setAboutModalVisible }) => {
  const [baseUrl, setBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBaseUrl = async () => {
      try {
        const storedBaseUrl = await AsyncStorage.getItem('baseUrl');
        setBaseUrl(storedBaseUrl);
      } catch (error) {
        console.error('Error retrieving baseUrl:', error);
      }
    };

    fetchBaseUrl();
  }, []);

  const data = [
    ['Version ID', '1.4.7'],
    ['Environmental ID', baseUrl || 'Loading...'], // Display 'Loading...' until the value is loaded
  ];

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={aboutModalVisible}
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        setAboutModalVisible(false);
      }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View
          style={{
            backgroundColor: isDarkMode ? '#333' : 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%',
            maxHeight: '80%',
          }}>
          <View style={{ marginVertical: 20 }}>
            <Table borderStyle={{ borderWidth: 2, borderColor: isDarkMode ? '#666' : '#c8e1ff' }}>
              <Rows
                data={data}
                textStyle={{
                  padding: 10,
                  textAlign: 'center',
                  color: isDarkMode ? '#fff' : '#000', // Adjust text color for dark mode
                }}
              />
            </Table>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Pressable
              style={{ padding: 10, backgroundColor: '#e74c3c', borderRadius: 5 }}
              onPress={() => setAboutModalVisible(false)}>
              <FontAwesomeIcon icon={faCircleXmark} size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const CustomDailyTasksHeader = ({ navigation, label, title }: any) => {
  const [supportCountdata, countsetData] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const route = navigation?.getState()?.routes?.[navigation?.getState()?.index];
  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const ID = await AsyncStorage.getItem('UID');
        if (ID) {
          getMessageCount(ID); // Pass the retrieved ID
        } else {
          console.log("UID not found");
        }
        getSupportCount('206');
      } catch (error) {
        console.error("Error retrieving UID:", error);
      }
    };

    loadUserDetails();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const loadUserId = async () => {
        try {
          const ID = await AsyncStorage.getItem('UID');
          if (ID) {
            getMessageCount(ID); // Pass the retrieved ID
          } else {
            console.log("UID not found");
          }
          getSupportCount('206');
          console.log(JSON.stringify({ ID })); // Log the userId inside an object
        } catch (error) {
          console.error("Error retrieving UID:", error);
        }
      };

      loadUserId();
    }, [])
  );
  const loadUserDetails = () => {
    getUserId().then(async (userId: any) => {
      const baseUrl = await AsyncStorage.getItem('baseUrl');
      const url = baseUrl + `user/loadUser/` + userId;
      getAccessToken().then(token => {
        if (token) {
          fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              // getPatientCount(data.createdBy.toString());
              // getSupportCount('206')
              getMessageCount(data.hospital);
              getSupportCount('206')
              console.log("CustomDailyTasksHeader")
              // AsyncStorage.setItem('UID', data.hospital);
            })
            .catch((error: any) => {
              console.error("Error loading user details:", error);
            });
        } else {
          console.error('Access token not found');
        }
      });
    });
  };

  const fetchUnreadMessageCount = (UID: string, setCount: (count: number) => void) => {
    CometChat.getUnreadMessageCountForUser(UID).then(
      (unreadMessageCount: any) => {
        const messageCount: number = unreadMessageCount[UID] || 0;
        console.log("Message count fetched:", messageCount);
        setCount(messageCount);
      },
      (error: CometChat.CometChatException) => {
        console.log("Error in getting message count", error);
      }
    );
  };

  const addMessageListener = (UID: string, updateCountCallback: () => void) => {
    CometChat.addMessageListener(
      UID,
      new CometChat.MessageListener({
        onTextMessageReceived: () => {
          console.log("Text message received successfully");
          updateCountCallback();
        },
        onMediaMessageReceived: () => {
          console.log("Media message received successfully");
          updateCountCallback();
        },
        onCustomMessageReceived: () => {
          console.log("Custom message received successfully");
          updateCountCallback();
        }
      })
    );
  };

  const getMessageCount = (UID: string) => {
    console.log("Fetching chat message count");
    fetchUnreadMessageCount(UID, setMessageCount);
    addMessageListener(UID, () => fetchUnreadMessageCount(UID, setMessageCount));
  };

  const getSupportCount = (UID: string) => {
    console.log("Fetching support message count");
    fetchUnreadMessageCount(UID, countsetData);
    addMessageListener(UID, () => fetchUnreadMessageCount(UID, countsetData));
  };
  const openSupportModal = () => {
    console.log('First icon pressed')
    countsetData(0);
    setModalVisible(true);
  };

  const openMessageModal = () => {
    setMessageModalVisible(true);
    setMessageCount(0);
  };

  const openAboutModal = () => {
    setAboutModalVisible(true);
  }
  const navigateBack = () => {
    if (label != "Daily Task")
      navigation.goBack();
    else
      navigation.navigate("Overview");
  }

  return (

    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
      {title === "Daily Tasks" && (
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={navigateBack}>
          {label !== "Daily Task" ? (
            <FontAwesomeIcon icon={faAngleLeft} size={30} color={Colors.bottomNavigationIconInActive} />
          ) : null}
        </TouchableOpacity>
      )}
                <Text style={[styles.headerText, { paddingRight: 105 }]}>{title}</Text>

      <SupportModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <MessageModal messageModalVisible={messageModalVisible} setMessageModalVisible={setMessageModalVisible} />
      <AboutModal aboutModalVisible={aboutModalVisible} setAboutModalVisible={setAboutModalVisible} />
      <View style={{ flexDirection: 'row' }}>
        <Pressable
          // style={[styles.msgbutton, styles.buttonOpen]}
          onPress={() => openAboutModal()}>
          {/* <Text style={styles.textStyle}>Support</Text> */}
          <FontAwesomeIcon icon={faCircleInfo} size={30} />
        </Pressable>
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Pressable
          // style={[styles.msgbutton, styles.buttonOpen]}
          onPress={() => openSupportModal()}>
          {/* <Text style={styles.textStyle}>Support</Text> */}
          <FontAwesomeIcon icon={faComments} size={30} />
          {supportCountdata ? (<View style={{
            position: 'absolute',
            top: -12,
            right: -12,
            backgroundColor: 'red',
            borderRadius: 15,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {supportCountdata}

            </Text>
          </View>) : null}

        </Pressable>
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Pressable
          onPress={() => openMessageModal()}>
          {/* <Text style={styles.textStyle}>Messages</Text> */}
          <FontAwesomeIcon icon={faMessage} size={25} />
          {messageCount ? (<View style={{
            position: 'absolute',
            top: -14,
            right: -15,
            backgroundColor: 'red',
            borderRadius: 15,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {messageCount}
            </Text>
          </View>) : null}

        </Pressable>
      </View>
    </View>
  );
};
const CustomHeader = ({ navigation, label, title }: any) => {
  const [supportCountdata, countsetData] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const route = navigation?.getState()?.routes?.[navigation?.getState()?.index];
  useEffect(() => {
    const loadUserDetails = async () => {
      console.log("customheader");

      try {
        const ID = await AsyncStorage.getItem('UID');
        if (ID) {
          getMessageCount(ID); // Pass the retrieved ID
        } else {
          console.log("UID not found");
        }
        getSupportCount('206');
      } catch (error) {
        console.error("Error retrieving UID:", error);
      }
    };

    loadUserDetails();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const loadUserId = async () => {
        try {
          const userId = await AsyncStorage.getItem('UID');
          console.log(JSON.stringify({ userId })); // Log the userId inside an object
        } catch (error) {
          console.error("Error retrieving UID:", error);
        }
      };

      loadUserId();
    }, [])
  );

  const loadUserDetails = () => {
    getUserId().then(async (userId: any) => {
      const baseUrl = await AsyncStorage.getItem('baseUrl');
      const url = baseUrl + `user/loadUser/` + userId;
      getAccessToken().then(token => {
        if (token) {
          fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {

              // getPatientCount(data.createdBy.toString());
              // getSupportCount('206')

              // AsyncStorage.setItem('UID', data.hospital);

            })
            .catch((error: any) => {
              console.error("Error loading user details:", error);
            });
        } else {
          console.error('Access token not found');
        }
      });
    });
  };

  const fetchUnreadMessageCount = (UID: string, setCount: (count: number) => void) => {
    CometChat.getUnreadMessageCountForUser(UID).then(
      (unreadMessageCount: any) => {
        const messageCount: number = unreadMessageCount[UID] || 0;
        console.log("Message count fetched:", messageCount);
        setCount(messageCount);
      },
      (error: CometChat.CometChatException) => {
        console.log("Error in getting message count", error);
      }
    );
  };

  const addMessageListener = (UID: string, updateCountCallback: () => void) => {
    CometChat.addMessageListener(
      UID,
      new CometChat.MessageListener({
        onTextMessageReceived: () => {
          console.log("Text message received successfully");
          updateCountCallback();
        },
        onMediaMessageReceived: () => {
          console.log("Media message received successfully");
          updateCountCallback();
        },
        onCustomMessageReceived: () => {
          console.log("Custom message received successfully");
          updateCountCallback();
        }
      })
    );
  };

  const getMessageCount = (UID: string) => {
    console.log("Fetching chat message count");
    fetchUnreadMessageCount(UID, setMessageCount);
    addMessageListener(UID, () => fetchUnreadMessageCount(UID, setMessageCount));
  };

  const getSupportCount = (UID: string) => {
    console.log("Fetching support message count");
    fetchUnreadMessageCount(UID, countsetData);
    addMessageListener(UID, () => fetchUnreadMessageCount(UID, countsetData));
  };
  const openSupportModal = () => {
    console.log('First icon pressed')
    countsetData(0);
    setModalVisible(true);
  };

  const openMessageModal = () => {
    setMessageModalVisible(true);
    setMessageCount(0);

  };
  const navigateBack = () => {
    if (label != "Daily Task")
      navigation.goBack();
    else
      navigation.navigate("Overview");
  }

  const openAboutModal = () => {
    setAboutModalVisible(true);
  }

  return (

    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>

      <Text style={[styles.headerText, { paddingLeft: 10 }]}>{title}</Text>
      <AboutModal aboutModalVisible={aboutModalVisible} setAboutModalVisible={setAboutModalVisible} />
      <SupportModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <MessageModal messageModalVisible={messageModalVisible} setMessageModalVisible={setMessageModalVisible} />
      <View style={{ flexDirection: 'row' }}>
        {/* <TouchableOpacity onPress={() => openSupportModal()}>
          <FontAwesomeIcon icon={faBell} size={24} color={Colors.defaultColor} />
        </TouchableOpacity> */}
        <Pressable
          // style={[styles.msgbutton, styles.buttonOpen]}
          onPress={() => openAboutModal()}>
          {/* <Text style={styles.textStyle}>Support</Text> */}
          <FontAwesomeIcon icon={faCircleInfo} size={30} />
        </Pressable>
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Pressable
          // style={[styles.msgbutton, styles.buttonOpen]}
          onPress={() => openSupportModal()}>
          {/* <Text style={styles.textStyle}>Support</Text> */}
          <FontAwesomeIcon icon={faComments} size={30} />
          {supportCountdata ? (<View style={{
            position: 'absolute',
            top: -12,
            right: -12,
            backgroundColor: 'red',
            borderRadius: 15,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {supportCountdata}

            </Text>
          </View>) : null}

        </Pressable>
        {/* <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => console.log('Second icon pressed')}>
          <FontAwesomeIcon icon={faCircleUser} size={30} color={Colors.bottomNavigationIconInActive} />
        </TouchableOpacity> */}
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Text>{'\u00A0\u00A0\u00A0'}</Text>
        <Pressable
          onPress={() => openMessageModal()}>
          {/* <Text style={styles.textStyle}>Messages</Text> */}
          <FontAwesomeIcon icon={faMessage} size={25} />
          {messageCount ? (<View style={{
            position: 'absolute',
            top: -14,
            right: -15,
            backgroundColor: 'red',
            borderRadius: 15,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {messageCount}
            </Text>
          </View>) : null}

        </Pressable>
      </View>
    </View>
  );
};

const CustomProfileHeader = ({ navigation, title }: any) => {
  const route: any = useRoute();

  const navigateBack = () => {
    const previousScreenName = route.params?.previousScreen || 'Unknown'
    console.log(previousScreenName, "???????????????????????????????????????????????????????????????????????????????????????")
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", "navigateBack", route)
    navigation.goBack();
  }

  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={navigateBack}>
        {/* <FontAwesomeIcon icon={faAngleLeft} size={30} color={Colors.bottomNavigationIconInActive} /> */}
        <Text style={[styles.headerText, {}]}>{title}</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => console.log('First icon pressed')}>
          {/* <FontAwesomeIcon icon={faBell} size={24} color={Colors.defaultColor} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => console.log('Second icon pressed')}>
          <FontAwesomeIcon icon={faCircleUser} size={30} color={Colors.bottomNavigationIconInActive} />
        </TouchableOpacity>
      </View>
    </View>
  );
};




const Stack = createStackNavigator();

// const ChatHeader= ({ navigation }: any) =>{
// return (
//   <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
//     <View style={{ flexDirection: 'row' }}>
//       <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => console.log('Second icon pressed')}>
//         <FontAwesomeIcon icon={faComment} size={30} color={Colors.bottomNavigationIconInActive} />
//       </TouchableOpacity>
//     </View>
//   </View>
// );
// }

// const ChatStackNavigator = () =>{
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Chat" component={Chat} options={{ headerShown: true, header: (props) => <ChatHeader {...props} /> }} />
//     </Stack.Navigator>
//   );
// }

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} title="Profile" /> }} />
      {/* <Stack.Screen name="SupportChat" component={SupportChat} options={{ headerShown: true, }} /> */}
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: true, header: (props) => <CustomProfileHeader {...props} title="Edit Profile" /> }} />
    </Stack.Navigator>
  );
};

const DashboardNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Overviews" component={Dashboard} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} title="Overview" /> }} />
      {/* <Stack.Screen name="SupportChat" component={SupportChat} options={{ headerShown: true, }} /> */}
    </Stack.Navigator>
  )
}
const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

const getAccessToken = async () => {
  const { storedCrendentials } = useContext(CrendentialsContext);
  try {
    if (storedCrendentials) {
      console.log(storedCrendentials, "BottomNAvigation")
      return storedCrendentials;
    }
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};



const DailyTaskStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Daily Task" component={DailyTask} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Daily Task" title="Daily Tasks" /> }} />
      <Stack.Screen name="Weight" component={Weight} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Weight" title="Daily Tasks" /> }} />
      <Stack.Screen name="Temperature" component={Temperature} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Temperature" title="Daily Tasks" /> }} />
      <Stack.Screen name="BP" component={BP} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="BP" title="Daily Tasks" /> }} />
      <Stack.Screen name="StroopTest" component={StroopTest} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Stroop Test" title="Daily Tasks" /> }} />
      <Stack.Screen name="DailyPic" component={DailyPic} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="DailyPics" title="Daily Tasks" /> }} />
      <Stack.Screen name="DailyQuestionarie" component={DailyQuestionarie} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="DailyQuestionarie" title="Daily Tasks" /> }} />
    </Stack.Navigator>
  );
};


const BottomNavigation = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true); // Track loading state
  const [data, setData] = useState(0);
  const [supportCountdata, countsetData] = useState(0);

  const [uid, setUID] = useState<string | null>(null);
  useEffect(() => {
    // const fetchUID = async () => {
    //   const storedUID = await AsyncStorage.getItem('UID');
    //   console.log("storing Id useEffect", storedUID);
    //   if (storedUID) {
    //     getPatientCount(storedUID);
    //     setUID(storedUID);
    //   } else {
    //     console.error("UID is null");
    //   }
    // };
    // fetchUID();
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchUIDOnFocus = async () => {
  //       const storedUID = await AsyncStorage.getItem('UID');
  //       console.log("storing Id useFocusEffect", storedUID);
  //       if (storedUID) {
  //         console.log("storing Id useFocusEffect", storedUID);
  //         getPatientCount(storedUID);  // Add message listener
  //       } else {
  //         console.error("UID is null");
  //       }
  //     };
  //     fetchUIDOnFocus();

  //     return () => {
  //       // Clean up if necessary
  //     };
  //   }, [uid])
  // );
  const checkAsyncStorage = async () => {
    try {
      const storedUID = await AsyncStorage.getItem('UID');
      setUID(storedUID)// Replace 'UID' with the key you want to ch
      if (storedUID !== null) {
        // The item exists, and you can use it
        console.log('Stored UID:', storedUID);
      } else {
        // The item does not exist
        console.log('No UID found in AsyncStorage');
      }
    } catch (error) {
      // Handle error if something goes wrong
      console.error('Error fetching UID from AsyncStorage:', error);
    }
  };



  const removeMessageListener = (UID: any) => [
    CometChat.removeMessageListener(UID)
  ]

  const CustomTabBar = ({ state, descriptors, navigation }: any) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#CCCCCC',
      width: '100%',
      height: 80,
      marginBottom: 7,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20
    }}>
      {
        state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          let label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (label === 'Support') {
              countsetData(0);
            }
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const icon = label === 'Health Trends'
            ? faArrowTrendUp
            : label === 'Profile'
              ? faUser
              : label === 'Daily Tasks'
                ? faListCheck
                : label === 'Messages'
                  ? faMessage
                  : label === 'Support'
                    ? faComments
                    : faCircleCheck; // Default icon, replace as needed

          // Placeholder for the badge count (replace '10' with a dynamic count if needed)
          // const badgeCount = 10; 

          return (
            label === "Daily Tasks" || label === "Health Trends" || label === "Profile" || label === "Messages" || label === "Support" ? (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={{ flex: 1, alignItems: 'center', position: 'relative' }} // Add position: 'relative' for badge placement
              >
                <FontAwesomeIcon icon={icon} size={30} color={(isFocused) ? Colors.bottomNavigationIconActive : Colors.bottomNavigationIconInActive} />
                <Text style={{ color: (isFocused) ? Colors.bottomNavigationIconActive : Colors.bottomNavigationIconInActive }}>
                  {label}
                </Text>
                {label === 'Support' && supportCountdata > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -11,
                    right: 9,
                    backgroundColor: 'red',
                    borderRadius: 15,
                    width: 25,
                    height: 25,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                      {supportCountdata}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : null
          );
        })}
    </View>
  );
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} >
      <Tab.Screen
        name="Overview"
        component={DashboardNavigator}
        options={{ tabBarLabel: 'Health Trends', headerShown: false }}
      />
      <Tab.Screen
        name="Daily Tasks"
        component={DailyTaskStackNavigator}
        options={{
          tabBarLabel: 'Daily Tasks', headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile', headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;



