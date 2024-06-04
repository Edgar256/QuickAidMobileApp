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

// NPM MODULES
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
// import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal';
import CountrySelectDropdown from 'react-native-searchable-country-dropdown';
// import CountryPicker from 'rn-country-code-picker';
// import {CountryList} from "react-native-country-codes-picker";
import {CountryPicker} from 'react-native-country-codes-picker';
import {CountryList} from 'react-native-country-codes-picker';
import {countryCodes, countryCodeNames} from '../../utils/data';

// RESOURCE IMPORTS
import images from '../../constants/images';
import {COLORS, SIZES} from '../../constants';
// import

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, CustomTextInput} from '../../components';

// API URL
import {apiURL} from '../../utils/apiURL';

// Icons
import ChevronDownIcon from '../../assets/svgs/chevron-down.svg';
import ChevronDownIconDark from '../../assets/svgs/chevron-down-dark.svg';
import AlertDanger from '../../components/AlertDanger';
import AlertSuccess from '../../components/AlertSuccess';

export default function Register({navigation}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCodeFull, setCountryCodeFull] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let callingCode, countryCode;

  useEffect(() => {}, []);

  async function handleRegister() {
    try {
      setError('');
      setSuccessMessage('');

      if (!fullName) {
        return alert('Full Names field cannot be blank');
      }

      const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!email) {
        return alert('Email field cannot be blank');
      }
      if (!regexEmail.test(email)) {
        return alert('Please enter a Valid Email Address');
      }

      if (!password) {
        return alert('Password field cannot be blank');
      }
      if (password.length < 6) {
        return alert('Password must be atleast 6 characters');
      }

      if (!confirmPassword) {
        return alert('Confirm Password field cannot be blank');
      }
      if (confirmPassword !== password) {
        return alert('Passwords do not match');
      }

      callingCode = countryCodeFull.slice(1);

      let countryNameFull = countryCodes.filter(
        elem => elem.callingCode === callingCode,
      )[0].name;
      countryCode = Object.entries(countryCodeNames).filter(
        ([key, value]) => value.toLowerCase() === countryNameFull.toLowerCase(),
      )[0][0];

      if (!countryCode) {
        return alert('Country Code field cannot be blank');
      }

      if (!callingCode) {
        return alert('Country field cannot be blank');
      }

      if (!phone) {
        return alert('Phone field cannot be blank');
      }

      const phoneNumber = '+' + callingCode + phone;

      const payload = {
        name: fullName,
        email: email.toLowerCase(),
        password,
        phone: phoneNumber,
      };

      setIsLoading(true);

      await axios
        .post(`${apiURL}/users/signup`, payload)
        .then(res => {
          if (res.status === 201) {
            alert(
              'We are processing your details and creating your account.' +
                'Your results are based off your details to give you the best experience using BIG DATA',
            );
            setSuccessMessage('Account has been created successfully');
            setTimeout(() => {
              return navigation.navigate('PatientLogin');
            }, 2000);
          } else {
            setError('Failed to sign up. Please try again.');
            return setIsLoading(false);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      setError('Error creating account');
      return err;
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={images.MainBgImg} style={styles.imageBg}>
        <ScrollView>
          <View
            style={styles.image}
            onPress={() => navigation.navigate('Welcome')}>
            <Image
              source={images.Logo}
              height={150}
              width={150}
              style={{width: 120, height: 150, marginTop: 20}}
            />
          </View>
          <View style={styles.body}>
            <View style={styles.header}>
              <Text
                style={{
                  color: COLORS.black,
                  fontWeight: '700',
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Patient Registration
              </Text>
            </View>
            <View style={styles.pad}>
              <CustomTextInput
                placeholder="Full Names*"
                secureTextEntry={false}
                autoComplete="name"
                onChangeText={text => setFullName(text)}
              />
            </View>
            <View style={styles.pad}>
              <CustomTextInput
                placeholder="Email*"
                secureTextEntry={false}
                autoComplete="email"
                onChangeText={text => setEmail(text)}
              />
            </View>
            <View style={styles.pad}>
              <View style={{paddingVertical: 2, flexDirection: 'row'}}>
                <View
                  style={{
                    width: '40%',
                    backgroundColor: '#000000',
                    paddingVertical: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={{
                      width: '100%',
                      height: 40,
                      // backgroundColor: 'black',
                      padding: 5,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        padding: 5,
                      }}>
                      {countryCodeFull ? countryCodeFull : 'Country Code'}
                    </Text>
                  </TouchableOpacity>
                  <CountryPicker
                    show={show}
                    pickerButtonOnPress={item => {
                      setCountryCodeFull(item.dial_code);
                      setShow(false);
                    }}
                  />
                </View>
                <View style={{width: '60%'}}>
                  <CustomTextInput
                    placeholder="Phone Number eg 772 123456"
                    secureTextEntry={false}
                    onChangeText={text => setPhone(text)}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>
            <View style={styles.pad}>
              <CustomTextInput
                placeholder="Password*"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
              />
            </View>
            <View style={styles.pad}>
              <CustomTextInput
                placeholder="Confirm Password*"
                secureTextEntry={true}
                onChangeText={text => setConfirmPassword(text)}
              />
              <Text style={{fontSize: SIZES.small, color: COLORS.white}}>
                Never disclose your Quickaid password to anyone
              </Text>
            </View>

            {error && <AlertDanger text={error} />}
            {successMessage && <AlertSuccess text={successMessage} />}

            {isLoading ? (
              <CustomLoaderSmall />
            ) : (
              <View style={styles.pad}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleRegister()}>
                  <Text style={{color: COLORS.yellow}}>Register</Text>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 40,
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: '100%',
                marginBottom: 60,
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: SIZES.text1,
                  marginRight: 20,
                }}>
                Already have an Account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('PatientLogin')}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: SIZES.text1,
                    paddingVertical: 25,
                    paddingHorizontal: 20,
                  }}>
                  LOGIN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    marginTop: 0,
  },
  imageBg: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  body: {
    marginTop: 10,
    paddingHorizontal: 40,
  },
  pad: {
    paddingVertical: 5,
    position: 'relative',
  },
  sect: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  header: {
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomColor: COLORS.yellow,
    borderBottomWidth: 2,
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
