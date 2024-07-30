import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constant/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../constant/config';
import Spinner from 'react-native-loading-spinner-overlay';
import ToastMessage from '../toast';
import { useRoute } from '@react-navigation/native';

const StroopTest = () => {
  const colors = [ 'green', 'red', 'blue', 'white', 'black', 'red', 'black', 'green', 'blue', 'white' ];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [buttonColors, setButtonColors] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(0); // Track answered questions
  const [data, setData]: any = useState({});
  const [isPracticing, setIsPracticing] = useState(false); // Track if practicing mode

  // Track the total number of questions
  const totalQuestions = isPracticing ? 2 : 10;

  // Calculate the time elapsed
  const elapsedTime = startTime !== null ? (Date.now() - startTime) / 1000 : 0;
  const route: any = useRoute();
  const { questionData } = route.params;

  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    setData(questionData);
  }, []);

  const startOrPractice = () => {
    setStartTime(Date.now());
    setCurrentColorIndex(0);
    setResponseTimes([]);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    getRandomButtonColors(colors, 0)
    .then(newButtonColors => {
        setButtonColors(newButtonColors);
        getTextColor(newButtonColors);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };

  const getRandomButtonColors = (colors: string[], currentIndex: number) => {
    // Remove duplicates from the original colors array
    const uniqueColors = Array.from(new Set(colors));
    
    // Exclude the color at the currentIndex
    const remainingColors = uniqueColors.filter((color, index) => index !== currentIndex);
    
    // Shuffle the remaining colors
    const shuffledColors = shuffleArray(remainingColors);
    
    // Ensure the finalButtonColors are unique
    let additionalColors = shuffledColors.slice(0, 2);
    
    // If additionalColors contains the current color, replace duplicates with other colors
    if (additionalColors.includes(colors[currentIndex])) {
        additionalColors = additionalColors.filter(color => color !== colors[currentIndex]);
        additionalColors.push(shuffledColors[2]);
    }
    
    // Combine the current color with the additional colors
    const finalButtonColors = [colors[currentIndex], ...additionalColors];
    
    // Shuffle the final button colors
    const buttonColorsList = shuffleArray(finalButtonColors);
    // Return the reversed list
    return new Promise<string[]>((resolve, reject) => {
      resolve(buttonColorsList.reverse());
  });
};

// Function to shuffle array
const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};


  // Function to handle color button press
  const handleColorPress = (color: string, textColor: string) => {
    if (startTime !== null) {
      const timeElapsed = Date.now() - (startTime as number);
      setResponseTimes((prev) => [...prev, timeElapsed]);
      console.log(color,"+++++++++++++++++++++++++++",textColor)
      if (color === textColor) {
        setCorrectAnswers((prev) => prev + 1);
        if (currentColorIndex < colors.length - 1) {
          let value = currentColorIndex + 1;
          setCurrentColorIndex(value);
          getRandomButtonColors(colors, value)
          .then(newButtonColors => {
              setButtonColors(newButtonColors);
              getTextColor(newButtonColors);
          })
          .catch(error => {
              console.error('Error:', error);
          });
        } 
      }else{
        if (currentColorIndex < colors.length - 1) {
          let value = currentColorIndex + 1;
          setCurrentColorIndex(value);
          getRandomButtonColors(colors, value)
          .then(newButtonColors => {
              setButtonColors(newButtonColors);
              getTextColor(newButtonColors);
          })
          .catch(error => {
              console.error('Error:', error);
          });
        } 
      }
      
      
      // else {
      //   const totalTime = responseTimes.reduce((acc, time) => acc + time, 0);
      // }
      setAnsweredQuestions((prev) => prev + 1);

    }
  };

  // Function to capitalize first letter of a string
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Function to get access token from AsyncStorage
  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  };

  // Function to get user ID from AsyncStorage
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      return userId;
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      return null;
    }
  };

  // Function to handle form submission
  const onSubmit = () => {
    if (isPracticing) {
      setIsPracticing(false);
      startOrPractice()
    } else {
      getUserId().then(userId => {
        let requestBody = {
          "id": data.qaResponseId,
          "patientId": userId,
          "patientName": "",
          "questionId": data.id,
          "questionName": "",
          "answer": `${correctAnswers}\/${totalQuestions} - ${elapsedTime}`,
          "dateOfResponse": "",
          "userBadge": "",
          "image": "",
          "questionType": data.questionType,
          "nestedQuestion": [],
          "stroopValue": `${elapsedTime}`,
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
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(response => {
                setIsLoading(false);
                handleShowToast();
                setType("success");
                setMessage("Stroop Test data saved successfully");
                const updatedData = {
                  ...data,
                  qaResponseId: response.qaReponseId
                };
                setData(updatedData);
                setStartTime(null);
                setResponseTimes([]);
                setAnsweredQuestions(0);
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
  }


  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const [textColor,setTextColor] = useState(0);
  const [textColorValue,setTextColorValue] = useState("");

  const getTextColor = (btnColors?:any) => {
    const randomNumber = Math.floor(Math.random() * buttonColors.length)
    if(buttonColors.length!=0){
      // console.log(buttonColors,buttonColors[randomNumber],"buttonColors difference c olrs after each chanege")
      setTextColor(randomNumber)
      setTextColorValue(buttonColors[randomNumber]);
      return randomNumber;
    } else{
      // console.log(btnColors,btnColors[randomNumber]," btnColors difference c olrs after each chanege")
      setTextColor(randomNumber)
      setTextColorValue(btnColors[randomNumber]);
      return randomNumber;
    }  
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      <ToastMessage visible={showToast} message={message} onClose={handleCloseToast} type={type} />

      {/* Render "Practice" button if data.answer is null */}
      {
        data.qaResponseId === null && startTime === null && (
          <View>
            <TouchableOpacity onPress={() => { setIsPracticing(true); startOrPractice(); }} style={styles.button}>
              <Text style={styles.buttonText}>Practice</Text>
            </TouchableOpacity>
          </View>
        )}

      {/* Original content starts here */}
      {
        startTime === null && data.qaResponseId !== null ? // Check if startTime is null and data.answer is not null
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>Stroop Test</Text>
            <TouchableOpacity onPress={() => { setIsPracticing(false); startOrPractice(); }} style={styles.button}>
              <Text style={styles.buttonText}>Start Test</Text>
            </TouchableOpacity>
          </View> : null
      }

      {startTime !== null && responseTimes.length !== totalQuestions && (
        <View>
          <TouchableOpacity onPress={() => {}} style={[styles.colorButton, { justifyContent: 'center', alignSelf: 'center', width: '100%', padding: 20, marginBottom: 30 }]}>
            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}}>
            <Text style={[styles.colorText, { color: Colors.Black }]}>What is color of the following text?</Text>
            <Text style={[styles.colorText, { color: buttonColors[textColor] }]}>------ {colors[currentColorIndex].toUpperCase()} ------</Text>

            </View>
          </TouchableOpacity>
          <View style={styles.buttonGroup}>
            {buttonColors .length >0 && buttonColors.map((color, index) => (
              <TouchableOpacity key={index} onPress={() => handleColorPress(color,buttonColors[textColor])} style={[styles.colorButton1]}>
                <Text style={[styles.colorButtonText]}>{capitalizeFirstLetter(color)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {responseTimes.length === totalQuestions && (
        <Text style={styles.resultText}>{correctAnswers} out of {totalQuestions} colors correctly identified</Text>
      )}

      {responseTimes.length === totalQuestions && (
        <TouchableOpacity onPress={() => onSubmit()} style={styles.button}>
          <Text style={styles.buttonText}>{isPracticing ? 'Start Test' : 'Submit'}</Text>
        </TouchableOpacity>
      )}
      {/* Display the total number of questions answered */}
      <Text style={styles.questionCount}>{answeredQuestions}/{totalQuestions}</Text>

      {/* Display the time at the top-right corner */}
      <Text style={styles.time}>{elapsedTime} sec</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d2d2d2'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.Black
  },
  button: {
    backgroundColor: Colors.defaultColor,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.White,
    fontSize: 18,
    fontWeight: 'bold'
  },
  colorButton: {
    width: '30%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
    // backgroundColor:Colors.White
  },
  colorButton1: {
    width: '30%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Colors.White
  },
  colorText: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  colorButtonText: {
    fontSize: 18,
    color: Colors.Black,
    fontWeight: '800'
  },
  resultText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
    color: Colors.Black
  },
  questionCount: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 18,
    color: Colors.Black
  },
  time: {
    position: 'absolute',
    top: 40,
    right: 10,
    fontSize: 18,
    color: Colors.Black
  }
});

export default StroopTest;
