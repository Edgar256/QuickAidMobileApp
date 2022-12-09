import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {COLORS, images, SIZES} from '../constants';
import { StarRating } from './StarRating';

export default function Review(props) {
  return (
    <View style={styles.review}>
      {!props.image ? (
        <Image source={images.DefaultImage} style={styles.image} />
      ) : (
        <Image source={{uri: props.image}} style={styles.image} />
      )}
      <View style={{flexDirection: 'column', flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: SIZES.text1, color: COLORS.white}}>
            {props.name}
          </Text>
          <Text style={{fontSize: SIZES.text1, color: COLORS.white}}>
            {props.dateCreated}
          </Text>
        </View>
        <StarRating rating={props.rating}/>
        <Text
          style={{
            color: COLORS.white,
            flex: 1,
            flexDirection: 'row',
            fontSize: SIZES.normal,
          }}>
          {props.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  review: {
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70,
    marginRight: 10,
  },
  text: {
    color: COLORS.white,
  },
});
