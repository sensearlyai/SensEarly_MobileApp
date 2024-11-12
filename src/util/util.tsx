import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

// Function to get token and base URL
// DropdownContext.js
import React, { createContext, useContext, useState } from 'react';
import { CrendentialsContext } from '../constant/CredentialsContext';

export const DropdownContext = createContext<any>(null);

export const DropdownProvider = ({ children }: any) => {
  const [value, setValue] = useState<string | null>(null);
  const [newBaseUrl, setNewBaseUrl] = useState<string | null>(null);

  return (
    <DropdownContext.Provider value={{ value, setValue, newBaseUrl, setNewBaseUrl }}>
      {children}
    </DropdownContext.Provider>
  );
};

export function logCurrentStorage() {
  AsyncStorage.getAllKeys().then((keyArray) => {
    AsyncStorage.multiGet(keyArray).then((keyValArray) => {
      let myStorage: any = {};
      for (let keyVal of keyValArray) {
        myStorage[keyVal[0]] = keyVal[1]
      }

      console.log('CURRENT STORAGE: ', myStorage);
    })
  });
}
const getTokenAndUrl = async () => {
const { storedCrendentials } = useContext(CrendentialsContext);
  
  try {
    const [token, baseUrl] = await Promise.all([
      storedCrendentials,
      AsyncStorage.getItem('baseUrl'),
    ]);
    return { token, baseUrl };
  } catch (error) {
    console.error('Error retrieving data:', error);
    return { token: null, baseUrl: null };
  }
};

// Function to fetch CometChat credentials and initialize the SDK
const initializeCometChat = async () => {
  const { token, baseUrl } = await getTokenAndUrl();

  if (token && baseUrl) {
    try {
      const response = await fetch(`${baseUrl}user/cometChatCredentials/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      let uikitSettings = {
        appId: data.appId,
        authKey: data.authKey,
        region: data.region,
      };

      console.log(uikitSettings, 'uikitSettings');

      await CometChatUIKit.init(uikitSettings);

      if (CometChat.setSource) {
        CometChat.setSource('ui-kit', Platform.OS, 'react-native');
      }

      console.log("CometChatUiKit successfully initialized");
    } catch (error) {
    //   Alert.alert('Error', error.toString(), [{ text: 'Okay' }]);
    }
  } else {
    console.error('Access token or base URL not found');
  }
};

export { initializeCometChat };
