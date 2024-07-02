// REACT NATIVE IMPORTS
import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Image,
  Alert,
} from 'react-native';

// NPM MODULES
import Icon from 'react-native-vector-icons/FontAwesome';

// RESOURCE IMPORTS
import {COLORS, SIZES} from '../../constants';

// API URL
import {apiURL} from '../../utils/apiURL';
import Spinner from '../../components/Spinner';
import axiosClient from '../../utils/axiosClient';
import moment from 'moment';

export default function Index({navigation}) {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(true);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getUser = async () => {
    try {
      const res = await axiosClient.get('/users/getUser');

      if (res.status === 200) {
        if (res.data.message.role !== 'USER')
          return navigation.navigate('Welcome');
        setUser(res.data.message);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        navigation.navigate('Welcome');
      }
    } catch (error) {
      setIsLoading(false);
      navigation.navigate('Welcome');
    }
  };

  const getOrders = async () => {
    try {
      const res = await axiosClient.get(
        `${apiURL}/users/getPendingAmbulanceOrders`,
      );
      if (res.status === 200) {
        setOrders(res.data.message);
      }
      setIsProcessing(false);
      setIsLoading(false);
    } catch (error) {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const deleteOrder = async id => {
    setIsProcessing(true);
    try {
      const res = await axiosClient.post(
        `${apiURL}/users/deleteAmbulanceOrder`,
        {orderId: id},
      );
      if (res.status === 200) {
        alert('Request has been deleted');
        getOrders();
      }
    } catch (error) {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    getUser();
    getOrders();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        <Image
          source={require('../../assets/images/default-user-image.jpg')}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.text}>No yet assigned medical staff</Text>
          <View style={styles.line} />
        </View>
      </View>
      <Text style={styles.text}>{item?.healthCondition}</Text>
      <Text style={styles.text}>{item.location}</Text>
      <Text style={styles.text}>{item?.notes}</Text>
      <View style={styles.status}>
        <Text style={styles.text}>Status:</Text>
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
      <Text style={styles.text}>
        Date Requested: {moment(item?.createdAt).format('LLLL')}
      </Text>
      {item.photoUrl && (
        <Image
          source={{uri: item.photoUrl}}
          resizeMode="cover"
          style={styles.imageOrder}
        />
      )}
      {isProcessing ? (
        <Spinner />
      ) : (
        <TouchableOpacity
          onPress={() => deleteOrder(item.id)}
          style={styles.buttonCancel}>
          <Text style={styles.buttonTextCancel}>Delete Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getUser();
    getOrders();
    setRefreshing(false);
  }, []);

  const ListHeaderComponent = (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Text style={styles.text}>Hello , {user?.name} !</Text>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionText}>
          Welcome to QuickAid - Your Trusted First Aid and Ambulance Services
          App! Access instant first aid guidance, emergency ambulance services,
          medical history storage, and informative blogs. Download now for peace
          of mind during medical emergencies!
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrderAmbulance')}>
          <Text style={styles.sectionText}>Learn how it works</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          if (orders.length > 0)
            return alert(
              'You already have a Pending Order, You need to wait for it to be accepted or you can delete it to able to create a New Request',
            );
          return navigation.navigate('PatientOrderAmbulance');
        }}>
        <View style={styles.iconContainer}>
          <Icon name="ambulance" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.sectionText}>Order an Ambulance</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Patient Requests In-Progress</Text>
      {orders.length === 0 && !isLoading && (
        <View>
          <Text style={styles.text}>No Pending Request found</Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    fontSize: 16,
    marginVertical: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 10,
    margin: 0,
    borderRadius: 7,
    marginVertical: 8,
    elevation: 5,
  },
  sectionText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    marginTop: 15,
  },
  buttonCancel: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonTextCancel: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 75,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  imageOrder: {
    width: '100%', // Make the image fill the entire width of the container
    height: undefined, // Allow the height to adjust according to the aspect ratio
    aspectRatio: 5 / 3, // Maintain the aspect ratio
    borderRadius: 5,
  },
  status: {
    flexDirection: 'row',
  },
  badgeText: {
    fontSize: 14,
    backgroundColor: '#FFF8DC',
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#000000',
  },
});
