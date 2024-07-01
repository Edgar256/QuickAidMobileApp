import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {COLORS, images} from '../../constants';
import io from 'socket.io-client';
import {apiHost, apiURL} from '../../utils/apiURL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../../utils/axiosClient';
import moment from 'moment';
import Spinner from '../../components/Spinner';

const Index = () => {
  const [staff, setStaff] = useState({});
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const handleWebSocketConnection = async () => {
      try {
        const socket = io(apiHost);

        setSocket(socket);

        socket.on('connect', async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            socket.emit('authenticate', {token}); // Replace with actual token

            socket.on('text', () => {
              console({data: 'Some data here'});
            });

            socket.on('error', error => {
              console.error({error});
            });

            socket.on('disconnect', () => {
              return;
            });

            // socket.on('orders', data => {
            //   console({data});
            //   setOrders([...data]);
            // });

            return () => {
              if (socket) {
                socket.disconnect();
              }
            };
          } catch (error) {
            return;
          }
        });
      } catch (error) {
        return;
      }
    };

    // handleWebSocketConnection();

    const getUser = async () => {
      try {
        axiosClient.get(`${apiURL}/staff/getStaff`).then(res => {
          setStaff({...res.data.message});
          return setIsLoading(false);
        });
      } catch (error) {}
    };
    getUser();

    const getOrders = async () => {
      try {
        axiosClient.get(`${apiURL}/staff/getAmbulanceOrders`).then(res => {
          setOrders([...res.data.message.reverse()]);
          return setIsLoading(false);
        });
      } catch (error) {}
    };
    getOrders();

    const intervalId = setInterval(getOrders, 10000); // Fetch orders every 10 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const acceptOrder = async id => {
    try {
      setIsProcessing(true);
      axiosClient
        .post(`${apiURL}/staff/acceptAmbulanceOrder`, {id, staffId: staff.id})
        .then(res => {
          if (res.status === 200) {
            axiosClient.get(`${apiURL}/staff/getAmbulanceOrders`).then(res => {
              setOrders([...res.data.message.reverse()]);
              setIsProcessing(false);
              return setIsLoading(false);
            });
          }
        });
    } catch (error) {
      return setIsProcessing(false);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {item?.user?.photo ? (
          <Image source={{uri: item?.user?.photo}} style={styles.image} />
        ) : (
          <Image
            source={require('../../assets/images/default-user-image.jpg')}
            style={styles.image}
          />
        )}
        <View style={styles.details}>
          <Text style={styles.text}>{item?.user?.name}</Text>
          <Text style={styles.text}>{item?.user?.phone}</Text>
          <Text style={styles.text}>{item?.user?.email}</Text>
          <Text style={styles.text}>{item?.location}</Text>
          <View style={styles.line} />
        </View>
      </View>
      <Text style={styles.text}>{item?.healthCondition}</Text>
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => acceptOrder(item.id)}>
          <Text style={styles.buttonText}>Admit Patient</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      axiosClient.get(`${apiURL}/staff/getStaff`).then(res => {
        setStaff({...res.data.message});
        return setIsLoading(false);
      });
      axiosClient.get(`${apiURL}/staff/getAmbulanceOrders`).then(res => {
        setOrders([...res.data.message.reverse()]);
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
      <Text style={styles.title}> Patient Requests</Text>
      <View style={styles.bodyTextWrapper}>
        <Text style={styles.bodyText}>Welcome to the QuickAid App. </Text>
        <Text style={styles.bodyText}>
          On this screen you will be able to see patients requesting for an
          ambulance
        </Text>
        <Text style={styles.bodyText}>
          You have {orders.length} pending request
        </Text>
      </View>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {orders.length === 0 ? (
            <View>
              <Text style={styles.text}>No Requests found</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#F2F5FB',
  },
  bodyTextWrapper: {
    margin: 8,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
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
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
  },

  // Card styling
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
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

export default Index;
