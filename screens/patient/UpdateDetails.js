import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import axiosClient from '../../utils/axiosClient';
import Spinner from '../../components/Spinner';
import {COLORS} from '../../constants';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const Index = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const getUser = async () => {
    try {
      const res = await axiosClient.get('/users/getUser');
      if (res.status === 200) {
        setName(res.data.message.name);
        setImageUri(res.data.message.photo);
        setPhone(res.data.message.phone);
        setMedicalHistory(res.data.message.medicalHistory);
        return setIsLoading(false);
      } else {
        return navigation.navigate('Welcome');
      }
    } catch (error) {}
  };

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const updateDetails = async () => {
    try {
      if (!phone || !name) {
        Alert.alert('Name and Email are compulsory fields');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', 'realtorsUg');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/pixabits-group-limited/image/upload', // Replace with your cloud name
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      
      const payload = {
        name,
        phone,
        medicalHistory,
        photo: response.data.secure_url,
      };
      setIsLoading(true);

      await axiosClient.post('/users/update', payload).then(res => {
        if (res.status === 200) {
          setIsLoading(false);
          return getUser();
        } else {
          return setIsLoading(false);
        }
      });
    } catch (error) {
      Alert.alert('Failed to Updated user details');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Spinner />
      ) : (
        <View>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.image}
              />
            ) : (
              <Image
                source={require('../../assets/images/default-user-image.jpg')}
                style={styles.image}
              />
            )}
            <TouchableOpacity
              onPress={selectImage}
              style={{
                backgroundColor: '#f5f5f5',
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
                textAlign: 'center',
                marginTop: -30,
                marginRight: -100,
                borderRadius: 25,
              }}>
              <Icon name="camera" color={COLORS.black} size={35} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Phone:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>
              Please add your medication history ,allergies and any important
              notes here:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={medicalHistory}
              multiline={true}
              numberOfLines={8}
              onChangeText={setMedicalHistory}
            />
          </View>
          {isLoading ? (
            <Spinner />
          ) : (
            <TouchableOpacity style={styles.button} onPress={updateDetails}>
              <Text style={styles.buttonText}>Update Details</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  label: {
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 5,
    // marginTop: 5,
  },
  value: {
    flex: 2,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  button: {
    backgroundColor: COLORS.danger,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Index;
