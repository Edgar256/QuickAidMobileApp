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
  Image,
  RefreshControl,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
// import io from 'socket.io-client';
import moment from 'moment';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';
import {
  limitStringLength,
  titleCase,
  trimString,
  upperCase,
} from '../utils/helperFunctions';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall} from '../components';

// API URL
import {apiURL, rootApiURL} from '../utils/apiURL';

// SVG IMPORTS
import SendArrowWhite from '../assets/svgs/send-arrow-white.svg';

const windowWidth = Dimensions.get('window').width;

export default function Inbox({navigation}) {
  const [user, setUser] = useState([]);
  const [id, setId] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [messages, setMessages] = useState('');
  const [replyCount, setReplyCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function populateData() {
    try {
      setIsLoading(true);

      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }
      setId(TOKEN_ID);

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setFirstName(res.data.message.firstName);
          setLastName(res.data.message.lastName);
          setId(res.data.message.id);
          setImageURL(res.data.message.profileImage);
          return setUser(res.data.message);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });

      await axios.get(`${apiURL}/feedbacks/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setMessages(res.data.message.reverse());
          return setIsLoading(false);
        } else {
          alert('OOOPPPSS! Something went wrong. We are working to find it.');
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

  const openFeedbackBack = async feedbackID => {
    try {
      await axios
        .patch(`${apiURL}/feedbacks/replies/user-read/${feedbackID}`)
        .then(res => {
          if (res.data.success === true) {
            return setIsLoading(false);
          } else {
            alert('OOOPPPSS! Something went wrong. We are working to find it.');
          }
        });

      await axios
        .patch(`${apiURL}/feedbacks/user-read/${feedbackID}`)
        .then(res => {
          if (res.data.success === true) {
            return setIsLoading(false);
          } else {
            alert('OOOPPPSS! Something went wrong. We are working to find it.');
          }
        });

      await axios.get(`${apiURL}/feedbacks/users/${id}`).then(res => {
        if (res.data.success === true) {
          setMessages(res.data.message.reverse());
          return setIsLoading(false);
        } else {
          alert('OOOPPPSS! Something went wrong. We are working to find it.');
        }
      });

      await AsyncStorage.setItem('feedbackID', feedbackID);
      return navigation.navigate('InboxDetails');
    } catch (error) {
      alert(error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);

      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }
      setId(TOKEN_ID);

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setFirstName(res.data.message.firstName);
          setLastName(res.data.message.lastName);
          setId(res.data.message.id);
          setImageURL(res.data.message.profileImage);
          setRefreshing(false);
          return setUser(res.data.message);
        } else {
          setRefreshing(false);
          alert('OOOPPP ! Something went wrong');
        }
      });

      await axios.get(`${apiURL}/feedbacks/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setMessages(res.data.message.reverse());
          return setRefreshing(false);
        } else {
          alert('OOOPPPSS! Something went wrong. We are working to find it.');
          setRefreshing(false);
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
      setRefreshing(false);
      return error;
    }
  }, [refreshing]);

  return (
    <View style={styles.container}>

      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            padding: 5,
            backgroundColor: COLORS.white,
            borderRadius: 30,
            padding: 10,
            marginVertical: 10,
          }}>
          Tap Message to view response
        </Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flexDirection: 'column', padding: 0}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {messages.length < 1 ? (
                <View>
                  <Text
                    style={{textAlign: 'center', width: '100%', padding: 10}}>
                    No Messages to show
                  </Text>
                </View>
              ) : (
                <View>
                  {messages.map(elem => {
                    if (elem.isUserRead !== true) {
                      return (
                        <TouchableOpacity
                          onPress={() => openFeedbackBack(elem.id)}
                          style={{
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            flexDirection: 'row',
                            width: '100%',
                            marginVertical: 1,
                            justifyContent: 'center',
                            width: windowWidth * 0.92,
                            alignSelf: 'center',
                          }}
                          key={elem._id}>
                          <View
                            style={{
                              padding: 10,
                              borderRadius: 10,
                              backgroundColor: '#dcf6e2',
                              flex: 1,
                              flexDirection: 'row',
                            }}>
                            <View style={{flex: 1}}>
                              <Text style={{fontWeight: '700'}}>
                                {upperCase(elem.subject)}
                              </Text>
                              <Text>
                                {limitStringLength(elem.description, 0, 40)}
                              </Text>

                              <Text
                                style={{
                                  fontSize: SIZES.small,
                                  color: COLORS.gray,
                                }}>
                                {moment(elem.dateCreated).format('LLLL')}
                              </Text>
                            </View>
                            <View>
                              {elem.replies.filter(
                                item => item.isUserRead === false,
                              ).length < 1 ? (
                                <Text
                                  style={{
                                    backgroundColor: COLORS.lightGray,
                                    fontStyle: 'italic',
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 15,
                                    color: COLORS.white,
                                  }}>
                                  {
                                    elem.replies.filter(
                                      item => item.isUserRead === false,
                                    ).length
                                  }
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    backgroundColor: COLORS.green,
                                    fontStyle: 'italic',
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 15,
                                    color: COLORS.white,
                                  }}>
                                  {
                                    elem.replies.filter(
                                      item => item.isUserRead === false,
                                    ).length
                                  }
                                </Text>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          onPress={() => openFeedbackBack(elem.id)}
                          style={{
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            flexDirection: 'row',
                            width: '100%',
                            marginVertical: 1,
                            justifyContent: 'center',
                            width: windowWidth * 0.92,
                            alignSelf: 'center',
                          }}
                          key={elem._id}>
                          <View
                            style={{
                              padding: 10,
                              borderRadius: 10,
                              backgroundColor: '#ffffff',
                              flex: 1,
                              flexDirection: 'row',
                            }}>
                            <View style={{flex: 1}}>
                              <Text style={{fontWeight: '700'}}>
                                {upperCase(elem.subject)}
                              </Text>
                              <Text>
                                {limitStringLength(elem.description, 0, 40)}
                              </Text>

                              <Text
                                style={{
                                  fontSize: SIZES.small,
                                  color: COLORS.gray,
                                }}>
                                {moment(elem.dateCreated).format('LLLL')}
                              </Text>
                            </View>
                            <View>
                              {elem.replies.filter(
                                item => item.isUserRead === false,
                              ).length < 1 ? (
                                <Text
                                  style={{
                                    backgroundColor: COLORS.lightGray,
                                    fontStyle: 'italic',
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 15,
                                    color: COLORS.white,
                                  }}>
                                  {
                                    elem.replies.filter(
                                      item => item.isUserRead === false,
                                    ).length
                                  }
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    backgroundColor: COLORS.green,
                                    fontStyle: 'italic',
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 15,
                                    color: COLORS.white,
                                  }}>
                                  {
                                    elem.replies.filter(
                                      item => item.isUserRead === false,
                                    ).length
                                  }
                                </Text>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  })}
                </View>
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
    backgroundColor: '#e5e5e5',
    width: windowWidth,
    height: '100%',
  },
  outbound: {
    paddingLeft: 70,
    padding: 5,
    flexDirection: 'column',
    paddingRight: 50,
    width: windowWidth,
    marginVertical: 10,
  },
  outboundInner: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
  },
  inbound: {
    paddingRight: 70,
    padding: 5,
    flexDirection: 'column',
    width: '100%',
    marginVertical: 10,
  },
  inboundInner: {
    backgroundColor: COLORS.yellow,
    padding: 10,
    borderRadius: 5,
  },
});
