// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
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
import {CustomLoaderSmall, NewsCard, Comment} from '../components';
// import {BottomNavigation, TopProfileNavigation} from '../navigations';

// API URL
import {apiURL} from '../utils/apiURL';
import {openURL, titleCase, upperCase} from '../utils/helperFunctions';

// SVG IMPORTS
import Location from '../assets/svgs/location-white.svg';
import UserIcon from '../assets/svgs/user-white.svg';
import PhoneIcon from '../assets/svgs/phone-black.svg';
import MessageIcon from '../assets/svgs/message-active.svg';
import EmailIcon from '../assets/svgs/email-active.svg';

export default function NewsProfileComments({navigation}) {
  const [currentNews, setCurrentNews] = useState([]);
  const [currentNewsID, setCurrentNewsID] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState([]);
  const [user, setUser] = useState([]);
  const [poster, setPoster] = useState([]);
  const [isCommentingVisible, setIsCommentingVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });
      setAuthor(TOKEN_ID);
      setUser(TOKEN_ID);

      const CURRENT_NEWS_ID = await AsyncStorage.getItem('currentNewsID').then(
        res => {
          return res;
        },
      );
      setCurrentNewsID(CURRENT_NEWS_ID);

      if (!TOKEN_ID) {
        return;
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          let arr = [];
          arr.push(res.data.message);
          setPoster(arr);
          return (USER = res.data.message);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });

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
        .get(`${apiURL}/news/comments/${CURRENT_NEWS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let arr = res.data.message.map(item => {
              return item.author._id;
            });
            if (arr.includes(TOKEN_ID)) {
              console.log(true);
              setIsCommentingVisible(true);
            } else {
              setIsCommentingVisible(false);
            }

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

  const postComment = async id => {
    try {
      if (!author) {
        return alert('Author not found');
      }

      if (!description) {
        return alert('description not found');
      }

      if (!currentNewsID) {
        return alert('News not found');
      }
      setIsLoading(true);
      const payload = {
        author: author,
        description: description,
      };

      await axios
        .post(`${apiURL}/news/comments/create/${id}`, payload)
        .then(res => {
          if (res.data.success === true) {
            alert('Your comment has been successfully Submitted');
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });

      await axios.get(`${apiURL}/news/comments/${id}`).then(res => {
        if (res.data.success === true) {
          let arr = res.data.message.map(item => {
            return item.author._id;
          });
          if (arr.includes(author)) {
            console.log(true);
            setIsCommentingVisible(true);
          } else {
            setIsCommentingVisible(false);
          }

          setCommentsCount(res.data.message.length);
          setComments(res.data.message.reverse());
          return setIsLoading(false);
        } else {
          alert('OOOPPP ! Something went wrong');
        }

        // let arr = comments.map(item => {
        //   return item.author._id;
        // });

        // if (arr.includes(author)) {
        //   console.log(true);
        //   setIsCommentingVisible(true);
        // } else {
        //   setIsCommentingVisible(false);
        // }
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
      setAuthor(TOKEN_ID);
      setUser(TOKEN_ID);

      const CURRENT_NEWS_ID = await AsyncStorage.getItem('currentNewsID').then(
        res => {
          return res;
        },
      );
      setCurrentNewsID(CURRENT_NEWS_ID);

      if (!TOKEN_ID) {
        return;
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          let arr = [];
          arr.push(res.data.message);
          setPoster(arr);
          return (USER = res.data.message);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });

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
        .get(`${apiURL}/news/comments/${CURRENT_NEWS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let arr = res.data.message.map(item => {
              return item.author._id;
            });
            if (arr.includes(TOKEN_ID)) {
              console.log(true);
              setIsCommentingVisible(true);
            } else {
              setIsCommentingVisible(false);
            }

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
        
      {/* {currentNews.map(elem => {
        return (
          <TopProfileNavigation
            navigation={navigation}
            key={elem.id}
            header={upperCase(elem.title)}
          />
        );
      })} */}

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
                      {/* {!elem.isAdminCreated ? (
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
                      )} */}
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
                      {/* {!elem.isAdminCreated ? (
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
                      )} */}
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
                      <Text style={{color: COLORS.yellow}}>Message</Text>
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
                  Category:{' '}
                  {elem.category ? elem.category.name : 'No Category Added'}
                </Text>
                {elem.website ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: SIZES.text1,
                        // flex: 1,
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
              </View>
            </View>
          );
        })}
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
              Comments
            </Text>
            <View>
              <Text style={{color: COLORS.green, fontSize: SIZES.normal}}>
                {commentsCount}
              </Text>
            </View>
            <View>
              <Text style={{color: COLORS.yellow, fontSize: SIZES.normal}}>
                +
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{padding: 10}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {comments.length < 1 ? (
                <View style={{padding: 10, textAlign: 'center'}}>
                  <Text style={{textAlign: 'center'}}>No Comments to show</Text>
                </View>
              ) : (
                <View>
                  {comments.map(comment => {
                    return (
                      <Comment
                        key={comment._id}
                        imageURL={
                          comment.author ? comment.author.profileImage : ''
                        }
                        firstName={
                          comment.author
                            ? comment.author.firstName
                            : 'Anonymous User'
                        }
                        lastName={comment.author ? comment.author.lastName : ''}
                        text={comment.description}
                        dateCreated={comment.dateCreated}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      {isLoading ? (
        <CustomLoaderSmall />
      ) : (
        <View>
          {!isCommentingVisible ? (
            <View>
              {poster.map(elem => {
                return (
                  <View
                    style={{
                      padding: 10,
                      marginBottom: 0,
                      paddingBottom: 1,
                      backgroundColor: '#878787',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                    key={elem._id}>
                    <Text
                      style={{
                        flex: 1,
                        color: COLORS.white,
                        fontSize: SIZES.text1,
                        paddingBottom: 0,
                      }}>
                      Leave your comment here
                    </Text>
                    <View style={styles.comment}>
                      {elem.profileImage ? (
                        <Image
                          source={{uri: elem.profileImage}}
                          style={styles.imageComment}
                        />
                      ) : (
                        <Image
                          source={images.DefaultImage}
                          style={styles.imageComment}
                        />
                      )}
                      {/* <Image source={images.Lady} style={styles.imageComment} /> */}
                      <View style={{flexDirection: 'column', flex: 1}}>
                        <Text
                          style={{fontSize: SIZES.normal, color: COLORS.white}}>
                          Posting as {titleCase(elem.firstName)}{' '}
                          {titleCase(elem.lastName)}
                        </Text>
                        <TextInput
                          height={20}
                          width={20}
                          placeholder="Leave your comment here"
                          color={COLORS.white}
                          multiline={true}
                          numberOfLines={5}
                          onChangeText={text => setDescription(text)}
                          style={{
                            borderColor: COLORS.white,
                            borderWidth: 1,
                            flex: 1,
                            width: '100%',
                            color: COLORS.white,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{padding: 5, width: '100%'}}>
                      <TouchableOpacity
                        style={styles.buttonCall}
                        onPress={() => postComment(currentNewsID)}>
                        <Text>POST YOUR COMMENT</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View></View>
          )}
        </View>
      )}

      {/* <BottomNavigation navigation={navigation} screen="communities" /> */}
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
    padding: 10,
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
    borderColor: COLORS.white,
    padding: 10,
  },
  comment: {
    flexDirection: 'row',
  },
  imageComment: {
    width: 70,
    height: 70,
    borderRadius: 70,
    marginRight: 10,
  },
});
