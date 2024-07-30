import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle, } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constant/colors';
import styles from '../../styles/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import ToastMessage from '../toast';

export const DailyQuestionarie = ({ navigation }: any) => {
  const route: any = useRoute();
  const { categoryId, categoryName } = route.params;

  const [data, setData]: any = useState(null);
  const [completedTask, setCompletedTask] = useState(0);
  const [pendingTask, setPendingTask] = useState(0);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success')
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
  }, []);

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
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

  const getSelectedDate = async () => {
    try {
      const date = await AsyncStorage.getItem('selectedDate');
      return date;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      setPendingTask(0);
      setCompletedTask(0);
      loadQuestionnaire();
    }, [])
  );

  const loadQuestionnaire = () => {
    getSelectedDate().then(date => {
      let currentDate = new Date().toISOString().split('T')[0];
      if (date != null)
        currentDate = new Date(date).toISOString().split('T')[0];
      const url = config.BASE_URL + `task/loadCategoryQuestions/` + categoryId + "/" + currentDate;
      getAccessToken().then((token: any) => {
        console.log(token, "token");
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
              const response = data.list;
              const newCompletedTask = data.complatedQuestions;
              const newPendingTask = data.pendingQuestions;
              setCompletedTask(newCompletedTask);
              setPendingTask(newPendingTask);
              setData(response);
            })
            .catch(error => {
              setIsLoading(false);
              handleShowToast();
              setType("error");
              setMessage(error.toString());
            });
        } else {
          setIsLoading(false);
          console.error('Access token not found');
        }
      });
    })
  }

  const onSubmit = (question: any, value: any) => {
    getUserId().then(userId => {
      let requestBody = {
        "id": question.qaResponseId,
        "patientId": userId,
        "patientName": "",
        "questionId": question.id,
        "questionName": "",
        "answer": value ? "Yes" : "No",
        "dateOfResponse": "",
        "userBadge": "",
        "image": "",
        "nestedQuestion": [],
        "questionType": question.questionType,
      }
      const url = config.BASE_URL + `task/saveResponse`;
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
            .then(data => {
              setIsLoading(false);
              handleShowToast();
              setType("success");
              setMessage("Answer saved successfully");
              const response = data.list;
              const newCompletedTask = data.complatedQuestions;
              const newPendingTask = data.pendingQuestions;
              setCompletedTask(newCompletedTask);
              setPendingTask(newPendingTask);
              setData(response);
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

  const onSubmitRadio = async (question: any, value: any) => {
    try {
      const userId = await getUserId();
      const token = await getAccessToken();

      const requestBody = {
        "id": question.qaResponseId,
        "patientId": userId,
        "patientName": "",
        "questionId": question.id,
        "questionName": "",
        "answer": value,
        "dateOfResponse": "",
        "userBadge": "",
        "image": "",
        "nestedQuestion": [],
        "questionType": question.questionType,

      };

      const url = config.BASE_URL + `task/saveResponse`;

      setIsLoading(true);

      if (token) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        handleShowToast();
        setType("success");
        setMessage("Answer saved successfully");
        const newCompletedTask = data.complatedQuestions;
        const newPendingTask = data.pendingQuestions;
        setCompletedTask(newCompletedTask);
        setPendingTask(newPendingTask);
        setData(data.list);
        setIsLoading(false);
      } else {
        console.error('Access token not found');
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error fetching or parsing data:', error);
      handleShowToast();
      setType("error");
      setMessage(error.toString());
    }
  };

  const onSubmitText = (question: any, value: any) => {
    getUserId().then(userId => {
      let requestBody = {
        "id": question.qaResponseId,
        "patientId": userId,
        "patientName": "",
        "questionId": question.id,
        "questionName": "",
        "answer": value,
        "dateOfResponse": "",
        "userBadge": "",
        "image": "",
        "nestedQuestion": [],
        "questionType": question.questionType,
      }
      const url = config.BASE_URL + `task/saveResponse`;
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
              console.log(response);
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              setIsLoading(false);
              handleShowToast();
              setType("success");
              setMessage("Answer saved successfully");
              const response = data.list;
              const newCompletedTask = data.complatedQuestions;
              const newPendingTask = data.pendingQuestions;
              setCompletedTask(newCompletedTask);
              setPendingTask(newPendingTask);
              setData(response);
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



  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const CustomRadioButtons = ({ options, onSelect, selectedKey }: any) => {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
      // Automatically select the option if it matches the provided key
      const autoSelectOption = options.find((option: any) => option.key === selectedKey);
      if (autoSelectOption) {
        setSelectedOption(autoSelectOption);
      }
    }, [options, selectedKey]);

    const handleSelect = (option: any) => {
      setSelectedOption(option);
      onSelect(option);
    };

    return (
      <View style={{ marginLeft: 10, marginRight: 25 }}>
        {options.map((option: any) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleSelect(option)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: selectedOption === option ? 'green' : 'black',
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {selectedOption === option && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: 'green',
                    }}
                  />
                )}
              </View>
              <Text style={{ color: selectedOption === option ? 'green' : 'black' }}>
                {option.option}
              </Text>
            </View>
            <View style={{ width: '100%' }}>
              <CustomTooltip text={option.discription}>
                <FontAwesomeIcon color={Colors.defaultColor} size={20} icon={faInfoCircle} />
              </CustomTooltip>
            </View>
          </TouchableOpacity>
        ))}
      </View>

    );
  };

  const CustomTooltip = ({ text, children }: any) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const screenWidth = Dimensions.get('window').width;

    return (
      <View style={{ position: 'relative', width: '100%' }}>
        <TouchableOpacity
          onPressIn={() => setShowTooltip(true)}
          onPressOut={() => setShowTooltip(false)}
          activeOpacity={1}
          style={{ width: '100%' }}
        >
          {children}
        </TouchableOpacity>
        {showTooltip && (
          <View style={[dailyQuestionarieStyles.tooltipContainer, { position: 'absolute', right: 0, maxWidth: screenWidth * 0.5 }]}>
            <Text style={dailyQuestionarieStyles.tooltipText}>{text}</Text>
          </View>
        )}
      </View>
    );
  };

  const Questionnaire = ({ data }: any) => {
    const [selectedRadioOptions, setSelectedRadioOptions] = useState<any>({});

    const onSelectOption = (question: any, selectedOption: any) => {
      setSelectedRadioOptions((prevSelectedOptions: any) => ({
        ...prevSelectedOptions,
        [question.id]: selectedOption.key,
      }));

      question.answer = selectedOption.key;
      onSubmitRadio(question, selectedOption.key);
    };

    const renderNestedQuestions = (nestedQuestions: any, parentIndex: any) => {
      //console.log("Render Nested questions, parentId", parentIndex, nestedQuestions.length)
      return (
        nestedQuestions && nestedQuestions.map((nestedQuestion: any, nestedIndex: any) => (
          <View key={nestedIndex}>
            {nestedQuestion && (<View>
              <View style={[styles.questionCard, { marginBottom: 20 }]}>
                <Text style={dailyQuestionarieStyles.questionText}>{nestedQuestion.question}</Text>
                <Text style={dailyQuestionarieStyles.descriptionText}>{nestedQuestion.discription}</Text>
                {nestedQuestion.currentDate ? (
                  nestedQuestion.questionType === 'Yes or No' ? (
                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center' }}>
                      <TouchableOpacity
                        style={{
                          marginRight: '10%', padding: 5, backgroundColor: '#EEFDF3', width: '20%', alignItems: 'center',
                          borderWidth: nestedQuestion.answerFlag && nestedQuestion.answer == 'Yes' ? 2 : 0,
                          borderColor: nestedQuestion.answerFlag && nestedQuestion.answer == 'Yes' ? 'green' : 'transparent',
                        }}
                        onPress={() => onSubmit(nestedQuestion, true)}
                      >
                        <Text style={{ color: 'green' }}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          padding: 5, backgroundColor: '#FDF2F2', width: '20%', alignItems: 'center',
                          borderWidth: nestedQuestion.answerFlag && nestedQuestion.answer == 'No' ? 2 : 0,
                          borderColor: nestedQuestion.answerFlag && nestedQuestion.answer == 'No' ? 'red' : 'transparent',
                        }}
                        onPress={() => onSubmit(nestedQuestion, false)}
                      >
                        <Text style={{ color: 'red' }}>No</Text>
                      </TouchableOpacity>
                    </View>
                  ) : nestedQuestion.questionType === 'Radio' ? (
                    <View>
                      <CustomRadioButtons
                        options={nestedQuestion.lookupItems}
                        onSelect={(selectedOption: any) => onSelectOption(nestedQuestion, selectedOption)}
                        selectedKey={nestedQuestion.answer}
                      />
                    </View>
                  ) : nestedQuestion.questionType === 'Weight' ? (

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.subText, { width: '50%' }]}>{nestedQuestion.answer && `${nestedQuestion.answer.split(' ')[0]} ${nestedQuestion.answer.split(' ')[1] === 'kg' ? 'kg' : 'lb'}`}</Text>
                      <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('Weight', { questionData: nestedQuestion }); }}>
                        <Text style={styles.buttonText}>Weight</Text>
                      </TouchableOpacity>
                    </View>
                  ) : nestedQuestion.questionType === 'Temperature' ? (

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.subText, { width: '50%' }]}>{nestedQuestion.answer && `${nestedQuestion.answer.split(' ')[0]} ${nestedQuestion.answer.split(' ')[1] === 'C' ? '\u00B0C' : '\u00B0F'}`}</Text>
                      <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('Temperature', { questionData: nestedQuestion }); }}>
                        <Text style={styles.buttonText}>Temperature</Text>
                      </TouchableOpacity>
                    </View>

                  ): nestedQuestion.questionType === 'BP' ? (

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.subText, { width: '50%' }]}>{nestedQuestion.answer}</Text>
                      <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('BP', { questionData: nestedQuestion }); }}>
                        <Text style={styles.buttonText}>BP</Text>
                      </TouchableOpacity>
                    </View>

                  )  : nestedQuestion.questionType === 'Image' ? (
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.subText, { width: '50%' }]}>{nestedQuestion.answer ? 'Uploaded' : 'NA'}</Text>
                      <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('DailyPic', { questionData: nestedQuestion }); }}>
                        <Text style={styles.buttonText}>Image</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Default input for other types
                    <TextInput
                      style={{
                        height: 40,
                        borderColor: nestedQuestion.answerFlag ? Colors.defaultColor : 'gray',
                        borderWidth: 2,
                        borderRadius: 5,
                        width: '80%',
                        paddingHorizontal: 10,
                      }}
                      placeholder="Type your answer"
                      onChangeText={(text) => { }}
                      defaultValue={nestedQuestion?.answer}
                      onEndEditing={({ nativeEvent: { text } }) => {
                        onSubmitText(nestedQuestion, text);
                      }}
                    />
                  )
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    {
                      nestedQuestion.questionType != 'Image' ?
                        <Text style={styles.subText}>Answer : <Text style={[styles.subText, { color: 'black' }]}>{nestedQuestion?.answer}</Text></Text>
                        : <View style={{ flexDirection: 'row' }}>
                          <Text style={[styles.subText, { width: '50%' }]}>{nestedQuestion.answer ? 'Uploaded' : 'NA'}</Text>
                          <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('DailyPic', { questionData: nestedQuestion }); }}>
                            <Text style={styles.buttonText}>Image</Text>
                          </TouchableOpacity>
                        </View>
                    }
                  </View>
                )}
              </View>
              {nestedQuestion.nestedQuestion && renderNestedQuestions(nestedQuestion.nestedQuestion, parentIndex)}
            </View>)}
          </View>
        ))

      );
    };

    const progress = (pendingTask + completedTask) !== 0 ? (completedTask / (pendingTask + completedTask)) * 100 : completedTask;

    return (
      <View>
        <View style={{ padding: 7 }}>
          <View style={{}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={[styles.alertTitle, { width: '60%' }]}>{categoryName}</Text>
              {data?.length > 0
                ? <View style={{ width: '40%' }}>
                  <View style={styles.taskCountContainer}>
                    <Text style={styles.taskCountText}>Progress {`${completedTask}/${pendingTask + completedTask}`}</Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progress, { width: `${progress}%` }]} />
                  </View>
                </View>
                : null}
            </View>

            {data?.length > 0
              ? <View style={{ borderWidth: 1, borderColor: Colors.defaultColor, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                <View style={{ flexDirection: 'row', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                  <Text style={[styles.subText, { backgroundColor: Colors.defaultColor, color: Colors.White, padding: 10, width: '70%' }]}>Pending Task - {pendingTask}</Text>
                  <Text style={{ width: '5%' }}></Text>
                  <Text style={{ width: '1%' }}></Text>
                </View>
                {data && data.map((question: any, index: any) => (
                  <View key={index}>
                    {question && (
                      <View>
                        <View style={[styles.questionCard, { marginBottom: 20 }]}>
                          <Text style={dailyQuestionarieStyles.questionText}>{question.question}</Text>
                          <Text style={dailyQuestionarieStyles.descriptionText}>{question.discription}</Text>
                          {question.currentDate ? (
                            question.questionType === 'Yes or No' ? (
                              <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center' }}>
                                <TouchableOpacity
                                  style={{
                                    marginRight: '10%', padding: 5, backgroundColor: '#EEFDF3', width: '20%', alignItems: 'center',
                                    borderWidth: question.answerFlag && question.answer == 'Yes' ? 2 : 0,
                                    borderColor: question.answerFlag && question.answer == 'Yes' ? 'green' : 'transparent',
                                  }}
                                  onPress={() => onSubmit(question, true)}
                                >
                                  <Text style={{ color: 'green' }}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    padding: 5, backgroundColor: '#FDF2F2', width: '20%', alignItems: 'center',
                                    borderWidth: question.answerFlag && question.answer == 'No' ? 2 : 0,
                                    borderColor: question.answerFlag && question.answer == 'No' ? 'red' : 'transparent',
                                  }}
                                  onPress={() => onSubmit(question, false)}
                                >
                                  <Text style={{ color: 'red' }}>No</Text>
                                </TouchableOpacity>
                              </View>
                            ) : question.questionType === 'Radio' ? (
                              <View>
                                <CustomRadioButtons
                                  options={question.lookupItems}
                                  onSelect={(selectedOption: any) => onSelectOption(question, selectedOption)}
                                  selectedKey={question.answer}
                                />
                              </View>
                            ) : question.questionType === 'Weight' ? (
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.subText, { width: '50%' }]}>{question.answer && `${question.answer.split(' ')[0]} ${question.answer.split(' ')[1] === 'kg' ? 'kg' : 'lb'}`}</Text>
                                <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('Weight', { questionData: question }); }}>
                                  <Text style={styles.buttonText}>Weight</Text>
                                </TouchableOpacity>
                              </View>
                            ) : question.questionType === 'Temperature' ? (

                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.subText, { width: '50%' }]}>{question.answer && `${question.answer.split(' ')[0]} ${question.answer.split(' ')[1] === 'C' ? '\u00B0C' : '\u00B0F'}`}</Text>
                                <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('Temperature', { questionData: question }); }}>
                                  <Text style={styles.buttonText}>Temperature</Text>
                                </TouchableOpacity>
                              </View>
                            ) : question.questionType === 'BP' ? (
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.subText, { width: '50%' }]}>{question.answer}`</Text>
                                <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('BP', { questionData: question }); }}>
                                  <Text style={styles.buttonText}>BP</Text>
                                </TouchableOpacity>
                              </View>
                            ) : question.questionType === 'Image' ? (
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.subText, { width: '50%' }]}>{question.answer ? 'Uploaded' : 'NA'}</Text>
                                <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('DailyPic', { questionData: question }); }}>
                                  <Text style={styles.buttonText}>Image</Text>
                                </TouchableOpacity>
                              </View>
                            ) : question.questionType === 'Stroop' ? (
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.subText, { width: '50%' }]}>{question.answer ? question.answer : 'NA'}</Text>
                                <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('StroopTest', { questionData: question }); }}>
                                  <Text style={styles.buttonText}>Stroop Test</Text>
                                </TouchableOpacity>
                              </View>) : (
                              // Default input for other types
                              <TextInput
                                style={{
                                  height: 40,
                                  borderColor: question.answerFlag ? Colors.defaultColor : 'gray',
                                  borderWidth: 2,
                                  borderRadius: 5,
                                  width: '80%',
                                  paddingHorizontal: 10,
                                }}
                                placeholder="Type your answer"
                                onChangeText={(text) => { }}
                                defaultValue={question?.answer}
                                onEndEditing={({ nativeEvent: { text } }) => {
                                  onSubmitText(question, text);
                                }}
                              />
                            )
                          ) : (
                            <View style={{ flexDirection: 'row' }}>
                              {
                                question.questionType != 'Image' ?
                                  <Text style={styles.subText}>Answer : <Text style={[styles.subText, { color: 'black' }]}>{question?.answer}</Text></Text>
                                  : <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.subText, { width: '50%' }]}>{question.answer ? 'Uploaded' : 'NA'}</Text>
                                    <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.navigate('DailyPic', { questionData: question }); }}>
                                      <Text style={styles.buttonText}>Image</Text>
                                    </TouchableOpacity>
                                  </View>
                              }
                            </View>
                          )}
                        </View>
                        {question.nestedQuestion && renderNestedQuestions(question.nestedQuestion, index)}
                      </View>
                    )}
                  </View>
                ))}

              </View>
              : <View>
                <Text style={styles.subText}>No Task Found.</Text>
              </View>}

          </View>

        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      {/* <ToastMessage visible={showToast} message={message} onClose={handleCloseToast} type={type} /> */}
      <ScrollView>
        {
          data != null ?
            <View style={{ margin: 10 }}>
              <Questionnaire data={data} />
            </View>
            : null
        }
      </ScrollView>
    </View>
  );
};

const dailyQuestionarieStyles = StyleSheet.create({
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
  questionCard: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    height: 200
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.SubHeaderTextColor
  },
  nestedQuestionCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    elevation: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: Colors.defaultlightColor
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    bottom: '100%',
    left: '0%',
    right: '3%',
    width: '100%',
    transform: [{ translateX: -200 }],
    marginTop: 50
  },
  tooltipText: {
    color: 'white',
  },
});
