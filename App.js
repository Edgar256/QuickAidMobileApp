// REACT NATIVE IMPORTS
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// COMPONENT IMPORTS
import AppDrawerStack from './navigations/AppDrawerStack';
import AppDrawerStackStaff from './navigations/AppDrawerStackStaff';

import {
  Start,
  SplashScreen,
  LoginOptions,
  PatientLogin,
  PatientRegister,
  PatientBlogs,
  PatientBlog,
  PatientOrderAmbulance,  
  StaffLogin,
  StaffRegister,
} from './screens';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'SplashScreen'}>
          {/* Starter Pages */}
          <Stack.Screen
            name="SplashScreen"
            options={{
              headerShown: false,
            }}
            component={SplashScreen}
          />
          <Stack.Screen
            name="Start"
            options={{
              headerShown: false,
            }}
            component={Start}
          />
          <Stack.Screen
            name="LoginOptions"
            options={{
              headerShown: false,
            }}
            component={LoginOptions}
          />

          {/* Patient Screens */}
          <Stack.Screen
            name="PatientLogin"
            options={{
              headerShown: false,
            }}
            component={PatientLogin}
          />
          <Stack.Screen
            name="PatientRegister"
            options={{
              headerShown: false,
            }}
            component={PatientRegister}
          />
          <Stack.Screen
            name="PatientBlogs"
            options={{
              headerShown: false,
            }}
            component={PatientBlogs}
          />
          <Stack.Screen
            name="PatientBlog"
            options={{
              headerShown: true,
            }}
            component={PatientBlog}
          />
          <Stack.Screen
            name="PatientOrderAmbulance"
            options={{
              headerShown: true,
            }}
            component={PatientOrderAmbulance}
          />

          {/* Staff Screens */}
          <Stack.Screen
            name="StaffLogin"
            options={{
              headerShown: false,
            }}
            component={StaffLogin}
          />
          <Stack.Screen
            name="StaffRegister"
            options={{
              headerShown: false,
            }}
            component={StaffRegister}
          />

          {/* Other Screens */} 
          <Stack.Screen
            name="AppDrawerStack"
            options={{
              headerShown: false,
            }}
            component={AppDrawerStack}
          />
          <Stack.Screen
            name="AppDrawerStackStaff"
            options={{
              headerShown: false,
            }}
            component={AppDrawerStackStaff}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
