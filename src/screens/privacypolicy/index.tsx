// PrivacyPolicy.js
import React, { useEffect } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styles from '../../styles/styles';

const PrivacyPolicy = (props:any) => {
  return (
<ScrollView style={{ flex: 1, margin: 10 }}>
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.headerText}>Privacy Policy</Text>
    {/* <Text style={[styles.normalText, { marginBottom: 20 }]}>Effective Date: 1/8/2022</Text> */}

    {/* 1. Introduction */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.headerText }}>1. Introduction</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black'  }]}>
        Sensearly Inc. ("Sensearly," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website at https://sensearly.ai, including any subdomains (collectively, the "Website"), and use our mobile application ("App").
      </Text>
    </View>

    {/* 2. Information We Collect */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>2. Information We Collect</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        <Text style={{ fontWeight: 'bold' }}>Personal Information:</Text> When you use our Website, its subdomains, or App, we may collect personal information such as your name, email address, phone number, health-related data, and any other information you provide to us.
      </Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        <Text style={{ fontWeight: 'bold' }}>Usage Information:</Text> We collect information about your use of the Website, its subdomains, and App, including your IP address, browser type, access times, device information, and referring website addresses.
      </Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        <Text style={{ fontWeight: 'bold' }}>Cookies and Tracking Technologies:</Text> We may use cookies and similar technologies to collect information about your interactions with our Website, its subdomains, and App. You can manage your cookie preferences through your browser settings.
      </Text>
    </View>

    {/* 3. How We Use Your Information */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>3. How We Use Your Information</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        We may use your information to:
      </Text>
      <Text style={[styles.normalText, { marginLeft: 10,fontWeight: 'bold',color: 'black' }]}>
        - Provide and maintain our services on the Website, its subdomains, and the App.{'\n'}
        - Improve, personalize, and enhance your experience on the Website, its subdomains, and the App.{'\n'}
        - Respond to your inquiries and provide customer support.{'\n'}
        - Communicate with you about updates, promotions, and other information related to our services.{'\n'}
        - Monitor and analyze usage and trends to improve the Website, its subdomains, and the App.{'\n'}
        - Comply with legal obligations and protect our rights.
      </Text>
    </View>

    {/* 4. Disclosure of Your Information */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>4. Disclosure of Your Information</Text>
      <Text style={[styles.normalText, { textAlign: 'justify' ,fontWeight: 'bold',color: 'black'}]}>
        We may share your information with:
      </Text>
      <Text style={[styles.normalText, { textAlign: 'justify' }]}>
  - <Text style={{ fontWeight: 'bold', color: 'black' }}>Service Providers:</Text> <Text style={{ fontWeight: 'bold', color: 'black' }}>Third-party vendors who help us operate the Website, its subdomains, and the App and provide our services.{'\n'}</Text>
  - <Text style={{ fontWeight: 'bold', color: 'black' }}>Legal Authorities:</Text> <Text style={{ fontWeight: 'bold', color: 'black' }}>When required by law or in response to valid requests by public authorities (e.g., a court or government agency).{'\n'}</Text>
  - <Text style={{ fontWeight: 'bold', color: 'black' }}>Business Transfers:</Text> <Text style={{ fontWeight: 'bold', color: 'black' }}>In the event of a merger, acquisition, or sale of assets, your information may be transferred to a new entity.</Text>
</Text>

    </View>

    {/* 5. Your Choices */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>5. Your Choices</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        <Text style={{ fontWeight: 'bold' }}>Access and Update Your Information:</Text> You have the right to access and update your personal information. You may contact us at support@sensearly.ai to request updates or changes to your information.
      </Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black'}]}>
        <Text style={{ fontWeight: 'bold' }}>Opt-Out:</Text> You can opt out of receiving promotional communications from us by following the unsubscribe instructions in those communications or by contacting us directly at support@sensearly.ai.
      </Text>
    </View>

    {/* 6. Security of Your Information */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>6. Security of Your Information</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
      </Text>
    </View>

    {/* 7. Children's Privacy */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>7. Children's Privacy</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        Our Website, its subdomains, and App are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that we have collected information about your child, please contact us at support@sensearly.ai.
      </Text>
    </View>

    {/* 8. Changes to This Privacy Policy */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>8. Changes to This Privacy Policy</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the Website, its subdomains, or the App after any changes constitutes your acceptance of the revised Privacy Policy.
      </Text>
    </View>

    {/* 9. Contact Us */}
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.SubHeaderTextColor }}>9. Contact Us</Text>
      <Text style={[styles.normalText, { textAlign: 'justify',fontWeight: 'bold',color: 'black' }]}>
        If you have any questions or concerns about this Privacy Policy, please contact us at support@sensearly.ai.
      </Text>
    </View>
  </View>
  
  <Button title="Back to Login" onPress={() => props.navigation.navigate('Login')} />
</ScrollView>

  );
};

export default PrivacyPolicy;
