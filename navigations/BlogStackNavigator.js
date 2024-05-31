import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PatientBlog, PatientBlogs} from '../screens/';

const Stack = createNativeStackNavigator();

const BlogStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Blogs">
      <Stack.Screen
        name="Blogs"
        component={PatientBlogs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Blog"
        component={PatientBlog}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
};

export default BlogStackNavigator;
