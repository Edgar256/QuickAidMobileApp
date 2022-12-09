// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';
import {Dimensions} from 'react-native';

// CUSTOM IMPORTS
import {
  CustomLoaderSmall,  
  NotificationsCard,
} from '../components';

// API URL
import {apiURL} from '../utils/apiURL';
import {titleCase, upperCase} from '../utils/helperFunctions';
const windowHeight = Dimensions.get('window').height;

export default function NotificationScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [id, setId] = useState('');
  const [notifications, setNotifications] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setFirstName(res.data.message.firstName);
          setLastName(res.data.message.lastName);
          setId(res.data.message.id);
          setEmail(res.data.message.email);
          return setIsLoading(false);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/notifications/receiver/${TOKEN_ID}`)
        .then(res => {
          if (res.data.success === true) {
            setNotifications(res.data.message.reverse());
            return setIsLoading(false);
          } else {
            console.log(res.data);
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
      await AsyncStorage.setItem('currentEventID', eventID);
      await AsyncStorage.setItem('currentEventCategory', eventCategory);
      return navigation.navigate('EventProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  const openJobProfile = async (jobID, jobCategory) => {
    try {
      await AsyncStorage.setItem('currentJobID', jobID);
      await AsyncStorage.setItem('currentJobCategory', jobCategory);
      return navigation.navigate('JobProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  const openBusinessProfile = async (businessID, businessCategory) => {
    try {
      await AsyncStorage.setItem('currentBusinessID', businessID);
      await AsyncStorage.setItem('currentBusinessCategory', businessCategory);
      return navigation.navigate('BusinessProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  const openNewsProfile = async (newsID, newsCategory) => {
    try {
      await AsyncStorage.setItem('currentNewsID', newsID);
      await AsyncStorage.setItem('currentNewsCategory', newsCategory);
      return navigation.navigate('NewsProfileAnalytics');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{flexDirection: 'column', padding: 10}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {notifications.length < 1 ? (
                <View>
                  <Text>No Notications to show</Text>
                </View>
              ) : (
                <View>
                  {notifications.map(elem => {
                    if (elem.news) {
                      // {console.log(elem)}
                      if (elem.message === 'called') {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="CALL NOTIFICATION"
                            text={`${elem.author.lastName} called you to know more about this news`}
                            dateCreated={elem.dateCreated}
                            imageURL={elem.news.imageURL}
                            openProfileAnalytics={() =>
                              openNewsProfile(elem.news._id, elem.news.category)
                            }
                          />
                        );
                      } else {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="EMAIL NOTIFICATION"
                            text={`${elem.author.lastName} emailed you to know more about this news`}
                            dateCreated={elem.dateCreated}
                            // imageURL={elem.imageURL}
                            imageURL={elem.news.imageURL}
                            openProfileAnalytics={() =>
                              openNewsProfile(elem.news._id, elem.news.category)
                            }
                          />
                        );
                      }
                    } else if (elem.job) {
                      if (elem.message === 'called') {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="CALL NOTIFICATION"
                            text={`${elem.author.lastName} called you about this job`}
                            dateCreated={elem.dateCreated}
                            imageURL={elem.job.imageURL}
                            openProfileAnalytics={() =>
                              openJobProfile(elem.job._id, elem.job.category)
                            }
                          />
                        );
                      } else {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="JOB APPLICATION NOTIFICATION"
                            text={`${elem.author.lastName} applied for this job`}
                            dateCreated={elem.dateCreated}
                            imageURL={elem.job.imageURL}
                            openProfileAnalytics={() =>
                              openJobProfile(elem.job._id, elem.job.category)
                            }
                          />
                        );
                      }
                    } else if (elem.event) {
                      if (elem.message === 'called') {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="CALL NOTIFICATION"
                            text={`${titleCase(
                              elem.author.lastName,
                            )} called you about this event`}
                            dateCreated={elem.dateCreated}
                            imageURL={elem.event.imageURL}
                            openProfileAnalytics={() =>
                              openEventProfile(
                                elem.event._id,
                                elem.event.category,
                              )
                            }
                          />
                        );
                      } else {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="EVENT ATTENDANCE NOTIFICATION"
                            text={`${titleCase(
                              elem.author.lastName,
                            )} is attending this event`}
                            dateCreated={elem.dateCreated}
                            imageURL={elem.event.imageURL}
                            openProfileAnalytics={() =>
                              openEventProfile(
                                elem.event._id,
                                elem.event.category,
                              )
                            }
                          />
                        );
                      }
                    } else {
                      if (elem.message === 'called') {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="CALL NOTIFICATION"
                            text={`${elem.author.lastName} called to do business with you on`}
                            dateCreated={elem.dateCreated}
                            imageURL={
                              elem.business ? elem.business.imageURL : ''
                            }
                            openProfileAnalytics={() =>
                              openBusinessProfile(
                                elem.business._id,
                                elem.business.category,
                              )
                            }
                          />
                        );
                      } else {
                        return (
                          <NotificationsCard
                            key={elem.id}
                            headerText="EMAIL NOTIFICATION"
                            text={`${elem.author.lastName} called to do business with you on`}
                            dateCreated={elem.dateCreated}
                            imageURL={
                              elem.business ? elem.business.imageURL : ''
                            }
                          />
                        );
                      }
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
    backgroundColor: COLORS.grayDark,
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 10,
    width: 200,
    marginBottom: 50,
    marginHorizontal: '25%',
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
    padding: 10,
  },
});
