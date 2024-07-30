import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import styles from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircleXmark, faHeartbeat, faMoon, faPills, faRocket, faSun, faThermometerHalf, faTint, faUtensils, faWeight } from '@fortawesome/free-solid-svg-icons';
import Colors from '../../constant/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../constant/config';
import { useFocusEffect } from '@react-navigation/native';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Spinner from 'react-native-loading-spinner-overlay';

export const Dashboard = (props: any) => {

  const [currentDate, setCurrentDate] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData]: any = useState(null);

  useEffect(() => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const month = monthsOfYear[today.getMonth()];

    const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month}`;
    setCurrentDate(formattedDate);
    loadDasboardCards();
  }, []);


  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
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

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      loadDasboardCards();
    }, [])
  );

  const loadDasboardCards = () => {
    getUserId().then((userId: any) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const url = config.BASE_URL + `task/loadPendingByPatientsMobile/` + currentDate;
      getAccessToken().then(token => {
        setIsLoading(true);
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
              setIsLoading(false);
              setData(data);
            })
            .catch(error => {
              setIsLoading(false);
              setAlertVisible(true);
              setType("error");
              setTitle("Error");
              setMessage(error.toString());
            });
        } else {
          console.error('Access token not found');
        }
      });
    })
  }

  const renderItems = (startIndex: any, endIndex: any) => {
    return data && data.list.slice(startIndex, endIndex).map((item: any, index: any) => {
      console.log(data)

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
        default:
          icon = faMoon;
      }

      return (
        <View key={index} style={{ width: '48%', backgroundColor: item.color, borderRadius: 10, padding: 10, justifyContent: 'center', alignItems: 'center', height: 185 }}>
          <FontAwesomeIcon icon={icon} size={50} color="white" style={{ alignSelf: 'flex-end' }} />
          <Text style={[styles.headerText, { color: Colors.White, marginTop: 15 }]}>{item.label}</Text>
          <Text style={[styles.subText, { color: Colors.White, marginTop: 5 }]}>{item.value}</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: Colors.LightGray }}>
              {
                type == "success"
                  ? <FontAwesomeIcon icon={faCheckCircle} size={24} color={Colors.PrimaryDark} />
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

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 7 }}>
          <FontAwesomeIcon icon={faSun} size={30} color={Colors.LightGray} />
          <Text style={[styles.subText, {}]}> {currentDate.toUpperCase()}</Text>
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
        </View>
      </View>
    </ScrollView>
  );
};

