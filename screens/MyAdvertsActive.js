// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {launchImageLibrary} from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
// import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal';
// import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

// CUSTOM IMPORTS
import {currencyNames, currencySymbols} from '../utils/data';
import {COLORS, SIZES, images} from '../constants';
import {
  AdvertCard,
  AdvertEventCard,
  BusinessCard,
  CustomLoaderSmall,
  CustomMultiLineTextInput,
  CustomTextInput,
  EventCard,
  JobCard,
  NewsCard,
  AdvertBusinessCard,
  AdvertJobCard,
  AdvertNewsCard,
} from '../components';

// API URL
import {apiURL} from '../utils/apiURL';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

import PlusIcon from '../assets/svgs/plus.svg';

const Tab = createMaterialTopTabNavigator();

const Events = ({navigation}) => {
  const [events, setEvents] = useState([]);
  const [id, setId] = useState([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventCategories, setEventCategories] = useState([]);
  const [eventCategoriesData, setEventCategoriesData] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [flagCode, setFlagCode] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [fee, setFee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [selectedHours, setSelectedHours] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState('');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async date => {
    await setSelectedDate(date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = async time => {
    await setSelectedTime(time);
    hideTimePicker();
  };

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return;
      }
      setId(TOKEN_ID);

      await axios.get(`${apiURL}/events/user/active/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setEvents(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      let eventCategoryNames = [];
      let eventCategoryData = [];
      await axios
        .get(`${apiURL}/events/categories`)
        .then(res => {
          return res.data.message;
        })
        .then(result => {
          result.map(elem => {
            eventCategoryNames.push(elem.name);
            eventCategoryData.push(elem);
          });
          setEventCategories(eventCategoryNames);
          setEventCategoriesData(eventCategoryData);
          setIsLoading(false);
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

  const openEventProfile = async (eventID, eventCategory) => {
    try {
      await AsyncStorage.setItem('currentEventID', eventID);
      await AsyncStorage.setItem('currentEventCategory', eventCategory);
      return navigation.navigate('EventProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  const openDelete = async event => {
    try {
      await setIsLoading(true);
      await setCurrent(event);
      setModalDeleteVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const openEdit = async elem => {
    try {
      await setIsLoading(true);
      await setCurrent(elem);
      setModalEditVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleDismissModal = async => {
    try {
      setModalDeleteVisible(false);
      setModalEditVisible(false);
    } catch (error) {}
  };

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
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
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

  const editEvent = async eventID => {
    try {
      setIsLoading(true);
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

      if (
        !title &&
        !eventCategory &&
        !description &&
        !address &&
        !countryCode &&
        !phoneNumber &&
        !email &&
        !website &&
        !selectedHours &&
        !selectedMinutes &&
        !selectedDate &&
        !fee &&
        !currency
      ) {
        alert('Nothing to Update');
        return setModalEditVisible(false);
      }

      if (title) {
        data.append('title', title);
      }
      if (eventCategory) {
        const selectedCategory = eventCategoriesData.filter(
          elem => elem.name === eventCategory,
        );
        data.append('category', selectedCategory[0].id);
      }
      if (description) {
        data.append('description', description);
      }
      if (address) {
        data.append('address', address);
      }
      if (countryCode) {
        data.append('countryCode', countryCode);
      }
      if (phoneNumber) {
        data.append('phone', phoneNumber);
      }
      if (email) {
        data.append('email', email);
      }
      if (website) {
        data.append('website', website);
      }
      if (fee) {
        data.append('fee', fee);
      }
      if (selectedHours && selectedMinutes) {
        let contentTime = selectedHours + ':' + selectedMinutes;
        data.append('selectedTime', contentTime);
      }
      if (selectedDate) {
        data.append('selectedDate', selectedDate.toString());
      }
      if (currency) {
        const currencyAsArray = Object.entries(currencyNames);
        const filteredCurrencyCode = currencyAsArray.filter(
          ([key, value]) => value === currency,
        )[0][0];

        setCurrencyCode(filteredCurrencyCode);
        data.append('currency', filteredCurrencyCode);
      }

      await axios.patch(`${apiURL}/events/edit/${eventID}`, data).then(res => {
        if (res.data.success === true) {
          alert('Event Item has been successfully updated');
          setCountryCode('');
          setCurrency('');
          setCurrencyCode('');
          setPhoneNumber('');
          setAddress('');
          setEmail('');
          setWebsite('');
          setPhoto('');
          setTitle('');
          setDescription('');
          setEventCategory('');
          setFlagCode('');
          setSelectedDate('');
          setSelectedTime('');
          setSelectedMinutes('00');
          setSelectedHours('00');
          setFee('');
          setModalEditVisible(false);
        } else {
          alert('Something went wrong');
          setModalEditVisible(false);
        }
      });

      await axios.get(`${apiURL}/events/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setEvents(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  const deleteEvent = async eventID => {
    try {
      setIsLoading(true);
      await axios.delete(`${apiURL}/events/delete/${eventID}`).then(res => {
        if (res.data.success === true) {
          alert('Event has been successfully deleted');
          setModalDeleteVisible(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/events/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setEvents(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems: 'center', width: '100%'}}>
        <View style={styles.card}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : events.length < 1 ? (
            <Text>You have not yet created any events yet</Text>
          ) : (
            <View>
              {events.map(elem => {
                return (
                  <AdvertEventCard
                    key={elem._id}
                    image={elem.imageURL}
                    title={elem.title}
                    billing={elem.billing}
                    fee={elem.fee}
                    currency={elem.currency}
                    description={elem.description}
                    address={elem.address}
                    date={elem.date}
                    time={elem.eventTime}
                    text="Your AD is active"
                    editText="EDIT"
                    deleteText="DELETE"
                    republishText="Republish"
                    openEventProfile={() =>
                      openEventProfile(elem.id, elem.category.id)
                    }
                    openDelete={() => openDelete(elem)}
                    openEdit={() => openEdit(elem)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* EVENT EDITING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalEditVisible(!modalEditVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: COLORS.green,
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  EDITING EVENT ITEM
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                You are editing and updating an existing Event Item
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 15,
                  borderRadius: 10,
                }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Event Title</Text>
                  <CustomTextInput
                    placeholder="Event Title"
                    onChangeText={text => setTitle(text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Select Event Category (Users in find your event more easily)
                  </Text>
                  <SelectDropdown
                    data={eventCategories}
                    onSelect={(selectedItem, index) => {
                      setEventCategory(selectedItem);
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
                      height: 30,
                      color: COLORS.black,
                    }}
                    defaultButtonText={'Select Event Category'}
                    buttonTextStyle={{
                      fontSize: SIZES.text1,
                      textAlign: 'left',
                      width: '100%',
                      backgroundColor: COLORS.yellow,
                      color: COLORS.black,
                    }}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Event Currency</Text>
                      <SelectDropdown
                        data={Object.values(currencyNames)}
                        onSelect={(selectedItem, index) => {
                          setCurrency(selectedItem);
                          const currencyAsArray = Object.entries(currencyNames);
                          const filteredCurrencyCode = currencyAsArray.filter(
                            ([key, value]) => value === selectedItem,
                          )[0][0];

                          setCurrencyCode(filteredCurrencyCode);
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
                          height: 30,
                          color: COLORS.black,
                        }}
                        defaultButtonText={'Select Currency'}
                        buttonTextStyle={{
                          fontSize: SIZES.text1,
                          textAlign: 'left',
                          width: '100%',
                          backgroundColor: COLORS.yellow,
                          color: COLORS.black,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Event Fee</Text>
                      <CustomTextInput
                        placeholder="Event Fee e.g 3000"
                        onChangeText={text => setFee(text)}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Select Date</Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: COLORS.yellow,
                          paddingHorizontal: 5,
                          fontSize: 10,
                          paddingVertical: 6,
                        }}
                        onPress={showDatePicker}>
                        {selectedDate ? (
                          <Text style={{fontSize: 10, paddingVertical: 2}}>
                            {moment(selectedDate).format('LL')}
                          </Text>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              paddingVertical: 2,
                            }}>
                            <Text style={{fontSize: 10}}>Select Date</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                      />
                    </View>
                  </View>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Select Time</Text>
                      <View style={{flexDirection: 'row'}}>
                        <SelectDropdown
                          data={[
                            '00',
                            '01',
                            '02',
                            '03',
                            '04',
                            '05',
                            '06',
                            '07',
                            '08',
                            '09',
                            '10',
                            '11',
                            '12',
                            '13',
                            '14',
                            '15',
                            '16',
                            '17',
                            '18',
                            '19',
                            '20',
                            '21',
                            '22',
                            '23',
                            '24',
                          ]}
                          onSelect={(selectedItem, index) => {
                            setSelectedHours(selectedItem);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={{
                            maxWidth: '100%',
                            width: '50%',
                            backgroundColor: COLORS.yellow,
                            paddingVertical: 2,
                            paddingHorizontal: 0,
                            textAlign: 'center',
                            height: 30,
                            color: COLORS.black,
                          }}
                          defaultButtonText={'HRS'}
                          buttonTextStyle={{
                            fontSize: SIZES.text1,
                            // textAlign: 'left',
                            paddingHorizontal: 0,
                            textAlign: 'center',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                          }}
                        />
                        <SelectDropdown
                          data={[
                            '00',
                            '01',
                            '02',
                            '03',
                            '04',
                            '05',
                            '06',
                            '07',
                            '08',
                            '09',
                            '10',
                            '11',
                            '12',
                            '13',
                            '14',
                            '15',
                            '16',
                            '17',
                            '18',
                            '19',
                            '20',
                            '21',
                            '22',
                            '23',
                            '24',
                            '25',
                            '26',
                            '27',
                            '28',
                            '29',
                            '30',
                            '31',
                            '32',
                            '33',
                            '34',
                            '35',
                            '36',
                            '37',
                            '38',
                            '39',
                            '40',
                            '41',
                            '42',
                            '43',
                            '44',
                            '45',
                            '46',
                            '47',
                            '48',
                            '49',
                            '50',
                            '51',
                            '52',
                            '53',
                            '54',
                            '55',
                            '56',
                            '57',
                            '58',
                            '59',
                          ]}
                          onSelect={(selectedItem, index) => {
                            setSelectedMinutes(selectedItem);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={{
                            maxWidth: '100%',
                            width: '50%',
                            backgroundColor: COLORS.yellow,
                            paddingVertical: 2,
                            paddingHorizontal: 0,
                            textAlign: 'center',
                            height: 30,
                            color: COLORS.black,
                          }}
                          defaultButtonText={'MINS'}
                          buttonTextStyle={{
                            fontSize: SIZES.text1,
                            // textAlign: 'left',
                            paddingHorizontal: 0,
                            textAlign: 'center',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                          }}
                        />
                      </View>
                      <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleConfirmTime}
                        onCancel={hideTimePicker}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Address</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Address"
                        onChangeText={text => setAddress(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Phone</Text>
                  <View style={styles.phoneInput}>
                    <View style={{width: 150, padding: 2}}>
                      {/* <CountryPicker
                        withFilter
                        countryCode={flagCode}
                        withFlag
                        withAlphaFilter={false}
                        withCurrencyButton={false}
                        withCallingCode
                        withCallingCodeButton
                        onSelect={country => {
                          const {cca2, callingCode} = country;
                          setFlagCode(cca2);
                          setCountryCode(callingCode[0]);
                        }}
                        style={{backgroundColor: COLORS.yellow}}
                        theme={DARK_THEME}
                      /> */}
                    </View>
                    <View style={{flex: 1, padding: 2}}>
                      <CustomTextInput
                        placeholder="Phone Number"
                        onChangeText={text => setPhoneNumber(text)}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Email</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Email"
                        onChangeText={text => setEmail(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Website</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Website"
                        onChangeText={text => setWebsite(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: SIZES.normal,
                    }}>
                    Add Photos
                  </Text>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: SIZES.normal,
                    }}>
                    This is the title picture that will be displayed on the Job
                    listing
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{padding: 20}}
                    onPress={() => handleChoosePhoto()}>
                    <PlusIcon height="60" width="60" />
                  </TouchableOpacity>
                  <View>
                    {photo === '' ? (
                      <></>
                    ) : (
                      <>
                        <Image
                          source={{uri: photo.uri}}
                          style={{
                            flex: 1,
                            width: windowWidth - 200,
                            height: 150,
                          }}
                        />
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Description ({180 - description.length} characters left)
                  </Text>
                  <CustomMultiLineTextInput
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={text => setDescription(text)}
                    maxLength={180}
                  />
                </View>
              </View>

              <Text
                style={{textAlign: 'center', marginTop: 10, fontWeight: '700'}}>
                PREVIEW
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                {/* <EventCard /> */}
                <EventCard
                  title={title ? title : current.title}
                  image={photo ? photo.uri : current.imageURL}
                  currency={currencyCode ? currencyCode : current.currency}
                  fee={fee ? fee : current.fee}
                  billing={current.billing}
                  date={selectedDate ? selectedDate : current.date}
                  time={selectedTime ? selectedTime : current.eventTime}
                  description={description ? description : current.description}
                  address={address ? address : current.address}
                  phone={
                    '+' + countryCode
                      ? countryCode
                      : current.countryCode + '-' + phoneNumber
                      ? phoneNumber
                      : current.phone
                  }
                  openEventProfile={() =>
                    openEventProfile(current.id, current.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.successButton}
                  onPress={() => editEvent(current.id)}>
                  <Text style={{color: COLORS.white}}>UPDATE EVENT</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>

      {/* EVENT DELETING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDeleteVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalDeleteVisible(!modalDeleteVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: '#c00',
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  DELETING EVENT
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                This is an irreversible action, be sure you understand what you
                are doing
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                {/* <EventCard /> */}
                <EventCard
                  title={current.title}
                  image={current.imageURL}
                  fee={current.fee}
                  billing={current.billing}
                  date={current.selectedDate}
                  description={current.description}
                  address={current.address}
                  phone={'+' + current.countryCode + '-' + current.phone}
                  openEventProfile={() =>
                    openEventProfile(current.id, current.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.submitButton}
                  onPress={() => deleteEvent(current.id)}>
                  <Text style={{color: COLORS.white}}>DELETE EVENT</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </ScrollView>
  );
};

const Business = ({navigation}) => {
  const [businesses, setBusinesses] = useState([]);
  const [id, setId] = useState([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessCategories, setBusinessCategories] = useState([]);
  const [businessCategoriesData, setBusinessCategoriesData] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [flagCode, setFlagCode] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }
      setId(TOKEN_ID);

      await axios
        .get(`${apiURL}/businesses/user/active/${TOKEN_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setBusinesses(res.data.message.reverse());
            setIsLoading(false);
          } else {
            alert('Something went wrong');
          }
        });

      let businessCategoryNames = [];
      let businessCategoryData = [];
      await axios
        .get(`${apiURL}/businesses/categories`)
        .then(res => {
          return res.data.message;
        })
        .then(result => {
          result.map(elem => {
            businessCategoryNames.push(elem.name);
            businessCategoryData.push(elem);
          });
          setBusinessCategories(businessCategoryNames);
          setBusinessCategoriesData(businessCategoryData);
          setIsLoading(false);
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

  const openBusinessProfile = async (businessID, businessCategory) => {
    try {
      await AsyncStorage.setItem('currentBusinessID', businessID);
      await AsyncStorage.setItem('currentBusinessCategory', businessCategory);
      return navigation.navigate('BusinessProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  const openDelete = async business => {
    try {
      setIsLoading(true);
      await setCurrent(business);
      setModalDeleteVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const openEdit = async elem => {
    try {
      setIsLoading(true);
      await setCurrent(elem);
      setModalEditVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleDismissModal = async => {
    try {
      setModalDeleteVisible(false);
      setModalEditVisible(false);
    } catch (error) {}
  };

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
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
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

  const editBusiness = async businessID => {
    try {
      setIsLoading(true);
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

      if (businessName) {
        data.append('businessName', businessName);
      }

      if (businessCategory) {
        const selectedCategory = businessCategoriesData.filter(
          elem => elem.name === businessCategory,
        );
        data.append('category', selectedCategory[0].id);
      }
      if (description) {
        data.append('description', description);
      }
      if (address) {
        data.append('address', address);
      }
      if (countryCode) {
        data.append('countryCode', countryCode);
      }
      if (phoneNumber) {
        data.append('phone', phoneNumber);
      }
      if (email) {
        data.append('email', email);
      }
      if (website) {
        data.append('website', website);
      }

      await axios
        .patch(`${apiURL}/businesses/edit/${businessID}`, data)
        .then(res => {
          if (res.data.success === true) {
            alert('Business Item has been successfully updated');
            setCountryCode('');
            setPhoneNumber('');
            setAddress('');
            setEmail('');
            setWebsite('');
            setPhoto('');
            setBusinessName('');
            setDescription('');
            setBusinessCategory('');
            setFlagCode('');
            setModalEditVisible(false);
          } else {
            alert('Something went wrong');
            setModalEditVisible(false);
          }
        });

      await axios.get(`${apiURL}/businesses/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setBusinesses(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  const deleteBusiness = async businessID => {
    try {
      setIsLoading(true);
      await axios
        .delete(`${apiURL}/businesses/delete/${businessID}`)
        .then(res => {
          if (res.data.success === true) {
            alert('Business has been successfully deleted');
            setModalDeleteVisible(false);
          } else {
            alert('Something went wrong--');
          }
        });

      await axios.get(`${apiURL}/businesses/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setBusinesses(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems: 'center', width: '100%'}}>
        <View style={styles.card}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : businesses.length < 1 ? (
            <Text>You have not yet created any events yet</Text>
          ) : (
            <View>
              {businesses.map(elem => {
                return (
                  <AdvertBusinessCard
                    key={elem.id}
                    name={elem.businessName}
                    image={elem.imageURL}
                    billing={elem.billing}
                    description={elem.description}
                    email={elem.email}
                    address={elem.address}
                    text="Your AD is active"
                    editText="EDIT"
                    deleteText="DELETE"
                    republishText="Republish"
                    phone={'+' + elem.countryCode + '-' + elem.phone}
                    openBusinessProfile={() =>
                      openBusinessProfile(elem.id, elem.category.id)
                    }
                    navigation={navigation}
                    // deleteBusiness={() => deleteBusiness(elem.id)}
                    openDelete={() => openDelete(elem)}
                    openEdit={() => openEdit(elem)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* BUSINESS EDITING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalEditVisible(!modalEditVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: COLORS.green,
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  EDITING BUSINESS ITEM
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                You are editing and updating an existing Business Item
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 15,
                  borderRadius: 10,
                }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Company / Business Name</Text>
                  <CustomTextInput
                    placeholder="Add Business or Company Name"
                    onChangeText={text => setBusinessName(text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Select Business Category (Users find your business more
                    easily)
                  </Text>
                  <SelectDropdown
                    data={businessCategories}
                    onSelect={(selectedItem, index) => {
                      setBusinessCategory(selectedItem);
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
                      height: 30,
                      color: COLORS.black,
                    }}
                    defaultButtonText={'Select Business Category'}
                    buttonTextStyle={{
                      fontSize: SIZES.text1,
                      textAlign: 'left',
                      width: '100%',
                      backgroundColor: COLORS.yellow,
                      color: COLORS.black,
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Email</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Email"
                        onChangeText={text => setEmail(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Phone</Text>
                  <View style={styles.phoneInput}>
                    <View style={{width: 150, padding: 2}}>
                      {/* <CountryPicker
                        withFilter
                        countryCode={flagCode}
                        withFlag
                        withAlphaFilter={false}
                        withCurrencyButton={false}
                        withCallingCode
                        withCallingCodeButton
                        onSelect={country => {
                          const {cca2, callingCode} = country;
                          setFlagCode(cca2);
                          setCountryCode(callingCode[0]);
                        }}
                        style={{backgroundColor: COLORS.yellow}}
                        theme={DARK_THEME}
                      /> */}
                    </View>
                    <View style={{flex: 1, padding: 2}}>
                      <CustomTextInput
                        placeholder="Phone Number"
                        onChangeText={text => setPhoneNumber(text)}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Location</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Job Location"
                        onChangeText={text => setAddress(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Website</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Website"
                        onChangeText={text => setWebsite(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                    Add Photos
                  </Text>
                  <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                    This is the title picture that will be displayed on the
                    Community Item
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{padding: 20}}
                    onPress={() => handleChoosePhoto()}>
                    <PlusIcon height="60" width="60" />
                  </TouchableOpacity>
                  <View>
                    {photo === '' ? (
                      <></>
                    ) : (
                      <>
                        <Image
                          source={{uri: photo.uri}}
                          style={{
                            flex: 1,
                            width: windowWidth - 200,
                            height: 150,
                          }}
                        />
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Description ({180 - description.length} characters left)
                  </Text>
                  <CustomMultiLineTextInput
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={text => setDescription(text)}
                    maxLength={180}
                    placeholder={current.description}
                  />
                </View>
              </View>

              <Text
                style={{textAlign: 'center', marginTop: 10, fontWeight: '700'}}>
                PREVIEW
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                {/* <BusinessCard /> */}
                <BusinessCard
                  key={current.id}
                  name={businessName ? businessName : current.businessName}
                  image={photo ? photo.uri : current.imageURL}
                  description={description ? description : current.description}
                  billing={current.billing}
                  email={email ? email : current.email}
                  address={address ? address : current.address}
                  phone={
                    '+' + countryCode
                      ? countryCode
                      : current.countryCode + '-' + phoneNumber
                      ? phoneNumber
                      : current.phone
                  }
                  openBusinessProfile={() =>
                    openBusinessProfile(currents.id, currents.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.successButton}
                  onPress={() => editBusiness(current.id)}>
                  <Text style={{color: COLORS.white}}>UPDATE BUSINESS</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>

      {/* BUSINESS DELETING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDeleteVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalDeleteVisible(!modalDeleteVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: '#c00',
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  DELETING BUSINESS
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                This is an irreversible action, be sure you understand what you
                are doing
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                <BusinessCard
                  key={current.id}
                  name={current.businessName}
                  image={current.imageURL}
                  description={current.description}
                  billing={current.billing}
                  email={current.email}
                  address={current.address}
                  phone={'+' + current.countryCode + '-' + current.phone}
                  openBusinessProfile={() =>
                    openBusinessProfile(currents.id, currents.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.submitButton}
                  onPress={() => deleteBusiness(current.id)}>
                  <Text style={{color: COLORS.white}}>DELETE BUSINESS</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </ScrollView>
  );
};

const Job = ({navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [id, setId] = useState([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [title, setTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [jobCategories, setJobCategories] = useState([]);
  const [jobCategoriesData, setJobCategoriesData] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [flagCode, setFlagCode] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [wage, setWage] = useState('');
  const [wagePeriod, setWagePeriod] = useState('');
  const [contractType, setContractType] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return;
      }
      setId(TOKEN_ID);

      await axios.get(`${apiURL}/jobs/user/active/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setJobs(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      let jobCategoryNames = [];
      let jobCategoryData = [];
      await axios
        .get(`${apiURL}/jobs/categories`)
        .then(res => {
          return res.data.message;
        })
        .then(result => {
          result.map(elem => {
            jobCategoryNames.push(elem.name);
            jobCategoryData.push(elem);
          });
          setJobCategories(jobCategoryNames);
          setjobCategoriesData(jobCategoryData);
          setIsLoading(false);
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

  const openJobProfile = async (jobID, jobCategory) => {
    try {
      await AsyncStorage.setItem('currentJobID', jobID);
      await AsyncStorage.setItem('currentJobCategory', jobCategory);
      return navigation.navigate('JobProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  const openDelete = async business => {
    try {
      setIsLoading(true);
      await setCurrent(business);
      setModalDeleteVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const openEdit = async elem => {
    try {
      setIsLoading(true);
      await setCurrent(elem);
      setModalEditVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleDismissModal = async => {
    try {
      setModalDeleteVisible(false);
      setModalEditVisible(false);
    } catch (error) {}
  };

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
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
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

  const editJob = async jobID => {
    try {
      setIsLoading(true);
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

      if (
        !title &&
        !jobCategory &&
        !description &&
        !address &&
        !countryCode &&
        !phoneNumber &&
        !email &&
        !website &&
        !wage &&
        !currency
      ) {
        alert('Nothing to Update');
        return setModalEditVisible(false);
      }

      if (title) {
        data.append('title', title);
      }
      if (businessName) {
        data.append('businessName', businessName);
      }
      if (wage) {
        data.append('wage', wage);
      }
      if (wagePeriod) {
        data.append('wagePeriod', wagePeriod);
      }
      if (contractType) {
        data.append('contractType', contractType);
      }
      if (jobCategory) {
        const selectedCategory = jobCategoriesData.filter(
          elem => elem.name === jobCategory,
        );
        data.append('category', selectedCategory[0].id);
      }
      if (description) {
        data.append('description', description);
      }
      if (address) {
        data.append('address', address);
      }
      if (countryCode) {
        data.append('countryCode', countryCode);
      }
      if (phoneNumber) {
        data.append('phone', phoneNumber);
      }
      if (email) {
        data.append('email', email);
      }
      if (website) {
        data.append('website', website);
      }
      if (currency) {
        const currencyAsArray = Object.entries(currencyNames);
        const filteredCurrencyCode = currencyAsArray.filter(
          ([key, value]) => value === currency,
        )[0][0];

        setCurrencyCode(filteredCurrencyCode);
        data.append('currency', filteredCurrencyCode);
      }

      await axios.patch(`${apiURL}/jobs/edit/${jobID}`, data).then(res => {
        if (res.data.success === true) {
          alert('Job Item has been successfully updated');
          setCountryCode('');
          setCurrency('');
          setCurrencyCode('');
          setPhoneNumber('');
          setAddress('');
          setEmail('');
          setWebsite('');
          setPhoto('');
          setTitle('');
          setWage('');
          setWagePeriod('');
          setBusinessName('');
          setDescription('');
          setJobCategory('');
          setContractType('');
          setFlagCode('');
          setModalEditVisible(false);
        } else {
          alert('Something went wrong');
          setModalEditVisible(false);
        }
      });

      await axios.get(`${apiURL}/jobs/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setJobs(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  const deleteJob = async jobID => {
    try {
      setIsLoading(true);
      await axios.delete(`${apiURL}/jobs/delete/${jobID}`).then(res => {
        if (res.data.success === true) {
          alert('Job has been successfully deleted');
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/jobs/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setJobs(res.data.message.reverse());
          setModalDeleteVisible(false);
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems: 'center', width: '100%'}}>
        <View style={styles.card}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : jobs.length < 1 ? (
            <Text>You have not yet created any jobs yet</Text>
          ) : (
            <View>
              {jobs.map(elem => {
                return (
                  <AdvertJobCard
                    key={elem.id}
                    currency={elem.currency}
                    wage={elem.wage}
                    title={elem.title}
                    image={elem.imageURL}
                    billing={elem.billing}
                    countryCode={elem.countryCode}
                    wagePeriod={elem.wagePeriod}
                    contractType={elem.contractType}
                    description={elem.description}
                    dateCreated={elem.dateCreated}
                    address={elem.address}
                    phone={elem.phone}
                    text="Your AD is active"
                    editText="EDIT"
                    deleteText="DELETE"
                    republishText="Republish"
                    openJobProfile={() =>
                      openJobProfile(elem.id, elem.category.id)
                    }
                    navigation={navigation}
                    deleteJob={() => deleteJob(elem.id)}
                    openDelete={() => openDelete(elem)}
                    openEdit={() => openEdit(elem)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* JOB EDITING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalEditVisible(!modalEditVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: COLORS.green,
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  EDITING JOB ITEM
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                You are editing and updating an existing Job Item
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 15,
                  borderRadius: 10,
                }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Company / Business Name</Text>
                  <CustomTextInput
                    placeholder="Add Business or Company Name"
                    onChangeText={text => setBusinessName(text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Job title (Title of your Job Position)
                  </Text>
                  <CustomTextInput
                    placeholder="Add Title"
                    onChangeText={text => setTitle(text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Select Job Category (Users in find your job more easily)
                  </Text>
                  <SelectDropdown
                    data={jobCategories}
                    onSelect={(selectedItem, index) => {
                      setJobCategory(selectedItem);
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
                      height: 30,
                      color: COLORS.black,
                    }}
                    defaultButtonText={'Select Job Category'}
                    buttonTextStyle={{
                      fontSize: SIZES.text1,
                      textAlign: 'left',
                      width: '100%',
                      backgroundColor: COLORS.yellow,
                      color: COLORS.black,
                    }}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Wage Currency</Text>
                      <SelectDropdown
                        data={Object.values(currencyNames)}
                        onSelect={(selectedItem, index) => {
                          setCurrency(selectedItem);
                          const currencyAsArray = Object.entries(currencyNames);
                          const filteredCurrencyCode = currencyAsArray.filter(
                            ([key, value]) => value === selectedItem,
                          )[0][0];

                          setCurrencyCode(filteredCurrencyCode);
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
                          height: 30,
                          color: COLORS.black,
                        }}
                        defaultButtonText={'Select Currency'}
                        buttonTextStyle={{
                          fontSize: SIZES.text1,
                          textAlign: 'left',
                          width: '100%',
                          backgroundColor: COLORS.yellow,
                          color: COLORS.black,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Wage Amount</Text>
                      <CustomTextInput
                        placeholder="Add Wage"
                        onChangeText={text => setWage(text)}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Pay Period</Text>
                      <SelectDropdown
                        data={['per hr', 'per wk', 'per mth']}
                        onSelect={(selectedItem, index) => {
                          setWagePeriod(selectedItem);
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
                          height: 30,
                          color: COLORS.black,
                        }}
                        defaultButtonText={'Select period'}
                        buttonTextStyle={{
                          fontSize: SIZES.text1,
                          textAlign: 'left',
                          width: '100%',
                          backgroundColor: COLORS.yellow,
                          color: COLORS.black,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{width: '50%'}}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelText}>Contract type</Text>
                      <SelectDropdown
                        data={['Full Time', 'Part Time']}
                        onSelect={(selectedItem, index) => {
                          setContractType(selectedItem);
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
                          height: 30,
                          color: COLORS.black,
                        }}
                        defaultButtonText={'Select Contract type'}
                        buttonTextStyle={{
                          fontSize: SIZES.text1,
                          textAlign: 'left',
                          width: '100%',
                          backgroundColor: COLORS.yellow,
                          color: COLORS.black,
                        }}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Email</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Email"
                        onChangeText={text => setEmail(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Phone</Text>
                  <View style={styles.phoneInput}>
                    <View style={{width: 150, padding: 2}}>
                      {/* <CountryPicker
                        withFilter
                        countryCode={flagCode}
                        withFlag
                        withAlphaFilter={false}
                        withCurrencyButton={false}
                        withCallingCode
                        withCallingCodeButton
                        onSelect={country => {
                          const {cca2, callingCode} = country;
                          setFlagCode(cca2);
                          setCountryCode(callingCode[0]);
                        }}
                        style={{backgroundColor: COLORS.yellow}}
                        theme={DARK_THEME}
                      /> */}
                    </View>
                    <View style={{flex: 1, padding: 2}}>
                      <CustomTextInput
                        placeholder="Phone Number"
                        onChangeText={text => setPhoneNumber(text)}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Location</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Job Location"
                        onChangeText={text => setAddress(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Website</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <CustomTextInput
                        placeholder="Enter Website"
                        onChangeText={text => setWebsite(text)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                    Add Photos
                  </Text>
                  <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                    This is the title picture that will be displayed on the
                    Community Item
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{padding: 20}}
                    onPress={() => handleChoosePhoto()}>
                    <PlusIcon height="60" width="60" />
                  </TouchableOpacity>
                  <View>
                    {photo === '' ? (
                      <></>
                    ) : (
                      <>
                        <Image
                          source={{uri: photo.uri}}
                          style={{
                            flex: 1,
                            width: windowWidth - 200,
                            height: 150,
                          }}
                        />
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Description ({300 - description.length} characters left)
                  </Text>
                  <CustomMultiLineTextInput
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={text => setDescription(text)}
                    maxLength={300}
                    placeholder={current.description}
                  />
                </View>
              </View>

              <Text
                style={{textAlign: 'center', marginTop: 10, fontWeight: '700'}}>
                PREVIEW
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                {/* <JobCard /> */}
                <JobCard
                  key={current.id}
                  currency={currencyCode ? currencyCode : current.currency}
                  wage={wage ? wage : current.wage}
                  title={title ? title : current.title}
                  image={photo ? photo.uri : current.imageURL}
                  wagePeriod={wagePeriod ? wagePeriod : current.wagePeriod}
                  billing={current.billing}
                  contractType={
                    contractType ? contractType : current.contractType
                  }
                  description={description ? description : current.description}
                  dateCreated={current.dateCreated}
                  address={address ? address : current.address}
                  // phone={current.phone}
                  phone={'+' + current.countryCode + '-' + current.phone}
                  openJobProfile={() =>
                    openJobProfile(current.id, current.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.successButton}
                  onPress={() => editJob(current.id)}>
                  <Text style={{color: COLORS.white}}>UPDATE JOB</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>

      {/* JOB DELETING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDeleteVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalDeleteVisible(!modalDeleteVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: '#c00',
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  DELETING JOB
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                This is an irreversible action, be sure you understand what you
                are doing
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                <JobCard
                  key={current.id}
                  wage={current.wage}
                  title={current.title}
                  image={current.imageURL}
                  wagePeriod={current.wagePeriod}
                  billing={current.billing}
                  contractType={current.contractType}
                  description={current.description}
                  dateCreated={current.dateCreated}
                  address={current.address}
                  phone={'+' + current.countryCode + '-' + current.phone}
                  openJobProfile={() =>
                    openJobProfile(current.id, current.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.submitButton}
                  onPress={() => deleteJob(current.id)}>
                  <Text style={{color: COLORS.white}}>DELETE JOB</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </ScrollView>
  );
};

const Community = ({navigation}) => {
  const [news, setNews] = useState([]);
  const [id, setId] = useState([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [title, setTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('');
  const [newsCategories, setNewsCategories] = useState([]);
  const [newsCategoriesData, setNewsCategoriesData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return;
      }
      setId(TOKEN_ID);

      let newsCategoryNames = [];
      let newsCategoryData = [];

      await axios.get(`${apiURL}/news/user/active/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setNews(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/news/categories`)
        .then(res => {
          return res.data.message;
        })
        .then(result => {
          result.map(elem => {
            newsCategoryNames.push(elem.name);
            newsCategoryData.push(elem);
          });
          setNewsCategories(newsCategoryNames);
          setNewsCategoriesData(newsCategoryData);
          setIsLoading(false);
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

  const openNewsProfile = async (newsID, newsCategory) => {
    try {
      await AsyncStorage.setItem('currentNewsID', newsID);
      await AsyncStorage.setItem('currentNewsCategory', newsCategory);
      return navigation.navigate('NewsProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  const openDelete = async elem => {
    try {
      setIsLoading(true);
      await setCurrent(elem);
      setModalDeleteVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const openEdit = async elem => {
    try {
      setIsLoading(true);
      await setCurrent(elem);
      setModalEditVisible(true);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleDismissModal = async => {
    try {
      setModalDeleteVisible(false);
      setModalEditVisible(false);
    } catch (error) {}
  };

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
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
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

  const editNews = async newsID => {
    try {
      setIsLoading(true);
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
      if (title) {
        data.append('title', title);
      }
      if (newsCategory) {
        const selectedCategory = newsCategoriesData.filter(
          elem => elem.name === newsCategory,
        );
        data.append('category', selectedCategory[0].id);
      }
      if (description) {
        data.append('description', description);
      }

      await axios.patch(`${apiURL}/news/edit/${newsID}`, data).then(res => {
        if (res.data.success === true) {
          alert('Community Item has been successfully updated');
          setPhoto('');
          setTitle('');
          setDescription('');
          setNewsCategory('');
          setModalEditVisible(false);
        } else {
          alert('Something went wrong');
          setModalEditVisible(false);
        }
      });

      await axios.get(`${apiURL}/news/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setNews(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  const deleteNews = async newsID => {
    try {
      setIsLoading(true);
      await axios.delete(`${apiURL}/news/delete/${newsID}`).then(res => {
        if (res.data.success === true) {
          alert('Community Item has been successfully deleted');
          setModalDeleteVisible(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/news/user/active/${id}`).then(res => {
        if (res.data.success === true) {
          setNews(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      // return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems: 'center', width: '100%'}}>
        <View style={styles.card}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : news.length < 1 ? (
            <Text>You have not yet created any news yet</Text>
          ) : (
            <View>
              {news.map(elem => {
                return (
                  <AdvertNewsCard
                    key={elem.id}
                    image={elem.imageURL}
                    title={elem.title}
                    description={elem.description}
                    category={elem.category.name}
                    dateCreated={elem.dateCreated}
                    billing={elem.billing}
                    text="Your AD is active"
                    editText="EDIT"
                    deleteText="DELETE"
                    republishText="Republish"
                    openNewsProfile={() =>
                      openNewsProfile(elem.id, elem.category.id)
                    }
                    navigation={navigation}
                    openDelete={() => openDelete(elem)}
                    openEdit={() => openEdit(elem)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* NEWS EDITING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEditVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalEditVisible(!modalEditVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: COLORS.green,
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  EDITING NEWS ITEM
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                You are editing and updating an existing News Item
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 15,
                  borderRadius: 10,
                }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    News title(Title of your news post)
                  </Text>
                  <CustomTextInput
                    placeholder="Add Title"
                    onChangeText={text => setTitle(text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Select News Category(Users in find your post more easily)
                  </Text>
                  <SelectDropdown
                    data={newsCategories}
                    onSelect={(selectedItem, index) => {
                      setNewsCategory(selectedItem);
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
                      height: 30,
                      color: COLORS.black,
                    }}
                    defaultButtonText={'Select News Category'}
                    buttonTextStyle={{
                      fontSize: SIZES.text1,
                      textAlign: 'left',
                      width: '100%',
                      backgroundColor: COLORS.yellow,
                      color: COLORS.black,
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                    Add Photos
                  </Text>
                  <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                    This is the title picture that will be displayed on the
                    Community Item
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{padding: 20}}
                    onPress={() => handleChoosePhoto()}>
                    <PlusIcon height="60" width="60" />
                  </TouchableOpacity>
                  <View>
                    {photo === '' ? (
                      <></>
                    ) : (
                      <>
                        <Image
                          source={{uri: photo.uri}}
                          style={{
                            flex: 1,
                            width: windowWidth - 200,
                            height: 150,
                          }}
                        />
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>
                    Description ({1200 - description.length} characters left)
                  </Text>
                  <CustomMultiLineTextInput
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={text => setDescription(text)}
                    maxLength={1200}
                    placeholder={current.description}
                  />
                </View>
              </View>

              <Text
                style={{textAlign: 'center', marginTop: 10, fontWeight: '700'}}>
                PREVIEW
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                {/* <NewsCard /> */}
                <NewsCard
                  key={current.id}
                  image={photo ? photo.uri : current.imageURL}
                  title={title ? title : current.title}
                  description={description ? description : current.description}
                  category={
                    current.category && !newsCategory
                      ? current.category.name
                      : newsCategory
                  }
                  billing={current.billing}
                  dateCreated={current.dateCreated}
                  openNewsProfile={() =>
                    openNewsProfile(current.id, current.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.successButton}
                  onPress={() => editNews(current.id)}>
                  <Text style={{color: COLORS.white}}>UPDATE NEWS</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>

      {/* NEWS DELETING MODAL */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDeleteVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalDeleteVisible(!modalDeleteVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  backgroundColor: '#c00',
                  padding: 10,
                  // width: windowWidth - 10,
                  width: '100%',
                  marginBottom: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  DELETING NEWS
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>***</Text>
              <Text style={{textAlign: 'center'}}>
                This is an irreversible action, be sure you understand what you
                are doing
              </Text>
              <Text style={{textAlign: 'center'}}>***</Text>
              <View
                style={{
                  backgroundColor: COLORS.grayDark,
                  padding: 5,
                  borderRadius: 10,
                }}>
                {/* <NewsCard /> */}
                <NewsCard
                  key={current.id}
                  image={current.imageURL}
                  title={current.title}
                  description={current.description}
                  category={
                    current.category ? current.category.name : 'NO CATEGORY'
                  }
                  billing={current.billing}
                  dateCreated={current.dateCreated}
                  openNewsProfile={() =>
                    openNewsProfile(current.id, current.category.id)
                  }
                  navigation={navigation}
                />
              </View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <Pressable
                  style={styles.submitButton}
                  onPress={() => deleteNews(current.id)}>
                  <Text style={{color: COLORS.white}}>DELETE NEWS</Text>
                </Pressable>
              )}
              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default function MyAdvertsActive({navigation}) {
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [news, setNews] = useState([]);
  const [id, setId] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return;
      }
      setId(TOKEN_ID);

      await axios.get(`${apiURL}/events/user/active/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setEvents(res.data.message);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/jobs/user/active/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setJobs(res.data.message);
        } else {
          alert('Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/businesses/user/active/${TOKEN_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setBusinesses(res.data.message);
          } else {
            alert('Something went wrong');
          }
        });

      await axios.get(`${apiURL}/news/user/active/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setNews(res.data.message);
          setIsLoading(false);
        } else {
          alert('Something went wrong');
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

  return (
    <View
      style={{
        backgroundColor: COLORS.grayDark,
        height: '100%',
        // height: windowHeight,
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: COLORS.yellow,
          padding: 10,
        }}>
        <View style={{width: '25%', alignItems: 'center'}}>
          <Text>({events.length})</Text>
        </View>
        <View style={{width: '25%', alignItems: 'center'}}>
          <Text>({businesses.length})</Text>
        </View>
        <View style={{width: '25%', alignItems: 'center'}}>
          <Text>({jobs.length})</Text>
        </View>
        <View style={{width: '25%', alignItems: 'center'}}>
          <Text>({news.length})</Text>
        </View>
      </View>

      <View style={{flexDirection: 'column', padding: 0}}>
        <ScrollView style={{flexDirection: 'column', padding: 5}}>
          <Tab.Navigator
            style={{
              flex: 1,
              height:
                windowHeight / 4 +
                windowHeight / 3 +
                windowHeight / 5 +
                windowHeight / 12,
              // height:"100%",
              // marginBottom: 15,
            }}
            initialRouteName="Events"
            screenOptions={{
              tabBarLabelStyle: {color: COLORS.yellow, fontSize: 9},
              tabBarStyle: {backgroundColor: COLORS.grayDark},
              tabBarIndicatorStyle: {
                borderBottomColor: COLORS.yellow,
                borderWidth: 2,
              },
            }}>
            <Tab.Screen name="Events" component={Events} />
            <Tab.Screen name="Businesses" component={Business} />
            <Tab.Screen name="Jobs" component={Job} />
            <Tab.Screen name="Community" component={Community} />
          </Tab.Navigator>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayDark,
    // width: '100%',
    // height: windowHeight * 0.3,
  },
  navTab: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  navItem: {
    width: 80,
    height: 80,
    alignItems: 'center',
    borderRadius: 90,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'space-evenly',
  },
  active: {
    backgroundColor: COLORS.yellow,
    borderWidth: 1,
    borderColor: COLORS.yellow,
  },
  text: {
    fontSize: SIZES.normal,
    color: COLORS.gray,
  },
  number: {
    fontSize: SIZES.normal,
    color: COLORS.gray,
  },
  image: {
    height: 35,
    width: 35,
  },
  card: {
    borderBottomColor: COLORS.yellow,
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginTop: 5,
    // paddingBottom: 40,
  },
  modalText: {
    marginBottom: 2,
  },
  submitButton: {
    backgroundColor: '#c00',
    padding: 10,
    width: 250,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  successButton: {
    backgroundColor: COLORS.green,
    padding: 10,
    width: 250,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#fff',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    width: windowWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  inputContainerStyle: {
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'column',
    width: '100%',
  },
  inputStyle: {
    backgroundColor: '#222242',
    paddingLeft: 15,
    borderRadius: 5,
    color: '#fff',
    // width:50
  },
  labelStyle: {
    marginBottom: 5,
    fontSize: 12,
  },
  inputContainer: {
    padding: 3,
    marginVertical: 0,
  },
  phoneInput: {
    flexDirection: 'row',
    paddingVertical: 1,
  },
});
