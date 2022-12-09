// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

// CUSTOM IMPORTS
import images from '../constants/images';
import {COLORS, SIZES} from '../constants';

export default function Start({navigation}) {
  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('token')
        .then(res => {
          if (jwt_decode(res).id) {
            navigation.navigate('AppDrawerStack');
          } else {
          }
        })
        .catch(err => err);
    })();
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ImageBackground source={images.MainBgImg} style={styles.image}>
        <View
          style={styles.start}
          onPress={() => navigation.navigate('Welcome')}>
          <Image source={images.Logo} style={{width: 200, height: 230}} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.text}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  start: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    borderWidth: 1,
    borderColor: COLORS.yellow,
    width: 200,
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: COLORS.yellow,
    fontSize: SIZES.text1,
  },
});
