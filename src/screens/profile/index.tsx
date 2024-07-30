import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, Image, StyleSheet, Modal, TouchableOpacity, } from 'react-native';
import styles from '../../styles/styles';
import Colors from '../../constant/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircleUser, faCircleXmark, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../constant/config';
import { useFocusEffect } from '@react-navigation/native';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import Spinner from 'react-native-loading-spinner-overlay';

export const Profile = ({ navigation }: any) => {

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

  useEffect(() => {
    //loadUserDetails();
    // const backAction = () => {
    //   Alert.alert('Back button pressed!');
    //   return true;
    // };

    // BackHandler.addEventListener('hardwareBackPress', backAction);

    // return () => BackHandler.removeEventListener('hardwareBackPress', backAction);

  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      loadUserDetails();
      loadActivityLog();
    }, [])
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData]: any = useState(null);
  const [activityData, setActivityData]: any = useState(null);

  const loadUserDetails = () => {
    getUserId().then((userId: any) => {
      const url = config.BASE_URL + `user/loadUser/` + userId;
      setIsLoading(true);
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
              console.log(response);
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              setIsLoading(false);
              setData(data);
            })
            .catch((error: any) => {
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

  const loadActivityLog = () => {
    getUserId().then(userId => {
      const url = config.BASE_URL + `audit/last5RecordsByPatientId/` + userId;
      setIsLoading(true);
      getAccessToken().then((token: any) => {
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
              const response = data;
              setActivityData(response);
            })
            .catch(error => {
              setIsLoading(false);
              Alert.alert(
                'Error',
                error.toString(),
                [
                  {
                    text: 'Okay',
                    onPress: () => {
                    }
                  }
                ]
              );
            });
        } else {
          console.error('Access token not found');
        }
      });
    })

  }

  const UserProfileIcon = ({ imageUrl }: any) => {
    console.log(imageUrl, "image url any")
    if (!imageUrl) {
      return (
        <FontAwesomeIcon icon={faCircleUser} color={Colors.defaultColor} size={40} />
      );
    }

    const uri = `data:image/jpeg;base64,${imageUrl}`;

    return (
      <Image
        source={{ uri }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25, // Half of width and height to make it round
        }}
      />
    );
  };


  const handleOk = () => {
    console.log('OK button pressed');
    setAlertVisible(false);
    setIsLoading(false);
  };


  const AuditTrail = ({ data }: any) => {
    return (
      <View style={{ flex: 1, padding: 10 }}>
        {data && data.map((item: any) => (
          <View key={item.id} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.defaultColor }} />
              <Text style={{ marginLeft: 10, fontWeight: 'bold', color: Colors.Black }}>{item.module}</Text>
            </View>
            <View style={{ marginLeft: 10, borderLeftWidth: 2, borderColor: Colors.defaultColor, paddingLeft: 10 }}>
              <Text style={{ marginBottom: 5, color: Colors.Black }}>Created Time: {item.createdTime}</Text>
              <Text style={{ marginBottom: 5, color: Colors.Black }}>System Remarks: {replaceMito(item.systemRemarks)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const replaceMito = (remarks: string) => {
    return remarks.replace(/<#mito#>/g, ' | ');
  };

  return (
    <View style={[styles.scrollViewContainer, {}]}>
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
      <View style={{ flex: 1 }}>
        <View style={[styles.profileCard, { margin: 10 }]}>

          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: Colors.LightGray, paddingLeft: 10 }}>
            <View style={{ marginRight: 5, padding: 10 }}>
              <UserProfileIcon imageUrl={data?.image} />
            </View>
            <View style={{ flex: 1, padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.Black }}>{data?.userName}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{data?.email}</Text>
            </View>
          </View>

          <TouchableOpacity style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 2, borderBottomColor: Colors.LightGray, paddingLeft: 10 }} onPress={() => { navigation.navigate("EditProfile", { data }) }}>
            <FontAwesomeIcon icon={faUser} color={Colors.DarkGray} size={23} />
            <Text style={[styles.subText, { marginLeft: 10 }]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 2, borderBottomColor: Colors.LightGray, paddingLeft: 10 }} onPress={() => { navigation.navigate("Login") }}>
            <FontAwesomeIcon icon={faRightFromBracket} color={Colors.DarkGray} size={23} />
            <Text style={[styles.subText, { marginLeft: 10 }]}>Logout</Text>
          </TouchableOpacity>

        </View>

        <View style={[styles.profileCard, { margin: 10, padding: 10, height: '70%' }]}>
          <Text style={styles.headerText}>Access Activity Log</Text>
          <Text style={styles.normalText}>Detailed log of all users accessing and interacting with your data.</Text>

          <ScrollView contentContainerStyle={{}}>
            <AuditTrail data={activityData} />
          </ScrollView>
        </View>

      </View>
    </View>
  )

};


const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 100
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 24,
    borderRadius: 12,
    backgroundColor: Colors.defaultColor,
    color: 'white',
    padding: 8,
  },
  line: {
    width: 3,
    flex: 1,
    backgroundColor: Colors.defaultColor,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.Black
  },
  description: {
    fontSize: 16,
    color: Colors.Black
  },
  subDescription: {
    fontSize: 14,
    color: Colors.Black
  },
});



