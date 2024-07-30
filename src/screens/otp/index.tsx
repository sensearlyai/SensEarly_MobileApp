import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, PermissionsAndroid, Text, TouchableOpacity, Modal } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import SmsListener from 'react-native-android-sms-listener';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircleXmark, faSms } from '@fortawesome/free-solid-svg-icons';
import Colors from '../../constant/colors';
import styles from '../../styles/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTPScreen = (props: any) => {
  const route: any = useRoute();
  const { phoneNumber } = route.params;

  const [otp, setOtp] = useState('');
  const [termsAndConditionFlag, setTermsAndConditionFlag] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success')
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkSMSPermission();
      setOtp('');
    }, [])
  );

  const checkSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to your SMS messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        startSmsListener();
      } else {
        Alert.alert(
          'Permission Denied',
          'You need to grant SMS permission to use this feature.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      }
    } catch (err: any) {
      console.log("Error : ", err)
    }
  };

  const startSmsListener = () => {
    const subscription = SmsListener.addListener((message: any) => {
      const regex = /(\d{6})/g; // Match 6-digit OTP
      const match = message.body.match(regex);
      if (match) {
        setOtp(match[0]);
      }
    });

    return () => {
      subscription.remove();
    };
  };

  const handleVerifyOtp = () => {
    console.log("STrat Signin error", otp, otp == "")
    if (otp == '') {
      setAlertVisible(true);
      setType("error");
      setTitle("Error");
      setMessage("Please enter code.");
      setOtp('');
      return;
    }

    if (otp.length != 6) {
      console.log("STrat Signin error")
      setAlertVisible(true);
      setType("error");
      setTitle("Error");
      setMessage("Please enter valid code.");
      setOtp('');
      return;
    }

    onLogin();

  };


  const onLogin = () => {
    setIsLoading(true);
    fetch(config.BASE_URL + 'user/verifyMobileOtp/' + otp + "/" + phoneNumber, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Handle the response data
        setIsLoading(false);
        if (data != undefined) {
          setTermsAndConditionFlag(data.termsAndCondition)
          if (data.success) {
            try {
              await AsyncStorage.setItem('userId', data.userId.toString());
              await AsyncStorage.setItem('token', data.accessToken);
            } catch (error) {
              console.error('Error storing user Id & token:', error);
            }
            setAlertVisible(true);
            setType("success");
            setTitle("Login Success");
            setMessage("User Signed In Successfully");
          } else {
            setAlertVisible(true);
            setType("error");
            setTitle("Error");
            setMessage("Invalid User");
          }
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        setAlertVisible(true);
        setType("error");
        setTitle("Error");
        setMessage(error.toString());
      });
  }




  const handleOk = () => {
    setAlertVisible(false);
    if (title == "Login Success") {
      AsyncStorage.removeItem("selectedDate");
      if (!termsAndConditionFlag)
        props.navigation.navigate('TermsAndCondition');
      else
        props.navigation.navigate('DashboardContainer');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
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
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <View style={{
          backgroundColor: Colors.defaultColor,
          borderRadius: 50,
          width: 70,
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <FontAwesomeIcon icon={faSms} color={Colors.White} size={35} />
        </View>

        <Text style={{ fontWeight: 'bold', fontSize: 20, color: Colors.Black }}>Verification</Text>
        <Text style={{ fontSize: 16, color: Colors.Black }}>We will send you a code to your phone number.</Text>
        <OtpInput
          numberOfDigits={6}
          focusColor="green"
          focusStickBlinkingDuration={500}
          onTextChange={(text) => { setOtp(text) }}
          onFilled={(text) => { console.log(`OTP is ${text}`) }}
          theme={{
            containerStyle: otpStyles.container,
            inputsContainerStyle: otpStyles.inputsContainer,
            pinCodeContainerStyle: otpStyles.pinCodeContainer,
            pinCodeTextStyle: otpStyles.pinCodeText,
            focusStickStyle: otpStyles.focusStick,
            focusedPinCodeContainerStyle: otpStyles.activePinCodeContainer,
          }}
        />
        <Text style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', fontSize: 15, marginTop: 5, color: Colors.defaultColor, textDecorationLine: 'underline' }}>
          Resend Code
        </Text>

        <TouchableOpacity onPress={() => { handleVerifyOtp() }} style={[styles.button, { marginTop: 20, width: '100%' }]}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPScreen;

const otpStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  inputsContainer: {
    marginHorizontal: 10,
  },
  pinCodeContainer: {
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.defaultColor,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  pinCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.Black
  },
  focusStick: {
    height: 30,
    width: 2,
    backgroundColor: Colors.defaultColor,
  },
  activePinCodeContainer: {
    borderColor: Colors.defaultColor,
  },
});