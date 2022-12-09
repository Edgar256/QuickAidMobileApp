import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

// CUSTOM IMPORTS
import {COLORS, images, SIZES} from '../constants';
import {
  currencySymbolConverter,
  dateManipulator,
  limitStringLength,
  titleCase,
  upperCase,
} from '../utils/helperFunctions';

// SVG IMPORTS
import Location from '../assets/svgs/location-white.svg';
import TimeIcon from '../assets/svgs/time-white.svg';
import DollarBag from '../assets/svgs/dollar-bag-white.svg';

export default function EventCard(props) {
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
      <TouchableOpacity
        style={styles.cardContent}
        // onPress={() => props.openEventProfile(props.id, props.category)}
        onPress={() => props.openEventProfile()}>
        <Text style={styles.cardHeader}>
          {upperCase(limitStringLength(props.title, 0, 40))}
        </Text>
        <Text style={styles.cardText}>
          {limitStringLength(props.description, 0, 32)}
        </Text>
        <View style={{flexDirection: 'row', paddingVertical: 1}}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            {/* <DollarBag height={17} width={17} /> */}
            <Icon name="money-bill-alt" color={COLORS.gray} size={17} />
            <Text style={styles.comment}>
              {props.fee == 0
                ? 'Free Event'
                : `${
                    props.currency
                      ? currencySymbolConverter(props.currency)
                      : ''
                  } ${props.fee}`}{' '}
            </Text>
          </View>
          {/* <View style={{flexDirection: 'row', width: '70%'}}>
            <TimeIcon height={17} width={17} />
            <Text style={styles.comment}>
              {moment(props.date).format('LL')}              
            </Text>
          </View> */}
        </View>
        <View style={styles.cardDiv}>
          <Ionicons name="location" color={COLORS.gray} size={17} />
          <Text style={styles.comment}>{titleCase(props.address)}</Text>
        </View>
        <View style={styles.cardDiv}>
          {/* <TimeIcon height={17} width={17} /> */}
          <Ionicons name="time" color={COLORS.gray} size={17} />
          {props.time ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.comment}>
                {moment(props.date).format('LL')}
              </Text>
              <Text style={styles.comment}>
                {' '}
                {props.time ? dateManipulator(props.time) : ''}
              </Text>
            </View>
          ) : (
            <Text style={styles.comment}>
              {moment(props.date).format('LLLL')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
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
    marginBottom: 4,
  },
  cardText: {
    color: COLORS.white,
    flexDirection: 'column',
    marginBottom: 3,
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
    justifyContent: 'flex-end',
  },
  comment: {
    marginLeft: 2,
    color: COLORS.gray,
    fontSize: SIZES.normal,
    // fontSize:12
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
    paddingVertical: 0,
  },
});
