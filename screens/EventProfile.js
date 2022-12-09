// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Linking,
  RefreshControl,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, EventCard} from '../components';

// SVG IMPORTS
import PhoneIcon from '../assets/svgs/phone-black.svg';
import MessageIcon from '../assets/svgs/message-active.svg';
import Location from '../assets/svgs/location-white.svg';
import EventsIcon from '../assets/svgs/events-white.svg';
import DollarBag from '../assets/svgs/dollar-bag-white.svg';
import EmailIcon from '../assets/svgs/email-active.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import {currencySymbolConverter, dateManipulator, openURL, upperCase} from '../utils/helperFunctions';

export default function EventProfile({navigation}) {
  const [currentEvent, setCurrentEvent] = useState([]);
  const [currentEventId, setCurrentEventId] = useState('');
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  let curID=""

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });
      setUser(TOKEN_ID);

      const CURRENT_EVENT_ID = await AsyncStorage.getItem(
        'currentEventID',
      ).then(res => {
        return res;
      });
      await setCurrentEventId(CURRENT_EVENT_ID);
      console.log(currentEventId,123, CURRENT_EVENT_ID)

      const CURRENT_EVENT_CATEGORY_ID = await AsyncStorage.getItem(
        'currentEventCategory',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios
        .get(`${apiURL}/events/single/${CURRENT_EVENT_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setIsLoading(false);
            let arr = [];
            arr.push(res.data.message);
            return setCurrentEvent(arr);
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });

      await axios
        .post(`${apiURL}/events/views/create/${CURRENT_EVENT_ID}`, {
          author: TOKEN_ID,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .get(`${apiURL}/events/category/${CURRENT_EVENT_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let newArray = res.data.message.filter(
              elem => elem._id !== CURRENT_EVENT_ID,
            );
            return setEvents(newArray.reverse());
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

  const openEventProfile = async (eventID, eventCategory) => {
    try {
      setIsLoading(true);
      const CURRENT_EVENT_CATEGORY_ID = await AsyncStorage.getItem(
        'currentEventCategory',
      ).then(res => {
        return res;
      });

      await AsyncStorage.setItem('currentEventID', eventID);

      await setCurrentEventId(eventID);

      await axios
        .post(`${apiURL}/events/views/create/${eventID}`, {
          author: user,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });

      await axios.get(`${apiURL}/events/single/${eventID}`).then(res => {
        if (res.data.success === true) {
          setIsLoading(false);
          let arr = [];
          arr.push(res.data.message);
          return setCurrentEvent(arr);
        } else {
          alert('OOOPPPS ! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/events/category/${CURRENT_EVENT_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let newArray = res.data.message.filter(
              elem => elem.id !== eventID,
            );
            return setEvents(newArray.reverse());
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  const handleCallAction = async (id, phone) => {
    try {
      setIsLoading(true);
      await axios
        .post(`${apiURL}/events/calls/create/${id}`, {
          author: user,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            setIsLoading(false);
            console.log(res.data.error);
          }
        });

      await axios
        .post(`${apiURL}/notifications/create/${user}`, {
          event: id,
          message: 'called',
        })
        .then(res => {
          if (res.data.success === true) {
            setIsLoading(false);
            console.log(res.data.message);
          } else {
            setIsLoading(false);
            console.log(res.data.error);
          }
        });

      return Linking.openURL(`tel:${'+' + phone}`);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });
      setUser(TOKEN_ID);

      const CURRENT_EVENT_ID = await AsyncStorage.getItem(
        'currentEventID',
      ).then(res => {
        return res;
      });
      setCurrentEventId(CURRENT_EVENT_ID);

      const CURRENT_EVENT_CATEGORY_ID = await AsyncStorage.getItem(
        'currentEventCategory',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios
        .get(`${apiURL}/events/single/${CURRENT_EVENT_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let arr = [];
            arr.push(res.data.message);
            return setCurrentEvent(arr);
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });

      await axios
        .post(`${apiURL}/events/views/create/${CURRENT_EVENT_ID}`, {
          author: TOKEN_ID,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .get(`${apiURL}/events/category/${CURRENT_EVENT_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let newArray = res.data.message.filter(
              elem => elem._id !== CURRENT_EVENT_ID,
            );
            return setEvents(newArray.reverse());
            return setEvents(res.data.message.reverse());
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      return error;
    }
  }, [refreshing]);

  const handleEmailAction = async (id, email) => {
    try {
      setIsLoading(true);
      await axios
        .post(`${apiURL}/events/emails/create/${id}`, {
          author: user,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .post(`${apiURL}/notifications/create/${user}`, {
          event: id,
          message: 'emailed',
        })
        .then(res => {
          if (res.data.success === true) {
            setIsLoading(false);
            console.log(res.data.message);
          } else {
            setIsLoading(false);
            console.log(res.data.error);
          }
        });
      // return Linking.openURL(`mailto:${email}`);
      return alert("Your attendance has been registered")
    } catch (error) {
      // console.log(error);
      return error;
    }
  };

  return (
    <View style={styles.container}>      

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {currentEvent.map(elem => {
          return (
            <View key={elem.id}>
              {/* {console.log(elem)} */}
              {elem.imageURL ? (
                <ImageBackground
                  source={{uri: elem.imageURL}}
                  style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingVertical: 5,
                          width: '75%',
                        }}>
                        <EventsIcon
                          width={20}
                          height={20}
                          style={styles.icon}
                        />
                        {elem.eventTime ? (
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: SIZES.text1,
                              flex: 1,
                            }}>
                            Date: {moment(elem.date).format('LL')}{' '}
                            {dateManipulator(elem.eventTime)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: SIZES.text1,
                              flex: 1,
                            }}>
                            Date: {moment(elem.date).format('LLLL')}
                          </Text>
                        )}
                        {/* <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          Date: {moment(elem.date).format('LLLL')}
                        </Text> */}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingVertical: 5,
                          width: '35%',
                        }}>
                        <DollarBag width={20} height={20} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {elem.fee == 0 ? 'Free Event' : `${elem.currency ? currencySymbolConverter(elem.currency) : "$"} ${elem.fee}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.imageText}>
                      <Location width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        Venue: {elem.address}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              ) : (
                <ImageBackground source={images.Default} style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingVertical: 5,
                          width: '75%',
                        }}>
                        <EventsIcon
                          width={20}
                          height={20}
                          style={styles.icon}
                        />
                        {elem.eventTime ? (
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: SIZES.text1,
                              flex: 1,
                            }}>
                            Date: {moment(elem.date).format('LL')}{' '}
                            {dateManipulator(elem.eventTime)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: SIZES.text1,
                              flex: 1,
                            }}>
                            Date: {moment(elem.date).format('LLLL')}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingVertical: 5,
                          width: '35%',
                        }}>
                        <DollarBag width={20} height={20} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {elem.fee == 0 ? 'Free Event' : `$ ${elem.fee}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.imageText}>
                      <Location width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        Venue: {elem.address}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              )}

              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <View style={styles.btnContainer}>
                  <View style={styles.btnContainerInner}>
                    <TouchableOpacity
                      style={styles.buttonCall}
                      onPress={() =>
                        handleCallAction(elem.id, elem.countryCode + elem.phone)
                      }>
                      <PhoneIcon
                        width={20}
                        height={20}
                        style={{marginRight: 15}}
                      />
                      <Text>Call</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.btnContainerInner}>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`mailto:${elem.email}`)}
                      style={styles.buttonMessage}>
                      <Text style={{color: COLORS.yellow}}>Email</Text>
                      <EmailIcon
                        width={20}
                        height={20}
                        style={{marginLeft: 15}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.description}>
                  Community: {elem.community.name}
                </Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.description}>
                  Category: {elem.category ? elem.category.name : 'No Category Added'}
                </Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.description}>
                  Telephone: +{elem.countryCode} - {elem.phone}
                </Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.description}>Email: {elem.email}</Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.description}>Event Fee: {elem.currency ? currencySymbolConverter(elem.currency) : "$"} {elem.fee}</Text>
              </View>
              {elem.website ? (
                <View style={{paddingHorizontal: 10, flexDirection:"row"}}>
                  <Text style={styles.description}>
                    Website: 
                  </Text>
                  <TouchableOpacity
                      onPress={() => openURL(elem.website)}>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        {elem.website}
                      </Text>
                    </TouchableOpacity>
                </View>
              ) : (
                <View />
              )}
              <View
                style={{
                  color: COLORS.white,
                  fontSize: SIZES.text1,
                  paddingTop: 10,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.description}>{upperCase(elem.title)}</Text>
                <Text style={styles.description}>{elem.description}</Text>
              </View>

              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.buttonReview}
                    onPress={() => handleEmailAction(elem.id, elem.email)}>
                    <Text
                      style={{
                        flex: 1,
                        color: COLORS.yellow,
                        textAlign: 'center',
                      }}>
                      ATTEND EVENT
                    </Text>
                    {/* <View>
                      <Text style={{color: COLORS.green}}>12</Text>
                    </View>
                    <View>
                      <Text style={{color: COLORS.yellow}}>+</Text>
                    </View> */}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <View
          style={{
            padding: 10,
            borderBottomColor: COLORS.yellow,
            borderBottomWidth: 2,
          }}>
          <Text style={{color: COLORS.white, fontSize: SIZES.text2}}>
            Similar Events
          </Text>
        </View>
        <View style={{padding: 10}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {events.length < 1 ? (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text>No results found</Text>
                </View>
              ) : (
                events.map(event => {
                  return (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      image={event.imageURL}
                      currency={event.currency}
                      fee={event.fee}
                      billing={event.billing}
                      description={event.description}
                      address={event.address}
                      phone={'+' + event.countryCode + '-' + event.phone}
                      date={event.date ? event.date : "No Date Added"}
                      time={event.eventTime ? event.eventTime : "No Time Added"}
                      openEventProfile={() =>
                        openEventProfile(event.id, event.category.id)
                      }
                      navigation={navigation}
                    />
                  );
                })
              )}
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
  filter: {
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: COLORS.blackLight,
  },
  description: {
    color: COLORS.white,
    fontSize: SIZES.text1,
  },
  fillterText: {
    color: COLORS.white,
  },
  active: {
    backgroundColor: COLORS.yellow,
  },
  containerSlider: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  bgImage: {
    height: 300,
    width: '100%',
  },
  overlayText: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.blackOpacity,
    padding: 10,
  },
  textWhite: {
    color: COLORS.white,
  },
  textYellow: {
    color: COLORS.yellow,
  },
  icon: {
    marginRight: 10,
  },
  imageText: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  btnContainerInner: {
    paddingHorizontal: 5,
    width: '50%',
  },
  buttonCall: {
    padding: 8,
    backgroundColor: COLORS.yellow,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonMessage: {
    padding: 8,
    backgroundColor: COLORS.black,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonReview: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.yellow,
    padding: 10,
  },
});
