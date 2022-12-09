import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {COLORS, images} from '../constants';
import {
  limitStringLength,
  trimString,
  upperCase,
} from '../utils/helperFunctions';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_WIDTH = Dimensions.get('window').width;

class BackgroundCarousel extends React.Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    setInterval(() => {
      this.setState(
        prev => ({
          selectedIndex:
            prev.selectedIndex === this.props.data.length - 1
              ? 0
              : prev.selectedIndex + 1,
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            x: (DEVICE_WIDTH - 100) * this.state.selectedIndex,
            y: 0,
          });
        },
      );
    }, 3000);
  };

  setSelectedIndex = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
    this.setState({selectedIndex});
  };

  render() {
    const {data} = this.props;
    const {selectedIndex} = this.state;

    const openNewsProfile = async (ID, CATEGORY) => {
      try {
        if (this.props.item === 'news') {
          await AsyncStorage.setItem('currentNewsID', ID);
          await AsyncStorage.setItem('currentNewsCategory', CATEGORY);
          return this.props.navigation.navigate('NewsProfile');
        } else if (this.props.item === 'jobs') {
          await AsyncStorage.setItem('currentJobID', ID);
          await AsyncStorage.setItem('currentJobCategory', CATEGORY);
          return this.props.navigation.navigate('JobProfile');
        } else if (this.props.item === 'businesses') {
          await AsyncStorage.setItem('currentBusinessID', ID);
          await AsyncStorage.setItem('currentBusinessCategory', CATEGORY);
          return this.props.navigation.navigate('BusinessProfile');
        } else if (this.props.item === 'events') {
          await AsyncStorage.setItem('currentEventID', ID);
          await AsyncStorage.setItem('currentEventCategory', CATEGORY);
          return this.props.navigation.navigate('EventProfile');
        } else {
          return null;
        }
      } catch (error) {
        alert(error);
      }
    };

    return (
      <View style={{}}>
        <ScrollView
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this.setSelectedIndex}
          ref={this.scrollRef}>
          {this.props.data.map(elem => {
            return (
              <TouchableOpacity
                key={elem._id}
                onPress={() => openNewsProfile(elem.id, elem.category.id)}>
                {elem.imageURL ? (
                  <Image
                    style={styles.backgroundImage}
                    source={{uri: elem.imageURL}}
                  />
                ) : (
                  <Image
                    style={styles.backgroundImage}
                    source={images.DefaultUserImage}
                  />
                )}
                <TouchableOpacity
                  onPress={() => openNewsProfile(elem.id, elem.category.id)}
                  style={{
                    position: 'absolute',
                    width: DEVICE_WIDTH - 100,
                    bottom: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => openNewsProfile(elem.id, elem.category.id)}
                    style={{
                      bottom: 0,
                      backgroundColor: COLORS.blackOpacity,
                      padding: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      width: DEVICE_WIDTH - 100,
                    }}>
                    <View>
                      <Text style={{color: COLORS.white}}>
                        {limitStringLength(upperCase(elem.title), 0, 25) ||
                          limitStringLength(
                            upperCase(elem.businessName),
                            0,
                            25,
                          )}
                      </Text>
                    </View>
                    <View>
                      <Text style={{color: COLORS.yellow}}>
                        {limitStringLength(elem.description, 0, 20)}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{color: COLORS.white}}>
                        Call us today on{' '}
                      </Text>
                      <Text style={{color: COLORS.white}}>
                        +{elem.countryCode}-{elem.phone}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.circleDiv}>
          {data.map((image, i) => (
            <View
              style={[
                styles.whiteCircle,
                {opacity: i === selectedIndex ? 0.5 : 1},
              ]}
              key={image.id}
              active={i === selectedIndex}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: Dimensions.get('window').height / 4,
    width: DEVICE_WIDTH - 100,
    borderRadius: 10,
    marginRight: 10,
  },
  circleDiv: {
    position: 'absolute',
    top: 180,
    display: 'none',
    // display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 10,
  },
  whiteCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: '#fff',
  },
});

export default BackgroundCarousel;
