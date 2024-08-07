import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {COLORS} from '../../constants';
import axiosClient from '../../utils/axiosClient';
import AlertDanger from '../../components/AlertDanger';
import AlertSuccess from '../../components/AlertSuccess';
import Spinner from '../../components/Spinner';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const OrderAmbulance = ({navigation}) => {
  const [location, setLocation] = useState('');
  const [healthCondition, setHealthCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [orders, setOrders] = useState([]);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        return;
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const handleOrderSubmit = async () => {
    setSuccessMessage('');
    setError('');

    // Handle submission logic
    if (!location) return setError('Please add a location');
    setError('');

    if (!healthCondition) return setError('Please add a health condition');
    setError('');

    if (!notes) return setError('Please add Notes');
    setError('');

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', 'realtorsUg');

    try {
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
        location,
        healthCondition,
        notes,
        photoUrl: response.data.secure_url,
      };

      const res = await axiosClient.post(
        '/users/createAmbulanceOrder',
        payload,
      );

      if (res.status === 201) {
        setIsLoading(false);
        setSuccessMessage('Ambulance Order has been Submitted');
        setLocation('');
        setNotes('');
        setHealthCondition('');
        setTimeout(() => {
          return navigation.navigate('AppDrawerStack');
        }, 2000);
      } else {
        setIsLoading(false);
        setError('Error requesting for Ambulance');
        return;
      }
    } catch (error) {
      setIsLoading(false);
      setError('Error uploading image');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionText}>Location:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Location"
              value={location}
              onChangeText={setLocation}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>Health Condition:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Health Condition"
              value={healthCondition}
              onChangeText={setHealthCondition}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>Notes:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>
              Add photo of patient's condition:
            </Text>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image source={{uri: imageUri}} style={styles.image} />
              ) : (
                <Image
                  source={require('../../assets/images/default-image.jpg')}
                  style={styles.image}
                />
              )}
              <TouchableOpacity
                onPress={selectImage}
                style={styles.cameraButton}>
                <Icon name="camera" color={COLORS.black} size={45} />
              </TouchableOpacity>
            </View>
          </View>

          {error && <AlertDanger text={error} />}
          {successMessage && <AlertSuccess text={successMessage} />}

          {isLoading ? (
            <Spinner />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleOrderSubmit}>
              <Text style={styles.buttonText}>Submit Order</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 10,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 5,
  },
  cameraButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: -60,
    marginRight: -200,
  },
  imageOrder: {
    width: '100%',
    height: undefined,
    aspectRatio: 5 / 3,
    borderRadius: 5,
  },
  status: {
    flexDirection: 'row',
  },
  badgeText: {
    fontSize: 14,
    backgroundColor: '#4BB543',
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#ffffff',
  },
});

export default OrderAmbulance;
