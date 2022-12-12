import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useDrawerProgress,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';

// CUSTOM IMPORTS
import BottomTabNavigator from './BottomTabNavigator';
import {
  NotificationScreen,
  Inbox,
  Feedback,
  PremiumServices,
  PaymentHistory,
  Settings,
  InviteFriends,
  Logout,
  MyAdvertsActive,
} from '../screens';
import {COLORS} from '../constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Share,
} from 'react-native';

function CustomDrawerContent(props) {
  const progress = useDrawerProgress();

  const translateX = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View style={{transform: [{translateX}]}}>
        <DrawerItemList {...props} />
        {/* <DrawerItem label="Help" onPress={() => alert('Link to help')} /> */}
        <View style={styles.navItem}>
          <View style={{paddingTop: 100, padding: 10}}>
            <Text
              style={{color: COLORS.yellow, fontSize: 11, textAlign: 'center'}}>
              Ugalav &copy; 2022. All Rights Reserved - Version 1.0.2
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://terms.ugalav.com`)}>
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
                onPress={() =>
                  Linking.openURL(`https://terms.ugalav.com/privacy.html`)
                }>
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
    backgroundColor: COLORS.grayDark,
  },
  headerTintColor: COLORS.white,
  headerTitleAlign: 'center',
};

function AppDrawerStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Community Listings"
      useLegacyImplementation
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: '80%',
          backgroundColor: COLORS.grayDark,
          headerBackground: COLORS.grayDark,
          headerTintColor: COLORS.white,
        },
        drawerActiveTintColor: COLORS.yellow,
        drawerInactiveTintColor: COLORS.white,
      }}>
      <Drawer.Screen
        name="Community Listings"
        component={BottomTabNavigator}
        options={HEADER_OPTIONS}
      />
      <Drawer.Screen name="Inbox" component={Inbox} options={HEADER_OPTIONS} />
      <Drawer.Screen
        name="Feedback"
        component={Feedback}
        options={HEADER_OPTIONS}
      />
      <Drawer.Screen
        name="My Adverts & Posting History"
        component={MyAdvertsActive}
        options={HEADER_OPTIONS}
      />
      <Drawer.Screen
        name="Premium Services"
        component={PremiumServices}
        options={HEADER_OPTIONS}
      />
      <Drawer.Screen
        name="Payment History"
        component={PaymentHistory}
        options={{
          headerStyle: {
            backgroundColor: COLORS.grayDark,
          },
          headerTintColor: COLORS.white,
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerStyle: {
            backgroundColor: COLORS.grayDark,
          },
          headerTintColor: COLORS.white,
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerStyle: {
            backgroundColor: COLORS.grayDark,
          },
          headerTintColor: COLORS.white,
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="Invite Friends to Ugalav Family"
        component={InviteFriends}
        options={{
          headerStyle: {
            backgroundColor: COLORS.grayDark,
          },
          headerTintColor: COLORS.white,
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="LogOut"
        component={Logout}
        options={{
          headerStyle: {
            backgroundColor: COLORS.grayDark,
          },
          headerTintColor: COLORS.white,
          headerTitleAlign: 'center',
        }}
      />
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
