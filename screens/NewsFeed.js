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
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// RESOURCE IMPORTS
import {COLORS, SIZES} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {CustomLoaderSmall, BackgroundCarousel, NewsCard} from '../components';

// API URL
import {apiURL} from '../utils/apiURL';

const windowWidth = Dimensions.get('window').width;

export default function NewsFeed({navigation}) {
  const carouselImages = [
    'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1485550409059-9afb054cada4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1429087969512-1e85aab2683d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  ];

  const [currentCommunity, setCurrentCommunity] = useState({});
  const [news, setNews] = useState([]);
  const [vipNews, setVipNews] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [replyCount, setReplyCount] = useState(0);

  let CURRENT_COMMUNITIY;

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function populateData() {
    try {
      let USER;
      let DEFAULT_COMMUNITY;

      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        if (!res) {
          return navigation.navigate('Login');
        }
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          DEFAULT_COMMUNITY = res.data.message.community;
          CURRENT_COMMUNITIY = res.data.message.community;

          setCurrentCommunity(res.data.message.community);
          return (USER = res.data.message);
        } else {
          console.log(res.data.error);
          alert('OOOPPP ---! Something went wrong');
        }
      });

      await axios
        .get(`${apiURL}/news/community/active/${USER.community.id}`)
        .then(res => {
          if (res.data.success === true) {
            setNews(res.data.message.reverse());
            setIsLoading(false);
          } else {
            alert('Something went wrong');
          }
        });

      await axios.get(`${apiURL}/news/vip/`).then(res => {
        if (res.data.success === true) {
          let arr = res.data.message.filter(elem => {
            return elem.billing === 'VIP';
          });
          setVipNews(arr.reverse());
          // setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/communities/`).then(res => {
        if (res.data.success === true) {
          let COMMUNITIES = res.data.message.filter(
            elem => elem.id !== DEFAULT_COMMUNITY.id,
          );
          let ALL_COMMUNITY = COMMUNITIES.filter(
            elem => elem.name === 'All Ugandan Communities',
          )[0];

          let FILTERED_COMMUNITIES = COMMUNITIES.filter(
            elem => elem.id !== ALL_COMMUNITY.id,
          );

          FILTERED_COMMUNITIES.unshift(ALL_COMMUNITY);
          FILTERED_COMMUNITIES.unshift(DEFAULT_COMMUNITY);

          setCommunities(FILTERED_COMMUNITIES);
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });

      await axios.get(`${apiURL}/feedbacks/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {
          let feedbackArray = [];
          let replyArray = [];
          res.data.message.map(elem => {
            elem.replies.map(item => replyArray.push(item));
          });
          res.data.message.map(elem => {
            feedbackArray.push(elem)
          });
          let unReadReplies = replyArray.filter(elem => elem.isUserRead === false);
          let unReadFeedback = feedbackArray.filter(elem => elem.isUserRead === false);
          return setReplyCount(unReadReplies.length + unReadFeedback.length);
        } else {
          setRefreshing(false);
          alert('OOOPPPS ! Something went wrong');
        }
      });
    } catch (error) {
      return error;
    }
  }

  async function filterNewsByCommunity(id) {
    try {
      setIsLoading(true);
      CURRENT_COMMUNITIY = id;
      await axios.get(`${apiURL}/communities/${id}`).then(res => {
        if (res.data.success === true) {
          setCurrentCommunity(res.data.message);
        } else {
          alert('OOOPPP ! Something went wrong');
        }
      });
      await axios.get(`${apiURL}/news/community/active/${id}`).then(res => {
        if (res.data.success === true) {
          setNews(res.data.message.reverse());
          setIsLoading(false);
        } else {
          alert('Something went wrong');
        }
      });
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('token')
        .then(res => {
          if (!jwt_decode(res).id) {
            navigation.navigate('Login');
          } else {
          }
        })
        .catch(err => err);
    })();

    populateData();
  }, []);

  const openNewsProfile = async (newsID, newsCategory) => {
    try {
      await AsyncStorage.setItem('currentNewsID', newsID);
      await AsyncStorage.setItem('currentNewsCategory', newsCategory);
      return navigation.navigate('NewsProfile');
    } catch (error) {
      alert(error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      let USER;
      let DEFAULT_COMMUNITY;

      const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
        if (!res) {
          return navigation.navigate('Login');
        }
        return jwt_decode(res).id;
      });

      if (!TOKEN_ID) {
        return navigation.navigate('Login');
      }

      await axios
        .get(`${apiURL}/news/community/${CURRENT_COMMUNITIY.id}`)
        .then(res => {
          if (res.data.success === true) {
            setNews(res.data.message.reverse());
          } else {
            setRefreshing(false);
            alert('Something went wrong');
          }
        });

      await axios.get(`${apiURL}/feedbacks/users/${TOKEN_ID}`).then(res => {
        if (res.data.success === true) {          
          let feedbackArray = [];
          let replyArray = [];
          res.data.message.map(elem => {
            elem.replies.map(item => replyArray.push(item));
          });
          res.data.message.map(elem => {
            feedbackArray.push(elem)
          });
          let unReadReplies = replyArray.filter(elem => elem.isUserRead === false);
          let unReadFeedback = feedbackArray.filter(elem => elem.isUserRead === false);
          return setReplyCount(unReadReplies.length + unReadFeedback.length);
        } else {
          setRefreshing(false);
          alert('OOOPPPS ! Something went wrong');
        }
      });
      setRefreshing(false);
    } catch (error) {
      return error;
    }
  }, [refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <TopNavigation
        navigation={navigation}
        header="UGANDAN DIASPORA NEWS"
        replyCount={replyCount}
      /> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            padding: 10,
            flexDirection: 'row',
            borderBottomWidth: 2,
            borderBottomColor: COLORS.yellow,
          }}>
          {communities.map(elem => {
            if (currentCommunity.id === elem.id) {
              return (
                <TouchableOpacity
                  onPress={() => filterNewsByCommunity(elem.id)}
                  style={[styles.filter, styles.active]}
                  key={elem.id}>
                  <Text style={styles.filterTextActive}>{elem.name}</Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => filterNewsByCommunity(elem.id)}
                  style={[styles.filter]}
                  key={elem.id}>
                  <Text style={styles.filterText}>{elem.name}</Text>
                </TouchableOpacity>
              );
            }
          })}
        </ScrollView>

        {/* AD CAROUSEL */}
        <View style={{padding: 10, position: 'relative'}}>
          <BackgroundCarousel
            images={carouselImages}
            data={vipNews}
            navigation={navigation}
            item={'news'}
          />
          {/* <CustomCarousel data={vipNews}/> */}
        </View>

        <View
          style={{
            padding: 10,
            borderBottomColor: COLORS.yellow,
            borderBottomWidth: 2,
          }}>
          <Text style={{color: COLORS.white, fontSize: SIZES.text2}}>
            What's happening in {currentCommunity.name} ?
          </Text>
        </View>
        <View style={{padding: 10}}>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <View>
              {news.length < 1 ? (
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text>No results found</Text>
                </View>
              ) : (
                news.map(newsItem => {
                  return (
                    <NewsCard
                      key={newsItem.id}
                      image={newsItem.imageURL}
                      title={newsItem.title}
                      description={newsItem.description}
                      category={
                        newsItem.category === null
                          ? 'NO CATEGORY'
                          : newsItem.category.name
                      }
                      billing={newsItem.billing}
                      dateCreated={newsItem.dateCreated}
                      // openNewsProfile={() =>
                      //   openNewsProfile(newsItem.id, newsItem.category.id)
                      // }
                      openNewsProfile={() =>
                        newsItem.category
                          ? openNewsProfile(newsItem.id, newsItem.category.id)
                          : openNewsProfile(newsItem.id, '')
                      }
                      navigation={navigation}
                    />
                  );
                })
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayDark,
    width: '100%',
    height: '100%',
  },
  filter: {
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 7,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: COLORS.blackLight,
    fontSize: 10,
  },
  filterTextActive: {
    color: COLORS.black,
    fontSize: 10,
    width: 100,
    alignItems: 'center',
    textAlign: 'center',
  },
  filterText: {
    color: COLORS.white,
    fontSize: 10,
    width: 100,
    alignItems: 'center',
    textAlign: 'center',
  },
  active: {
    backgroundColor: COLORS.yellow,
  },
  containerSlider: {
    padding: 10,
  },
  image: {
    width: windowWidth / 3 + windowWidth / 3,
    height: 150,
    borderRadius: 10,
    padding: 5,
  },
});
