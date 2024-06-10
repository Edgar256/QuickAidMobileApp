import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// CUSTOM IMPORTS
import { 
  PatientBlogs,
  StaffDispatchHistory,
  StaffPatientAdmission,
  StaffDashboard,
  StaffAccount,
} from '../screens';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

const Index = () => {
  return (
    <Tab.Navigator
      initialRouteName="StaffDashboard"
      screenOptions={() => ({
        tabBarActiveTintColor: COLORS.yellow,
        tabBarOptions: {
          showIcon: true,
        },
        tabBarStyle: {
          backgroundColor: COLORS.black,
        },
        tabBarInactiveTintColor: COLORS.white,
      })}>
      <Tab.Screen
        name="Dispatch History"
        options={{
          headerShown: false,
          tabBarLabel: 'Dispatch History',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="apps" color={color} size={size} />
          ),
          headerTitle: 'Dispatch History',
        }}
        component={StaffDispatchHistory}
      />
      <Tab.Screen
        name="StaffPatientAdmission"
        options={{
          headerShown: false,
          tabBarLabel: 'Accepted',
          tabBarIcon: ({color, size}) => (
            <Icon name="plus-square" color={color} size={size} />
          ),
        }}
        component={StaffPatientAdmission}
      />
      <Tab.Screen
        name="StaffDashboard"
        options={{
          headerShown: false,
          tabBarLabel: 'Requests',
          tabBarIcon: ({color, size}) => (
            <Icon name="ambulance" color={color} size={size} />
          ),
        }}
        component={StaffDashboard}
      />
      <Tab.Screen
        name="StaffAccount"
        options={{
          headerShown: false,
          tabBarLabel: 'StaffAccount',
          tabBarIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
        component={StaffAccount}
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

export default Index;
