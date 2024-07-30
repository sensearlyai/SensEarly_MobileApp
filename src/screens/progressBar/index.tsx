import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constant/colors';

const ProgressBar = ({ totalTasks, completedTasks }: any) => {
  const progress = totalTasks !== 0 ? (completedTasks / totalTasks) * 100 : completedTasks;

  return (
    <View style={styles.container}>
      <View style={styles.taskCountContainer}>
        <Text style={styles.taskCountText}>Progress {`${completedTasks}/${totalTasks}`}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    width: 200
  },
  taskCountContainer: {
    marginBottom: 4,
  },
  taskCountText: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.LightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#00C853', // Green color for completed progress
  },
  progressText: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default ProgressBar;
