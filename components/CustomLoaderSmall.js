import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants';

export default function CustomLoaderSmall() {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size={40} color={COLORS.lightGray} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
