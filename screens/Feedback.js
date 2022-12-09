// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// RESOURCE IMPORTS
import {COLORS} from '../constants';
import {Dimensions} from 'react-native';

// CUSTOM COMPONENT IMPORTS
import {
  CustomLoaderSmall,
  CustomTextInput,
  CustomMultiLineTextInput,
} from '../components';

// API URL
import {apiURL} from '../utils/apiURL';
const windowHeight = Dimensions.get('window').height;

export default function Feedback({navigation}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [id, setId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setFirstName(res.data.message.firstName);
          setLastName(res.data.message.lastName);
          setId(res.data.message.id);
          setEmail(res.data.message.email);
          return setIsLoading(false);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('token')
        .then(res => {
          if (!jwt_decode(res).id) {
            navigation.navigate('Login');
          } else {
          }
        })
        .catch(err => err);
    })();

    populateData();
  }, []);

  // const handleSendFeedback = async => {
  async function handleSendFeedback() {
    try {
      if (!subject) {
        return alert('Please add a Message subject');
      }

      if (!description) {
        return alert('Please add a Message description');
      }
      if (!id) {
        return alert('ID not found');
      }

      const payload = {
        user: id,
        subject,
        description,
        isAdminSent: false,
        isAdminRead: false,
        isUserRead: true,
      };

      setIsLoading(true);

      await axios.post(`${apiURL}/feedbacks/create/user`, payload).then(res => {
        alert(
          'Thanks for ryour feedback. We shall get back to you as soon as possible',
        );
        setIsLoading(false);
        return navigation.navigate('Chat');
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{flexDirection: 'column', padding: 10}}>
          <View style={{backgroundColor: COLORS.lightGray, padding: 10}}>
            <Text style={{textAlign: 'center'}}>
              Please share your experience with us.
            </Text>
            <Text style={{textAlign: 'center'}}>
              Please fill the form for any questions or queries.
            </Text>
          </View>
          <View style={{padding: 10, marginVertical: 0}}>
            <Text>Subject</Text>
            <CustomTextInput
              placeholder="Subject"
              onChangeText={text => setSubject(text)}
            />
          </View>
          <View style={{padding: 10, marginVertical: 0}}>
            <View style={{flexDirection: 'row'}}>
              <Text>Enter your message</Text>
              <Text>({1200 - description.length} characters left)</Text>
            </View>
            <CustomMultiLineTextInput
              numberOfLines={10}
              multiline={true}
              onChangeText={text => setDescription(text)}
              maxLength={1200}
            />
          </View>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginVertical: 30,
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSendFeedback()}>
                <Text style={{color: COLORS.yellow, textAlign: 'center'}}>
                  SEND FEEDBACK
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayDark,
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 10,
    width: 200,
    marginBottom: 50,
    marginHorizontal: '25%',
  },
  btnContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  btnContainerInner: {
    paddingHorizontal: 5,
    width: '50%',
  },
  buttonCall: {
    padding: 10,
    backgroundColor: COLORS.yellow,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonMessage: {
    padding: 10,
    backgroundColor: COLORS.black,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonComment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.yellow,
    padding: 10,
  },
});