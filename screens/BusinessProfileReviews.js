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
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import StarRatingWidget from 'react-native-star-rating-widget';
import moment from 'moment';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, StarRating, Review} from '../components';

// SVG IMPORTS
import PhoneIcon from '../assets/svgs/phone-black.svg';
import Location from '../assets/svgs/location-white.svg';
import Star from '../assets/svgs/star-white.svg';
import EmailIcon from '../assets/svgs/email-active.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import {averageOfArray, upperCase, titleCase, openURL} from '../utils/helperFunctions';

export default function BusinessProfileReviews({navigation}) {
  const [currentBusiness, setCurrentBusiness] = useState([]);
  const [user, setUser] = useState('');
  const [poster, setPoster] = useState([]);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState([]);
  const [bizRating, setBizRating] = useState(0);
  const [isReviewingVisible, setIsReviewingVisible] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });
      setUser(TOKEN_ID);

      const CURRENT_BUSINESS_ID = await AsyncStorage.getItem(
        'currentBusinessID',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
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

      await axios
        .get(`${apiURL}/businesses/single/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let arr = [];
            if (res.data.message.ratings.length < 1) {
              arr.push(res.data.message);
              setBizRating(0);
              return setCurrentBusiness(arr);
            } else {
              arr.push(res.data.message);
              let ratingArr = res.data.message.ratings.map(elem => elem.rating);
              setBizRating(averageOfArray(ratingArr));
              return setCurrentBusiness(arr);
            }
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });

      await axios
        .post(`${apiURL}/businesses/views/create/${CURRENT_BUSINESS_ID}`, {
          author: TOKEN_ID,
        })
        .then(res => {
          if (res.data.success === true) {
          } else {
            console.log(res.data.error);
          }
        });

      // console.log(1234, CURRENT_BUSINESS_ID);
      await axios
        .get(`${apiURL}/ratings/business/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          // console.log(res.data.message, res.data.message.length);

          if (res.data.message.length < 1) return setIsReviewingVisible(true);
          let filterArr = [];
          if (res.data.success === true) {
            setReviews(res.data.message.reverse());
            setReviewsCount(res.data.message.length);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }

          if (res.data.success === true) {
            let sampleArr = [];
            res.data.message.map(item => {
              console.log('tokenP', TOKEN_ID);
              if (item.author._id) {
                if (TOKEN_ID === item.author._id) {
                  console.log(true);
                  setIsReviewingVisible(false);
                  setIsLoading(false);
                }
                setIsLoading(false);
                // console.log('ID-****-', item.author._id);
                // sampleArr.push(item.author._id);
                // console.log(23456,sampleArr)
                // return item.author._id;
              } else {
                return 123456;
              }
            });
            // console.log(sampleArr)

            setIsLoading(false);
          } else {
            setIsLoading(false);
          }

          res.data.message.map(item => {
            if (item.author._id) {
              console.log('ID---', TOKEN_ID, item.author._id);
              filterArr.push(item.author._id);
              if (filterArr.includes(TOKEN_ID)) {
                setIsReviewingVisible(false);
              } else {
                setIsReviewingVisible(true);
              }
              return item.author._id;
            } else {
              return 123456;
            }
          });
          console.log('arr', arr);
          console.log('filterArr', filterArr);

          let arr = res.data.message.map(item => {
            // console.log('id', item.author._id);
            // return item.author._id;
            if (item.author._id) {
              console.log('id', item.author._id);
              return item.author._id;
            } else {
              return 123456;
            }
          });
          // console.log("arr",arr)

          setIsLoading(true);

          if (arr.includes(TOKEN_ID)) {
            setIsReviewingVisible(false);
          } else {
            setIsReviewingVisible(true);
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
          }
        })
        .catch(err => err);
    })();

    populateData();
  }, []);

  const handleCallAction = async (id, phone) => {
    try {
      setIsLoading(true);
      await axios
        .post(`${apiURL}/businesses/calls/create/${id}`, {
          author: user,
        })
        .then(res => {
          if (res.data.success === true) {
          } else {
            setIsLoading(false);
          }
        });
      await axios
        .post(`${apiURL}/notifications/create/${user}`, {
          business: id,
          message: 'called',
        })
        .then(res => {
          if (res.data.success === true) {
            setIsLoading(false);
          } else {
            setIsLoading(false);
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
        .post(`${apiURL}/businesses/emails/create/${id}`, {
          author: user,
        })
        .then(res => {
          if (res.data.success === true) {
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .post(`${apiURL}/notifications/create/${user}`, {
          business: id,
          message: 'emailed',
        })
        .then(res => {
          if (res.data.success === true) {
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        });
      return Linking.openURL(`mailto:${email}`);
    } catch (error) {
      return error;
    }
  };

  const postReview = async () => {
    try {
      if (!description) {
        return alert('description not found');
      }

      if (!rating) {
        return alert('Please add Star Rating');
      }
      setIsLoading(true);
      const payload = {
        author: poster[0].id,
        description: description,
        rating,
        business: currentBusiness[0].id,
      };

      let ratingID;

      await axios
        .post(`${apiURL}/ratings/create/${currentBusiness[0].id}`, payload)
        .then(res => {
          if (res.data.success === true) {
            ratingID = res.data.message._id;
            // alert('Your rating has been successfully Submitted');
            return setIsLoading(false);
          } else {
            alert('OOOPPPS! Something went wrong');
          }
        });

      await axios
        .patch(`${apiURL}/businesses/rating/${currentBusiness[0].id}`, {
          rating: ratingID,
        })
        .then(res => {
          if (res.data.success === true) {
            alert('Your rating has been successfully Submitted');
            return setIsLoading(false);
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });

      await axios
        .get(`${apiURL}/businesses/single/${currentBusiness[0].id}`, {
          rating: ratingID,
        })
        .then(res => {
          if (res.data.success === true) {
            if (res.data.message.length < 1) return setIsReviewingVisible(true);
            let arr = res.data.message.ratings.map(item => {
              return item.author.id;
            });
            if (arr.includes(poster[0].id)) {
              setIsReviewingVisible(true);
            } else {
              setIsReviewingVisible(false);
            }

            // setReviewsCount(res.data.message.length);
            // setReviews(res.data.message.ratings.reverse());
          } else {
            alert('OOOPPP ! Something went wrong');
            return setIsLoading(false);
          }
        });

      await axios
        .get(`${apiURL}/ratings/business/${currentBusiness[0].id}`)
        .then(res => {
          if (res.data.success === true) {
            setReviews(res.data.message.reverse());
            setReviewsCount(res.data.message.length);
            return setIsLoading(false);
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .get(`${apiURL}/businesses/single/${currentBusiness[0].id}`)
        .then(res => {
          if (res.data.success === true) {
            let arr = [];
            if (res.data.message.ratings.length < 1) {
              arr.push(res.data.message);
              setBizRating(0);
              return setCurrentBusiness(arr);
            } else {
              arr.push(res.data.message);
              let ratingArr = res.data.message.ratings.map(elem => elem.rating);
              setBizRating(averageOfArray(ratingArr));
              return setCurrentBusiness(arr);
            }
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });
    } catch (error) {
      alert(error);
      return setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });
      setUser(TOKEN_ID);

      const CURRENT_BUSINESS_ID = await AsyncStorage.getItem(
        'currentBusinessID',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      // setIsLoading(true)

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

      await axios
        .get(`${apiURL}/businesses/single/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let arr = [];
            if (res.data.message.ratings.length < 1) {
              arr.push(res.data.message);
              setBizRating(0);
              return setCurrentBusiness(arr);
            } else {
              arr.push(res.data.message);
              let ratingArr = res.data.message.ratings.map(elem => elem.rating);
              setBizRating(averageOfArray(ratingArr));
              return setCurrentBusiness(arr);
            }
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });

      await axios
        .post(`${apiURL}/businesses/views/create/${CURRENT_BUSINESS_ID}`, {
          author: TOKEN_ID,
        })
        .then(res => {
          if (res.data.success === true) {
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .get(`${apiURL}/ratings/business/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.message.length < 1) return setIsReviewingVisible(true);
          let arr = res.data.message.map(item => {
            return item.author._id;
          });
          if (arr.includes(TOKEN_ID)) {
            setIsReviewingVisible(false);
          } else {
            setIsReviewingVisible(true);
          }
          if (res.data.success === true) {
            setReviews(res.data.message.reverse());
            setReviewsCount(res.data.message.length);
          } else {
            setIsLoading(false);
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
        {currentBusiness.map(elem => {
          return (
            <View key={elem.id}>
              {elem.imageURL ? (
                <ImageBackground
                  source={{uri: elem.imageURL}}
                  style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View style={styles.imageText}>
                      <Location width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        {elem.address}
                      </Text>
                    </View>
                    <View style={styles.imageText}>
                      <Star width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        <StarRating rating={bizRating} />
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              ) : (
                <ImageBackground
                  source={images.DefaultImage}
                  style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View style={styles.imageText}>
                      <Location width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        {elem.address}
                      </Text>
                    </View>
                    <View style={styles.imageText}>
                      <Star width={20} height={20} style={styles.icon} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        <StarRating rating={bizRating} />
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
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Community : {elem.community.name}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Category :{' '}
                  {elem.category ? elem.category.name : 'No Category Added'}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Telephone : +{elem.countryCode}-{elem.phone}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Email : {elem.email}
                </Text>
                {elem.website ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: SIZES.text1,
                        // flex: 1,
                        // width: 100,
                      }}>
                      Website :
                    </Text>
                    <TouchableOpacity
                      style={{
                        color: COLORS.white,
                        fontSize: SIZES.text1,
                        flex: 1,
                        // width:100
                      }}
                      onPress={() => openURL(elem.website)}>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          // flex: 1,
                          // width: '100%',
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
                    flex: 1,
                    paddingTop: 10,
                  }}>
                  {upperCase(elem.businessName)}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  {elem.description}
                </Text>
              </View>
              {elem.website ? (
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
              )}
            </View>
          );
        })}

        <View style={{padding: 10}}>
          <TouchableOpacity style={styles.buttonComment}>
            <Text
              style={{
                flex: 1,
                color: COLORS.white,
                textAlign: 'center',
              }}>
              Reviews
            </Text>
            <View>
              <Text style={{color: COLORS.green}}>{reviewsCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <CustomLoaderSmall />
        ) : (
          <View>
            {reviews.length < 1 ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text>No review to show</Text>
              </View>
            ) : (
              <View>
                {reviews.map(elem => {
                  return (
                    <View key={elem.id}>
                      <View style={{padding: 10}}>
                        <Review
                          image={elem.author ? elem.author.profileImage : ''}
                          name={
                            titleCase(
                              elem.author
                                ? elem.author.firstName
                                : 'Anonymous User',
                            ) +
                            ' ' +
                            titleCase(elem.author ? elem.author.lastName : '')
                          }
                          text={elem.description}
                          dateCreated={moment(elem.dateCreated).format('LLL')}
                          rating={elem.rating}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      {isLoading ? (
        <CustomLoaderSmall />
      ) : (
        <View>
          {isReviewingVisible === true ? (
            <View>
              {poster.map(elem => {
                return (
                  <View
                    style={{
                      padding: 10,
                      marginBottom: 0,
                      paddingBottom: 1,
                      backgroundColor: '#878787',
                      height: 180,
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
                      Leave a Review and Rating
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
                      <View
                        style={{flexDirection: 'column', flex: 1, height: 100}}>
                        <Text
                          style={{fontSize: SIZES.normal, color: COLORS.white}}>
                          Posting as {titleCase(elem.firstName)}{' '}
                          {titleCase(elem.lastName)}
                        </Text>
                        <StarRatingWidget
                          rating={rating}
                          onChange={setRating}
                        />
                        <View style={{height: 50}}>
                          <TextInput
                            height={150}
                            placeholder="Leave your comment here"
                            color={COLORS.white}
                            multiline={true}
                            numberOfLines={8}
                            onChangeText={text => setDescription(text)}
                            style={{
                              borderColor: COLORS.white,
                              borderWidth: 1,
                              borderRadius: 4,
                              flex: 1,
                              width: '100%',
                              color: COLORS.white,
                              height: 150,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={{padding: 5, width: '100%'}}>
                      <TouchableOpacity
                        style={styles.buttonCall}
                        onPress={() => postReview()}>
                        <Text>POST YOUR REVIEW</Text>
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

      {/* <BottomNavigation navigation={navigation} screen="business" /> */}
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
    borderRadius: 7,
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
    // height: 200,
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
    padding: 20,
  },
  btnContainerInner: {
    paddingHorizontal: 5,
    width: '50%',
  },
  buttonCall: {
    padding: 10,
    backgroundColor: COLORS.yellow,
    borderRadius: 7,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonMessage: {
    padding: 10,
    backgroundColor: COLORS.black,
    borderRadius: 7,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonComment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.white,
    padding: 10,
  },
  comment: {
    flexDirection: 'row',
  },
  imageComment: {
    width: 50,
    height: 50,
    borderRadius: 70,
    marginRight: 10,
  },
});
