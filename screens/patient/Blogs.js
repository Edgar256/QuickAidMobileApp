import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Spinner from '../../components/Spinner';
import axiosClient from '../../utils/axiosClient';
import parser from 'html-react-parser';
import limitStringLength from '../../utils/limitStringLength';

export default function Index({ navigation }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getBlogs = async () => {
    try {
      const res = await axiosClient.get('/users/getAllBlogs');

      if (res.status === 200) {
        setBlogs(res.data.message);
        setIsLoading(false);
      } else {
        // Handle error or navigate to error screen
        console.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getBlogs();
    setRefreshing(false);
  }, []);

  const handleOpenBlog = (data) => {
    try {
      // AsyncStorage.setItem('currentBlogId', id);
      navigation.navigate('PatientBlog', data);
    } catch (error) {
      console.error('Error opening blog:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleOpenBlog(item)}>
      <Text style={styles.title}>{limitStringLength(item.title, 0, 50)}</Text>
      <Text style={styles.content}>
        {limitStringLength(parser(item.content), 0, 200)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to our Blog!</Text>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <FlatList
            data={blogs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#F2F5FB',
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
  scrollView: {
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
});
