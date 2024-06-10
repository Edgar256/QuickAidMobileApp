// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// RESOURCE IMPORTS
import images from '../../constants/images';
import {COLORS, SIZES} from '../../constants';
// import

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, CustomTextInput} from '../../components';

// API URL
import {apiURL} from '../../utils/apiURL';
import AlertDanger from '../../components/AlertDanger';
import AlertSuccess from '../../components/AlertSuccess';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  async function handleLogin() {
    try {
      setError('');
      const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!email) {
        return alert('Email field cannot be blank');
      }
      if (!regexEmail.test(email)) {
        return setError('Please enter a Valid Email Address');
      }
      setError('');

      if (!password) {
        return setError('Password field cannot be blank');
      }
      if (password.length < 6) {
        return setError('Password must be atleast 6 characters');
      }
      setError('');

      const payload = {
        email: email.toLowerCase(),
        password,
      };

      setIsLoading(true);

      axios
        .post(`${apiURL}/users/signin`, payload)
        .then(res => {
          if (res.data.status === 200) {
            setIsLoading(false);
            AsyncStorage.setItem('token', res.data.token);
            AsyncStorage.setItem('id', res.data.id);
            setSuccessMessage('Login Successful');
            setTimeout(() => {
              return navigation.navigate('AppDrawerStack');
            }, 1500);
          } else if (res.data.status === 401) {
            setError('Wrong login Credentials');
            return setIsLoading(false);
          } else {
            setError('server error.');
            return setIsLoading(false);
          }
        })
        .catch(err => {
          setError('Wrong login Credentials');
          return setIsLoading(false);
        });
    } catch (err) {
      setError('Server Errors');
      return setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={images.MainBgImg} style={styles.imageBg}>
        <View
          style={styles.image}
          onPress={() => navigation.navigate('Welcome')}>
          <Image
            source={images.Logo}
            style={{width: 120, height: 150, marginTop: 30}}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.sect}>
            <Text
              style={{
                color: COLORS.white,
                fontWeight: '300',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Login to explore as a Patient to explore the amazing opportunities
              in our App
            </Text>
          </View>
          <View style={styles.pad}>
            <CustomTextInput
              placeholder="Email"
              secureTextEntry={false}
              autoComplete="email"
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View style={styles.pad}>
            <CustomTextInput
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
          </View>

          {error && <AlertDanger text={error} />}
          {successMessage && <AlertSuccess text={successMessage} />}

          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View style={styles.pad}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLogin()}>
                <Text style={{color: COLORS.yellow}}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PatientRegister')}
              style={{paddingVertical: 25, paddingHorizontal: 10}}>
              <Text style={{color: COLORS.white, fontSize: 10}}>
                REGISTER WITH US
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{paddingVertical: 25, paddingHorizontal: 10}}>
              <Text style={{color: COLORS.white, fontSize: 10}}>
                FORGOT PASSWORD
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  imageBg: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  body: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
  pad: {
    paddingVertical: 5,
  },
  sect: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.black,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    fontSize: SIZES.text1,
  },
  text: {
    color: COLORS.yellow,
    fontSize: SIZES.text1,
  },
});
