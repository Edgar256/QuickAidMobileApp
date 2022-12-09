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
import moment from 'moment';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, JobCard} from '../components';
// import {BottomNavigation, TopProfileNavigation} from '../navigations';

// SVG IMPORTS
import PhoneIcon from '../assets/svgs/phone-black.svg';
import Location from '../assets/svgs/location-white.svg';
import TimeIcon from '../assets/svgs/time-white.svg';
import DollarBag from '../assets/svgs/dollar-bag-white.svg';
import BriefCaseIcon from '../assets/svgs/briefcase-white.svg';
import EmailIcon from '../assets/svgs/email-active.svg';

// API URL
import {apiURL} from '../utils/apiURL';
import {currencySymbolConverter, openURL, upperCase} from '../utils/helperFunctions';

export default function JobProfile({navigation}) {
  const [currentJob, setCurrentJob] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function populateData() {
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });
      setUser(TOKEN_ID);

      const CURRENT_JOB_ID = await AsyncStorage.getItem('currentJobID').then(
        res => {
          return res;
        },
      );

      const CURRENT_JOB_CATEGORY_ID = await AsyncStorage.getItem(
        'currentJobCategory',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/jobs/single/${CURRENT_JOB_ID}`).then(res => {
        if (res.data.success === true) {
          setIsLoading(false);
          let arr = [];
          arr.push(res.data.message);
          return setCurrentJob(arr);
        } else {
          alert('OOOPPPS ! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/jobs/category/${CURRENT_JOB_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            let newArray = res.data.message.filter(
              elem => elem._id !== CURRENT_JOB_ID,
            );
            return setJobs(newArray.reverse());
            // return setJobs(res.data.message);
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });

      await axios
        .post(`${apiURL}/jobs/views/create/${CURRENT_JOB_ID}`, {
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

  const openJobProfile = async (jobID, jobCategory) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('currentJobID', jobID);
      await AsyncStorage.setItem('currentJobCategory', jobCategory);

      await axios.get(`${apiURL}/jobs/single/${jobID}`).then(res => {
        if (res.data.success === true) {
          setIsLoading(false);
          let arr = [];
          arr.push(res.data.message);
          return setCurrentJob(arr);
        } else {
          console.log(res.error);
          alert('OOOPPPS ! Something went wrong');
        }
      });

      await axios.get(`${apiURL}/jobs/category/${jobCategory}`).then(res => {
        if (res.data.success === true) {
          let newArray = res.data.message.filter(elem => elem._id !== jobID);
          return setJobs(newArray.reverse());
          // return setJobs(res.data.message);
        } else {
          console.log(res);
          alert('OOOPPP ! Something went wrong');
        }
      });

      setIsLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleCallAction = async (id, phone) => {
    try {
      setIsLoading(true);
      await axios
        .post(`${apiURL}/jobs/calls/create/${id}`, {
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
          job: id,
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
        .post(`${apiURL}/jobs/emails/create/${id}`, {
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
          job: id,
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

  const handleApplyAction = async (id, email, website) => {
    try {
      setIsLoading(true);

      await axios
        .post(`${apiURL}/jobs/emails/create/${id}`, {
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
          job: id,
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
      console.log('123456789', user, '  https://' + website);
      if(website){
        // return Linking.openURL('https://' + website);
        return openURL(website)
      }else{
        return Linking.openURL(`mailto:${email}`);
      }
      
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

      const CURRENT_JOB_ID = await AsyncStorage.getItem('currentJobID').then(
        res => {
          return res;
        },
      );

      const CURRENT_JOB_CATEGORY_ID = await AsyncStorage.getItem(
        'currentJobCategory',
      ).then(res => {
        return res;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/jobs/single/${CURRENT_JOB_ID}`).then(res => {
        if (res.data.success === true) {
          setIsLoading(false);
          let arr = [];
          arr.push(res.data.message);
          return setCurrentJob(arr);
        } else {
          alert('OOOPPPS ! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/jobs/category/${CURRENT_JOB_CATEGORY_ID}`)
        .then(res => {
          if (res.data.success === true) {
            return setJobs(res.data.message);
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });

      await axios
        .post(`${apiURL}/jobs/views/create/${CURRENT_JOB_ID}`, {
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
      {/* {currentJob.map(job => {
        return (
          <TopProfileNavigation
            navigation={navigation}
            key={job.id}
            header={upperCase(job.title)}
          />
        );
      })} */}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {currentJob.map(job => {
          return (
            <View key={job.id}>
              {job.imageURL ? (
                <ImageBackground
                  source={{uri: job.imageURL}}
                  style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                      }}>
                      <View style={styles.imageText}>
                        <BriefCaseIcon
                          width={17}
                          height={17}
                          style={styles.icon}
                        />
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {job.businessName}
                        </Text>
                      </View>
                      <View style={styles.imageText}>
                        <DollarBag width={17} height={17} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.yellow,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {job.currency
                            ? currencySymbolConverter(job.currency)
                            : ''}
                          {job.wage} {job.wagePeriod}
                        </Text>
                      </View>
                      <View style={styles.imageText}>
                        <TimeIcon width={17} height={17} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.yellow,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {job.contractType}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                      }}>
                      <View style={{flexDirection: 'row', width: '100%'}}>
                        <Location width={17} height={17} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {job.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              ) : (
                <ImageBackground
                  source={images.DefaultImage}
                  style={styles.bgImage}>
                  <View style={styles.overlayText}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                      }}>
                      <View style={styles.imageText}>
                        <BriefCaseIcon
                          width={17}
                          height={17}
                          style={styles.icon}
                        />
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {job.businessName}
                        </Text>
                      </View>
                      <View style={styles.imageText}>
                        <DollarBag width={17} height={17} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.yellow,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          ${job.wage} per month
                        </Text>
                      </View>
                      <View style={styles.imageText}>
                        <TimeIcon width={17} height={17} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.yellow,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          Full time
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                      }}>
                      <View style={{flexDirection: 'row', width: '100%'}}>
                        <Location width={17} height={17} style={styles.icon} />
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.text1,
                            flex: 1,
                          }}>
                          {job.address}
                        </Text>
                      </View>
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
                        handleCallAction(job.id, job.countryCode + job.phone)
                      }>
                      <PhoneIcon
                        height={20}
                        width={20}
                        style={{marginRight: 15}}
                      />
                      <Text style={{fontWeight: '700'}}>Call</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.btnContainerInner}>
                    <TouchableOpacity
                      style={styles.buttonMessage}
                      onPress={() => handleEmailAction(job.id, job.email)}>
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

              <View style={{paddingHorizontal: 10}}>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Job Title: {job.title}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Company Name: {job.businessName}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Community: {job.community.name}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Category:{' '}
                  {job.category ? job.category.name : 'No Category Added'}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Email : {job.email}
                </Text>
                {job.website ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: SIZES.text1,
                        // flex: 1,
                      }}>
                      Website :
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleApplyAction(job.id, job.email, job.website)}>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: SIZES.text1,
                          flex: 1,
                        }}>
                        {job.website}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View />
                )}
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Phone : +{job.countryCode}-{job.phone}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Address: {job.address}
                </Text>
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Pay:{' '}
                  {job.currency ? currencySymbolConverter(job.currency) : ''}{' '}
                  {job.wage} {job.wagePeriod}
                </Text>
                {/* {job.website ? (
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: SIZES.text1,
                      flex: 1,
                    }}>
                    WEBSITE : {job.website}
                  </Text>
                ) : (
                  <View />
                )} */}
                <Text
                  style={{color: COLORS.white, fontSize: SIZES.text1, flex: 1}}>
                  Date Posted: {moment(job.dateCreated).format('LLLL')}
                </Text>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: SIZES.text1,
                    flex: 1,
                    paddingTop: 10,
                  }}>
                  {job.description}
                </Text>
              </View>

              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.buttonReview}
                    onPress={() => handleApplyAction(job.id, job.email, job.website)}>
                    <Text
                      style={{
                        flex: 1,
                        color: COLORS.yellow,
                        textAlign: 'center',
                      }}>
                      APPLY FOR THIS JOB
                    </Text>
                    {/* <View>
                      <Text style={{color: COLORS.green}}>12</Text>
                    </View>
                    <View>
                      <Text style={{color: COLORS.yellow}}>+</Text>
                    </View> */}
                  </TouchableOpacity>
                </View>
              )}
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
            Similar Jobs
          </Text>
        </View>
        <View style={{padding: 10}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {jobs.length < 1 ? (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text>No results found</Text>
                </View>
              ) : (
                jobs.map(job => {
                  return (
                    <JobCard
                      key={job.id}
                      contractType={job.contractType}
                      wagePeriod={job.wagePeriod}
                      wage={job.wage}
                      currency={currencySymbolConverter(job.currency)}
                      title={job.title}
                      image={job.imageURL}
                      description={job.description}
                      billing={job.billing}
                      dateCreated={job.dateCreated}
                      address={job.address}
                      phone={'+' + job.countryCode + '-' + job.phone}
                      openJobProfile={() =>
                        openJobProfile(job.id, job.category.id)
                      }
                      navigation={navigation}
                    />
                  );
                })
              )}
            </View>
          )}
          {/* 
          <JobCard
            name="SOFTWARE ENGINEER"
            image={images.Office}
            description="Looking for a Software Engineer to  ..."
            address="1600 Amphitheatre parkway in Mountain View California , USA"
            phone="+1 345 678 9078"
            navigation={navigation}
          /> */}
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
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    width: '33.3%',
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
  buttonReview: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.yellow,
    padding: 10,
  },
});
