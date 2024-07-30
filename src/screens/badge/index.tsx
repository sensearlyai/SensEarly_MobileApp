import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constant/colors';

const Badge = ({ text }: any) => {
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: Colors.Gray,
    borderRadius: 7,
    padding: 3, marginLeft: 5
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Badge;
