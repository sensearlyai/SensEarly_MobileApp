import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Navigation from './src/routers/navigation';
import { LogBox } from 'react-native';
import styles from './src/styles/styles';
import Colors from './src/constant/colors';
import { NavigationContainer } from '@react-navigation/native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);
//Ignore all log notifications
LogBox.ignoreAllLogs();

class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        <StatusBar
          backgroundColor={Colors.White} // Background color of the status bar
          barStyle="dark-content" // Text color of the status bar (can be 'default', 'light-content', 'dark-content')
          translucent={false} // Whether the status bar is translucent (true/false)
        />
          <Navigation />
      </SafeAreaView>
    );
  }
}

export default App;
