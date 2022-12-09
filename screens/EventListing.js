// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import jwt_decode from 'jwt-decode';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, BackgroundCarousel, EventCard} from '../components';
import Search from '../assets/svgs/search.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import { currencySymbolConverter } from '../utils/helperFunctions';

const windowWidth = Dimensions.get('window').width;

export default function EventListing({navigation}) {
  const carouselImages = [
    'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1485550409059-9afb054cada4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1429087969512-1e85aab2683d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  ];

  const [currentCommunity, setCurrentCommunity] = useState({});
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [communitiesData, setCommunitiesData] = useState([]);
  const [eventsRecord, setEventsRecord] = useState('');
  const [vipEvents, setVipEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [replyCount, setReplyCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      let USER, DEFAULT_COMMUNITY;
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          DEFAULT_COMMUNITY = res.data.message.community;
          setCurrentCommunity(res.data.message.community);
          return (USER = res.data.message);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/events/community/active/${USER.community.id}`)
        .then(res => {
          if (res.data.success === true) {
            setEvents(res.data.message);
            setEventsRecord(res.data.message.reverse());
            setIsLoading(false);
          } else {
            alert('Something went wrong');
          }
        });

      await axios.get(`${apiURL}/events/vip/`).then(res => {
        if (res.data.success === true) {
          let arr = res.data.message.filter(elem => {
            return elem.billing === 'VIP';
          });
          setVipEvents(arr.reverse());
          // setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/communities/`).then(res => {
        if (res.data.success === true) {
          let COMMUNITIES = res.data.message.filter(
            elem => elem.id !== DEFAULT_COMMUNITY.id,
          );
          let ALL_COMMUNITY = COMMUNITIES.filter(
            elem => elem.name === 'All Ugandan Communities',
          )[0];

          let FILTERED_COMMUNITIES = COMMUNITIES.filter(
            elem => elem.id !== ALL_COMMUNITY.id,
          );

          FILTERED_COMMUNITIES.unshift(ALL_COMMUNITY);
          FILTERED_COMMUNITIES.unshift(DEFAULT_COMMUNITY);

          let results = FILTERED_COMMUNITIES.map(elem => elem.name);
          setCommunitiesData(res.data.message);
          setCommunities(results);
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/feedbacks/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          let feedbackArray = [];
          let replyArray = [];
          res.data.message.map(elem => {
            elem.replies.map(item => replyArray.push(item));
          });
          res.data.message.map(elem => {
            feedbackArray.push(elem);
          });
          let unReadReplies = replyArray.filter(
            elem => elem.isUserRead === false,
          );
          let unReadFeedback = feedbackArray.filter(
            elem => elem.isUserRead === false,
          );
          return setReplyCount(unReadReplies.length + unReadFeedback.length);
        } else {
          setRefreshing(false);
          alert('OOOPPPS ! Something went wrong');
        }
      });
    } catch (error) {
      return error;
    }
  }

  async function filterEventsByCommunity(name) {
    try {
      setIsLoading(true);
      let selectedCommunity = communitiesData.filter(
        elem => elem.name === name,
      );
      await axios
        .get(`${apiURL}/communities/${selectedCommunity[0].id}`)
        .then(res => {
          if (res.data.success === true) {
            setCurrentCommunity(res.data.message);
          } else {
            alert('Something went wrong');
          }
        });
      await axios
        .get(`${apiURL}/events/community/active/${selectedCommunity[0].id}`)
        .then(res => {
          if (res.data.success === true) {
            setEvents(res.data.message.reverse());
            setEventsRecord(res.data.message);
            setIsLoading(false);
          } else {
            alert('Something went wrong');
          }
        });
    } catch (error) {
      return error;
    }
  }

  const onChangeText = txt => {
    if (!txt) return events;
    const tempArray = eventsRecord.filter(el => {
      if (
        el.title.toLowerCase().indexOf(txt.toLowerCase()) !== -1 ||
        el.description.toLowerCase().indexOf(txt.toLowerCase()) !== -1
      ) {
        return el;
      }
    });
    return setEvents(tempArray);
  };

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
      return navigation.navigate('EventProfile');
    } catch (error) {
      alert(error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);

      let USER, DEFAULT_COMMUNITY;
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          DEFAULT_COMMUNITY = res.data.message.community;
          setCurrentCommunity(res.data.message.community);
          setRefreshing(false);
          return (USER = res.data.message);
        } else {
          alert('OOOPPP ! Something went wrong');
          setRefreshing(false);
        }
      });

      await axios
        .get(`${apiURL}/events/community/active/${USER.community.id}`)
        .then(res => {
          if (res.data.success === true) {
            setEvents(res.data.message);
            setEventsRecord(res.data.message.reverse());
            setIsLoading(false);
            setRefreshing(false);
          } else {
            alert('Something went wrong');
            setRefreshing(false);
          }
        });

      await axios.get(`${apiURL}/events/vip/`).then(res => {
        if (res.data.success === true) {
          let arr = res.data.message.filter(elem => {
            return elem.billing === 'VIP';
          });
          setRefreshing(false);
          setVipEvents(arr.reverse());
          // setIsLoading(false);
        } else {
          setRefreshing(false);
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/feedbacks/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          let feedbackArray = [];
          let replyArray = [];
          res.data.message.map(elem => {
            elem.replies.map(item => replyArray.push(item));
          });
          res.data.message.map(elem => {
            feedbackArray.push(elem);
          });
          let unReadReplies = replyArray.filter(
            elem => elem.isUserRead === false,
          );
          let unReadFeedback = feedbackArray.filter(
            elem => elem.isUserRead === false,
          );
          return setReplyCount(unReadReplies.length + unReadFeedback.length);
        } else {
          setRefreshing(false);
          alert('OOOPPPS ! Something went wrong');
        }
      });

      setRefreshing(false);
    } catch (error) {
      return error;
    }
  }, [refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            padding: 7,
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: COLORS.yellow,
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: COLORS.yellow,
              borderRadius: 3,
              padding: 3,
              width: '100%',
            }}>
            <SelectDropdown
              data={communities}
              buttonStyle={{
                fontSize: 12,
                padding: 5,
                height: 20,
                width: '50%',
                backgroundColor: COLORS.yellow,
              }}
              buttonTextStyle={{fontSize: 13, padding: 0, height: 15}}
              dropdownStyle={{fontSize: 8, padding: 0}}
              rowTextStyle={{fontSize: 13, padding: 10}}
              defaultButtonText={currentCommunity.name}
              onSelect={(selectedItem, index) => {
                filterEventsByCommunity(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.yellow,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: COLORS.black,
                  padding: 2,
                  flexDirection: 'row',
                  display: 'flex',
                  flex: 1,
                }}>
                <TextInput
                  style={styles.input}
                  onChangeText={text => onChangeText(text)}
                  // value={'Type to search'}
                  placeholder="Type to search"
                  placeholderTextColor="#fff"
                />
                <TouchableOpacity style={{padding: 2}}>
                  <Search height={17} width={17} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* AD CAROUSEL */}
        <View style={{padding: 10, position: 'relative'}}>
          {/* <BackgroundCarousel images={carouselImages} /> */}
          <BackgroundCarousel
            images={carouselImages}
            data={vipEvents}
            navigation={navigation}
            item={'events'}
          />
        </View>

        <View
          style={{
            padding: 10,
            borderBottomColor: COLORS.yellow,
            borderBottomWidth: 2,
          }}>
          <Text style={{color: COLORS.white, fontSize: SIZES.text2}}>
            Events in {currentCommunity.name}
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
                      fee={event.fee}
                      currency={event.currency}
                      billing={event.billing}
                      date={event.date ? event.date : 'No Date Added'}
                      time={event.eventTime ? event.eventTime : 'No Time Added'}
                      description={event.description}
                      address={event.address}
                      phone={'+' + event.countryCode + '-' + event.phone}
                      // category={event.category.id}
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
    </SafeAreaView>
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
    width: windowWidth / 3 + windowWidth / 3,
    height: 150,
    borderRadius: 10,
    padding: 5,
  },
  input: {
    height: 23,
    margin: 0,
    borderWidth: 0,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: COLORS.black,
    flex: 1,
    fontSize: SIZES.normal,
    color: COLORS.yellow,
  },
});
