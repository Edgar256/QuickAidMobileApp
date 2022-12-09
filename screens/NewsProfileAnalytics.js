// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';

// NPM MODULES
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, Comment, AnalyticsCard} from '../components';
// import {BottomNavigation, TopProfileNavigation} from '../navigations';

// SVG IMPORTS
import UserIcon from '../assets/svgs/user-white.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import {titleCase, upperCase} from '../utils/helperFunctions';

const Tab = createMaterialTopTabNavigator();

const windowHeight = Dimensions.get('window').height;

const Comments = ({navigation}) => {
  const [comments, setComments] = useState([]);
  const [id, setId] = useState([]);

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

      const CURRENT_NEWS_ID = await AsyncStorage.getItem('currentNewsID').then(
        res => {
          return res;
        },
      );

      await axios
        .get(`${apiURL}/news/comments/${CURRENT_NEWS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setComments(res.data.message.reverse());
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
    <View style={styles.container}>
      <View style={{width: '100%', padding: 5}}>
        {isLoading ? (
          <CustomLoaderSmall />
        ) : comments.length < 1 ? (
          <Text>You have no Comments yet</Text>
        ) : (
          <View>
            {comments.map(elem => {
              return (
                <Comment
                  key={elem._id}
                  imageURL={elem.author ? elem.author.profileImage : ''}
                  firstName={
                    elem.author ? elem.author.firstName : 'Anonymous User'
                  }
                  lastName={elem.author ? elem.author.lastName : ''}
                  text={elem.author ? elem.description : ''}
                  dateCreated={elem.dateCreated}
                />
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const PageViews = ({navigation}) => {
  const [views, setViews] = useState([]);
  const [id, setId] = useState([]);

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

      const CURRENT_NEWS_ID = await AsyncStorage.getItem('currentNewsID').then(
        res => {
          return res;
        },
      );

      await axios.get(`${apiURL}/news/views/${CURRENT_NEWS_ID}`).then(res => {
        if (res.data.success === true) {
          setViews(res.data.message.reverse());
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
    <View style={styles.container}>
      <View style={{width: '100%', padding: 5}}>
        {isLoading ? (
          <CustomLoaderSmall />
        ) : views.length < 1 ? (
          <Text>You have no Comments yet</Text>
        ) : (
          <View>
            {views.map(elem => {
              return (
                <AnalyticsCard
                  key={elem._id}
                  imageURL={elem.author ? elem.author.profileImage : ''}
                  firstName={
                    elem.author ? elem.author.firstName : 'Anonymous User'
                  }
                  lastName={elem.author ? elem.author.lastName : ''}
                  channel={elem.author ? elem.author.email : ''}
                  text={'Viewed your profile on'}
                  dateCreated={elem.dateCreated}
                />
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const CallActions = ({navigation}) => {
  const [calls, setCalls] = useState([]);
  const [id, setId] = useState([]);

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

      const CURRENT_NEWS_ID = await AsyncStorage.getItem('currentNewsID').then(
        res => {
          return res;
        },
      );

      await axios.get(`${apiURL}/news/calls/${CURRENT_NEWS_ID}`).then(res => {
        if (res.data.success === true) {
          setCalls(res.data.message.reverse());
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
    <View style={styles.container}>
      <View style={{width: '100%', padding: 5}}>
        {isLoading ? (
          <CustomLoaderSmall />
        ) : calls.length < 1 ? (
          <Text>You have no Calls yet</Text>
        ) : (
          <View>
            {calls.map(elem => {
              return (
                <AnalyticsCard
                  key={elem._id}
                  imageURL={elem.author ? elem.author.profileImage : ''}
                  firstName={
                    elem.author ? elem.author.firstName : 'Anonymous User'
                  }
                  lastName={elem.author ? elem.author.lastName : ''}
                  channel={
                    '+' + elem.author
                      ? elem.author.callingCode
                      : '' + '-' + elem.author
                      ? elem.author.telephone
                      : ''
                  }
                  text={'Called you on'}
                  dateCreated={elem.dateCreated}
                />
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const EmailActions = ({navigation}) => {
  const [emails, setEmails] = useState([]);
  const [id, setId] = useState([]);

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

      const CURRENT_NEWS_ID = await AsyncStorage.getItem('currentNewsID').then(
        res => {
          return res;
        },
      );

      await axios.get(`${apiURL}/news/emails/${CURRENT_NEWS_ID}`).then(res => {
        if (res.data.success === true) {
          setEmails(res.data.message.reverse());
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
    <View style={styles.container}>
      <View style={{width: '100%', padding: 5}}>
        {isLoading ? (
          <CustomLoaderSmall />
        ) : emails.length < 1 ? (
          <Text>You have no Emails yet</Text>
        ) : (
          <View>
            {emails.map(elem => {
              return (
                <AnalyticsCard
                  key={elem._id}
                  imageURL={elem.author ? elem.author.profileImage : ''}
                  firstName={
                    elem.author ? elem.author.firstName : 'Anonymous User'
                  }
                  lastName={elem.author ? elem.author.lastName : ''}
                  channel={elem.author ? elem.author.email : ''}
                  text={'Emailed you on '}
                  dateCreated={elem.dateCreated}
                />
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default function NewsProfileAnalytics({navigation}) {
  const [currentNews, setCurrentNews] = useState([]);
  const [news, setNews] = useState([]);
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [pageViewCount, setPageViewCount] = useState(0);
  const [callCount, setCallCount] = useState(0);
  const [emailCount, setEmailCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });
      setUser(TOKEN_ID);

      const CURRENT_NEWS_ID = await AsyncStorage.getItem('currentNewsID').then(
        res => {
          return res;
        },
      );

      const CURRENT_NEWS_CATEGORY_ID = await AsyncStorage.getItem(
        'currentNewsCategory',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/news/single/${CURRENT_NEWS_ID}`).then(res => {
        if (res.data.success === true) {
          setIsLoading(false);
          let arr = [];
          arr.push(res.data.message);
          return setCurrentNews(arr);
        } else {
          alert('OOOPPPS ! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/news/category/${CURRENT_NEWS_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            return setNews(res.data.message.reverse());
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });

      await axios
        .get(`${apiURL}/news/comments/${CURRENT_NEWS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setCommentsCount(res.data.message.length);
            return setComments(res.data.message.reverse());
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });

      await axios.get(`${apiURL}/news/views/${CURRENT_NEWS_ID}`).then(res => {
        if (res.data.success === true) {
          setPageViewCount(res.data.message.length);
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/news/calls/${CURRENT_NEWS_ID}`).then(res => {
        if (res.data.success === true) {
          setCallCount(res.data.message.length);
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/news/emails/${CURRENT_NEWS_ID}`).then(res => {
        if (res.data.success === true) {
          setEmailCount(res.data.message.length);
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

  async function handlePress(url) {
    try {
      console.log(url, 123);
      await Linking.openURL(url);
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    } catch (error) {}
  }

  return (
    <View style={styles.container}>
      {/* {currentNews.map(elem => {
        return (
          <TopProfileNavigation
            navigation={navigation}
            key={elem.id}
            header={upperCase(elem.title)}
          />
        );
      })} */}

      <ScrollView>
        {currentNews.map(elem => {
          return (
            <View key={elem.id}>
              {elem.imageURL ? (
                <ImageBackground
                  source={{uri: elem.imageURL}}
                  style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View style={styles.imageText}>
                      <UserIcon width={20} height={20} style={styles.icon} />
                      <Text
                        style={{color: COLORS.white, fontSize: SIZES.text1}}>
                        Posted by:{' '}
                      </Text>
                      {!elem.isAdminCreated ? (
                        <Text
                          style={{color: COLORS.yellow, fontSize: SIZES.text1}}>
                          {titleCase(elem.author.firstName)}{' '}
                          {titleCase(elem.author.lastName)}
                        </Text>
                      ) : (
                        <Text
                          style={{color: COLORS.yellow, fontSize: SIZES.text1}}>
                          Admin
                        </Text>
                      )}
                    </View>
                    {/* <View style={styles.imageText}>
                      <Location width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        {titleCase(elem.address)}
                      </Text>
                    </View> */}
                  </View>
                </ImageBackground>
              ) : (
                <ImageBackground
                  source={images.DefaultImage}
                  style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View style={styles.imageText}>
                      <UserIcon width={20} height={20} style={styles.icon} />
                      <Text
                        style={{color: COLORS.white, fontSize: SIZES.text1}}>
                        Posted by:{' '}
                      </Text>
                      {!elem.isAdminCreated ? (
                        <Text
                          style={{color: COLORS.yellow, fontSize: SIZES.text1}}>
                          {titleCase(elem.author.firstName)}{' '}
                          {titleCase(elem.author.lastName)}
                        </Text>
                      ) : (
                        <Text
                          style={{color: COLORS.yellow, fontSize: SIZES.text1}}>
                          Admin
                        </Text>
                      )}
                    </View>
                    {/* <View style={styles.imageText}>
                      <Location width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        {titleCase(elem.address)}
                      </Text>
                    </View> */}
                  </View>
                </ImageBackground>
              )}

              <View style={{padding: 10}}>
                <Text style={{color: COLORS.white, fontSize: SIZES.text1}}>
                  POSTED ON : {moment(elem.dateCreated).format('LLLL')}
                </Text>
                <Text style={{color: COLORS.white, fontSize: SIZES.text1}}>
                  COMMUNITY : {elem.community.name}
                </Text>
                <Text style={{color: COLORS.white, fontSize: SIZES.text1}}>
                  CATEGORY :{' '}
                  {elem.category ? elem.category.name : 'No Category Added'}
                </Text>
                <Text style={{color: COLORS.white, fontSize: SIZES.text1}}>
                  BILLING : {elem.billing}
                </Text>
                <Text style={{color: COLORS.white, fontSize: SIZES.text1}}>
                  AMOUNT : ${elem.billingAmount}
                </Text>
                {elem.website ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: COLORS.white, fontSize: SIZES.text1}}>
                      Website :
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`https://${elem.website}`)
                      }>
                      <Text
                        style={{color: COLORS.white, fontSize: SIZES.text1}}>
                        {elem.website}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View />
                )}

                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: SIZES.text1,
                    paddingTop: 10,
                  }}>
                  {elem.description}
                </Text>
              </View>
            </View>
          );
        })}

        {currentNews.map(elem => {
          if (elem.billing !== 'FREEMIUM') {
            return (
              <View key={elem._id}>
                <View style={{flexDirection: 'row', padding: 5}}>
                  <View style={styles.w25}>
                    <View style={styles.w25Inner}>
                      <Text style={{fontSize: 28}}>{commentsCount}</Text>
                      <Text>Comments</Text>
                    </View>
                  </View>
                  <View style={styles.w25}>
                    <View style={styles.w25Inner}>
                      <Text style={{fontSize: 28}}>{pageViewCount}</Text>
                      <Text>Page Views</Text>
                    </View>
                  </View>
                  <View style={styles.w25}>
                    <View style={styles.w25Inner}>
                      <Text style={{fontSize: 28}}>{callCount}</Text>
                      <Text>Callers</Text>
                    </View>
                  </View>
                  <View style={styles.w25}>
                    <View style={styles.w25Inner}>
                      <Text style={{fontSize: 28}}>{emailCount}</Text>
                      <Text>Emailers</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    padding: 10,
                    borderBottomColor: COLORS.yellow,
                    borderBottomWidth: 2,
                  }}>
                  <Text style={{color: COLORS.white, fontSize: SIZES.text2}}>
                    DETAILED ANALYTICS
                  </Text>
                </View>
                <View style={{flexDirection: 'column', padding: 5}}>
                  <Tab.Navigator
                    style={{
                      flex: 1,
                      height: windowHeight / 2 + windowHeight / 3,
                      marginBottom: 15,
                    }}
                    initialRouteName="Comments"
                    screenOptions={{
                      tabBarLabelStyle: {color: COLORS.yellow, fontSize: 10},
                      tabBarStyle: {backgroundColor: COLORS.grayDark},
                      tabBarIndicatorStyle: {
                        borderBottomColor: COLORS.yellow,
                        borderWidth: 2,
                      },
                    }}>
                    <Tab.Screen name="Comments" component={Comments} />
                    <Tab.Screen name="Views" component={PageViews} />
                    <Tab.Screen name="Calls" component={CallActions} />
                    <Tab.Screen name="Emails" component={EmailActions} />
                  </Tab.Navigator>
                </View>
              </View>
            );
          } else {
            return (
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 70,
                  paddingHorizontal: 40,
                }}
                key={elem._id}>
                <Text
                  style={{
                    fontSize: 15,
                    color: COLORS.white,
                    textAlign: 'center',
                    paddingBottom: 40,
                  }}>
                  Post your item as a PREMIUM post to be able to view your
                  Posts's Analytics and get the most out of the UGALAV APP
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateNewCommunityItem')}
                  style={{
                    padding: 10,
                    backgroundColor: COLORS.black,
                    borderRadius: 5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: COLORS.yellow}}>CREATE A POST</Text>
                </TouchableOpacity>
              </View>
            );
          }
        })}
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
  description: {
    color: COLORS.white,
    fontSize: SIZES.text2,
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
    flex: 1,
    padding: 5,
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
    padding: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  w25: {
    width: '25%',
    padding: 2,
  },
  w25Inner: {
    paddingVertical: 15,
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
  },
});
