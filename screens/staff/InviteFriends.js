import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// CUSTOM IMPORTS
import {COLORS} from '../../constants';
import {apiURL} from '../../utils/apiURL';
import axiosClient from '../../utils/axiosClient';

function Index({navigation}) {
  const [user, setUser] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [apkUrl, setApkUrl] = useState('https://drive.google.com/drive/folders/1sYHOeI1eNLjgVSaJDBmyUG1XAGyVpEul');

  const getUser = async () => {
    try {
      const res = await axiosClient.get('/staff/getStaff');

      if (res.status === 200) {
        if (res.data.message.role !== 'STAFF')
          return navigation.navigate('Welcome');
        setUser(res.data.message);
        return setIsLoading(false);
      } else {
        setIsLoading(false);
        return navigation.navigate('Welcome');
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUser()
  }, []);

  const onShare = async () => {
    try {
      
      const result = await Share.share({
        message: `Hi ,${user?.name} is sharing with you this amazing app, QuickAidApp:  ${apkUrl}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }
      getUser()
      setApkUrl("https://drive.google.com/drive/folders/1sYHOeI1eNLjgVSaJDBmyUG1XAGyVpEul")
      // await axios.get(`${apiURL}/users/apk-url`).then(res => {
      //   if (res.data.success === true) {
      //     setApkUrl(res.data.message);
      //     return setIsLoading(false);
      //   } else {
      //     alert('OOOPPP ! Something went wrong');
      //   }
      // });

      setRefreshing(false);
    } catch (error) {
      return error;
    }
  }, [refreshing]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{padding: 40}}>
          <Text>Invite Friends to the QuickAid Family</Text>
        </View>

        <TouchableOpacity
          onPress={() => onShare()}
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
          <Text style={{color: COLORS.yellow}}>INVITE FRIENDS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
    flex: 1,
    paddingTop: 250,
  },
});

export default Index;
