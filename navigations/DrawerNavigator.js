import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeScreen, NotificationScreen } from "../screens";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;