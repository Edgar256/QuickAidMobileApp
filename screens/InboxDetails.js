// REACT NATIVE IMPORTS
import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';
import {upperCase} from '../utils/helperFunctions';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall} from '../components';

// API URL
import {apiURL} from '../utils/apiURL';

// SVG IMPORTS
import SendArrowWhite from '../assets/svgs/send-arrow-white.svg';

const windowWidth = Dimensions.get('window').width;

export default function InboxDetails({navigation}) {
  const [user, setUser] = useState([]);
  const [id, setId] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [feedback, setFeedback] = useState({});
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const scrollViewRef = useRef();
  const slowlyScrollDown = () => {
    const y = offset + 10000;
    scrollViewRef.current.scrollTo({x: 0, y, animated: true});
    setOffset(y);
  };

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

      const FEEDBACK_ID = await AsyncStorage.getItem('feedbackID').then(res => {
        return res;
      });

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

      await axios.get(`${apiURL}/feedbacks/single/${FEEDBACK_ID}`).then(res => {
        if (res.data.success === true) {
          setFeedback(res.data.message);
          return setIsLoading(false);
        } else {
          alert('OOOPPPSS! Something went wrong. We are working to find it.');
        }
      });

      await axios
        .get(`${apiURL}/feedbacks/replies/${FEEDBACK_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setReplies(res.data.message);
            return setIsLoading(false);
          } else {
            alert('OOOPPPSS! Something went wrong. We are working to find it.');
            return setIsLoading(false);
          }
        });
    } catch (error) {
      return error;
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      setIsLoading(true);

      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }
      setId(TOKEN_ID);

      const FEEDBACK_ID = await AsyncStorage.getItem('feedbackID').then(res => {
        return res;
      });

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

      await axios.get(`${apiURL}/feedbacks/single/${FEEDBACK_ID}`).then(res => {
        if (res.data.success === true) {
          setFeedback(res.data.message);
          setRefreshing(false);
          return setIsLoading(false);
        } else {
          setRefreshing(false);
          alert('OOOPPPSS! Something went wrong. We are working to find it.');
        }
      });

      await axios
        .get(`${apiURL}/feedbacks/replies/${FEEDBACK_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setReplies(res.data.message);
            return setRefreshing(false);
          } else {
            alert('OOOPPPSS! Something went wrong. We are working to find it.');
            return setRefreshing(false);
          }
        });
    } catch (error) {
      return error;
    }
  }, [refreshing]);

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

  const handleSendMessage = async () => {
    try {
      if (!text) {
        return alert('Please add a description');
      }
      if (!id) {
        return alert('User not found');
      }
      if (!feedback) {
        return alert('Feedback not found');
      }
      setIsLoading(true);

      const payload = {
        user: id,
        description: text,
      };

      let replyID = '';

      await axios
        .post(`${apiURL}/feedbacks/create/replies/user/${feedback.id}`, payload)
        .then(res => {
          if (res.data.success == true) {
            replyID = res.data.message.id;
            setText('');
          } else {
            setText('');
            setIsLoading(false);
            return alert('Message not sent');
          }
        });

      if (!replyID) {
        alert('Did not get Reply ID');
      }

      const replyPayload = {reply: replyID};
      await axios
        .patch(`${apiURL}/feedbacks/replies/${id}`, replyPayload)
        .then(res => {
          setReplies(res.data.message);
        });

      await axios
        .get(`${apiURL}/feedbacks/replies/${feedback.id}`)
        .then(res => {
          if (res.data.success === true) {
            setReplies(res.data.message);
            return setIsLoading(false);
          } else {
            alert('OOOPPPSS! Something went wrong. We are working to find it.');
            return setIsLoading(false);
          }
        });
    } catch (error) {
      return setIsLoading(false);
    }
  };

  const handleCloseThread = async () => {
    try {
      setIsLoading(true);
      await axios
        .patch(`${apiURL}/feedbacks/user-close/${feedback.id}`)
        .then(res => {
          if (res.data.success === true) {
            return alert('Thread has been closed');
            // return setIsLoading(false);
          } else {
            alert('OOOPPPSS! Something went wrong. We are working to find it.');
          }
        });

      await axios.get(`${apiURL}/feedbacks/single/${feedback.id}`).then(res => {
        if (res.data.success === true) {
          setFeedback(res.data.message);
          return setIsLoading(false);
        } else {
          alert('OOOPPPSS! Something went wrong. We are working to find it.');
        }
      });
    } catch (error) {
      return setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {isLoading ? (
          <CustomLoaderSmall />
        ) : (
          <View
            style={{
              paddingHorizontal: 0,
              paddingVertical: 0,
              flexDirection: 'row',
              width: '100%',
              marginVertical: 0,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: COLORS.green,
                padding: 10,
                width: windowWidth * 1,
              }}>
              <Text style={{color: COLORS.white}}>
                {' '}
                {upperCase(feedback.subject)}
              </Text>
              <Text style={{color: COLORS.white}}> {feedback.description}</Text>
              <Text
                style={{
                  fontSize: SIZES.small,
                  color: COLORS.gray,
                  color: COLORS.white,
                  fontStyle: 'italic',
                }}>
                {moment(feedback.dateCreated).format('LLLL')}
              </Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ref={scrollViewRef}
        onContentSizeChange={() => slowlyScrollDown()}>
        <View style={{flexDirection: 'column', padding: 0}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {replies.length < 1 ? (
                <View>
                  <Text style={{textAlign: 'center', width: '100%'}}>
                    No replies to this feedback yet to show
                  </Text>
                </View>
              ) : (
                <View>
                  {replies.map(elem => {
                    if (elem.isAdminSent !== true && elem.description) {
                      return (
                        <View
                          style={{
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            flexDirection: 'row',
                            width: '100%',
                            marginVertical: 1,
                            justifyContent: 'flex-end',
                          }}
                          key={elem._id}>
                          {/* <View style={{padding: 5}}>
                            <Image
                              source={images.DefaultUserImage}
                              style={{
                                height: 30,
                                width: 30,
                                borderRadius: 40,
                              }}
                            />
                          </View> */}
                          <View
                            style={{
                              backgroundColor: '#dcf6e2',
                              padding: 10,
                              borderTopRightRadius: 0,
                              borderBottomLeftRadius: 10,
                              borderBottomRightRadius: 10,
                              borderTopLeftRadius: 10,
                              width: windowWidth * 0.7,
                            }}>
                            <Text>{elem.description}</Text>
                            <Text
                              style={{
                                fontSize: SIZES.small,
                                color: COLORS.gray,
                              }}>
                              {moment(elem.dateCreated).format('LLLL')}
                            </Text>
                          </View>
                        </View>
                      );
                    } else if (elem.isAdminSent === true && elem.description) {
                      return (
                        <View
                          style={{
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            flexDirection: 'row',
                            width: '100%',
                            marginVertical: 1,
                            justifyContent: 'flex-start',
                          }}
                          key={elem._id}>
                          {/* <View style={{padding: 5}}>
                            <Image
                              source={elem.user ? elem.user.profileImage : images.DefaultUserImage }
                              style={{
                                height: 30,
                                width: 30,
                                borderRadius: 40,
                              }}
                            />
                          </View> */}
                          <View
                            style={{
                              backgroundColor: COLORS.white,
                              padding: 10,
                              borderTopRightRadius: 10,
                              borderBottomLeftRadius: 10,
                              borderBottomRightRadius: 10,
                              borderTopLeftRadius: 0,
                              width: windowWidth * 0.7,
                            }}>
                            <Text>ADMIN : {elem.description}</Text>
                            <Text
                              style={{
                                fontSize: SIZES.small,
                                color: COLORS.gray,
                              }}>
                              {moment(elem.dateCreated).format('LLLL')}
                            </Text>
                          </View>
                        </View>
                      );
                    } else {
                      return <View />;
                    }
                  })}
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: 20,
                }}>
                {feedback.isClosed !== true ? (
                  <TouchableOpacity
                    onPress={() => handleCloseThread()}
                    style={{
                      backgroundColor: COLORS.red,
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                      borderRadius: 25,
                      textAlign: 'center',
                    }}>
                    <Text style={{color: COLORS.white}}>CLOSE THREAD</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.grayDark,
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                      borderRadius: 25,
                      textAlign: 'center',
                    }}>
                    <Text style={{color: COLORS.white}}>THREAD CLOSED</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {feedback.isClosed !== true ? (
        <View style={{flexDirection: 'row', padding: 5}}>
          <TextInput
            placeholder="Enter your message"
            style={styles.textInput}
            value={text}
            onChangeText={text => setText(text)}
            multiline
          />
          {text ? (
            <TouchableOpacity
              onPress={() => handleSendMessage()}
              style={{
                backgroundColor: COLORS.green,
                marginVertical: 10,
                alignItems: 'center',
                textAlign: 'center',
                paddingVertical: 10,
                paddingLeft: 7,
                borderRadius: 40,
                width: 50,
                height: 50,
              }}>
              <SendArrowWhite width={30} height={30} />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      ) : (
        <View />
      )}
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
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    margin: 10,
    marginRight: 5,
    flex: 1,
    maxHeight: 70,
    paddingHorizontal: 10,
  },
});
