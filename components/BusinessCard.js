import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {COLORS, images, SIZES} from '../constants';

import {
  limitStringLength,
  upperCase,
} from '../utils/helperFunctions';

import Location from '../assets/svgs/location.svg';
import Phone from '../assets/svgs/phone.svg';
import Email from '../assets/svgs/email-white.svg';

export default function BusinessCard(props) {
  return (
    <View style={styles.card}>
      <View>
        {!props.image ? (
          <Image source={images.DefaultImage} style={styles.cardImage} />
        ) : (
          <Image source={{uri: props.image}} style={styles.cardImage} />
        )}
        {props.billing !== 'FREEMIUM' ? (
          <View
            style={{
              backgroundColor: COLORS.yellow,
              paddingHorizontal: 10,
              right: 0,
              position: 'absolute',
            }}>
            <Text>AD</Text>
          </View>
        ) : (
          <View />
        )}
      </View>
      <View style={styles.cardContent}>
        <TouchableOpacity onPress={() => props.openBusinessProfile(props.id)}>
          <Text style={styles.cardHeader}>
            {/* {upperCase(limitStringLength(props.name, 0, 32))} */}
            {props.name ? upperCase(limitStringLength(props.name, 0, 32)) : ''}
          </Text>
          <Text style={styles.cardText}>
            {limitStringLength(props.description, 0, 32)}
          </Text>
          <View style={styles.cardDiv}>
            {/* <Email height={17} width={17} /> */}
            <Icon name="envelope" color={COLORS.gray} size={17} />
            <Text style={styles.comment}>{props.email}</Text>
          </View>
          <View style={styles.cardDiv}>
            {/* <Location height={17} width={17} /> */}
            <Ionicons name="location" color={COLORS.gray} size={17} />
            <Text style={styles.comment}>{props.address}</Text>
          </View>
          <View style={styles.cardDiv}>
            {/* <Phone height={17} width={17} /> */}
            <MaterialCommunityIcons name="phone" color={COLORS.gray} size={17} />
            <Text style={styles.comment}>{props.phone}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  card: {
    borderBottomColor: COLORS.yellow,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 5,
    marginVertical: 2,
  },
  cardImage: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginVertical: 5,
  },
  cardContent: {
    paddingHorizontal: 5,
    flex: 1,
    marginVertical: 3,
  },
  cardHeader: {
    color: COLORS.white,
    flexDirection: 'column',
    fontSize: SIZES.text1,
    marginBottom: 5,
  },
  cardText: {
    color: COLORS.white,
    flexDirection: 'column',
    marginBottom: 5,
    fontSize: SIZES.normal,
  },
  cardDetails: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: COLORS.gray,
  },
  cardDetailsText: {
    backgroundColor: COLORS.gray,
    fontSize: SIZES.normal,
    paddingVertical: 5,
  },
  cardComment: {
    flexDirection: 'row',
    flex: 1,
    fontSize: SIZES.normal,
    justifyContent: 'flex-end',
  },
  comment: {
    marginLeft: 2,
    color: COLORS.gray,
    fontSize: SIZES.normal,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  bottomTime: {
    flexDirection: 'row',
  },
  bottomTimeText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    paddingLeft: 5,
  },
  bottomComment: {
    fontSize: SIZES.small,
    color: COLORS.green,
  },
  cardDiv: {
    flexDirection: 'row',
    paddingVertical: 1,
  },
});
