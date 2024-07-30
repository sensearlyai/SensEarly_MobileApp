// ScreenA.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../../styles/styles';
import Colors from '../../constant/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircleXmark, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export const TermsAndCondition = ({ navigation }: any) => {

  const [isChecked, setIsChecked] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success')
  const [isLoading, setIsLoading] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

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

  const saveTermsAndCondition = async () => {

    if (!isChecked) {
      setAlertVisible(true);
      setType("error");
      setTitle("Error");
      setMessage("Please accept terms and conditions");
      return;
    }

    let value = isChecked ? "Y" : "N"
    getAccessToken().then(token => {
      if (token) {
        setIsLoading(true);
        getUserId().then(userId => {
          fetch(config.BASE_URL + 'user/InlineSave/' + userId + '/Terms And Condition', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'Authorization': `Bearer ${token}`,
            },
            body: value,
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              setIsLoading(false);
              setAlertVisible(true);
              setType("success");
              setTitle("Success");
              setMessage("Terms and conditions updated successfully.");
            })
            .catch((error: any) => {
              setIsLoading(false);
              setAlertVisible(true);
              setType("error");
              setTitle("Error");
              setMessage(error.toString());
            });
        })
      } else {
        setIsLoading(false);
        console.error('Access token not found');
      }
    });
  };


  const handleOk = () => {
    console.log('OK button pressed');
    setAlertVisible(false);
    if (title == "Success") {
      navigation.navigate("DashboardContainer");
    }
  };


  return (
    <View style={[styles.container, { padding: 10 }]}>
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
      <View style={{ height: '80%', margin: 10 }}>
        <Text style={styles.headerText}>Terms & conditions</Text>
        <Text style={[styles.normalText, { marginBottom: 20 }]}>Update 1/8/2022</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>1. Introduction</Text>
          <Text style={[styles.normalText, { textAlign: 'justify' }]}>
            Ad veniam reprehenderti exerciation aute deserunt
            minimveniam. volupate irure consequat do ad aliquip nisi.
          </Text>
        </View>
        <View style={{ height: '20%', marginBottom: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>2. Who can use this app?</Text>
          <Text style={[styles.normalText, { marginBottom: 20, textAlign: 'justify' }]}>
            Ut nostrud cupidatat elit est eiusmod voluptate dolore nisi. Eiusmod deserunt sit excepteur nisi reprehenderit dolor labore magna pariatur nisi
          </Text>
          <Text style={[styles.normalText, { textAlign: 'justify' }]}>
            Elit deserunt cupidatat anim consequat reprehenderit voluptate. Labore labore non consequat ut voluptate reprehenderit est. Nostrud dolore et magna tempor co
          </Text>
        </View>
      </View>
      <View style={{ margin: 10 }}>
        <TouchableOpacity onPress={toggleCheckbox} style={styles.checkboxContainer}>
          {isChecked ? (
            <FontAwesomeIcon icon={faSquareCheck} size={24} color={Colors.defaultColor} />
          ) : (
            <FontAwesomeIcon icon={faSquare} size={24} color={Colors.LightGray} />
          )}
          <Text style={[styles.label, { color: Colors.SubHeaderTextColor }]}>I Agree to the above terms and conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { saveTermsAndCondition() }} style={{ height: 70, backgroundColor: Colors.defaultColor, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
          <Text style={styles.buttonText}>Agree and Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
