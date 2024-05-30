import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

// CUSTOM IMPORTS
import {COLORS} from '../../constants';

function Logout({navigation}) {
  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('token')
        .then(res => {
          if (!jwt_decode(res).id) {
            navigation.navigate('PatientLogin');
          } else {
          }
        })
        .catch(err => err);
    })();
  }, []);

  async function logout() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('id');
      return navigation.navigate('PatientLogin');
    } catch (error) {
      return alert('FAILED TO LOGOUT');
    }
  }

  return (
    <View style={styles.container}>
      <View style={{padding: 40}}>
        <Text>Proceed to Logout from Ugalav</Text>
      </View>
      <TouchableOpacity
        onPress={() => logout()}
        style={{
          padding: 10,
          backgroundColor: COLORS.black,
          borderRadius: 5,
          alignItems: 'center',
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'center',
          paddingHorizontal: 30,
        }}>
        <Text style={{color: COLORS.yellow}}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default Logout;
