import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {COLORS, images, SIZES} from '../constants';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

// CUSTOM IMPORTS
import {
  currencySymbolConverter,
  limitStringLength,
  trimString,
  upperCase,
} from '../utils/helperFunctions';

// SVG IMPORTS
import Phone from '../assets/svgs/phone.svg';
import Location from '../assets/svgs/location-white.svg';
import TimeIcon from '../assets/svgs/time-white.svg';
import DollarBag from '../assets/svgs/dollar-bag-white.svg';
import ContractIcon from '../assets/svgs/contract-white.svg';

export default function JobCard(props) {
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
        <TouchableOpacity onPress={() => props.openJobProfile(props.id)}>
          <Text style={styles.cardHeader}>
            {' '}
            {/* {upperCase(limitStringLength(props.title, 0, 25))} */}
            {props.title
              ? upperCase(limitStringLength(props.title, 0, 25))
              : ''}
          </Text>
          <Text style={styles.cardText}>
            {props.description
              ? limitStringLength(props.description, 0, 32)
              : ''}
          </Text>
          <View style={{flexDirection: 'row', paddingVertical: 1}}>
            <View style={{flexDirection: 'row', width: '60%'}}>
              {/* <DollarBag height={17} width={17} /> */}
              <Icon name="money-bill-alt" color={COLORS.gray} size={17} />
              <Text style={styles.comment}>
                {props.currency ? currencySymbolConverter(props.currency) : ''}{' '}
                {props.wage} {props.wagePeriod}
              </Text>
            </View>
            <View style={{flexDirection: 'row', width: '40%'}}>
              {/* <ContractIcon height={17} width={17} /> */}
              <Icon name="file-invoice" color={COLORS.gray} size={17} />
              <Text style={styles.comment}>{props.contractType}</Text>
            </View>
          </View>
          <View style={styles.cardDiv}>
            {/* <Location height={17} width={17} /> */}
            <Ionicons name="location" color={COLORS.gray} size={17} />
            <Text style={styles.comment}>
              {trimString(props.address, 0, 35)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 1}}>
            <View style={{flexDirection: 'row', width: '60%'}}>
              {/* <Phone height={17} width={17} /> */}
              <MaterialCommunityIcons name="phone" color={COLORS.gray} size={17} />
              <Text style={styles.comment}>{props.phone}</Text>
            </View>
            <View style={{flexDirection: 'row', width: '40%'}}>
              {/* <TimeIcon height={17} width={17} /> */}
              <Ionicons name="time" color={COLORS.gray} size={17} />
              <Text style={styles.comment}>
                {moment(props.dateCreated).fromNow()}
              </Text>
            </View>
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
    marginBottom: 0,
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
    fontSize: SIZES.normal,
  },
  cardDetailsText: {
    backgroundColor: COLORS.gray,
    fontSize: SIZES.small,
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
    fontSize: SIZES.normal,
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
