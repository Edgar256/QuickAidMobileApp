import React from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../constants';

export default function CustomTextInput(props) {
  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder={props.placeholder}
        placeholderTextColor="#000"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        maxLength={props.maxLength}
        value={props.value}
        autoComplete={props.autoComplete}
        secureTextEntry={props.secureTextEntry}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        editable={props.editable}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    backgroundColor: COLORS.yellow,
    fontSize: SIZES.text1,
    color: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 0,
    paddingBottom: 0,
    height: 40,
  },
});
