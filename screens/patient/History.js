import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Spinner from '../../components/Spinner';
import axiosClient from '../../utils/axiosClient';
import moment from 'moment';

const Index = () => {
  // Dummy data for past ambulance requests
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getAmbulanceOrders = async () => {
    try {
      const res = await axiosClient.get('/users/getCompletedAmbulanceOrders');

      if (res.status === 200) {
        setIsLoading(false);
        return setAmbulanceRequests(res.data.message);
      } else {
        setIsLoading(false);
        setError('Error requesting for Ambulance');
        return;
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAmbulanceOrders();
  }, []);

  // Render item function for FlatList
  const renderAmbulanceRequest = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {item?.staff?.photo ? (
          <Image source={{uri: item?.staff?.photo}} style={styles.image} />
        ) : (
          <Image
            source={require('../../assets/images/default-user-image.jpg')}
            style={styles.image}
          />
        )}
        <View style={styles.details}>
          <Text style={styles.text}>{item?.staff?.name}</Text>
          <Text style={styles.text}>{item?.staff?.phone}</Text>
          <Text style={styles.text}>{item?.staff?.email}</Text>

          <View style={styles.line} />
        </View>
      </View>
      <Text style={styles.text}>{item?.healthCondition}</Text>
      <Text style={styles.text}>{item.location}</Text>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History ({ambulanceRequests.length})</Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={ambulanceRequests}
          renderItem={renderAmbulanceRequest}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
  requestContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 7,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
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
