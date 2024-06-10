import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import axiosClient from '../../utils/axiosClient';
import moment from 'moment';
import Spinner from '../../components/Spinner';
import {COLORS} from '../../constants';

const Index = ({navigation}) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getUser = async () => {
    try {
      const res = await axiosClient.get('/staff/getStaff');

      if (res.status === 200) {
        setUser(res.data.message);
        return setIsLoading(false);
      } else {
        console.log('User is not authenticated');
        return navigation.navigate('Welcome');
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      axiosClient.get(`${apiURL}/staff/getStaff`).then(res => {
        setUser({...res.data.message});
        return setIsLoading(false);
      });
      setRefreshing(false);
    } catch (error) {}
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.header}>Staff Personal Details</Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Name: {user.name}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.value}>Email :{user.email}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.value}>Phone :{user.phone}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.value}>
              Date Registered :{moment(user.createdAt).format('LLLL')}
            </Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Update Details</Text>
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
  label: {
    flex: 1,
    fontWeight: 'bold',
  },
  value: {
    flex: 2,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Index;
