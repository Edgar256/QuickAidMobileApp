// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// NPM MODULES
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import {
  limitStringLength,
  timeAgo,
  trimString,
  upperCase,
} from '../utils/helperFunctions';

import {COLORS, images, SIZES} from '../constants';

// COMPONENTS
// import {BottomNavigation, TopProfileNavigation} from '../navigations';

// API URL
import {apiURL} from '../utils/apiURL';
import {CustomLoaderSmall} from '../components';

export default function PaymentHistory({navigation}) {
  const [payments, setPayments] = useState([]);
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

      await axios.get(`${apiURL}/payments/user/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          setPayments(res.data.message.reverse());
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
      <ScrollView>
        <View style={{flexDirection: 'column', padding: 10}}>
          <Text
            style={{
              color: COLORS.yellow,
              fontSize: SIZES.text4,
              textAlign: 'center',
              padding: 15,
            }}>
            VIEW YOUR PAYMENT HISTORY
          </Text>
          <View style={{width: '100%'}}>
            <View style={{width: '100%', flexDirection: 'row'}}>
              <View style={[styles.cellHeader, styles.w30]}>
                <Text style={styles.cellHeaderText}>S_ID</Text>
              </View>
              <View style={[styles.cellHeader, styles.w15]}>
                <Text style={styles.cellHeaderText}>ITEM TYPE</Text>
              </View>
              <View style={[styles.cellHeader, styles.w15]}>
                <Text style={styles.cellHeaderText}>PAYMENT TYPE</Text>
              </View>
              <View style={[styles.cellHeader, styles.w15]}>
                <Text style={styles.cellHeaderText}>AMOUNT ($)</Text>
              </View>
              <View style={[styles.cellHeader, styles.w25]}>
                <Text style={styles.cellHeaderText}>DATE PROCESSED</Text>
              </View>
            </View>
            <View>
              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <View>
                  {payments.length < 1 ? (
                    <View style={{alignItems: 'center', width: '100%'}}>
                      <Text>No Payments to show</Text>
                    </View>
                  ) : (
                    <View>
                      {payments.map(elem => {
                        return (
                          <View
                            key={elem._id}
                            style={{width: '100%', flexDirection: 'row'}}>
                            <View style={[styles.cellBody, styles.w30]}>
                              <Text style={styles.cellBodyText}>
                                {elem.stripePaymentId}
                              </Text>
                            </View>
                            <View style={[styles.cellBody, styles.w15]}>
                              <Text style={styles.cellBodyText}>
                                {elem.job ? (
                                  'Job'
                                ) : (
                                  <Text>
                                    {elem.business ? (
                                      'Business'
                                    ) : (
                                      <Text>
                                        {elem.event ? 'Event' : 'News'}
                                      </Text>
                                    )}
                                  </Text>
                                )}
                              </Text>
                            </View>
                            <View style={[styles.cellBody, styles.w15]}>
                              <Text style={styles.cellBodyText}>
                                {elem.paymentType}
                              </Text>
                            </View>
                            <View style={[styles.cellBody, styles.w15]}>
                              <Text style={styles.cellBodyText}>
                                {elem.amount}
                              </Text>
                            </View>
                            <View style={[styles.cellBody, styles.w25]}>
                              <Text style={styles.cellBodyText}>
                                {moment(elem.dateCreated).format('LLL')}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
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
  cellHeader: {
    width: '20%',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray,
    borderWidth: 1,
    padding: 2,
  },
  cellHeaderText: {
    color: COLORS.white,
    alignItems: 'center',
    fontSize: 11,
    textAlign: 'center',
  },
  cellBody: {
    // width: '20%',
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderWidth: 1,
    padding: 2,
  },
  cellBodyText: {
    color: COLORS.black,
    alignItems: 'center',
    fontSize: 11,
    textAlign: 'center',
  },
  w10: {
    width: '10%',
  },
  w15: {
    width: '15%',
  },
  w20: {
    width: '20%',
  },
  w25: {
    width: '25%',
  },
  w30: {
    width: '30%',
  },
  w35: {
    width: '35%',
  },
  w40: {
    width: '40%',
  },
});
