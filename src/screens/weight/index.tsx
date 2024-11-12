import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMinus, faPlus, faWeight } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constant/colors';
import styles from '../../styles/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import ToastMessage from '../toast';
import { CrendentialsContext } from '../../constant/CredentialsContext';

export const Weight = ({ navigation }: any) => {
  const route: any = useRoute();
  const { questionData } = route.params; // Access categoryId directly from route.params

  const [weight, setWeight] = useState('');
  const [confirmWeight, setConfirmWeight] = useState('');
  const [data, setData]: any = useState(null);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const weightInputRef = useRef<TextInput>(null);
  const confrimWeightInputRef = useRef<TextInput>(null);
  const { storedCrendentials } = useContext(CrendentialsContext);

  const [showToast, setShowToast] = useState(false);
  const handleIncrement = () => {
    if (!confirmWeightFlag) {
      const newWeight = parseFloat(weight) + 1;
      if (newWeight >= 0)
        setWeight(newWeight.toFixed(1)); // Limit to 1 decimal place
    } else {
      const newWeight = parseFloat(confirmWeight) + 1;
      if (newWeight >= 0)
        setConfirmWeight(newWeight.toFixed(1)); // Limit to 1 decimal place
    }
  };

  const handleDecrement = () => {
    if (!confirmWeightFlag) {
      const newWeight = parseFloat(weight) - 1;
      if (newWeight >= 0)
        setWeight(newWeight.toFixed(1)); // Limit to 1 decimal place
    } else {
      const newWeight = parseFloat(confirmWeight) - 1;
      if (newWeight >= 0)
        setConfirmWeight(newWeight.toFixed(1)); // Limit to 1 decimal place
    }
  };

  useEffect(() => { }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadWeightLookupValue();
      setConfirmWeightFlag(false);
      setConfirmWeight("");
      setWeight("");
      setData(questionData);
      setTimeout(() => {
        weightInputRef?.current?.focus();
      }, 100);
      if (questionData.answerFlag) {
        const responseAnswer = questionData.answer;
        const [weightValue, weightUnit] = responseAnswer.split(' ');
        setWeight(weightValue);
        handleTabChange(weightUnit == 'kg' ? 1 : 2);
      }
    }, []),
  );

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

  const onSubmit = (exceptionFlag: boolean, expectionValue: string, exceptionCondition: boolean) => {
    if (parseFloat(weight) <= 0) {
      handleShowToast();
      setType('error');
      setMessage('Weight entered cannopt be below less than 0');
      return;
    }
    getUserId().then(async userId => {
      let requestBody = {
        id: data.qaResponseId,
        patientId: userId,
        patientName: '',
        questionId: data.id,
        questionName: '',
        answer: `${confirmWeightFlag ? confirmWeight : weight} ${activeTab === 1 ? 'kg' : 'lb'}`,
        dateOfResponse: '',
        userBadge: '',
        image: '',
        nestedQuestion: [],
        questionType: data.questionType,
      };
      const baseUrl = await AsyncStorage.getItem('baseUrl');

      const url = baseUrl + `task/saveResponse`;
      getAccessToken().then((token: any) => {
        setIsLoading(true);
        if (token) {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(response => {
              setIsLoading(false);
              const updatedData = {
                ...data,
                qaResponseId: response.qaReponseId,
                answer: `${confirmWeightFlag ? confirmWeight : weight} ${activeTab === 1 ? 'kg' : 'lb'}`
              };
              console.log(response,"asdd")
              setData(updatedData);
              console.log(updatedData,"updated data");
              if (updatedData.answerFlag) {
                const responseAnswer = updatedData.answer;
                const [weightValue, weightUnit] = responseAnswer.split(' ');
                setWeight(weightValue);
                handleTabChange(weightUnit == 'kg' ? 1 : 2);
                setConfirmWeight("");
                setConfirmWeightFlag(false);
              }
              handleShowToast();
              setType('success');
              setMessage('Weight data saved successfully');
              if (exceptionFlag) saveException(expectionValue, exceptionCondition);
            })
            .catch(error => {
              setIsLoading(false);
              handleShowToast();
              setType('error');
              setMessage(error.toString());
            });
        } else {
          console.error('Access token not found');
        }
      });
    });
  };

  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (tabIndex: any, toggle?: any) => {
    if (activeTab != tabIndex) {
      setActiveTab(tabIndex);
      if (tabIndex == 1 && toggle) {
        if (!confirmWeightFlag) {
          const newWeight = lbToKg(Number(weight)).toFixed(1);
          setWeight(newWeight);
        } else {
          const newWeight = lbToKg(Number(confirmWeight)).toFixed(1);
          setConfirmWeight(newWeight);
        }
      } else if (tabIndex == 2 && toggle) {
        if (!confirmWeightFlag) {
          const newWeight = kgToLb(Number(weight)).toFixed(1);
          setWeight(newWeight);
        } else {
          const newWeight = kgToLb(Number(confirmWeight)).toFixed(1);
          setConfirmWeight(newWeight);
        }
      }
    }
  };

  // Function to convert kilograms (kg) to pounds (lb)
  const kgToLb = (kg: any) => {
    let data = kg * 2.20462;
    return data;
  };

  // Function to convert pounds (lb) to kilograms (kg)
  const lbToKg = (lb: any) => {
    let data = lb / 2.20462;
    return data;
  };

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const getLast7daysWeight =  async (value: any) => {
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    const url = baseUrl+ `task/getLast7daysWeight/${value}`;

    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('Access token not found');
        setIsLoading(false);
        return null;
      }

      setIsLoading(true);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setIsLoading(false);
      console.log(data, 'lookup response value');

      return data;
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.toString(), [
        {
          text: 'Okay',
          onPress: () => { },
        },
      ]);
      return null;
    }
  };

  const getLast24hWeight =  async (value: any) => {
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    const url = baseUrl + `task/getLast24hWeight/${value}`;

    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('Access token not found');
        setIsLoading(false);
        return null;
      }

      setIsLoading(true);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setIsLoading(false);
      console.log(data, 'lookup response value');

      return data;
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.toString(), [
        {
          text: 'Okay',
          onPress: () => { },
        },
      ]);
      return null;
    }
  };

  const onSubmitWeight = () => {
    if (!confirmWeightFlag) validateWeight(weight);
    else validateConfirmWeight(confirmWeight);
  };

  const handleWeightChange = (text: any) => {
    const numericText = text.replace(/[^\d.]/g, '');

    // Ensure only one decimal point is present
    const decimalIndex = numericText.indexOf('.');
    if (decimalIndex !== -1) {
      const integerPart = numericText.substring(0, decimalIndex);
      const decimalPart = numericText.substring(
        decimalIndex + 1,
        decimalIndex + 2,
      );
      const hasMultipleDecimals =
        numericText.substring(decimalIndex + 1).indexOf('.') !== -1;
      if (hasMultipleDecimals) {
        return; // Ignore input if multiple decimal points are present
      }
      const newValue = `${integerPart}.${decimalPart}`;
      setWeight(newValue);
    } else {
      setWeight(numericText);
    }
  };

  const handleConfirmWeightChange = (text: any) => {
    const numericText = text.replace(/[^\d.]/g, '');

    // Ensure only one decimal point is present
    const decimalIndex = numericText.indexOf('.');
    if (decimalIndex !== -1) {
      const integerPart = numericText.substring(0, decimalIndex);
      const decimalPart = numericText.substring(
        decimalIndex + 1,
        decimalIndex + 2,
      );
      const hasMultipleDecimals =
        numericText.substring(decimalIndex + 1).indexOf('.') !== -1;
      if (hasMultipleDecimals) {
        return; // Ignore input if multiple decimal points are present
      }
      const newValue = `${integerPart}.${decimalPart}`;
      setConfirmWeight(newValue);
    } else {
      setConfirmWeight(numericText);
    }
  };

  const [minWeightKg, setMinWeightKg] = useState(0);
  const [maxWeightKg, setMaxWeightKg] = useState(0);
  const [minWeightLb, setMinWeightLb] = useState(0);
  const [maxWeightLb, setMaxWeightLb] = useState(0);
  const [confirmWeightFlag, setConfirmWeightFlag] = useState(false);

  const loadWeightLookupValue = async () => {
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    const url = baseUrl + `task/getConstants/WEIGHT`;
    getAccessToken().then(token => {
      if (token) {
        setIsLoading(true);
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setIsLoading(false);
            console.log(data, "lookup response value");
            setMinWeightKg(Number(data.MIN_WEIGHT_KG));
            setMaxWeightKg(Number(data.MAX_WEIGHT_KG));
            setMinWeightLb(Number(data.MIN_WEIGHT_LB));
            setMaxWeightLb(Number(data.MAX_WEIGHT_LB));
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
        console.error('Access token not found');
      }
    });
  }

  // Determine the unit based on the activeTab
  const unit = activeTab === 1 ? 'kg' : 'lb';

  const validateWeight = async (value: any) => {
    if (!isNaN(value)) {
      console.log(unit, value);
      if ((unit == 'kg' && (value < minWeightKg || value > maxWeightKg)) || (unit == 'lb' && (value < minWeightLb || value > maxWeightLb))) {
        Alert.alert(
          'Exception 19',
          unit == 'kg'
            ? `Weight must be between ${minWeightKg} and ${maxWeightKg}`
            : `weight must be between ${minWeightLb} and ${maxWeightLb}`,
        );
      } else {
        const data = await getLast24hWeight(value);
        if (data) {
          console.log('Received data:', data);
          if (data.last24hData) {
            if (data.changeOver24hrs) {
              Alert.alert(`Exception 13`, `Please confirm weight again`, [
                {
                  text: 'OK',
                  onPress: () => {
                    setConfirmWeightFlag(true);
                  }
                }
              ]);
              saveException('Exception 13', true);
              setTimeout(() => {
                confrimWeightInputRef?.current?.focus();
              }, 100);
            } else {
              //Exception 13
              onSubmit(true, "Exception 13", false);
              saveException('Exception 15', false);
            }
          } else {
            saveException('Exception 11', true);
            const last7DayData = await getLast7daysWeight(value);
            if (last7DayData.last7Days) {
              if (last7DayData.changeOver7Days) {
                saveException('Exception 14', true);
                Alert.alert('Exception 14', `Please confirm weight again`, [
                  {
                    text: 'OK',
                    onPress: () => {
                      setConfirmWeightFlag(true);
                    }
                  }
                ]);
                setTimeout(() => {
                  confrimWeightInputRef?.current?.focus();
                }, 100);
              } else {
                //Record Next Reading After 24 Hours
                onSubmit(false, '', false);
                saveException('Exception 14', false);
                saveException('Exception 15', false);
              }
            } else {
              //Exception 13
              onSubmit(true, 'Exception 13', true);
              
            }
          }
        } else {
          console.log('No data received or there was an error.');
        }
      }
    }
  };

  const validateConfirmWeight = (confirmWeight: any) => {
    console.log('fuyjfuukfukuufufu', confirmWeight, unit);
    // Ensure confirmTemp is valid and has at least one decimal point
    if (!isNaN(confirmWeight)) {
      const temp = parseFloat(weight);
      const difference = Math.abs(temp - confirmWeight);
      console.log(
        weight,
        confirmWeight,
        difference,
        '}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}',
      );
      console.log(
        difference,
        'asrfdtgdtdt difference',
        Number(difference.toFixed(1)) === 0.1,
      );
      if ((unit == 'kg' && (confirmWeight < minWeightKg || confirmWeight > maxWeightKg)) || (unit == 'lb' && (confirmWeight < minWeightLb || confirmWeight > maxWeightLb))) {
        Alert.alert(
          'Exception 19',
          unit == 'kg'
            ? `Temperature must be between ${minWeightKg} ${unit} and ${maxWeightKg} ${unit}`
            : `Temperature must be between ${minWeightLb} ${unit} and ${maxWeightLb} ${unit}`,
        );
      } else {
        onSubmit(true, 'Exception 15',true);
        // if (Number(difference.toFixed(1)) === 0.2) {
        //   console.log('Difference ===0.2');
        //   onSubmit(true, 'Exception 15',true);
        // } else {
        //   console.log('Difference !== 0.2');
        //   setConfirmWeight('');
        //   setConfirmWeightFlag(true);
        // }
      }
    }
  };

  const saveException = async (exception: any, exceptionCondition:boolean) => {
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    const url = baseUrl + `task/saveException`;
    let requestBody = {
      "id": 0,
      "exceptionType": exception,
      "exception": exception,
      "deviceId": '',
      "date": '',
      "patientName": '',
      "patientId": '',
      "condition": exceptionCondition
    };
    getAccessToken().then(token => {
      if (token) {
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(response => {
            setIsLoading(false);
            console.log('arssrsrsrt false', response);
          })
          .catch(error => {
            setIsLoading(false);
            console.error('Error fetching or parsing data:', error);
            handleShowToast();
            setType('error');
            setMessage(error.toString());
          });
      } else {
        console.error('Access token not found');
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: Colors.White }}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      {data != null ? (
        <View style={{ margin: 10 }}>
          <Text style={[styles.headerText, {}]}>{data.question}</Text>
          <Text style={[styles.subText, { marginBottom: 10 }]}>
            {data.discription}
          </Text>

          <View style={styles.card}>
            {!confirmWeightFlag ? (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                  <View style={{ width: '70%', flexDirection: 'row', marginBottom: 5, borderWidth: 2, borderColor: Colors.defaultColor, backgroundColor: Colors.defaultColor }}>
                    <TouchableOpacity
                      style={[weightStyles.tab, activeTab === 1 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                      onPress={() => handleTabChange(1, true)}
                    >
                      <Text
                        style={[weightStyles.tabText, activeTab === 1 ? weightStyles.activeText : weightStyles.inActiveText]}
                      >Kg</Text>
                    </TouchableOpacity>

                    {/* Tab 2 */}
                    <TouchableOpacity
                      style={[weightStyles.tab, activeTab === 2 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                      onPress={() => handleTabChange(2, true)}
                    >
                      <Text
                        style={[weightStyles.tabText, activeTab === 2 ? weightStyles.activeText : weightStyles.inActiveText]}
                      >lb</Text>
                    </TouchableOpacity>

                  </View>
                  <View style={{ width: '5%', paddingLeft: 20, paddingTop: 10 }}>
                    <FontAwesomeIcon icon={faWeight} size={30} color={Colors.Gray} />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginVertical: 7,
                    padding: 10,
                    borderWidth: 2,
                    borderColor: Colors.LightGray,
                  }}>
                  {data?.currentDate ? (
                    <TouchableOpacity
                      onPress={handleDecrement}
                      style={{
                        padding: 15,
                        backgroundColor: Colors.defaultColor,
                        margin: 10,
                      }}>
                      <FontAwesomeIcon icon={faMinus} size={20} color="black" />
                    </TouchableOpacity>
                  ) : null}
                  <TextInput
                    ref={weightInputRef}
                    style={{
                      height: 60,
                      paddingHorizontal: 10,
                      fontSize: 24,
                      color: Colors.Black,
                      width: '41%',
                      justifyContent: 'center',
                      textAlign: 'center',
                      borderBottomWidth: 2, borderBottomColor: Colors.LightGray
                    }}
                    keyboardType="numeric"
                    onChangeText={handleWeightChange}
                    value={weight}
                  />
                  <Text style={{ fontSize: 20, color: 'black', marginTop: '5%' }}>
                    {unit}
                  </Text>
                  {data?.currentDate ? (
                    <TouchableOpacity
                      onPress={handleIncrement}
                      style={{
                        padding: 15,
                        backgroundColor: Colors.defaultColor,
                        margin: 10,
                      }}>
                      <FontAwesomeIcon icon={faPlus} size={20} color="black" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : (
              <View>
                <Text style={[styles.subText, { textAlign: 'center' }]}>
                  Entered Weight : {weight} {unit}
                </Text>
                <Text style={[styles.subText, { textAlign: 'center' }]}>
                  Please Confirm Weight Below
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                  <View style={{ width: '70%', flexDirection: 'row', marginBottom: 5, borderWidth: 2, borderColor: Colors.defaultColor, backgroundColor: Colors.defaultColor }}>
                    <TouchableOpacity
                      style={[weightStyles.tab, activeTab === 1 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                      onPress={() => handleTabChange(1, true)}
                    >
                      <Text
                        style={[weightStyles.tabText, activeTab === 1 ? weightStyles.activeText : weightStyles.inActiveText]}
                      >Kg</Text>
                    </TouchableOpacity>

                    {/* Tab 2 */}
                    <TouchableOpacity
                      style={[weightStyles.tab, activeTab === 2 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                      onPress={() => handleTabChange(2, true)}
                    >
                      <Text
                        style={[weightStyles.tabText, activeTab === 2 ? weightStyles.activeText : weightStyles.inActiveText]}
                      >lb</Text>
                    </TouchableOpacity>

                  </View>
                  <View style={{ width: '5%', paddingLeft: 20, paddingTop: 10 }}>
                    <FontAwesomeIcon icon={faWeight} size={30} color={Colors.Gray} />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginVertical: 7,
                    padding: 10,
                    borderWidth: 2,
                    borderColor: Colors.LightGray,
                  }}>
                  {data?.currentDate ? (
                    <TouchableOpacity
                      onPress={handleDecrement}
                      style={{
                        padding: 15,
                        backgroundColor: Colors.defaultColor,
                        margin: 10,
                      }}>
                      <FontAwesomeIcon icon={faMinus} size={20} color="black" />
                    </TouchableOpacity>
                  ) : null}
                  <TextInput
                    ref={confrimWeightInputRef}
                    style={{
                      height: 60,
                      paddingHorizontal: 10,
                      fontSize: 24,
                      color: Colors.Black,
                      width: '41%',
                      justifyContent: 'center',
                      textAlign: 'center',
                      borderBottomWidth: 2, borderBottomColor: Colors.LightGray
                    }}
                    keyboardType="numeric"
                    onChangeText={handleConfirmWeightChange}
                    value={confirmWeight}
                  />
                  <Text style={{ fontSize: 20, color: 'black', marginTop: '5%' }}>
                    {unit}
                  </Text>
                  {data?.currentDate ? (
                    <TouchableOpacity
                      onPress={handleIncrement}
                      style={{
                        padding: 15,
                        backgroundColor: Colors.defaultColor,
                        margin: 10,
                      }}>
                      <FontAwesomeIcon icon={faPlus} size={20} color="black" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}

            {data?.currentDate ? (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    height: 70,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    width: '70%',
                    backgroundColor: Colors.defaultColor, // Change background color based on success state
                  },
                ]}
                onPress={(onSubmitWeight)} // Disable onPress if isSuccess is true
              >
                <Text style={[styles.buttonText, { fontSize: 20 }]}>Submit</Text>
              </TouchableOpacity>
            ) : null}
            <ToastMessage
              visible={showToast}
              message={message}
              onClose={handleCloseToast}
              type={type}
            />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

const weightStyles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    color: Colors.White,
  },
  tabText: {
    fontSize: 16,
  },
  activeTab: {
    backgroundColor: Colors.defaultColor,
  },
  inActiveTab: {
    backgroundColor: Colors.White,
  },
  activeText: {
    color: Colors.White,
  },
  inActiveText: {
    color: Colors.defaultColor,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
  },
  iconContainer: {
    padding: 10,
  },
});
