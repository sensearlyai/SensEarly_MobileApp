import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
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

export const BP = ({ navigation }: any) => {
    const route: any = useRoute();
    const { questionData } = route.params; // Access categoryId directly from route.params
    const [systolic, setSystolic] = useState('');
    const [confirmSystolic, setConfirmSystolic] = useState('');

    const [diastolic, setDiastolic] = useState('');
    const [data, setData]: any = useState(null);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success')
    const [isLoading, setIsLoading] = useState(false);

    const [showToast, setShowToast] = useState(false);
  const { storedCrendentials } = useContext(CrendentialsContext);

    useEffect(() => {

    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadBPLookupValue();
            setData(questionData);
            setConfirmSystolicFlag(false);
            setConfirmSystolic('');
            if (questionData.answerFlag) {
                const responseAnswer = questionData.answer;
                const [lowerLimitValue, upperLimitValue] = responseAnswer.split("-");
                setSystolic(lowerLimitValue)
                setDiastolic(upperLimitValue);
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

    const [confirmSystolicFlag, setConfirmSystolicFlag] = useState(false);
    const [systolicMin, setSystolicMin] = useState(300);
    const [systolicMax, setSystolicMax] = useState(50);
    const [diastolicMin, setDiastolicMin] = useState(180);
    const [diastolicMax, setDiastolicMax] = useState(50);
    const [thersholdSystolic, setThersholdSystolic] = useState(180);

    //Alert.alert('Alert 3', `Alert 3`);
    const loadBPLookupValue = async () => {
        const baseUrl = await AsyncStorage.getItem('baseUrl');
        const url = baseUrl + `task/getConstants/BP`;
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
                        setSystolicMin(Number(data.SYSTOLIC_MIN));
                        setSystolicMax(Number(data.SYSTOLIC_MAX));
                        setDiastolicMin(Number(data.DIASTOLIC_MIN));
                        setDiastolicMax(Number(data.DIASTOLIC_MAX));
                        setThersholdSystolic(Number(data.THRESHOLD_SYSTOLIC));
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

    const onSubmitFirstReading = () => {
       if ((Number(systolic) < systolicMin) || (Number(systolic) > systolicMax)) {
            //Save Exception 19
            console.log("exception 19, Alert 1");
            // saveException("Exception 19", true);
            Alert.alert(
                'Exception 19', // Alert title
                'Please enter reading again', // Alert message
                [
                    {
                        text: 'OK', // Button text
                        onPress: () => {
                            setSystolic('');
                            setDiastolic('');
                        }
                    },
                ]);
        } else {
            if ((Number(diastolic) < diastolicMin) || (Number(diastolic) > diastolicMax)) {
                //Save Exception 19
                console.log("exception 19, Alert 2");
                // saveException("Exception 19", true);
                Alert.alert(
                    'Exception 19', // Alert title
                    'Please enter reading again', // Alert message
                    [
                        {
                            text: 'OK', // Button text
                            onPress: () => {
                                setSystolic('');
                                setDiastolic('');
                            }
                        },
                    ]);
            } else {
                if (Number(systolic) < Number(diastolic)) {
                    //Save Exception 19
                    console.log("exception 19, Alert 3");
                    // saveException("Exception 19", true);
                    Alert.alert(
                        'Exception 19', // Alert title
                        'Please enter reading again', // Alert message
                        [
                            {
                                text: 'OK', // Button text
                                onPress: () => {
                                    setSystolic('');
                                    setDiastolic('');
                                }
                            },
                        ]);
                } else {
                    if (Number(systolic) > thersholdSystolic) {
                        setConfirmSystolicFlag(true);
                        console.log("confirm systolic, Alert 4")
                    } else {
                        //Save
                        console.log("onSubmitFunc, Alert 5");
                        onSave(false, "")

                    }
                }
            }
        }
    }

    const onSubmitFunc = () => {
        if (!confirmSystolicFlag) {
            onSubmitFirstReading();
        } else {
            if (Number(confirmSystolic) > thersholdSystolic) {
                //Save Exception 20
                console.log("Exception 20 Save, Alert 7");
                setConfirmSystolicFlag(false);
                onSave(true, "Exception 20");
            } else {
                //Save 
                console.log("onSubmitFunc, Alert 8");
                setConfirmSystolicFlag(false);
                onSave(false, "");
                saveException("Exception 20", false)
            }
        }
    }

    const saveException = async (exception: any, exceptionCondition: boolean) => {
        const baseUrl = await AsyncStorage.getItem('baseUrl');
        const url = baseUrl + `task/saveException`;
        let requestBody = {
            "id": 0,
            "exceptionType": exception,
            "exception": exception,
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

    const onSave = (exceptionFlag: boolean, exceptionMessage: any) => {
        if (parseFloat(systolic) <= 0 && parseFloat(diastolic) <= 0) {
            handleShowToast();
            setType("error");
            setMessage("Upper & Lower limit entered cannopt be below less than 0");
            return;
        }
        if (parseFloat(systolic) <= 0) {
            handleShowToast();
            setType("error");
            setMessage("Upper limit entered cannopt be below less than 0");
            return;
        }
        if (parseFloat(diastolic) <= 0) {
            handleShowToast();
            setType("error");
            setMessage("Lower limit entered cannopt be below less than 0");
            return;
        }
        getUserId().then(async userId => {
            let requestBody = {
                "id": data.qaResponseId,
                "patientId": userId,
                "patientName": "",
                "questionId": data.id,
                "questionName": "",
                "answer": `${confirmSystolic != '' ? confirmSystolic : systolic}-${diastolic}`,
                "dateOfResponse": "",
                "userBadge": "",
                "image": "",
                "nestedQuestion": [],
                "questionType": data.questionType,
            }
            const baseUrl = await AsyncStorage.getItem('baseUrl');
            const url = baseUrl + `task/saveResponse`;
            getAccessToken().then((token: any) => {
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
                            const updatedData = {
                                ...data,
                                qaResponseId: response.qaReponseId,
                                answer: `${confirmSystolic!='' ? confirmSystolic : systolic}-${diastolic}`

                            };
                            setData(updatedData);
                            if (updatedData.answerFlag) {
                                const responseAnswer = updatedData.answer;
                                const [lowerLimitValue, upperLimitValue] = responseAnswer.split("-");
                                setSystolic(lowerLimitValue)
                                setDiastolic(upperLimitValue);
                            }
                            handleShowToast();
                            setType("success");
                            setMessage("BP data saved successfully");
                            if (exceptionFlag) saveException(exceptionMessage, true);
                        })
                        .catch(error => {
                            setIsLoading(false);
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

    const handleShowToast = () => {
        setShowToast(true);
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

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

                        <Text style={[styles.headerText, { marginVertical: 10 }]}>{data.question}</Text>
                        <View style={styles.card}>
                            {!confirmSystolicFlag ? <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 10 }}>
                                <View style={{ flex: 1, alignItems: 'center', marginRight: 5 }}>
                                    <Text style={styles.subText}>Systolic:</Text>
                                    <TextInput
                                        style={{ height: 60, borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, width: '100%',color:'black' }}
                                        keyboardType="numeric"
                                        placeholder="Enter systolic"
                                        placeholderTextColor={Colors.PlaceholderColor}
                                        value={systolic}
                                        onChangeText={setSystolic}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', marginLeft: 5 }}>
                                    <Text style={styles.subText}>Diastolic:</Text>
                                    <TextInput
                                        style={{ height: 60, borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, width: '100%',color: 'black' }}
                                        keyboardType="numeric"
                                        placeholder="Enter diastolic"
                                        placeholderTextColor={Colors.PlaceholderColor}
                                        value={diastolic}
                                        onChangeText={setDiastolic}
                                    />
                                </View>
                            </View> : <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 10 }}>
                                <View style={{ flex: 1, alignItems: 'center', marginRight: 5 }}>
                                    <Text style={[styles.subText, { alignSelf: 'flex-start' }]}>Entered Systolic : {systolic} </Text>
                                    <Text style={[styles.subText, { alignSelf: 'flex-start' }]}>Entered Diastolic : {diastolic}</Text>
                                    <Text style={[styles.subText, { alignSelf: 'flex-start' }]}>Please Enter Systolic value :</Text>
                                    <TextInput
                                        style={{ height: 60, borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, width: '100%' , color: 'black'}}
                                        keyboardType="numeric"
                                        placeholder="Enter systolic"
                                        placeholderTextColor={Colors.PlaceholderColor}
                                        value={confirmSystolic}
                                        onChangeText={setConfirmSystolic}
                                    />
                                </View>
                            </View>}
                            {data?.currentDate ?
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
                                    onPress={onSubmitFunc} // Disable onPress if isSuccess is true
                                >
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
