import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import styles from '../../styles/styles'; // Import external styles
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constant/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faCheckCircle, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';

import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import { CrendentialsContext } from '../../constant/CredentialsContext';

export const DailyTask = ({ navigation }: any) => {
  const [currentDate, setCurrentDate] = useState('');
  const [completedTask, setCompletedTask] = useState(0);
  const [pendingTask, setPendingTask] = useState(0);
  const [totalTask, setTotalTask] = useState(0);
  const [list, setList] = useState([]);
  const { storedCrendentials } = useContext(CrendentialsContext);

  useEffect(() => {
    setCurrentDate(getCurrentDate());
    setSelectedDate(new Date());
    loadQuestionare(new Date());
  }, []);

  const getCurrentDate = () => {
    const currentDateObj = new Date();

    const year = currentDateObj.getFullYear();
    const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateObj.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  const getBaseUrlAndToken = async () => {
    try {
      const [token, baseUrl] = await Promise.all([
        storedCrendentials,
        AsyncStorage.getItem('baseUrl')
      ]);
      console.log(token, baseUrl)
      return { token, baseUrl };
    } catch (error) {
      console.error('Error retrieving data:', error);
      return { token: null, baseUrl: null };
    }
  }

  const getSelectedDate = async () => {
    try {
      const date = await AsyncStorage.getItem('selectedDate');
      return date;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const loadQuestionare = async (date: any) => {
    const currentDate = date.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    // const baseUrl = await AsyncStorage.getItem('baseUrl');
    // const url = baseUrl + `task/loadQuestionare/${currentDate}`;
    const { token, baseUrl } = await getBaseUrlAndToken();
    if (token && baseUrl) {
      setIsLoading(true);
      fetch(`${baseUrl}task/loadQuestionare/${currentDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
        .then(data => {
          const newCompletedTask = data.completedTask;
          const newPendingTask = data.pendingTask;
          const newTotalTask = data.totalTask;
          const newList = data.list || []; console.log(data, 'data')
          setCompletedTask(newCompletedTask);
          setPendingTask(newPendingTask);
          setTotalTask(newTotalTask);
          setList(newList);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          Alert.alert(
            'Error',
            error.toString(),
            [
              {
                text: 'Okay',
                onPress: () => {
                }
              }
            ]
          );
        });
    }
    else {
      setIsLoading(false);
      console.error('Access token not found1');
    }
    // getAccessToken().then(token => {
    //   if (token) {
    //     setIsLoading(true);
    //     fetch(url, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`,
    //       },
    //     })
    //       .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //       })
    //       .then(data => {
    //         setIsLoading(false);
    //         const newCompletedTask = data.completedTask;
    //         const newPendingTask = data.pendingTask;
    //         const newTotalTask = data.totalTask;
    //         const newList = data.list;
    //         console.log(data,'data')
    //         setCompletedTask(newCompletedTask);
    //         setPendingTask(newPendingTask);
    //         setTotalTask(newTotalTask);
    //         setList(newList);

    //       })
    //       .catch(error => {
    //         setIsLoading(false);
    //         Alert.alert(
    //           'Error',
    //           error.toString(),
    //           [
    //             {
    //               text: 'Okay',
    //               onPress: () => {
    //               }
    //             }
    //           ]
    //         );
    //       });
    //   } else {

    //   }
    // });
  }

  const loadQuestionData = (task: any, module: any) => {
    getSelectedDate().then(async date => {
      let currentDate = new Date().toISOString().split('T')[0];
      console.log(currentDate, 'dateformat')
      if (date != null)
        currentDate = new Date(date).toISOString().split('T')[0];
      // const baseUrl = await AsyncStorage.getItem('baseUrl');
      // const url =baseUrl + `task/loadCategoryQuestions/` + task.id + "/" + currentDate;
      const { token, baseUrl } = await getBaseUrlAndToken();
      console.log(token, "token");
      if (token && baseUrl) {
        setIsLoading(true);
        fetch(`${baseUrl}task/loadCategoryQuestions/${task.id}/${currentDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
          .then(data => {
            setIsLoading(false);
            const response = data.list || [];
            navigation.navigate(module, { questionData: data.list[0] });
          })
          .catch(error => {
            setIsLoading(false);
            Alert.alert(
              'Error',
              error.toString(),
              [
                {
                  text: 'Okay',
                  onPress: () => {
                  }
                }
              ]
            );
          });
      } else {
        setIsLoading(false);
        console.error('Access token not found2');
      }
    })
  }

  useFocusEffect(
    React.useCallback(() => {
      getSelectedDate().then((date: any) => {
        if (date != null) {
          setSelectedDate(new Date(date));
          loadQuestionare(new Date(date));
        } else {
          setSelectedDate(new Date());
          loadQuestionare(new Date());
        }
      })
    }, [])
  );

  const navigateFunc = (task: any) => {
    console.log(task.categoryName, 'nameeeeeeeeeeeeeeeee')
    if (task.categoryName.includes('Temperature')) {
      loadQuestionData(task, 'Temperature');
    } else if (task.categoryName.includes('Weight')) {
      loadQuestionData(task, 'Weight');
    } else if (task.categoryName.includes('Pic')) {
      loadQuestionData(task, 'DailyPic')
    } else if (task.categoryName.includes('BP')) {
      loadQuestionData(task, 'BP')
    } else {
      navigation.navigate('DailyQuestionarie', { categoryId: task.id, categoryName: task.categoryName });
    }
  }

  const TaskCard = ({ task }: any) => {
    return (
      <Pressable onPress={() => navigateFunc(task)}>
      <View style={dailyTaskStyle.card} >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: Colors.DarkGray, textAlign: 'center', paddingLeft: '35%' }}>
            {task.categoryTime}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 10, color: Colors.DarkGray, marginRight: 5 }}>
              {task.categoryTimeFormat}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '80%' }}>
            <Text style={dailyTaskStyle.title}>{task.categoryName}</Text>
            <Text style={dailyTaskStyle.description}>{task.categoryDiscription}</Text>
          </View>
          <View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end' }}>
            {task.completed
              ? <FontAwesomeIcon icon={faCheckCircle} size={50} color={Colors.PrimaryDark} />
              : <FontAwesomeIcon icon={faHourglassEnd} size={50} color='#F7CB73' />
            }
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Badge text="Fitness Regimen" />
          <Badge text="Mandatory" />
          <Badge text="Before Sunset" />
        </View> */}
      </View>
      </Pressable>
    );
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Calculate the minimum selectable date
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const handleDateChange = async (event: any, selectedDate: any) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    console.log(currentDate, "curent date dd");
    await AsyncStorage.setItem('selectedDate', currentDate.toString());
    loadQuestionare(currentDate);
  };
  const progress = totalTask !== 0 ? (completedTask / totalTask) * 100 : completedTask;

  return (
    <ScrollView contentContainerStyle={[styles.scrollViewContainer, { paddingTop: '1%', backgroundColor: Colors.White }]}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      <View style={{ flex: 1, margin: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ width: '50%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 2, borderColor: Colors.LightGray, padding: 3, borderRadius: 5 }}>
              <Text style={[styles.subText, { paddingRight: 10 }]}>{moment(selectedDate).format('DD/MM/YYYY')}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <FontAwesomeIcon icon={faCalendarAlt} size={27} color="red" />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                minimumDate={sevenDaysAgo}
                maximumDate={new Date()} // Optional: to disable future dates
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={{ width: '45%' }}>
            {isLoading ? (
          <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />):list.length > 0
              ?
              <View style={styles.container}>
                <View style={styles.taskCountContainer}>
                  <Text style={styles.taskCountText}>Progress {`${completedTask}/${totalTask}`}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progress, { width: `${progress}%` }]} />
                </View>
              </View>
              // <ProgressBar totalTasks={totalTask} completedTasks={completedTask} />
              : null}
          </View>
        </View>
        <View>

        </View>

        {isLoading ? (
          <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
        ) : list.length > 0
          ? <View style={{ borderWidth: 1, borderColor: Colors.defaultColor, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
            <View style={{ flexDirection: 'row', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
              <Text style={[styles.subText, { backgroundColor: Colors.defaultColor, color: Colors.White, padding: 10, width: '70%' }]}>Pending Task - {pendingTask}</Text>
              <Text style={{ width: '5%' }}></Text>
              {/* <View style={{ flexDirection: 'row', width: '20%', alignSelf: 'center', padding: 5, backgroundColor: Colors.defaultlightColor, }}>
              <FontAwesomeIcon icon={faFilter} size={15} color={Colors.defaultColor} />
              <Text style={[styles.normalText, { textAlign: 'right', color: Colors.defaultColor, paddingLeft: 10 }]}>
                Filter
              </Text>
            </View> */}
              <Text style={{ width: '1%' }}></Text>
            </View>

            {list.map((task: any, index: any) => (
              <TaskCard key={index} task={task} />
            ))}
          </View>
          : <View>
            <Text style={styles.subText}>No Task Found.</Text>
          </View>}
      </View>
    </ScrollView>
  );
};

const dailyTaskStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.Black
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.SubHeaderTextColor
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  completed: {
    fontSize: 14,
    color: '#00C853',
    fontWeight: 'bold',
  },
});
