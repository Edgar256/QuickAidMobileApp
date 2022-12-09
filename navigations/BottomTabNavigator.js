import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

// CUSTOM IMPORTS
import {
  EventListing,
  BusinessListing,
  JobListing,
  NewsFeed,
  NewItem,
} from '../screens';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="NewsFeed"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: COLORS.yellow,
        tabBarOptions: {
          showIcon: true,
        },
        tabBarStyle: {
          backgroundColor: COLORS.maroon,
        },
        tabBarInactiveTintColor: COLORS.white,
      })}>
      <Tab.Screen
        name="Events"
        options={{
          headerShown: false,
          tabBarLabel: 'Events',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="calendar-sharp" color={color} size={size} />
          ),
        }}
        component={EventListing}
      />
      <Tab.Screen
        name="Businesses"
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="handshake" color={color} size={size} />
          ),
        }}
        component={BusinessListing}
      />
      <Tab.Screen
        name="Jobs"
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="hand-holding-usd" color={color} size={size} />
          ),
        }}
        component={JobListing}
      />
      <Tab.Screen
        name="NewsFeed"
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="users" color={color} size={size} />
          ),
        }}
        component={NewsFeed}
      />
      <Tab.Screen
        name="NewItem"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="plus" color={color} size={50} />
          ),
        }}
        component={NewItem}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
