// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// RESOURCE IMPORTS
import {COLORS, SIZES} from '../../constants';

// CUSTOM COMPONENT IMPORTS
import {
  CustomLoaderSmall,
  BackgroundCarousel,
  NewsCard,
} from '../../components';

// API URL
import {apiURL} from '../../utils/apiURL';
import Spinner from '../../components/Spinner';
import axiosClient from '../../utils/axiosClient';

const windowWidth = Dimensions.get('window').width;

export default function Index({navigation}) {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const getUser = async () => {
    try {
      const res = await axiosClient.get('/users/getUser');

      if (res.status === 200) {
        if (res.data.message.role !== 'USER')
          return navigation.navigate('Welcome');
        setUser(res.data.message);
        return setIsLoading(false);
      } else {
        console.log('User is not authenticated');
        setIsLoading(false);
        return navigation.navigate('Welcome');
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      getUser();

      setRefreshing(false);
    } catch (error) {
      return error;
    }
  }, [refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {isLoading ? (
          <Spinner />
        ) : (
          <Text style={styles.text}>Hello , {user?.name} !</Text>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            Welcome to QuickAid - Your Trusted First Aid and Ambulance Services
            App! Access instant first aid guidance, emergency ambulance
            services, medical history storage, and informative blogs. Download
            now for peace of mind during medical emergencies!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('OrderAmbulance')}>
            <Text style={styles.sectionText}> Learn how it works</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('PatientOrderAmbulance')}>
          <View style={styles.iconContainer}>
            <Icon name="ambulance" size={80} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionText}>Order an Ambulance</Text>
        </TouchableOpacity>                
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 5,
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
  backgroundImage: {
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    margin: 0,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 5,
  },
  sectionText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical:20
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
});
