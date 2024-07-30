import React, { useEffect } from 'react';
import {
  View
} from 'react-native';
import styles from '../../styles/styles';
import BottomNavigation from '../../routers/bottomNavigation';
export const DashboardContainer = (props: any) => {
  useEffect(() => { }, []);

  return (
    <View style={styles.container}>
      <BottomNavigation />
    </View>
  );
};
