// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {launchImageLibrary} from 'react-native-image-picker';
// import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal';
import SelectDropdown from 'react-native-select-dropdown';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
// import {BottomNavigation, TopProfileNavigation} from '../navigations';
import {CustomLoaderSmall} from '../components';

// API URL
import {apiURL} from '../utils/apiURL';
import {titleCase} from '../utils/helperFunctions';

export default function Settings({navigation}) {
  const [user, setUser] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [callingCode, setCallingCode] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [photo, setPhoto] = useState('');
  const [community, setCommunity] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [communitiesData, setCommunitiesData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleChoosePhoto = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      base64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const uri = response.assets[0].uri;
        const type = response.assets[0].type;
        const name = response.assets[0].fileName;
        const size = response.assets[0].fileSize;
        const source = {
          uri,
          type,
          name,
          size,
        };
        setPhoto(source);
      }
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let communityNames = [];
        let allCommunityData = [];

        setIsLoading(true);

        let USER;
        const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
          return jwt_decode(res).id;
        });

        if (!TOKEN_ID) {
          return navigation.navigate('Login');
        }

        await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
          if (res.data.success === true) {
            let arr = [];
            arr.push(res.data.message);
            setCountryCode(res.data.message.countryCode);
            setUser(arr);
            return (USER = res.data.message);
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });

        await axios
          .get(`${apiURL}/communities/`)
          .then(res => {
            return res.data.message;
          })
          .then(result => {
            result.map(elem => {
              if (elem.name !== 'All Ugandan Communities') {
                communityNames.push(elem.name);
                allCommunityData.push(elem);
              }
            });
            setCommunities(communityNames);
            setCommunitiesData(allCommunityData);
            setIsLoading(false);
          });
      } catch (error) {
        return error;
      }
    }
    fetchData();
  }, []);

  // HANDLE SUBMIT EDIT USER DATA
  async function handleSubmitEditUserData(id) {
    try {
      setIsSaving(true);

      const data = new FormData();
      if (photo) {
        data.append('photo', {
          name: photo.name,
          type: photo.type,
          uri:
            Platform.OS === 'ios'
              ? photo.uri.replace('file://', '')
              : photo.uri,
          size: photo.size,
        });
      }

      if (firstName) {
        data.append('firstName', firstName.toLowerCase());
      }
      if (lastName) {
        data.append('lastName', lastName.toLowerCase());
      }

      if (community.length > 0) {
        const selectedCommunity = communitiesData.filter(
          elem => elem.name === community,
        );
        data.append('community', selectedCommunity[0].id);
      }
      if (countryCode) {
        data.append('countryCode', countryCode);
      }
      if (phoneNumber) {
        data.append('phoneNumber', phoneNumber);
      }
      if (address) {
        data.append('address', address);
      }
      if (city) {
        data.append('city', city);
      }
      if (website) {
        data.append('website', website);
      }
      if (callingCode) {
        data.append('callingCode', callingCode);
      }

      await axios
        .patch(`${apiURL}/users/edit/${id}`, data)
        .then(res => {
          alert('Your details has been successfully updated');
          setIsSaving(false);
          return res.data;
        })
        .then(data => {
          if (data.success === true) {
            setIsSaving(false);
            return data;
          } else {
            setIsSaving(false);
            return alert(data.error);
          }
        });
    } catch (err) {
      return err;
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      let communityNames = [];
      let allCommunityData = [];

      let USER;
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          let arr = [];
          arr.push(res.data.message);
          setCountryCode(res.data.message.countryCode);
          setUser(arr);
          return (USER = res.data.message);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/communities/`)
        .then(res => {
          return res.data.message;
        })
        .then(result => {
          result.map(elem => {
            if (elem.name !== 'All Ugandan Communities') {
              communityNames.push(elem.name);
              allCommunityData.push(elem);
            }
          });
          setCommunities(communityNames);
          setCommunitiesData(allCommunityData);
          setIsLoading(false);
        });

      setRefreshing(false);
    } catch (error) {
      return error;
    }
  }, [refreshing]);

  return (
    <View style={styles.container}>
      {/* <TopProfileNavigation navigation={navigation} header="MY PROFILE" /> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {isLoading ? (
          <CustomLoaderSmall />
        ) : (
          <View>
            {user.map(elem => {
              return (
                <View
                  style={{flexDirection: 'column', padding: 0}}
                  key={elem.id}>
                  <View style={{padding: 20}}>
                    <View style={{paddingVertical: 5}}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {photo ? (
                          <Image
                            source={{uri: photo.uri}}
                            style={styles.image}
                          />
                        ) : (
                          <View>
                            {elem.profileImage ? (
                              <Image
                                source={{uri: elem.profileImage}}
                                style={styles.image}
                              />
                            ) : (
                              <Image
                                source={images.DefaultUserImage}
                                style={styles.image}
                              />
                            )}
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() => handleChoosePhoto()}
                          style={{position: 'absolute', top: 150, left: 180}}>
                          <Image
                            source={images.Camera}
                            style={{height: 70, width: 70}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>First Name:</Text>
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={styles.input}
                            placeholder={titleCase(elem.firstName)}
                            onChangeText={text => setFirstName(text)}
                          />
                        </View>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>Last Name:</Text>
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={styles.input}
                            placeholder={titleCase(elem.lastName)}
                            onChangeText={text => setLastName(text)}
                          />
                        </View>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>Community:</Text>
                        </View>
                        <View style={{width: '70%'}}>
                          <SelectDropdown
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
                            buttonStyle={styles.input}
                            defaultButtonText={elem.community.name}
                            buttonTextStyle={{fontSize: SIZES.text2}}
                          />
                        </View>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>Email:</Text>
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={styles.input}
                            placeholder={elem.email}
                            editable={false}
                            value={elem.email}
                          />
                        </View>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>Telephone:</Text>
                        </View>
                        <View style={{width: '70%', flexDirection: 'row'}}>
                          <View
                            style={{
                              width: '40%',
                              backgroundColor: COLORS.black,
                            }}>
                            {/* <CountryPicker
                              withFilter
                              countryCode={countryCode}
                              withFlag
                              withAlphaFilter={false}
                              withCurrencyButton={false}
                              withCallingCode
                              withCallingCodeButton
                              onSelect={country => {
                                const {cca2, callingCode} = country;
                                setCountryCode(cca2);
                                setCallingCode(callingCode[0]);
                              }}
                              style={{
                                backgroundColor: COLORS.yellow,
                                color: COLORS.black,
                              }}
                              theme={DARK_THEME}
                            /> */}
                          </View>
                          <View style={{width: '60%'}}>
                            <TextInput
                              style={styles.input}
                              placeholder={elem.telephone}
                              onChangeText={text => setPhoneNumber(text)}
                              keyboardType="number-pad"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>Address:</Text>
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={styles.input}
                            placeholder={elem.address}
                            onChangeText={text => setAddress(text)}
                          />
                        </View>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>City:</Text>
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={styles.input}
                            placeholder={elem.city}
                            onChangeText={text => setCity(text)}
                          />
                        </View>
                      </View>
                      <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                        <View style={{width: '30%', paddingRight: 10}}>
                          <Text>Website:</Text>
                        </View>
                        <View style={{width: '70%'}}>
                          <TextInput
                            style={styles.input}
                            placeholder={elem.website}
                            onChangeText={text => setWebsite(text)}
                          />
                        </View>
                      </View>
                      {/* <View style={{paddingVertical: 10}}>
                        <TouchableOpacity
                          onPress={() => handleSubmitEditUserData(elem._id)}
                          style={{
                            backgroundColor: COLORS.black,
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}>
                          <Text style={{color: COLORS.yellow}}>SAVE</Text>
                        </TouchableOpacity>
                      </View> */}
                      {isSaving ? (
                        <CustomLoaderSmall />
                      ) : (
                        <View style={{paddingVertical: 10}}>
                          <TouchableOpacity
                            onPress={() => handleSubmitEditUserData(elem._id)}
                            style={{
                              backgroundColor: COLORS.black,
                              padding: 12,
                              borderRadius: 8,
                              alignItems: 'center',
                            }}>
                            <Text style={{color: COLORS.yellow}}>SAVE</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      {/* <BottomNavigation navigation={navigation} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5',
    width: '100%',
    height: '100%',
  },
  input: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 5,
    height: 30,
    width: '100%',
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 3,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200,
    marginRight: 10,
    marginBottom: 20,
  },
});
