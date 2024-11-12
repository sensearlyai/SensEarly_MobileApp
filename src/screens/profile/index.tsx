import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, Image, StyleSheet, Modal, TouchableOpacity, Linking, } from 'react-native';
import styles from '../../styles/styles';
import Colors from '../../constant/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircleUser, faCircleXmark, faHeadset, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import Spinner from 'react-native-loading-spinner-overlay';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CrendentialsContext } from '../../constant/CredentialsContext';


export const Profile = (props: any) => {
  const getAccessToken = async () => {
    try {
      if (storedCrendentials) {
        return storedCrendentials;
      }
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
    // const handleDeepLink = (event: any) => {
    //   const url = event.url;
    //   console.log("Received URL: ", url);
    //   // Handle the deep link URL
    //   if (url.includes('com.fitrockr.sync')) {
    //     // Perform the action based on the deep link
    //     // For example, navigate to a specific screen or perform an action
    //     navigation.navigate("SyncScreen"); // Replace with your actual screen
    //   }
    // };
    // Listen for deep links
    // const linkingListener = Linking.addEventListener('url', handleDeepLink);
    // Cleanup the listener when component unmounts
    return () => {
      // linkingListener.remove();
    };
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
  const [countdata, countsetData] = useState(0);
  const { storedCrendentials, setStoredCredentials } = useContext(CrendentialsContext);

  const loadUserDetails = () => {
    getUserId().then(async (userId: any) => {
      const baseUrl = await AsyncStorage.getItem('baseUrl');
      const url = baseUrl + `user/loadUser/` + userId;
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
              // console.log(data.createdBy,'dataaaa');
              setIsLoading(false);
              setData(data);
              // getUnreadMsgCount('206');
              // AsyncStorage.setItem('createdBy',data.createdBy.toString())
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

  const logout = async () => {
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    const url = baseUrl + `user/mobileLogout`;
    const body=JSON.stringify({ userId: await AsyncStorage.getItem('userId') })
    let requestBody={userId:await AsyncStorage.getItem('userId') 
    }
    getAccessToken().then(async token => {
      if (token) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        })
        if (!response.ok) {
          console.error('Error: Invalid response', token,response);
          console.log(JSON.stringify({ userId: await AsyncStorage.getItem('userId') }))
        } else {
          console.log('OK button pressed');
          try {
            // Remove the token and UID from AsyncStorage
            await AsyncStorage.removeItem("authToken").then(() => {
              setStoredCredentials(null);
            }).catch(error => {
              console.log(error)
            });
            await AsyncStorage.removeItem("UID");
            await AsyncStorage.removeItem("baseUrl");

            // Verify that the items have been removed
            const authToken = await AsyncStorage.getItem("authToken");
            const uid = await AsyncStorage.getItem("UID");
            const baseUrl = await AsyncStorage.getItem("baseUrl")
            if (!authToken && !uid && !baseUrl) {
              console.log("Logout successful authToken, token and UID removed.");
            } else {
              console.log("Error: Token or UID still exists.");
            }

            props.navigation.navigate('Login');
          } catch (error) {
            console.error("Error during logout:", error);
          }
        }
      } else {
        console.error('Access token not found');
      }
    });

  };

  const loadActivityLog = () => {
    getUserId().then(async userId => {
      const baseUrl = await AsyncStorage.getItem('baseUrl');
      const url = baseUrl + `audit/last5RecordsByPatientId/` + userId;
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
    // console.log(imageUrl, "image url any")
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
  const openLink = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.fitrockr.sync';
    Linking.openURL(url);
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
            {/* <Text style={{
              position: 'absolute',
              bottom: 0,
              right: 10,
              fontSize: 14,
              color: '#666'
            }}>
             V 1.4.6
            </Text> */}
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 2, borderBottomColor: Colors.LightGray, paddingLeft: 10 }} onPress={() => { props.navigation.navigate("EditProfile", { data }) }}>
            <FontAwesomeIcon icon={faUser} color={Colors.DarkGray} size={23} />
            <Text style={[styles.subText, { marginLeft: 10 }]}>Edit Profile</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: Colors.LightGray,
              paddingLeft: 10,
              position: 'relative' // Required for badge positioning
            }}
            onPress={NavigateSupport}
          >
            <FontAwesomeIcon icon={faHeadset} color={Colors.DarkGray} size={23} />
            <Text style={[styles.subText, { marginLeft: 10 }]}>
              Support Chat
            </Text>

            {countdata > 0 && (
              <View style={{
                position: 'absolute',
                  right: 10,
                  marginTop:10,
                  backgroundColor: 'red',
                  borderRadius: 15,
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                 &nbsp;{countdata}
                </Text>
              </View>
            )}
          </TouchableOpacity> */}

          <TouchableOpacity style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 2, borderBottomColor: Colors.LightGray, paddingLeft: 10 }} onPress={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} color={Colors.DarkGray} size={23} />
            <Text style={[styles.subText, { marginLeft: 10 }]}>Logout</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 2, borderBottomColor: Colors.LightGray, paddingLeft: 10 }} onPress={openLink}>
            <FontAwesomeIcon icon={faRightFromBracket} color={Colors.DarkGray} size={23} />
            <Text style={[styles.subText, { marginLeft: 10 }]}>DeepLink</Text>
          </TouchableOpacity> */}

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



