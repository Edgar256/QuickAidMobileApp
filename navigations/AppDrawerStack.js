import {useState} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerProgress,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';

// CUSTOM IMPORTS
import BottomTabNavigator from './BottomTabNavigator';
import {PatientInviteFriends} from '../screens';
import {COLORS} from '../constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import {CustomLoaderSmall} from '../components';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CustomDrawerContent(props) {
  const [isLoading, setIsLoading] = useState(false);
  const progress = useDrawerProgress();
  const navigation = useNavigation();

  const translateX = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  async function handleLogout() {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('id');
      setIsLoading(false);
      return navigation.navigate('Start');
    } catch (error) {
      return alert('FAILED TO LOGOUT');
    }
  }

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View style={{transform: [{translateX}]}}>
        <DrawerItemList {...props} />
        <View>
          {isLoading ? (
            <CustomLoaderSmall />
          ) : (
            <TouchableOpacity
              style={styles.navItemLogout}
              onPress={handleLogout}>
              <Text style={styles.navText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.navItem}>
          <View style={{paddingTop: 100, padding: 10}}>
            <Text
              style={{color: COLORS.yellow, fontSize: 11, textAlign: 'center'}}>
              Edgar256 &copy; 2024. All Rights Reserved - Version 1.0.0
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://edgar256.github.io/`)}>
                <Text
                  style={{
                    color: COLORS.yellow,
                    fontSize: 11,
                    textAlign: 'center',
                  }}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: COLORS.yellow,
                  fontSize: 11,
                  textAlign: 'center',
                }}>
                {'   '}|{'   '}
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://test.html`)}>
                <Text
                  style={{
                    color: COLORS.yellow,
                    fontSize: 11,
                    textAlign: 'center',
                  }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const HEADER_OPTIONS = {
  headerStyle: {
    backgroundColor: COLORS.red,
  },
  headerTintColor: COLORS.white,
  headerTitleAlign: 'center',
};

function AppDrawerStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      useLegacyImplementation
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: '80%',
          backgroundColor: COLORS.red,
          headerBackground: COLORS.red,
          headerTintColor: COLORS.white,
        },
        drawerActiveTintColor: COLORS.yellow,
        drawerInactiveTintColor: COLORS.white,
      }}>
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={HEADER_OPTIONS}
      />
      <Drawer.Screen
        name="Invite Friends to QuickAid"
        component={PatientInviteFriends}
        options={HEADER_OPTIONS}
      />
      {/* <Drawer.Screen
        name="LogOut"
        component={PatientLogout}
        options={HEADER_OPTIONS}
      /> */}
    </Drawer.Navigator>
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
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: COLORS.blackLight,
    fontSize: 10,
  },
  fillterText: {
    color: COLORS.white,
    fontSize: 10,
  },
  active: {
    backgroundColor: COLORS.yellow,
  },
  containerSlider: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  navItem: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  navItemLogout: {
    paddingLeft: 20,
    paddingVertical: 4,
  },
  navItemContent: {
    padding: 15,
    borderBottomColor: COLORS.yellow,
    borderBottomWidth: 1,
  },
  navText: {
    color: COLORS.white,
  },
});

export default AppDrawerStack;
