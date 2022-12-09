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

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, BusinessCard, StarRating} from '../components';

// SVG IMPORTS
import PhoneIcon from '../assets/svgs/phone-black.svg';
import MessageIcon from '../assets/svgs/message-active.svg';
import Location from '../assets/svgs/location-white.svg';
import Star from '../assets/svgs/star-white.svg';
import EmailIcon from '../assets/svgs/email-active.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import {averageOfArray, openURL, upperCase} from '../utils/helperFunctions';
// import StarRating from 'react-native-star-rating-widget';

export default function BusinessProfile({navigation}) {
  const [currentBusiness, setCurrentBusiness] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [user, setUser] = useState('');
  const [rating, setRating] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
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

      const CURRENT_BUSINESS_CATEGORY_ID = await AsyncStorage.getItem(
        'currentBusinessCategory',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios
        .get(`${apiURL}/businesses/single/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setIsLoading(false);
            let arr = [];
            if (res.data.message.ratings.length < 1) {
              arr.push(res.data.message);
              setRating(0);
              return setCurrentBusiness(arr);
            } else {
              arr.push(res.data.message);
              let ratingArr = res.data.message.ratings.map(elem => elem.rating);
              console.log(averageOfArray(ratingArr));
              setRating(averageOfArray(ratingArr));
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
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .get(`${apiURL}/businesses/category/${CURRENT_BUSINESS_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let newArray = res.data.message.filter(
              elem => elem._id !== CURRENT_BUSINESS_ID,
            );
            return setBusinesses(newArray.reverse());
            // return setBusinesses(res.data.message);
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

  const openBusinessProfile = async (businessID, businessCategory) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('currentBusinessID', businessID);
      // await AsyncStorage.setItem('currentBusinessCategory', businessCategory);
      const CURRENT_BUSINESS_ID = await AsyncStorage.getItem(
        'currentBusinessID',
      ).then(res => {
        return res;
      });

      await axios
        .post(`${apiURL}/businesses/views/create/${businessID}`, {
          author: user,
        })
        .then(res => {
          if (res.data.success === true) {
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });
      await axios.get(`${apiURL}/businesses/single/${businessID}`).then(res => {
        if (res.data.success === true) {
          setIsLoading(false);
          let arr = [];
          if (res.data.message.ratings.length < 1) {
            arr.push(res.data.message);
            setRating(0);
            return setCurrentBusiness(arr);
          } else {
            arr.push(res.data.message);
            let ratingArr = res.data.message.ratings.map(elem => elem.rating);
            console.log(averageOfArray(ratingArr));
            setRating(averageOfArray(ratingArr));
            setCurrentBusiness(arr);
            // return
          }
        } else {
          alert('OOOPPPS ! Something went wrong');
        }
      });
      await axios
        .get(`${apiURL}/businesses/category/${businessCategory}`)
        .then(res => {
          if (res.data.success === true) {
            let newArray = res.data.message.filter(
              elem => elem._id !== businessID,
            );
            return setBusinesses(newArray.reverse());
            // return setBusinesses(res.data.message);
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
        .post(`${apiURL}/businesses/calls/create/${id}`, {
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
          business: id,
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
        .post(`${apiURL}/businesses/emails/create/${id}`, {
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
          business: id,
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

      const CURRENT_BUSINESS_ID = await AsyncStorage.getItem(
        'currentBusinessID',
      ).then(res => {
        return res;
      });

      const CURRENT_BUSINESS_CATEGORY_ID = await AsyncStorage.getItem(
        'currentBusinessCategory',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios
        .get(`${apiURL}/businesses/single/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let arr = [];
            if (res.data.message.ratings.length < 1) {
              arr.push(res.data.message);
              setRating(0);
              return setCurrentBusiness(arr);
            } else {
              arr.push(res.data.message);
              let ratingArr = res.data.message.ratings.map(elem => elem.rating);
              console.log(averageOfArray(ratingArr));
              setRating(averageOfArray(ratingArr));
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
            console.log(res.data.message);
          } else {
            console.log(res.data.error);
          }
        });

      await axios
        .get(`${apiURL}/businesses/category/${CURRENT_BUSINESS_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let newArray = res.data.message.filter(
              elem => elem._id !== CURRENT_BUSINESS_ID,
            );
            return setBusinesses(newArray.reverse());
            // return setBusinesses(res.data.message);
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
                        <StarRating rating={rating} />
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
                        <StarRating rating={rating} />
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
                      onPress={() => Linking.openURL(`mailto:${elem.email}`)}>
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
                  style={{
                    color: COLORS.white,
                    fontSize: SIZES.text1,
                    flex: 1,
                    // paddingTop: 10,
                  }}>
                  {elem.description}
                </Text>
              </View>

              <View style={{padding: 10}}>
                <TouchableOpacity
                  style={styles.buttonReview}
                  onPress={() => navigation.navigate('BusinessProfileReviews')}>
                  <Text
                    style={{
                      flex: 1,
                      color: COLORS.yellow,
                      textAlign: 'center',
                    }}>
                    Reviews
                  </Text>
                  <View>
                    <Text style={{color: COLORS.green}}>
                      {elem.ratings.length}
                    </Text>
                  </View>
                  <View>
                    <Text style={{color: COLORS.yellow}}>+</Text>
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
            Similar Businesses
          </Text>
        </View>
        <View style={{padding: 10}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {businesses.length < 1 ? (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text>No results found</Text>
                </View>
              ) : (
                businesses.map(business => {
                  return (
                    <BusinessCard
                      key={business.id}
                      name={business.businessName}
                      email={business.email}
                      image={business.imageURL}
                      description={business.description}
                      address={business.address}
                      billing={business.billing}
                      phone={'+' + business.countryCode + '-' + business.phone}
                      openBusinessProfile={() =>
                        openBusinessProfile(business.id, business.category.id)
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
