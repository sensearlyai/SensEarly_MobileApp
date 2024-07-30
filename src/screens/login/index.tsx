import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  BackHandler,
} from 'react-native';
import styles from '../../styles/styles';
import Colors from '../../constant/colors';
import config from '../../constant/config';
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect } from '@react-navigation/native';

export const Login = (props: any) => {

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.7; // 30% of the screen width
  const imageHeight = imageWidth * (3 / 4); // 4:3 aspect ratio
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isValidPhoneNumber = (phoneNumber: any) => {
    // Regular expression to match a 10-digit phone number
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSignIn = () => {
    if (phoneNumber == '') {
      console.log("STrat Signin error")
      setAlertVisible(true);
      setType("error");
      setTitle("Error");
      setMessage("Please enter phone number");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setAlertVisible(true);
      setType("error");
      setTitle("Error");
      setMessage("Please enter a valid phone number");
      return;
    }
    setIsLoginLoading(true);
    fetch(config.BASE_URL + 'user/isUserExists/' + phoneNumber, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data) {
          setIsLoginLoading(false);
          props.navigation.navigate('OTP', { phoneNumber });
        } else {
          setIsLoginLoading(false);
          setAlertVisible(true);
          setType("error");
          setTitle("Error");
          setMessage("Invalid Phone Number");
          setPhoneNumber("");
        }
      })
      .catch((error: any) => {
        setIsLoginLoading(false);
        console.error('Error:', error);
        setAlertVisible(true);
        setType("error");
        setTitle("Error");
        setMessage(error.toString());
      });
  };

  useEffect(() => {
    // const backAction = () => {
    //   Alert.alert('Back button pressed!');
    //   return true;
    // };
    // BackHandler.addEventListener('hardwareBackPress', backAction);
    // return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoginLoading(false);
      setPhoneNumber('');
    }, [])
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');

  const handleOk = () => {
    console.log('OK button pressed');
    setAlertVisible(false);
    setIsLoginLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Spinner
        visible={isLoginLoading && phoneNumber != ''}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      <View style={{ flex: 1 }}>
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
        <View style={[styles.card, { margin: 10 }]}>
          <Image source={require('../../assets/images/loginImg.png')}
            style={{ width: imageWidth, height: imageHeight, borderWidth: 2, borderColor: Colors.LightGray, marginVertical: 10, alignSelf: 'center' }}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.card, { margin: 10 }]}>
          <Text style={[styles.subText, { marginBottom: 20 }]}>Sign in to your account</Text>
          <TextInput
            style={{
              height: 50, width: '100%', borderColor: isFocused ? Colors.defaultColor : Colors.Gray, color: 'black',
              borderWidth: 2, marginBottom: 20, paddingHorizontal: 10, borderRadius: 10
            }}
            placeholder="Enter your phone number"
            placeholderTextColor={Colors.PlaceholderColor}
            keyboardType="phone-pad"
            onChangeText={text => setPhoneNumber(text)}
            value={phoneNumber}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSignIn}
          />
          <TouchableOpacity onPress={() => { handleSignIn() }} style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};