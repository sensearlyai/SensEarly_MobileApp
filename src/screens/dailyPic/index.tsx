import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Button, Dimensions, Modal } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import config from '../../constant/config';
import Colors from '../../constant/colors';
import styles from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import RNFS from 'react-native-fs';
import Spinner from 'react-native-loading-spinner-overlay';
import ToastMessage from '../toast';
import { CrendentialsContext } from '../../constant/CredentialsContext';

export const DailyPic = ({ navigation }: any) => {
  const route: any = useRoute();
  const { questionData } = route.params; // Access categoryId directly from route.params

  const [data, setData] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [cameraFlag, setCameraFlag] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success')
  const [isLoading, setIsLoading] = useState(false);
  const { storedCrendentials } = useContext(CrendentialsContext);

  useEffect(() => {
    setImage(null);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      setImage(null);
      console.log(questionData,'data')
      console.log(questionData.discription,'data')
      console.log(questionData.question,'data21')
      setData(questionData);
      convertBase64ToUri(questionData.answer);
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

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const maxWidth = screenWidth * 0.90;
  const maxHeight = screenHeight * 0.65;
  console.log(maxWidth, maxHeight)
  const takePicture = () => {
    const options: ImagePicker.CameraOptions = {
      quality: 1,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      mediaType: 'photo',
      cameraType: 'back',
    };

    ImagePicker.launchCamera(options, async (response: any) => {
      console.log('Response =', response);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button:', response.customButton);
      } else if (response.assets && response.assets.length > 0) {
        const sourceUri = response.assets[0].uri;
        console.log('Source URI:', sourceUri);
        setImage(sourceUri);
        setCameraFlag(false);
        try {
          const base64Image = await RNFS.readFile(sourceUri, 'base64');
          setImageBase64(base64Image);
        } catch (error) {
          console.error('Error reading image file:', error);
        }
      }
    });
  };

  const convertBase64ToUri = (baseImage: any) => {
    if (baseImage != null) {
      try {
        const uri = `data:image/jpeg;base64,${baseImage}`;
        setImage(uri);
      } catch (error) {
        console.error('Error converting base64 to URI:', error);
      }
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



  const onSubmit = (base64Image: any) => {
    if (base64Image == undefined || base64Image == '' || base64Image == null) {
      handleShowToast();
      setType("error");
      setMessage("Please capture image or upload screenshot");
      return;
    }

    getUserId().then(async userId => {
      let requestBody = {
        "id": data.qaResponseId,
        "patientId": userId,
        "patientName": "",
        "questionId": data.id,
        "questionName": data.question,
        "answer": base64Image,
        "dateOfResponse": "",
        "userBadge": "",
        "image": base64Image ? "Y" : "N",
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
              console.log(requestBody,'data')
              setIsLoading(false);
              handleShowToast();
              setType("success");
              setMessage("Image uploaded successfully");
              const updatedData = {
                ...data,
                qaResponseId: response.qaReponseId
              };
              setData(updatedData);
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
      <View style={{ margin: 10 }}>
        <View style={styles.card}>
          <View style={{ height: '80%', borderWidth: 2, borderColor: Colors.LightGray }}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  flex: 1,
                  width: undefined, // Allow the width to be determined by the height and aspect ratio
                  height: undefined, // Allow the height to be determined by the width and aspect ratio
                }}
                resizeMode='contain'
              />
            )}
          </View>
          {image == null ? (
            data?.currentDate ? (
              <View style={{ height: '20%', alignContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.headerText, { marginVertical: 10 }]}>{data?.question}</Text>
                <TouchableOpacity onPress={takePicture}>
                  <FontAwesomeIcon icon={faCameraRetro} size={35} color={Colors.LightBlack} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ height: '20%', alignContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.headerText, { marginVertical: 10 }]}>No Image Uploaded</Text>
              </View>
            )
          ) : (
            data?.currentDate ? (
              <View style={{ height: '20%' }}>
                <TouchableOpacity onPress={takePicture} style={[styles.button, { marginTop: 10 }]}>
                  <Text style={styles.buttonText}>Retake Picture</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onSubmit(imageBase64)} style={[styles.button, { marginTop: 10 }]}>
                  <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            ) : (<View style={{ height: '20%', alignContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.headerText, { marginVertical: 10 }]}>Uploaded Image</Text>
            </View>)
          )}
        </View>
      </View>
      <ToastMessage visible={showToast} message={message} onClose={handleCloseToast} type={type} />
    </ScrollView>
  );
};


// const createPassword =(characters:string,PasswordLength:number)=>{
//   let result ='';
//   for (let i=0;i<PasswordLength;i++){
//     const characterIndex= Math.round( Math.random() * characters.length);
//     result += characters.charAt(characterIndex)
//   }
//  return result; 
// }
