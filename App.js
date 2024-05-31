// REACT NATIVE IMPORTS
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// COMPONENT IMPORTS
import AppDrawerStack from './navigations/AppDrawerStack';
import {
  Start,
  HomeScreen,
  PatientLogin,
  PatientRegister,
  InboxDetails,
  BusinessProfile,
  BusinessProfileAnalytics,
  BusinessProfileReviews,
  EventProfile,
  EventProfileReviews,
  EventProfileAnalytics,
  JobProfile,
  JobProfileAnalytics,
  NewsProfile,
  NewsProfileAnalytics,
  NewsProfileComments,
  SplashScreen,
  PatientBlogs,
  PatientBlog,
  PatientOrderAmbulance,
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



          <Stack.Screen
            name="HomeScreen"
            options={{
              headerShown: true,
            }}
            component={HomeScreen}
          />
          <Stack.Screen
            name="InboxDetails"
            options={{
              headerShown: false,
            }}
            component={InboxDetails}
          />
          <Stack.Screen
            name="BusinessProfile"
            options={{
              headerShown: false,
            }}
            component={BusinessProfile}
          />
          <Stack.Screen
            name="BusinessProfileReviews"
            options={{
              headerShown: false,
            }}
            component={BusinessProfileReviews}
          />
          <Stack.Screen
            name="BusinessProfileAnalytics"
            options={{
              headerShown: false,
            }}
            component={BusinessProfileAnalytics}
          />
          <Stack.Screen
            name="EventProfile"
            options={{
              headerShown: false,
            }}
            component={EventProfile}
          />
          <Stack.Screen
            name="EventProfileAnalytics"
            options={{
              headerShown: false,
            }}
            component={EventProfileAnalytics}
          />
          <Stack.Screen
            name="EventProfileReviews"
            options={{
              headerShown: false,
            }}
            component={EventProfileReviews}
          />
          <Stack.Screen
            name="JobProfile"
            options={{
              headerShown: false,
            }}
            component={JobProfile}
          />
          <Stack.Screen
            name="JobProfileAnalytics"
            options={{
              headerShown: false,
            }}
            component={JobProfileAnalytics}
          />
          <Stack.Screen
            name="NewsProfile"
            options={{
              headerShown: false,
            }}
            component={NewsProfile}
          />
          <Stack.Screen
            name="NewsProfileAnalytics"
            options={{
              headerShown: false,
            }}
            component={NewsProfileAnalytics}
          />
          <Stack.Screen
            name="NewsProfileComments"
            options={{
              headerShown: false,
            }}
            component={NewsProfileComments}
          />

          <Stack.Screen
            name="AppDrawerStack"
            options={{
              headerShown: false,
            }}
            component={AppDrawerStack}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
