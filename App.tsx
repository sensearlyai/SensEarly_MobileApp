import React, { Component, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, SafeAreaView, StatusBar } from 'react-native';
import Navigation from './src/routers/navigation';
import { LogBox } from 'react-native';
import styles from './src/styles/styles';
import Colors from './src/constant/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, persistor } from './src/util/store';
import { CrendentialsContext } from './src/constant/CredentialsContext';
// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);
//Ignore all log notifications
LogBox.ignoreAllLogs();

const App: React.FC = () => {
  const [storedCrendentials, setStoredCredentials] = useState<object | null>(null);

  useEffect(() => {
    getPermissions();
    checkLoginCredentials();
  }, []);

  const  getPermissions=async ()=> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        console.log('Permissions granted:', granted);
      } catch (err) {
        console.warn(err);
      }
    }
  }

 const checkLoginCredentials=()=>{
  AsyncStorage.getItem('authToken').then((result)=>{
    if(result !== null){
      setStoredCredentials(JSON.parse(result));
    }else{
      setStoredCredentials(null);

    }
  })
 }
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        <StatusBar
          backgroundColor={Colors.White} // Background color of the status bar
          barStyle="dark-content" // Text color of the status bar (can be 'default', 'light-content', 'dark-content')
          translucent={false} // Whether the status bar is translucent (true/false)
        />
        <CrendentialsContext.Provider value={{storedCrendentials,setStoredCredentials}}>
        <Navigation />
 
        </CrendentialsContext.Provider>
         {/* <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
   
      </PersistGate>
    </Provider> */}
        
      </SafeAreaView>
    );

}

export default App;
