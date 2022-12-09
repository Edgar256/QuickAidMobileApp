import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import {  HomeStackNavigator } from "./StackNavigator";
import { HomeScreen, NotificationScreen } from "../screens";
// import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
      {/* <Drawer.Screen name="Home" component={HomeStackNavigator} /> */}
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;