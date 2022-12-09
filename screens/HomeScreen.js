import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EventListing from '../screens/EventListing';
import BusinessListing from '../screens/BusinessListing';
import JobListing from '../screens/JobListing';
import NewsFeed from '../screens/NewsFeed';
import NewItem from '../screens/NewItem';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#efb810',
        // tabBarInactiveTintColor: 'black',
        // tabBarStyle: [
        //   {
        //     display: 'flex',
        //   },
        //   null,
        // ],
        // tabBarIcon: ({color}) => screenOptions(route, color),
      })}
      // screenOptions={({route}) => ({
      //   tabBarIcon: ({focused, color, size}) => {
      //     let iconName;
      //     // if (route.name === 'TabA') {
      //     //   iconName = focused
      //     //     ? 'ios-information-circle'
      //     //     : 'ios-information-circle-outline';
      //     // } else if (route.name === 'TabB') {
      //     //   iconName = focused ? 'ios-list-box' : 'ios-list';
      //     // }
      //     return <View size={size} color={color} />;
      //   },
      // })}

      // tabBarOptions={{
      //   activeTintColor: 'tomato',
      //   inactiveTintColor: 'gray',
      // }}
      // tabBarActiveTintColor="tomato"
      // tabBarInactiveTintColor="gray"
      // tabBarStyle={[
      //   {
      //     display: 'flex',
      //   },
      //   null,
      // ]}
    >
      <Tab.Screen
        name="Events"
        options={{
          headerShown: false,
        }}
        component={EventListing}
      />
      <Tab.Screen
        name="Business"
        options={{
          headerShown: false,
        }}
        component={BusinessListing}
      />
      <Tab.Screen
        name="Jobs"
        options={{
          headerShown: false,
        }}
        component={JobListing}
      />
      <Tab.Screen
        name="NewsFeed"
        options={{
          headerShown: false,
        }}
        component={NewsFeed}
      />
      {/* <Tab.Screen
        name="SideNav"
        options={{
          headerShown: false,
        }}
        component={SideNav}
      /> */}
      <Tab.Screen
        name="NewItem"
        options={{
          headerShown: false,
        }}
        component={NewItem}
      />
    </Tab.Navigator>

    // <Tab.Navigator>
    //   <Tab.Screen name="Home" component={HomeScreen} />
    //   <Tab.Screen name="Notifications" component={NotificationScreen} />
    //   <Tab.Screen name="Settings" component={SettingsScreen} />
    // </Tab.Navigator>
  );
};

export default HomeScreen;
