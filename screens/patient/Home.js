// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
} from 'react-native';

// NPM MODULES
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        return setIsLoading(false);
      } else {
        console.log('User is not authenticated');
        setIsLoading(false);
        return navigation.navigate('Welcome');
      }
    } catch (error) {}
  };

  const getOrders = async () => {
    try {
      axiosClient.get(`${apiURL}/users/getPendingAmbulanceOrders`).then(res => {
        setOrders([...res.data.message]);
        setIsProcessing(false);
        return setIsLoading(false);
      });
    } catch (error) {}
  };

  const deleteOrder = async id => {
    setIsProcessing(true);
    try {
      axiosClient
        .post(`${apiURL}/users/deleteAmbulanceOrder`, {orderId: id})
        .then(res => {
          if (res.status === 200) {
            alert('Request has been deleted');
            axiosClient
              .get(`${apiURL}/users/getPendingAmbulanceOrders`)
              .then(res => {
                setIsProcessing(false);
                return setOrders([...res.data.message]);
              });
          }
        });
    } catch (error) {
      return setIsProcessing(false);
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
      <Text style={styles.text}> {item.location}</Text>
      <Text style={styles.text}>{item?.notes}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
      <Text style={styles.text}>
        Date Requested: {moment(item?.createdAt).format('LLLL')}
      </Text>
      {item.photoUrl && (
        <Image
          source={{
            uri: item.photoUrl,
          }}
          resizeMode="cover"
          style={styles.imageOrder}
        />
      )}
      {isProcessing ? (
        <Spinner />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => deleteOrder(item.id)}
            style={styles.buttonCancel}>
            <Text style={styles.buttonTextCancel}>Delete Request</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      getUser();
      getOrders();

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
        <Text style={styles.title}> Patient Requests In-Progress</Text>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {orders.length === 0 ? (
              <View>
                <Text style={styles.text}>No Pending Request found</Text>
              </View>
            ) : (
              <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </>
        )}
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
    fontSize: 16,
    marginVertical: 8,
  },
  backgroundImage: {
    resizeMode: 'cover',
    justifyContent: 'center',
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

  button: {
    backgroundColor: COLORS.success,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
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

  // Card styling
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
});
