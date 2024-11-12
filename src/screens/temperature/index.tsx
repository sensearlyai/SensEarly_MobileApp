import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMinus, faPlus, faTemperature0, } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constant/colors';
import styles from '../../styles/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import ToastMessage from '../toast';
import { height } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { CrendentialsContext } from '../../constant/CredentialsContext';

export const Temperature = ({ navigation }: any) => {
  const route: any = useRoute();
  const { questionData } = route.params;

  const [temperature, setTemperature] = useState("");
  const [confirmTemperatureFlag, setConfirmTemperatureFlag] = useState(false);
  const [confirmTempertaure, setConfirmTemperature] = useState('');

  const [data, setData]: any = useState(null);

  const [message, setMessage] = useState('');
  const [type, setType] = useState('success')
  const [isLoading, setIsLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const { storedCrendentials } = useContext(CrendentialsContext);

  const handleIncrement = () => {
    if (!confirmTemperatureFlag) {
      const newTemperature = parseFloat(temperature) + 1;
      if(newTemperature >=0)
      setTemperature(newTemperature.toFixed(1));
    } else {
      const newTemperature = parseFloat(confirmTempertaure) + 1;
      if(newTemperature >=0)
      setConfirmTemperature(newTemperature.toFixed(1));
    }
  };

  const handleDecrement = () => {
    if (!confirmTemperatureFlag) {
      const newTemperature = parseFloat(temperature) - 1;
      if (newTemperature >= 0)
        setTemperature(newTemperature.toFixed(1));
    } else {
      const newTemperature = parseFloat(confirmTempertaure) - 1;
      if (newTemperature >= 0)
        setConfirmTemperature(newTemperature.toFixed(1));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      tempInputRef?.current?.focus();
    }, 100);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        tempInputRef?.current?.focus();
      }, 100);
      loadTemperatureLookupValue();
      setData(questionData);
      setTemperature("");
      setConfirmTemperature("");
      setConfirmTemperatureFlag(false);
      if (questionData) {
        if (questionData.answerFlag) {
          const responseAnswer = questionData.answer;
          const [newTemperature, temperatureUnit] = responseAnswer.split(" ");
          setTemperature(newTemperature);
          handleTabChange(temperatureUnit == 'C' ? 1 : 2);
        }
      }
    }, [])
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


  const onSubmit = (exceptionFlag: boolean) => {
    if (parseFloat(temperature) <= 0) {
      handleShowToast();
      setType("error");
      setMessage("Temperature entered cannoot be below less than 0");
      return;
    }
    getUserId().then(async userId => {
      let requestBody = {
        "id": data.qaResponseId,
        "patientId": userId,
        "patientName": "",
        "questionId": data.id,
        "questionName": "",
        "answer": `${confirmTempertaure != "" ? confirmTempertaure : temperature} ${activeTab === 1 ? 'C' : 'F'}`,
        "dateOfResponse": "",
        "userBadge": "",
        "image": "",
        "nestedQuestion": [],
        "questionType": data.questionType,
      }
      const baseUrl = await AsyncStorage.getItem('baseUrl');
      const url = baseUrl + `task/saveResponse`;
      getAccessToken().then(token => {
        setIsLoading(true);
        if (token) {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
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
              handleShowToast();
              setType("success");
              setMessage("Temperature data saved successfully");
              const updatedData = {
                ...data,
                qaResponseId: response.qaReponseId,
                answer: `${confirmTemperatureFlag ? confirmTempertaure : temperature} ${activeTab === 1 ? 'C' : 'F'}`                
              };
              setData(updatedData);
              if (updatedData.answerFlag) {
                const responseAnswer = updatedData.answer;
                const [newTemperature, temperatureUnit] = responseAnswer.split(" ");
                setTemperature(newTemperature);
                handleTabChange(temperatureUnit == 'C' ? 1 : 2);
              }
              setConfirmTemperature('');
              setConfirmTemperatureFlag(false);
              setTimeout(() => {
                tempInputRef?.current?.focus();
              }, 100);
              if (exceptionFlag)
                saveException(true);
            })
            .catch(error => {
              setIsLoading(false);
              console.error('Error fetching or parsing data:', error);
              handleShowToast();
              setType("error");
              setMessage(error.toString());
            });
        } else {
          console.error('Access token not found');
        }
      });
    })

  }

  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (tabIndex: any, toggle?: any) => {
    if (activeTab != tabIndex) {
      setActiveTab(tabIndex);
      if (tabIndex == 1 && toggle) {
        if (!confirmTemperatureFlag) {
          const newTemperature = fahrenheitToCelsius(Number(temperature)).toFixed(1);
          setTemperature(newTemperature);
        } else {
          const newTemperature = fahrenheitToCelsius(Number(confirmTempertaure)).toFixed(1);
          setConfirmTemperature(newTemperature);
        }
      } else if (tabIndex == 2 && toggle) {
        if (!confirmTemperatureFlag) {
          const newTemperature = celsiusToFahrenheit(Number(temperature)).toFixed(1);
          setTemperature(newTemperature);
        } else {
          const newTemperature = celsiusToFahrenheit(Number(confirmTempertaure)).toFixed(1);
          setConfirmTemperature(newTemperature);
        }
      }
    }
  };

  // Function to convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: any) => {
    if (celsius != 0)
      return (celsius * 9 / 5) + 32;
    else
      return 0;
  };

  // Function to convert Fahrenheit to Celsius
  const fahrenheitToCelsius = (fahrenheit: any) => {
    if (fahrenheit != 0)
      return (fahrenheit - 32) * 5 / 9;
    else
      return 0;
  };

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };


  const [thresholdTemperature, setThresholdTemperature] = useState(0);
  const [thresholdTemperatureFahrenheit, setThresholdTemperatureFahrenheit] = useState(0);

  const [minTemperatureCelsius, setMinTemperatureCelsius] = useState(0);
  const [maxTemperatureCelsius, setMaxTemperatureCelsius] = useState(0);
  const [minTemperatureFahrenheit, setMinTemperatureFahrenheit] = useState(0);
  const [maxTemperatureFahrenheit, setMaxTemperatureFahrenheit] = useState(0);
  const tempInputRef = useRef<TextInput>(null);
  const confrimTempInputRef = useRef<TextInput>(null);

  const loadTemperatureLookupValue = async () => {
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    const url = baseUrl+ `task/getConstants/TEMPERATURE`;
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
            setMinTemperatureCelsius(Number(data.MIN_TEMPERATURE_CELSIUS));
            setMaxTemperatureCelsius(Number(data.MAX_TEMPERATURE_CELSIUS));
            setMinTemperatureFahrenheit(Number(data.MIN_TEMPERATURE_FAHRENHEIT));
            setMaxTemperatureFahrenheit(Number(data.MAX_TEMPERATURE_FAHRENHEIT));
            setThresholdTemperature(Number(data.THRESHOLD_TEMPERATURE));
            setThresholdTemperatureFahrenheit(Number(data.THERSHOLD_TEMPERATURE_FAHRENHEIT))
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

  const handleTemperatureFunc = () => {
    console.log(confirmTemperatureFlag, "adtsdtdtdtd6")
    if (!confirmTemperatureFlag)
      validateTemperature(parseFloat(temperature));
    else
      compareTemperatures(parseFloat(confirmTempertaure));
  }

  const handleTemperatureChange = (text: any) => {
    const numericText = text.replace(/[^\d.]/g, '');

    // Ensure only one decimal point is present
    const decimalIndex = numericText.indexOf('.');
    if (decimalIndex !== -1) {
      const integerPart = numericText.substring(0, decimalIndex);
      const decimalPart = numericText.substring(decimalIndex + 1, decimalIndex + 2);
      const hasMultipleDecimals = numericText.substring(decimalIndex + 1).indexOf('.') !== -1;
      if (hasMultipleDecimals) {
        return; // Ignore input if multiple decimal points are present
      }
      const newValue = `${integerPart}.${decimalPart}`;
      setTemperature(newValue);
      // validateTemperature(parseFloat(newValue));
    } else {
      setTemperature(numericText);
      // validateTemperature(parseFloat(numericText));
    }
  };

  const validateTemperature = (value: any) => {
    if (!isNaN(value) && value.toString().length >= 2) {
      console.log(unit, value)
      if ((unit == '℃' && (value < minTemperatureCelsius || value > maxTemperatureCelsius)) || (unit == '℉' && (value < minTemperatureFahrenheit || value > maxTemperatureFahrenheit))) {
        Alert.alert('Exception 17', unit == '℃' ? `Temperature must be between ${minTemperatureCelsius} and ${maxTemperatureCelsius}` : `Temperature must be between ${minTemperatureFahrenheit} and ${maxTemperatureFahrenheit}`);
        setConfirmTemperatureFlag(false);
      } else if ((unit == '℃' && value >= thresholdTemperature) || (unit == '℉' && value >= thresholdTemperature)) {
        Alert.alert('Alert 11', `Temperature is greater than ${unit == '℃' ? thresholdTemperature : thresholdTemperatureFahrenheit} ${unit}, please confirm temperature again`, [
          {
            text: 'OK',
            onPress: () => {
              setConfirmTemperatureFlag(true);
              setConfirmTemperature("");
              setTimeout(() => {
                confrimTempInputRef?.current?.focus();
              }, 100);
            }
          }
        ]);
      } else {
        // Alert.alert('Alert 2', `Temperature is less than ${thresholdTemperature} ${unit}`);
        setConfirmTemperatureFlag(false);
        onSubmit(false);
        saveException(false);
      }
    }
  };

  const handleConfirmTemperatureChange = (text: any) => {
    const numericText = text.replace(/[^\d.]/g, '');

    // Ensure only one decimal point is present
    const decimalIndex = numericText.indexOf('.');
    if (decimalIndex !== -1) {
      const integerPart = numericText.substring(0, decimalIndex);
      const decimalPart = numericText.substring(decimalIndex + 1, decimalIndex + 2);
      const hasMultipleDecimals = numericText.substring(decimalIndex + 1).indexOf('.') !== -1;
      if (hasMultipleDecimals) {
        return; // Ignore input if multiple decimal points are present
      }
      const newValue = `${integerPart}.${decimalPart}`;
      setConfirmTemperature(newValue);
      // compareTemperatures(parseFloat(newValue));
    } else {
      setConfirmTemperature(numericText);
      // compareTemperatures(parseFloat(numericText));
    }
  };

  const compareTemperatures = (confirmTemp: number) => {
    console.log("fuyjfuukfukuufufu", confirmTemp, unit)
    // Ensure confirmTemp is valid and has at least one decimal point
    const confirmTempString = confirmTemp.toString();
    if (!isNaN(confirmTemp)) {
      const temp = parseFloat(temperature);
      const difference = (Math.abs(temp - confirmTemp));
      console.log(difference, "asrfdtgdtdt difference", Number(difference.toFixed(1)) === 0.1)
      if ((unit == '℃' && (confirmTemp < minTemperatureCelsius || confirmTemp > maxTemperatureCelsius)) || (unit == '℉' && (confirmTemp < minTemperatureFahrenheit || confirmTemp > maxTemperatureFahrenheit))) {
        Alert.alert('Exception 17', unit == '℃' ? `Temperature must be between ${minTemperatureCelsius} ${unit} and ${maxTemperatureCelsius} ${unit}` : `Temperature must be between ${minTemperatureFahrenheit} ${unit} and ${maxTemperatureFahrenheit} ${unit}`);
      } else {
        onSubmit(true);
      }
    }
  };

  const saveException = async (exceptionCondition:boolean) => {
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    const url = baseUrl + `task/saveException`;
    let requestBody = {
      "id": 0,
      "exceptionType": "Exception 16",
      "exception": "Exception 16",
      "deviceId": "",
      "date": "",
      "patientName": "",
      "patientId": "",
      "condition": exceptionCondition
    }
    getAccessToken().then(token => {
      if (token) {
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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
            console.log("arssrsrsrt false", response)
          })
          .catch(error => {
            setIsLoading(false);
            console.error('Error fetching or parsing data:', error);
            handleShowToast();
            setType("error");
            setMessage(error.toString());
          });
      } else {
        console.error('Access token not found');
      }
    });
  }

  // Determine the unit based on the activeTab
  const unit = activeTab === 1 ? '℃' : '℉';

  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: Colors.White }}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      {
        data != null ?
          <View style={{ margin: 10 }}>
            <Text style={[styles.headerText, {}]}>{data.question}</Text>
            <Text style={[styles.subText, { marginBottom: 10 }]}>{data.discription}</Text>
            <View style={[styles.card, {}]}>
              {
                !confirmTemperatureFlag ?
                  <View>
                    {/* Temperature */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                      <View style={{ width: '70%', flexDirection: 'row', marginBottom: 5, borderWidth: 2, borderColor: Colors.defaultColor, backgroundColor: Colors.defaultColor }}>
                        <TouchableOpacity
                          style={[weightStyles.tab, activeTab === 1 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                          onPress={() => handleTabChange(1, true)}
                        >
                          <Text
                            style={[weightStyles.tabText, activeTab === 1 ? weightStyles.activeText : weightStyles.inActiveText]}
                          >℃</Text>
                        </TouchableOpacity>

                        {/* Tab 2 */}
                        <TouchableOpacity
                          style={[weightStyles.tab, activeTab === 2 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                          onPress={() => handleTabChange(2, true)}
                        >
                          <Text
                            style={[weightStyles.tabText, activeTab === 2 ? weightStyles.activeText : weightStyles.inActiveText]}
                          >℉</Text>
                        </TouchableOpacity>

                      </View>
                      <View style={{ width: '5%', paddingLeft: 20, paddingTop: 10 }}>
                        <FontAwesomeIcon icon={faTemperature0} size={30} color={Colors.Gray} />
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginVertical: 7, padding: 10, borderWidth: 2, borderColor: Colors.LightGray }}>
                      {data?.currentDate ?
                        <TouchableOpacity onPress={handleDecrement} style={{ padding: 15, backgroundColor: Colors.defaultColor, margin: 10 }}>
                          <FontAwesomeIcon icon={faMinus} size={20} color="black" />
                        </TouchableOpacity> : null}
                      <TextInput
                        ref={tempInputRef}
                        style={{ height: 50, marginTop: 10, fontSize: 24, color: Colors.Black, width: '41%', borderBottomWidth: 2, borderBottomColor: Colors.LightGray, justifyContent: 'center', textAlign: 'center' }}
                        keyboardType="numeric"
                        onChangeText={handleTemperatureChange}
                        value={temperature}
                      />
                      <Text style={{ fontSize: 20, color: 'black', marginTop: '5%' }}>{unit}</Text>
                      {data?.currentDate ?
                        <TouchableOpacity onPress={handleIncrement} style={{ padding: 15, backgroundColor: Colors.defaultColor, margin: 10 }}>
                          <FontAwesomeIcon icon={faPlus} size={20} color="black" />
                        </TouchableOpacity> : null}
                    </View>
                  </View>
                  : <View>
                    {/* Confirm Temperature */}
                    <Text style={[styles.subText, { textAlign: 'center' }]}>Entered Temperature : {temperature} {unit}</Text>
                    <Text style={[styles.subText, { textAlign: 'center' }]}>Please Confirm Temperature Below</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                      <View style={{ width: '70%', flexDirection: 'row', marginBottom: 5, borderWidth: 2, borderColor: Colors.defaultColor, backgroundColor: Colors.defaultColor }}>
                        <TouchableOpacity
                          style={[weightStyles.tab, activeTab === 1 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                          onPress={() => handleTabChange(1, true)}
                        >
                          <Text
                            style={[weightStyles.tabText, activeTab === 1 ? weightStyles.activeText : weightStyles.inActiveText]}
                          >℃</Text>
                        </TouchableOpacity>

                        {/* Tab 2 */}
                        <TouchableOpacity
                          style={[weightStyles.tab, activeTab === 2 ? weightStyles.activeTab : weightStyles.inActiveTab]}
                          onPress={() => handleTabChange(2, true)}
                        >
                          <Text
                            style={[weightStyles.tabText, activeTab === 2 ? weightStyles.activeText : weightStyles.inActiveText]}
                          >℉</Text>
                        </TouchableOpacity>

                      </View>
                      <View style={{ width: '5%', paddingLeft: 20, paddingTop: 10 }}>
                        <FontAwesomeIcon icon={faTemperature0} size={30} color={Colors.Gray} />
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginVertical: 7, padding: 10, borderWidth: 2, borderColor: Colors.LightGray }}>
                      {data?.currentDate ?
                        <TouchableOpacity onPress={handleDecrement} style={{ padding: 15, backgroundColor: Colors.defaultColor, margin: 10 }}>
                          <FontAwesomeIcon icon={faMinus} size={20} color="black" />
                        </TouchableOpacity> : null}
                      <TextInput
                        ref={confrimTempInputRef}
                        style={{ height: 50, marginTop: 10, fontSize: 24, color: Colors.Black, width: '41%', borderBottomWidth: 2, borderBottomColor: Colors.LightGray, justifyContent: 'center', textAlign: 'center' }}
                        keyboardType="numeric"
                        onChangeText={handleConfirmTemperatureChange}
                        value={confirmTempertaure}
                      />
                      <Text style={{ fontSize: 20, color: 'black', marginTop: '5%' }}>{unit}</Text>
                      {data?.currentDate ?
                        <TouchableOpacity onPress={handleIncrement} style={{ padding: 15, backgroundColor: Colors.defaultColor, margin: 10 }}>
                          <FontAwesomeIcon icon={faPlus} size={20} color="black" />
                        </TouchableOpacity> : null}
                    </View>
                  </View>
              }




              {data?.currentDate ?
                <TouchableOpacity style={[styles.button, { height: 70, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', width: '70%' }]} onPress={() => { handleTemperatureFunc() }}>
                  <Text style={[styles.buttonText, { fontSize: 20 }]}>Submit</Text>
                </TouchableOpacity>
                : null}

              <ToastMessage visible={showToast} message={message} onClose={handleCloseToast} type={type} />
            </View>

          </View>
          : null
      }
    </ScrollView>
  );
};

const weightStyles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    color: Colors.White
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

