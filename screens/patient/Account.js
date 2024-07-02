import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import axiosClient from '../../utils/axiosClient';
import moment from 'moment';
import Spinner from '../../components/Spinner';
import { COLORS } from '../../constants';

const Index = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getUser = async () => {
    try {
      const res = await axiosClient.get('/users/getUser');

      if (res.status === 200) {
        setUser(res.data.message);
        setIsLoading(false);
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error) {
      setIsLoading(false);
      navigation.navigate('Welcome');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Personal Details</Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={user?.photo ? { uri: user.photo } : require('../../assets/images/default-user-image.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.value}>Name: {user.name}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.value}>Email: {user.email}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.value}>Phone: {user.phone}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.value}>
              Date Registered: {moment(user.createdAt).format('LLLL')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('PatientUpdateDetails')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Update Medical History & Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  button: {
    backgroundColor: COLORS.danger,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Index;
