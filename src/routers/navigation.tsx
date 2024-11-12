import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../constant/colors';
import { CrendentialsContext } from '../constant/CredentialsContext';
import IMAGES from '../constant/image';
import { DashboardContainer } from '../screens/dashboardContainer';
import { Login } from '../screens/login';
import OTPScreen from '../screens/otp';
import PrivacyPolicy from '../screens/privacypolicy';
import { TermsAndCondition } from '../screens/termsAndCondition';
import styles from '../styles/styles';
const screenWidth = Dimensions.get('window').width;
const Stack = createStackNavigator();
const CustomLoginHeader = () => (
  <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
    <View style={{ flexDirection: 'row' }}>
      {/* <View style={{ flexDirection: 'row', width: '87%' }}>
        <Image source={require('../assets/images/logo.png')} style={{ width: 30, height: 30 }} />
        <Text style={[styles.headerText, { paddingLeft: 10 }]}>Mito Power</Text>
      </View> */}
      <View style={{ flexDirection: 'row', width: '75%' }}>
        <Image
          source={require('../assets/images/Log.png')}
          style={{
            width: screenWidth * 0.60, // 60% of the screen width
            height: screenWidth * 0.90, // Maintain aspect ratio (adjust as needed)
            resizeMode: 'contain', // Ensures image maintains aspect ratio
            marginLeft: -40, // Set margin-left to -40 (if required)
          }}
        />
        {/* <Text style={[styles.headerText, { paddingLeft: 10 }]}>Mito Power</Text> */}
      </View>
      {/* <Text style={[styles.subText, { textAlign: 'right', justifyContent: 'center', alignSelf: 'center' }]}>V1.39</Text> */}
    </View>
  </View>
);

const CustomTermsAndConditionHeader = () => (
  <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
    <Image source={require('../assets/images/termsAndConditionIcon.png')} style={{ width: 50, height: 50 }} />
  </View>
);

const Navigation = ({ navigation }: any) => {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const data = [
    { label: 'https://uat.sensearly.ai:8443/api/', value: '1' },
    { label: 'https://staging.sensearly.ai:8443/api/', value: '2' },
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [newBaseUrl, setNewBaseUrl] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { storedCrendentials } = useContext(CrendentialsContext);

  useEffect(() => {
    // Initial check when the component mounts
    // validateToken();

    // Set up interval to validate token every 30 minutes (1800000 ms)
    // const tokenValidationInterval = setInterval(() => {
    //   validateToken();
    // }, 1800000);

    // Clean up the interval on component unmount
    // return () => clearInterval(tokenValidationInterval);
  }, []);

  const validateToken = async () => {
    try {
      // const token = await AsyncStorage.getItem('token');
      const token = storedCrendentials

      // const token = useSelector((state: any) => state.auth.token);
        if (token !== null) {
          console.log("valid")
          setIsLoggedIn(true);
          // await AsyncStorage.removeItem('token'); // Clear invalid token if necessary
        }
       else {
        console.log("not valid")
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      Alert.alert('Error', 'Unable to validate session');
    }
  };

  const checkTokenValidity = async (token: string) => {
    // Replace this with your actual API call to validate the token
    try {
      const response = await fetch('https://your-api-url.com/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.isValid; // Assume API returns { isValid: true/false }
    } catch (error) {
      console.error('Error validating token with API:', error);
      return false;
    }
  };

  const loadBaseUrl = async () => {
    try {
      const storedBaseUrl = await AsyncStorage.getItem('baseUrl');
      console.log(storedBaseUrl, "aaaaa");
      if (storedBaseUrl && storedBaseUrl.trim()) {  // Check if storedBaseUrl is not null, undefined, or empty
        setNewBaseUrl(storedBaseUrl);
        setValue(data.find(item => item.label === storedBaseUrl)?.value || null);
      } else {
        setValue(null);
        setNewBaseUrl(''); // Reset the base URL if needed
      }
    } catch (error) {
      console.error('Error loading base URL:', error);
    }
  };


  const saveBaseUrl = async () => {
    try {
      // Validate and save the new base URL in AsyncStorage
      if (newBaseUrl !== '') {
        await AsyncStorage.setItem('baseUrl', newBaseUrl);
        console.log(newBaseUrl, 'newbase');
        setValidationMsg(''); // Clear validation message

        // Optionally clear or reset the previous URL
        setBaseUrl(newBaseUrl);
        console.log(newBaseUrl, 'setbaseurl');
      } else {
        setValidationMsg('Please select a valid base URL');
      }
    } catch (error) {
      console.error('Error saving base URL:', error);
    }

    // Close the modal or perform any further actions
    setModalVisible(false);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     loadBaseUrl();  // Call the function when screen is focused
  //   }, [])
  // );
  
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Select New Base Url
        </Text>
      );
    }
    return null;
  };
  
  return (
    <CrendentialsContext.Consumer>
      {({storedCrendentials})=>(
    <NavigationContainer independent={true}>
    <Stack.Navigator>
      {storedCrendentials ? (
        <Stack.Screen
        name="DashboardContainer"
        component={DashboardContainer}
        options={{ headerShown: false }}
      />
      ) :
    <>
<Stack.Screen
        name="Login"
        component={Login}
        options={({ route, navigation }) => ({
          title: "",
          headerShown: true,
          headerTransparent: false, // Set to false to prevent transparency
          headerStyle: {
            backgroundColor: 'white', // Set header background color
            height: 45, // Adjust the header height as needed
          },
          headerRight: () => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '106%',
              height: 55,
              backgroundColor: 'white',
              borderBottomWidth: 1,
              borderBottomColor: Colors.LightGray,
              paddingHorizontal: 0, // Remove horizontal padding
              paddingLeft: 0, // Ensure no padding on the left side
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', width: '75%' }}>
                  <Image
                    source={require('../assets/images/Log.png')}
                    style={{
                      width: screenWidth * 0.60, // 60% of the screen width
                      height: screenWidth * 0.90, // Maintain aspect ratio (adjust as needed)
                      resizeMode: 'contain', // Ensures image maintains aspect ratio
                      marginLeft: -40, // Set margin-left to -40 (if required)
                    }}
                  />
                  {/* <Text style={[styles.headerText, { paddingLeft: 10 }]}>Mito Power</Text> */}
                </View>
                <View style={{ flexDirection: 'row', width: '20%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.subText, { textAlign: 'right' }]}>V 1.4.7&nbsp;&nbsp;</Text>
                  <TouchableOpacity onPress={() => { setModalVisible(true) }}>
                    <Image source={IMAGES.SETTINGS} style={{ width: 30, height: 30 }} />
                  </TouchableOpacity>
                </View>
              </View>

              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles1.modalContainer}>
                  <View style={styles1.modalContent}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles1.text}>Base URL</Text>

                      <View style={{ flexDirection: 'row' }}>
                        <Button title="&nbsp;&nbsp;&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;&nbsp;" color='#007BFF' onPress={saveBaseUrl} />
                        <Text>&nbsp;&nbsp;</Text>
                        <Button title="&nbsp;Cancel&nbsp;" color="#DC3545" onPress={() => setModalVisible(false)} />
                      </View>
                    </View>

                    <View style={{ justifyContent: 'center', height: 100, }}>
                      <View style={[styles1.dropcontainer]}>
                        {renderLabel()}
                        <Dropdown
                          style={[styles1.dropdown, { width: '100%', maxWidth: 500 }, isFocus && { borderColor: 'blue' }]}
                          placeholderStyle={[styles1.placeholderStyle, { color: 'black' }]} // Ensure placeholder text is black
                          selectedTextStyle={[styles1.selectedTextStyle, { color: 'black' }]} // Ensure selected text is black
                          inputSearchStyle={styles1.inputSearchStyle}
                          iconStyle={styles1.iconStyle}
                          data={data}
                          search={false}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder={!isFocus ? 'Select item' : '...'}
                          value={value} // Bind the value state here
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setValue(item.value); // Update the value state when item is selected
                            setNewBaseUrl(item.label); // Set the selected value as the new base URL
                            setIsFocus(false); // Close the dropdown
                          }}
                          renderLeftIcon={() => (
                            <FontAwesomeIcon
                              style={styles1.dropicon}
                              icon={faShieldAlt} // Use the icon you imported
                              size={20}
                              color={isFocus ? 'blue' : 'black'}
                            />
                          )}
                          renderItem={(item) => (
                            <View style={{ paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                              <Text style={{ color: 'black', fontSize: 16 }}>
                                {item.label}
                              </Text>
                            </View>
                          )}
                        />

                      </View>
                      {/* <TextInput
                placeholder="Enter New Base URL"
                value={newBaseUrl}
                onChangeText={(text) => {
                  setNewBaseUrl(text);
                  setValidationMsg('');
                }}
                onSubmitEditing={saveBaseUrl}
                style={styles1.input1}
              /> */}
                      {validationMsg != '' && <Text style={{ color: 'black', fontSize: 16 }}>{validationMsg}</Text>}
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          ),
        })}
      />
            {/* <Stack.Screen
            name="BottomNavigation"
            component={BottomNavigation}
            options={{ headerShown: false }}
          /> */}
      {/* <Stack.Screen
        name="Login"
        component={Login}
        options={{
          header: () => <CustomLoginHeader />,
        }}
      /> */}
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          header: () => <CustomTermsAndConditionHeader />,
        }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{
          header: () => <CustomLoginHeader />,
        }}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{
          header: () => <CustomTermsAndConditionHeader />,
        }}
      />
    </>  
    }
    
      
  
    </Stack.Navigator>
  </NavigationContainer>
      )}
    </CrendentialsContext.Consumer>

  );
};

const styles1 = StyleSheet.create({
  dropcontainer: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropicon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },





  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 5,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: 250,
    height: '100%',
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  icon: {
    width: 35,
    height: 35,
    padding: 10,
    borderRadius: 1,
    backgroundColor: 'white'
  },
  input1: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black'
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    width: 250,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 5,
  },
  text: {
    fontSize: 22,
    color: 'black',
    fontWeight: '700'
  },
  dashboardText: {
    fontSize: 17,
    color: 'black',
    // fontWeight:'bold'
  },
  userContainer: {
    padding: 10,
    backgroundColor: 'whitesmoke',
    borderRadius: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    padding: 10,
    backgroundColor: 'whitesmoke',
    borderRadius: 30,
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 65,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginVertical: 5,
  },
  separator: {
    fontWeight: 'bold',
    marginBottom: 10
  },
});


export default Navigation;
