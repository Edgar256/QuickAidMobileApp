import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {COLORS, images, SIZES} from '../constants';
import moment from 'moment';
import { titleCase } from '../utils/helperFunctions';

export default function AnalyticsCard(props) {
  return (
    <View style={styles.comment}>
      {props.imageURL ? (
        <Image source={{uri: props.imageURL}} style={styles.image} />
      ) : (
        <Image source={images.DefaultUserImage} style={styles.image} />
      )}

      <View style={{flexDirection: 'column', flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: SIZES.normal, color: COLORS.white}}>
            {titleCase(props.firstName)} {titleCase(props.lastName)}
          </Text>
          <Text style={{ color: COLORS.white, fontStyle:"italic"}}>
            {props.channel}            
          </Text>
        </View>
        <Text
          style={{
            fontSize: SIZES.normal,
            color: COLORS.white,
            flex: 1,
            flexDirection: 'row',
          }}>
          {props.text} {moment(props.dateCreated).format('LLLL')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomColor:COLORS.white,
    borderBottomWidth:1,
    marginTop:5
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
});
