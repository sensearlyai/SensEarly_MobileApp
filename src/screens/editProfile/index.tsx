import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';

import config from '../../constant/config';
import Colors from '../../constant/colors';
import styles from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleUser, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import RNFS from 'react-native-fs';
import Spinner from 'react-native-loading-spinner-overlay';
import ToastMessage from '../toast';

export const EditProfile = ({ navigation }: any) => {
  const route: any = useRoute();
  const { data } = route.params; // Access categoryId directly from route.params
  const [userData, setUserData] = useState(data);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success')
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [cameraFlag, setCameraFlag] = useState(true);

  useEffect(() => {
    setImage(null);
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
          setUserData({ ...userData, image: base64Image });
        } catch (error) {
          console.error('Error reading image file:', error);
        }
      }
    });
  };



  const UserProfileIcon = ({ imageUrl }: any) => {
    if (!imageUrl) {
      return (
        <View style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faCircleUser} color={Colors.defaultColor} size={100} />
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: '20%', padding: 10, backgroundColor: Colors.defaultColor, borderRadius: 25 }} onPress={() => { takePicture() }}>
            <FontAwesomeIcon icon={faPen} size={20} color={Colors.White} />
          </TouchableOpacity>
        </View>
      );
    }

    const uri = `data:image/jpeg;base64,${imageUrl}`;

    return (
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 25,
            marginBottom: 20
          }}
        />
        <TouchableOpacity style={{ position: 'absolute', top: 0, left: '20%', padding: 10, backgroundColor: Colors.defaultColor, borderRadius: 25 }} onPress={() => { takePicture() }}>
          <FontAwesomeIcon icon={faPen} size={20} color={Colors.White} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleChange = (key: any, value: any) => {
    const newData = { ...userData, [key]: value };
    setUserData(newData);
  };

  const handleSubmit = () => {
    getAccessToken().then((token: any) => {
      setIsLoading(true);
      if (token) {
        fetch(config.BASE_URL + "user/createUsersMobile", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
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
            setMessage("Profile updated successfully");
          })
          .catch(error => {
            setIsLoading(false);
            handleShowToast();
            console.error('Error fetching or parsing data:', error);
            setType("error");
            setMessage(error.toString());
          });
      } else {
        console.error('Access token not found');
      }
    });
  };


  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: Colors.White }}>
      <ToastMessage visible={showToast} message={message} onClose={handleCloseToast} type={type} />
      <View style={{ margin: 10 }}>
        <View style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => { navigation.navigate('Profile') }}>
            <FontAwesomeIcon icon={faXmark} color={Colors.Black} size={25} />
          </TouchableOpacity>
          <UserProfileIcon imageUrl={userData?.image} />
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <Text style={editProfileStyles.label}>First Name</Text>
            <TextInput
              style={editProfileStyles.input}
              placeholder="First Name"
              value={userData?.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
              placeholderTextColor={Colors.PlaceholderColor}
            />
            <Text style={editProfileStyles.label}>Last Name</Text>
            <TextInput
              style={editProfileStyles.input}
              placeholder="Last Name"
              value={userData?.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
              placeholderTextColor={Colors.PlaceholderColor}
            />
            <Text style={editProfileStyles.label}>Phone Number</Text>
            <TextInput
              style={[editProfileStyles.input, { backgroundColor: '#d3d3d3' }]}
              placeholder="Phone Number"
              value={userData?.phoneNumber}
              keyboardType='numeric'
              onChangeText={(text) => handleChange("phoneNumber", text)}
              placeholderTextColor={Colors.PlaceholderColor}
              editable={false}
            />
            <Text style={editProfileStyles.label}>Email</Text>
            <TextInput
              style={[editProfileStyles.input, { backgroundColor: '#d3d3d3' }]}
              placeholder="Email"
              value={userData?.email}
              onChangeText={(text) => handleChange("email", text)}
              placeholderTextColor={Colors.PlaceholderColor}
              editable={false}
            />
            <Text style={editProfileStyles.label}>Age</Text>
            <TextInput
              style={editProfileStyles.input}
              placeholder="Age"
              value={userData?.age}
              onChangeText={(text) => handleChange("age", text)}
              placeholderTextColor={Colors.PlaceholderColor}
            />
            {/* <Text style={editProfileStyles.label}>Gender</Text>
            <TextInput
              style={editProfileStyles.input}
              placeholder="Gender"
              value={userData?.gender}
              onChangeText={(text) => handleChange("gender", text)}
              placeholderTextColor={Colors.Black}
            /> */}
            <TouchableOpacity style={editProfileStyles.button} onPress={handleSubmit}>
              <Text style={editProfileStyles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </ScrollView>
  );
};

const editProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#d2d2d2",
    marginVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'whitesmoke',
    color: Colors.Black,
    borderRadius: 5
  },
  button: {
    backgroundColor: Colors.defaultColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.Black,
  },
});