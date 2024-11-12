// ScreenA.js
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import styles from '../../styles/styles';
import Colors from '../../constant/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircleXmark, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { CrendentialsContext } from '../../constant/CredentialsContext';

export const TermsAndCondition = ({ navigation }: any) => {

  const [isChecked, setIsChecked] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success')
  const [isLoading, setIsLoading] = useState(false);
  const { storedCrendentials } = useContext(CrendentialsContext);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

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
        getUserId().then(async userId => {
          const baseUrl = await AsyncStorage.getItem('baseUrl');
          fetch(baseUrl + 'user/InlineSave/' + userId + '/Terms And Condition', {
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
      <ScrollView style={{ flex: 1, margin: 10 }}>
      <View style={{ marginBottom: 10 }}>
  <Text style={styles.headerText}>Terms & Conditions</Text>
  {/* <Text style={[styles.normalText, { marginBottom: 20 }]}>Update 1/8/2022</Text> */}

  {/* 1. Introduction */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>1. Introduction</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      These Terms and Conditions ("Terms") govern your use of the website operated by Sensearly Inc. ("Sensearly," "we," "our," or "us") located at https://sensearly.ai, including any subdomains (collectively, the "Website") and the Sensearly mobile application ("App"). By accessing or using our Website, any subdomains, or the App, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, you should not use the Website, subdomains, or App.
    </Text>
  </View>

  {/* 2. Modifications to the Terms */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>2. Modifications to the Terms</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      We may update these Terms from time to time without prior notice. You are encouraged to review the Terms periodically for any changes. Your continued use of the Website, its subdomains, or the App after any changes to the Terms constitutes your acceptance of the updated Terms.
    </Text>
  </View>

  {/* 3. Use of the Website, Subdomains, and App */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>3. Use of the Website, Subdomains, and App</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      You agree to use the Website, its subdomains, and the App only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of these services by any third party. You are prohibited from violating or attempting to violate the security of the Website, its subdomains, or the App, including accessing data not intended for you, logging into a server or account which you are not authorized to access, or attempting to probe, scan, or test the vulnerability of the system or network.
    </Text>
  </View>

  {/* 4. Intellectual Property Rights */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>4. Intellectual Property Rights</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      All content on the Website, its subdomains, and the App, including but not limited to text, images, graphics, and software, is the property of Sensearly Inc. or its content suppliers and is protected by applicable intellectual property laws. You may not modify, reproduce, distribute, create derivative works from, or in any way exploit any of the content on the Website, its subdomains, or the App without our express written permission.
    </Text>
  </View>

  {/* 5. Disclaimer of Warranties */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>5. Disclaimer of Warranties</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      The content on the Website, its subdomains, and the App is provided "as is" without any warranties, express or implied. Sensearly Inc. disclaims all warranties, including but not limited to warranties of accuracy, reliability, merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Website, its subdomains, or the App will operate without interruption or error, or that they are free of viruses or other harmful components.
    </Text>
  </View>

  {/* 6. Limitation of Liability */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>6. Limitation of Liability</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      Sensearly Inc. will not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of, or inability to use, the Website, its subdomains, or the App, even if we have been advised of the possibility of such damages. Your sole remedy for dissatisfaction with the Website, its subdomains, the App, or any content is to stop using these services.
    </Text>
  </View>

  {/* 7. Indemnification */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>7. Indemnification</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      You agree to indemnify, defend, and hold harmless Sensearly Inc., its affiliates, officers, directors, employees, agents, and licensors from any claim, demand, liability, or expense, including reasonable attorneys' fees, arising out of or related to your use of the Website, its subdomains, or the App, your breach of these Terms, or your violation of any law or the rights of a third party.
    </Text>
  </View>

  {/* 8. Third-Party Links */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>8. Third-Party Links</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      The Website, its subdomains, and the App may contain links to third-party websites. These links are provided for your convenience only, and we do not endorse or make any representations about them. We are not responsible for the content, privacy policies, or practices of any third-party websites. Your use of any third-party website is at your own risk.
    </Text>
  </View>

  {/* 9. Privacy Policy */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>9. Privacy Policy</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      Your use of the Website, its subdomains, and the App is also governed by our Privacy Policy, which can be found here.
    </Text>
  </View>

  {/* 10. Governing Law */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>10. Governing Law</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Sensearly Inc. is headquartered, without regard to its conflict of law principles. Any disputes arising from or relating to these Terms or your use of the Website, its subdomains, or the App will be resolved exclusively in the courts of that jurisdiction.
    </Text>
  </View>

  {/* 11. Contact Us */}
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>11. Contact Us</Text>
    <Text style={[styles.normalText, { textAlign: 'justify' }]}>
      If you have any questions or concerns about these Terms, please contact us at support@sensearly.ai.
    </Text>
  </View>
  </View>
</ScrollView>
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
