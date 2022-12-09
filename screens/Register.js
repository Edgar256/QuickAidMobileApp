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
import {countryCodes, countryCodeNames} from '../utils/data';

// RESOURCE IMPORTS
import images from '../constants/images';
import {COLORS, SIZES} from '../constants';
// import

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, CustomTextInput} from '../components';

// API URL
import {apiURL} from '../utils/apiURL';

// Icons
import ChevronDownIcon from '../assets/svgs/chevron-down.svg';
import ChevronDownIconDark from '../assets/svgs/chevron-down-dark.svg';

export default function Register({navigation}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCodeFull, setCountryCodeFull] = useState('');
  //   const [callingCode, setCallingCode] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [community, setCommunity] = useState('');
  const [communities, setCommunities] = useState([]);
  const [communitiesData, setCommunitiesData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [show, setShow] = useState(false);

  let callingCode, countryCode;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        let communityNames = [];
        let allCommunitiesData = [];
        setIsLoading(true);
        await axios
          .get(`${apiURL}/communities/`)
          .then(res => {
            return res.data.message;
          })
          .then(result => {
            result.map(elem => {
              if (elem.name !== 'All Ugandan Communities') {
                communityNames.push(elem.name);
                allCommunitiesData.push(elem);
              }
            });
            setCommunities(communityNames);
            setCommunitiesData(allCommunitiesData);
            setIsLoading(false);
          });
      } catch (error) {
        return error;
      }
    }
    fetchCommunities();
  }, []);

  async function handleRegister() {
    try {
      if (!firstName) {
        return alert('First Name field cannot be blank');
      }

      if (!lastName) {
        return alert('First Name field cannot be blank');
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

      const selectedCommunity = communitiesData.filter(
        elem => elem.name === community,
      );

      const payload = {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        password,
        countryCode,
        callingCode,
        telephone: phone,
        community: selectedCommunity[0].id,
      };

      setIsLoading(true);

        await axios
          .post(`${apiURL}/users/register`, payload)
          .then(res => {
            alert(
              'We are processing your details and creating your account.' +
                'Your results are based off your details to give you the best experience using BIG DATA',
            );

            return res.data;
          })
          .then(data => {
            if (data.success === true) {
              setTimeout(() => {
                alert(
                  'Your account has been successfully created, please check your email for an ACTIVATION LINK in 30 seconds.' +
                    ' Be sure to also check your SPAM folder if you do not see the email link in your INBOX.' +
                    ' If you do not get an activation link , please register again.',
                );
                setIsLoading(false);
                navigation.navigate('Login');
              }, 30000);
              return data;
            } else {
              alert(data.error);
              setIsLoading(false);
              return data;
            }
          });
    } catch (err) {
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
                Register New User
              </Text>
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
                Never disclose your Ugalav password to anyone
              </Text>
            </View>
            <View style={styles.pad}>
              <CustomTextInput
                placeholder="First Name*"
                secureTextEntry={false}
                autoComplete="name"
                onChangeText={text => setFirstName(text)}
              />
            </View>

            <View style={styles.pad}>
              <CustomTextInput
                placeholder="Last Name*"
                secureTextEntry={false}
                autoComplete="name"
                onChangeText={text => setlastName(text)}
              />
              <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                <View
                  style={{
                    width: '40%',
                    // backgroundColor: '#000000',
                    paddingVertical: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={{
                      width: '100%',
                      height: 40,
                      backgroundColor: 'black',
                      padding: 5,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                      }}>
                      {countryCodeFull}
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
              <View style={styles.pad}>
                {community ? (
                  <View />
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10,
                      backgroundColor: COLORS.yellow,
                      paddingHorizontal: 5,
                      position: 'absolute',
                      width: '100%',
                      zIndex: 101,
                    }}>
                    <View>
                      <Text
                        style={{
                          color: COLORS.black,
                          fontSize: 13,
                          marginRight: 10,
                        }}>
                        Select Community
                      </Text>
                    </View>
                    <View>
                      <ChevronDownIconDark height="20" width="20" />
                    </View>
                  </View>
                )}

                {community ? (
                  <View
                    style={{
                      width: '100%',
                      opacity: 1,
                      zIndex: 102,
                      position: 'absolute',
                    }}>
                    <SelectDropdown
                      accessible={true}
                      accessibilityLabel="Select Community"
                      data={communities}
                      onSelect={(selectedItem, index) => {
                        setCommunity(selectedItem);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={{
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: COLORS.yellow,
                        paddingVertical: 2,
                        height: 40,
                        color: COLORS.black,
                      }}
                      defaultButtonText={'Select Community'}
                      buttonTextStyle={{
                        fontSize: SIZES.text1,
                        textAlign: 'left',
                        width: '100%',
                        backgroundColor: COLORS.yellow,
                        color: COLORS.black,
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      opacity: 0,
                      zIndex: 102,
                      position: 'absolute',
                    }}>
                    <SelectDropdown
                      accessible={true}
                      accessibilityLabel="Select Community"
                      data={communities}
                      onSelect={(selectedItem, index) => {
                        setCommunity(selectedItem);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={{
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: COLORS.yellow,
                        paddingVertical: 2,
                        height: 40,
                        color: COLORS.black,
                      }}
                      defaultButtonText={'Select Community'}
                      buttonTextStyle={{
                        fontSize: SIZES.text1,
                        textAlign: 'left',
                        width: '100%',
                        backgroundColor: COLORS.yellow,
                        color: COLORS.black,
                      }}
                    />
                  </View>
                )}
              </View>

              <View style={styles.pad}>
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: SIZES.small,
                      justifyContent: 'center',
                      width: '100%',
                      textAlign: 'center',
                      marginTop: 30,
                    }}>
                    By continuing you agree to the Policy and Rules
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
