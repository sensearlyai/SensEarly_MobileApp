import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavigation from './bottomNavigation';
import { DashboardContainer } from '../screens/dashboardContainer';
import { Login } from '../screens/login';
import { Image, Text, View } from 'react-native';
import styles from '../styles/styles';
import Colors from '../constant/colors';
import { TermsAndCondition } from '../screens/termsAndCondition';

import OTPScreen from '../screens/otp';

const Stack = createStackNavigator();
const CustomLoginHeader = () => (
  <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', width: '87%' }}>
        <Image source={require('../assets/images/logo.png')} style={{ width: 30, height: 30 }} />
        <Text style={[styles.headerText, { paddingLeft: 10 }]}>Mito Power</Text>
      </View>

      <Text style={[styles.subText, { textAlign: 'right', justifyContent: 'center', alignSelf: 'center' }]}>V1.35</Text>
    </View>
  </View>
);

const CustomTermsAndConditionHeader = () => (
  <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
    <Image source={require('../assets/images/termsAndConditionIcon.png')} style={{ width: 50, height: 50 }} />
  </View>
);



const Navigation = ({ navigation }: any) => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            header: () => <CustomLoginHeader />,
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
        <Stack.Screen
          name="DashboardContainer"
          component={DashboardContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
