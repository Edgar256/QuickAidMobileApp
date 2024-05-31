import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// CUSTOM IMPORTS
import {
  PatientHome,
  PatientAccount,  
  PatientBlogs,
  PatientRequests,
  PatientHistory,
} from '../screens';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="PatientHome"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: COLORS.yellow,
        tabBarOptions: {
          showIcon: true,
        },
        tabBarStyle: {
          backgroundColor: COLORS.red,
        },
        tabBarInactiveTintColor: COLORS.white,
      })}>
      <Tab.Screen
        name="History"
        options={{
          headerShown: false,
          tabBarLabel: 'Medical History',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="apps" color={color} size={size} />
          ),
        }}
        component={PatientHistory}
      />
      <Tab.Screen
        name="Requests"
        options={{
          headerShown: false,
          tabBarLabel: 'Requests',
          tabBarIcon: ({color, size}) => (
            <Icon name="plus-square" color={color} size={size} />
          ),
        }}
        component={PatientRequests}
      />
      <Tab.Screen
        name="PatientHome"
        options={{
          headerShown: false,
          tabBarLabel: 'Order Ambulance',
          tabBarIcon: ({color, size}) => (
            <Icon name="ambulance" color={color} size={size} />
          ),
        }}
        component={PatientHome}
      />
      <Tab.Screen
        name="My Account"
        options={{
          headerShown: false,
          tabBarLabel: 'My Account',
          tabBarIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
        component={PatientAccount}
      />
      <Tab.Screen
        name="Blogs"
        options={{
          headerShown: false,
          tabBarLabel: 'Blogs',
          tabBarIcon: ({color, size}) => (
            <Icon name="newspaper-o" color={color} size={size} />
          ),
        }}
        component={PatientBlogs}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
