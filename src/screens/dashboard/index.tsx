import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Pressable,
  StyleSheet,
  ViewPropsIOS,
} from 'react-native';
import styles from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartLine, faCheckCircle, faCircleXmark, faHeartbeat, faHospital, faMoon, faPills, faRocket, faSun, faThermometerHalf, faTint, faUtensils, faWeight } from '@fortawesome/free-solid-svg-icons';
import Colors from '../../constant/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../constant/config';
import { useFocusEffect } from '@react-navigation/native';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Spinner from 'react-native-loading-spinner-overlay';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { SupportChat } from '../chat/indes';
import { Chat } from '../chat';
import { logCurrentStorage } from '../../util/util';
import { CrendentialsContext } from '../../constant/CredentialsContext';
export const Dashboard = (props: any) => {

  const [currentDate, setCurrentDate] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData]: any = useState(null);
  const [supportCountdata, countsetData] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const { storedCrendentials,setStoredCredentials } = useContext(CrendentialsContext);

  interface SupportModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
  }
  interface MessageModalProps {
    messageModalVisible: boolean;
    setMessageModalVisible: (visible: boolean) => void;
  }


  useEffect(() => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const month = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month}`;
    setCurrentDate(formattedDate);
    loadDashboardCards();
    console.log(storedCrendentials,'storedCrendentials');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // logCurrentStorage();
      setIsLoading(false);
      loadDashboardCards();
      console.log(storedCrendentials,'storedCrendentials');

    }, [])
  );
  const getAccessToken = async () => {
    try {
      // Prefer retrieving from context first
      if (storedCrendentials) {
        return storedCrendentials;
      }
      // Fallback to AsyncStorage if context is not populated
      // const token = await AsyncStorage.getItem('token');
      // return token;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  };

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      return userId;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  };

  const loadDashboardCards = async () => {
    try {
      const userId = await getUserId();
      const currentDate = new Date().toISOString().split('T')[0];
      const baseUrl = await AsyncStorage.getItem('baseUrl');
      const url = `${baseUrl}task/loadPendingByPatientsMobile/${currentDate}`;
      const accessToken = await getAccessToken();
      if (accessToken) {
        console.log(accessToken,"Validddddddddddddddddddddddddddddddddddddddddddddd")
        setIsLoading(true);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          console.error('Error: Invalid response', accessToken,response);
          await AsyncStorage.removeItem("authToken").then(() => {
            setStoredCredentials(null);
            props.navigation.navigate('Login');
          }).catch(error => {
            console.log(error)
          });
        } else {
          const data = await response.json();
          setData(data);
          // loadUserDetails();
        }
      } else {
        console.error('Access token not found');
        props.navigation.navigate('Login');

      }
    } catch (error) {
      console.error('Error:', error);
      props.navigation.navigate('Login');
    } finally {
      setIsLoading(false);
    }
  };

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
              console.log(data.hospital, 'doctordldlfdfkdfkdlkldfdlfkdlfklfdkslfjslkfjkf')
              // getMessageCount(data.hospital);
              // getSupportCount('206')
              AsyncStorage.setItem('UID', data.hospital);
              console.log(AsyncStorage.setItem('UID', data.hospital),"AsyncStorage.setItem('UID', data.hospital)")
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
  
  const renderItems = (startIndex: any, endIndex: any) => {
    return data && data.list.slice(startIndex, endIndex).map((item: any, index: any) => {
      // console.log(data)
      let icon: IconProp | null = null;
      switch (item.icon) {
        case 'faRocket':
          icon = faRocket;
          break;
        case 'faHeartbeat':
          icon = faHeartbeat;
          break;
        case 'faMoon':
          icon = faMoon;
          break;
        case 'faTint':
          icon = faTint;
          break;
        case 'faWeight':
          icon = faWeight;
          break;
        case 'faThermometerHalf':
          icon = faThermometerHalf;
          break;
        case 'faHospital':
          icon = faHospital;
          break;
        case 'faChartLine':
          icon = faChartLine;
          break;
        default:
          icon = faMoon;
      }

      return (
        <View key={index} style={{ width: '48%', backgroundColor: item.color, borderRadius: 10, padding: 8, justifyContent: 'center', alignItems: 'center', height: 140 }}>
          <FontAwesomeIcon icon={icon} size={50} color="white" style={{ alignSelf: 'flex-end' }} />
          <Text style={[styles.headerText, { color: Colors.White, marginTop: 1 }]}>{item.label}</Text>
          <Text style={[styles.subText, { color: Colors.White, marginTop: 1 }]}>{item.value}</Text>
        </View>
      );
    });
  };

  const handleOk = () => {
    setAlertVisible(false);
    setIsLoading(false);
  };
  return (
    <ScrollView contentContainerStyle={[styles.scrollViewContainer, {}]}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      <Modal animationType="slide"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: Colors.LightGray }}>
              {
                type == "success"
                  ? <FontAwesomeIcon icon = { faCheckCircle } size = { 24 } color = {Colors.PrimaryDark} />
              : <FontAwesomeIcon icon={faCircleXmark} size={24} color={Colors.Error} />
              }
              <Text style={styles.alertTitle}>{title}</Text>
            </View>
            <Text style={styles.alertMessage}>{message}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={styles.button} onPress={handleOk}>
                <Text style={styles.buttonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1, margin: 10 }}>

      
        
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 7, paddingRight: 10,paddingBottom:10 }}>
    <FontAwesomeIcon icon={faSun} size={30} color={Colors.LightGray} />
    <Text style={[styles.subText]}> {currentDate.toUpperCase()}</Text>
</View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderItems(0, 2)}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            {renderItems(2, 4)}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            {renderItems(4, 6)}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            {renderItems(6, 8)}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles2 = StyleSheet.create({
  centeredView: {
    flex: 1, // Make the centered view take full available space
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background for better focus on modal
  },
  modalView: {
    width: '98%', // Occupies almost the full width
    height: '95%', // Occupies almost the full height
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15, // Small padding for the content
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonOpen1: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

