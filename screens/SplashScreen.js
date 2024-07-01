// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

// RESOURCE IMPORTS
import {COLORS} from '../constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SplashScreen({navigation}) {
  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('token')
        .then(res => {
          if (!jwt_decode(res).id) {
            setTimeout(() => {
              navigation.navigate('Start');
            }, 3000);
          } else {
            const role = jwt_decode(res).role;
            if (role === 'USER') {
              navigation.navigate('AppDrawerStack');
            } else if (role === 'STAFF') {
              navigation.navigate('AppDrawerStackStaff');
            } else {
              navigation.navigate('Start');
            }
          }
        })
        .catch(err => {
          setTimeout(() => {
            navigation.navigate('Start');
          }, 3000);
        });
    })();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <ImageBackground
          style={styles.bgImage}
          source={require('../assets/images/splash.gif')}></ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayDark,
    width: '100%',
    height: '100%',
  },
  bgImage: {
    height: windowHeight,
    width: windowWidth,
  },
});
