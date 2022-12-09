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
import {CustomLoaderSmall, NewsCard} from '../components';
// import {BottomNavigation, TopProfileNavigation} from '../navigations';

// SVG IMPORTS
import PhoneIcon from '../assets/svgs/phone-black.svg';
import MessageIcon from '../assets/svgs/message-active.svg';
import UserIcon from '../assets/svgs/user-white.svg';
import EmailIcon from '../assets/svgs/email-active.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import {openURL, titleCase, upperCase} from '../utils/helperFunctions';

export default function NewsProfile({navigation}) {
  const [currentNews, setCurrentNews] = useState([]);
  const [news, setNews] = useState([]);
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      if (CURRENT_NEWS_CATEGORY_ID) {
        await axios
          .get(`${apiURL}/news/category/${CURRENT_NEWS_CATEGORY_ID}`)
          .then(res => {
            if (res.data.success === true) {
              console.log(CURRENT_NEWS_ID);
              let newArray = res.data.message.filter(
                elem => elem._id !== CURRENT_NEWS_ID,
              );
              return setNews(newArray.reverse());
              // return setNews(res.data.message.reverse());
            } else {
              alert('OOOPPP ! Something went wrong');
            }
          });
      } else {
        return setNews([]);
      }

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

      await axios
        .post(`${apiURL}/news/views/create/${CURRENT_NEWS_ID}`, {
          author: TOKEN_ID,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
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

  const openNewsProfile = async (newsID, newsCategory) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('currentNewsID', newsID);
      await AsyncStorage.setItem('currentNewsCategory', newsCategory);
      await axios
        .post(`${apiURL}/news/views/create/${newsID}`, {author: user})
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });

      await axios.get(`${apiURL}/news/single/${newsID}`).then(res => {
        if (res.data.success === true) {
          setIsLoading(false);
          let arr = [];
          arr.push(res.data.message);
          return setCurrentNews(arr);
        } else {
          alert('OOOPPPS ! Something went wrong');
        }
      });

      await axios.get(`${apiURL}/news/category/${newsCategory}`).then(res => {
        if (res.data.success === true) {
          // console.log(CURRENT_NEWS_ID);
          let newArray = res.data.message.filter(elem => elem._id !== newsID);
          return setNews(newArray.reverse());
          // return setNews(res.data.message.reverse());
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
        .post(`${apiURL}/news/calls/create/${id}`, {
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
          news: id,
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

  const handleEmailAction = async (id, email) => {
    try {
      setIsLoading(true);
      await axios
        .post(`${apiURL}/news/emails/create/${id}`, {
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
          news: id,
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
      return Linking.openURL(`mailto:${email}`);
    } catch (error) {
      // console.log(error);
      return error;
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
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

      if (CURRENT_NEWS_CATEGORY_ID) {
        await axios
          .get(`${apiURL}/news/category/${CURRENT_NEWS_CATEGORY_ID}`)
          .then(res => {
            if (res.data.success === true) {
              let newArray = res.data.message.filter(
                elem => elem._id !== CURRENT_NEWS_ID,
              );
              return setNews(newArray.reverse());
              // return setNews(res.data.message.reverse());
            } else {
              alert('OOOPPP ! Something went wrong');
            }
          });
      } else {
        return setNews([]);
      }

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

      await axios
        .post(`${apiURL}/news/views/create/${CURRENT_NEWS_ID}`, {
          author: TOKEN_ID,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
                          {elem.author && elem.author.firstName
                            ? titleCase(elem.author.firstName)
                            : 'Anonymous User'}{' '}
                          {elem.author && elem.author.lastName
                            ? titleCase(elem.author.lastName)
                            : ''}
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
                          {elem.author && elem.author.firstName
                            ? titleCase(elem.author.firstName)
                            : 'Anonymous User'}{' '}
                          {elem.author && elem.author.lastName
                            ? titleCase(elem.author.lastName)
                            : ''}
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
                      style={styles.buttonMessage}
                      onPress={() => handleEmailAction(elem.id, elem.email)}>
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

              <View style={{padding: 10}}>
                <Text style={{color: COLORS.white, fontSize: SIZES.text1}}>
                  Posted on : {moment(elem.dateCreated).format('LLLL')}
                </Text>
                <Text style={styles.description}>
                  Community : {elem.community.name}
                </Text>
                <Text style={styles.description}>
                  Category :{' '}
                  {elem.category ? elem.category.name : 'No Category Added'}
                </Text>
                {elem.website ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: SIZES.text1,
                      }}>
                      Website:
                    </Text>
                    <TouchableOpacity onPress={() => openURL(elem.website)}>
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
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: SIZES.text1,
                    paddingTop: 10,
                  }}>
                  {upperCase(elem.title)}
                </Text>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: SIZES.text1,
                  }}>
                  {elem.description}
                </Text>
                {/* <Text style={styles.description}>{elem.website}</Text> */}
              </View>
              {/* {elem.website ? (
                <View style={{padding: 10}}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: SIZES.text1,
                      flex: 1,
                    }}>
                    {elem.website}
                  </Text>
                </View>
              ) : (
                <View />
              )} */}
              <View style={{padding: 5}}>
                <TouchableOpacity
                  style={styles.buttonComment}
                  onPress={() => navigation.navigate('NewsProfileComments')}>
                  <Text
                    style={{
                      flex: 1,
                      color: COLORS.yellow,
                      textAlign: 'center',
                      fontSize: SIZES.text1,
                    }}>
                    View Comments
                  </Text>
                  <View>
                    <Text style={{color: COLORS.green, fontSize: SIZES.normal}}>
                      {commentsCount}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{color: COLORS.yellow, fontSize: SIZES.normal}}>
                      +
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
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
            Similar Posts
          </Text>
        </View>
        <View style={{padding: 10}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {news.length < 1 ? (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text>No results found</Text>
                </View>
              ) : (
                news.map(newsItem => {
                  return (
                    <NewsCard
                      key={newsItem.id}
                      image={newsItem.imageURL}
                      title={newsItem.title}
                      description={newsItem.description}
                      billing={newsItem.billing}
                      category={
                        newsItem.category === null
                          ? 'NO CATEGORY'
                          : newsItem.category.name
                      }
                      dateCreated={newsItem.dateCreated}
                      openNewsProfile={() =>
                        newsItem.category
                          ? openNewsProfile(newsItem.id, newsItem.category.id)
                          : openNewsProfile(newsItem.id, '')
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
  buttonComment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.yellow,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
