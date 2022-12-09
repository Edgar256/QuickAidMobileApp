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
import {
  CustomLoaderSmall,
  NewsCard,
  Comment,
  AnalyticsCard,
} from '../components';

// SVG IMPORTS
import Location from '../assets/svgs/location-white.svg';
import TimeIcon from '../assets/svgs/time-white.svg';
import DollarBag from '../assets/svgs/dollar-bag-white.svg';
import BriefCaseIcon from '../assets/svgs/briefcase-white.svg';
import EventsIcon from '../assets/svgs/events-white.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import {titleCase, upperCase} from '../utils/helperFunctions';

const Tab = createMaterialTopTabNavigator();

const windowHeight = Dimensions.get('window').height;

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

      const CURRENT_BUSINESS_ID = await AsyncStorage.getItem(
        'currentBusinessID',
      ).then(res => {
        return res;
      });

      await axios
        .get(`${apiURL}/businesses/views/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setViews(res.data.message.reverse());
            setIsLoading(false);
          } else {
            console.log(res.data.error);
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
          <Text>You have no Views yet</Text>
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
                  text={'Viewed your job posting on'}
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
        return;
      }
      setId(TOKEN_ID);

      const CURRENT_BUSINESS_ID = await AsyncStorage.getItem(
        'currentBusinessID',
      ).then(res => {
        return res;
      });

      await axios
        .get(`${apiURL}/businesses/calls/${CURRENT_BUSINESS_ID}`)
        .then(res => {
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
                  firstName={elem.author ? elem.author.firstName : ''}
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
        return;
      }
      setId(TOKEN_ID);

      const CURRENT_BUSINESS_ID = await AsyncStorage.getItem(
        'currentBusinessID',
      ).then(res => {
        return res;
      });

      await axios
        .get(`${apiURL}/businesses/emails/${CURRENT_BUSINESS_ID}`)
        .then(res => {
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

export default function BusinessProfileAnalytics({navigation}) {
  const [currentBusiness, setCurrentBusiness] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [user, setUser] = useState('');
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
        return;
      }

      await axios
        .get(`${apiURL}/businesses/single/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setIsLoading(false);
            let arr = [];
            arr.push(res.data.message);
            return setCurrentBusiness(arr);
          } else {
            alert('OOOPPPS ! Something went wrong');
          }
        });

      await axios
        .get(`${apiURL}/businesses/category/${CURRENT_BUSINESS_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            return setBusinesses(res.data.message.reverse());
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });

      await axios
        .get(`${apiURL}/businesses/views/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setPageViewCount(res.data.message.length);
            setIsLoading(false);
          } else {
            alert('Something went wrong');
          }
        });

      await axios
        .get(`${apiURL}/businesses/calls/${CURRENT_BUSINESS_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setCallCount(res.data.message.length);
            setIsLoading(false);
          } else {
            alert('Something went wrong');
          }
        });

      await axios
        .get(`${apiURL}/businesses/emails/${CURRENT_BUSINESS_ID}`)
        .then(res => {
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

  return (
    <View style={styles.container}>     

      <ScrollView>
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
                  </View>
                </ImageBackground>
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
              {elem.website ? (
                <View style={{paddingHorizontal: 10}}>
                  <Text style={styles.description}>
                    Website: {elem.website}
                  </Text>
                </View>
              ) : (
                <View />
              )}
              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.description}>Billing: {elem.billing}</Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.description}>
                  Amount: ${elem.billingAmount}
                </Text>
              </View>
              <View style={{paddingHorizontal: 10, paddingTop: 10}}>
                <Text style={styles.description}>{elem.description}</Text>
              </View>

              {/* <View style={{padding: 10}}>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  {elem.description}
                </Text>
              </View> */}

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

        {currentBusiness.map(elem => {
          if (elem.billing !== 'FREEMIUM') {
            return (
              <View key={elem._id}>
                <View style={{flexDirection: 'row', padding: 5}}>
                  <View style={styles.w33}>
                    <View style={styles.w25Inner}>
                      <Text style={{fontSize: 28}}>{pageViewCount}</Text>
                      <Text>Page Views</Text>
                    </View>
                  </View>
                  <View style={styles.w33}>
                    <View style={styles.w25Inner}>
                      <Text style={{fontSize: 28}}>{callCount}</Text>
                      <Text>Callers</Text>
                    </View>
                  </View>
                  <View style={styles.w33}>
                    <View style={styles.w25Inner}>
                      <Text style={{fontSize: 28}}>{emailCount}</Text>
                      <Text>Emails</Text>
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
                    initialRouteName="PageViews"
                    screenOptions={{
                      tabBarLabelStyle: {color: COLORS.yellow, fontSize: 10},
                      tabBarStyle: {backgroundColor: COLORS.grayDark},
                      tabBarIndicatorStyle: {
                        borderBottomColor: COLORS.yellow,
                        borderWidth: 2,
                      },
                    }}>
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
  w33: {
    width: '33.33%',
    padding: 2,
  },
  w25Inner: {
    paddingVertical: 15,
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
  },
});
