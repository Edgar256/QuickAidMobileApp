// REACT NATIVE IMPORTS
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

// CUSTOM IMPORTS
import {limitStringLength, upperCase} from '../utils/helperFunctions';

// SVG IMPORTS
import {COLORS, images, SIZES} from '../constants';
import Comments from '../assets/svgs/comments.svg';
import Time from '../assets/svgs/time.svg';

export default function NewsCard(props) {
  return (
    <View style={styles.card}>
      <View>
        {!props.image ? (
          <Image source={images.DefaultImage} style={styles.cardImage} />
        ) : (
          <View>
            {props.image === '' ? (
              <Image source={images.DefaultImage} style={styles.cardImage} />
            ) : (
              <Image source={{uri: props.image}} style={styles.cardImage} />
            )}
          </View>
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
        onPress={() => props.openNewsProfile()}>
        <View>
          <Text style={styles.cardText}>
            {upperCase(limitStringLength(props.title, 0, 32))}
          </Text>
        </View>
        <View>
          <Text style={styles.cardText}>
            {limitStringLength(props.description, 0, 32)}
          </Text>
        </View>
        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.cardDetailsText}>
              {props.category
                ? upperCase(limitStringLength(props.category, 0, 20))
                : ''}
            </Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.bottomTime}>
            {/* <Time height={17} width={17} /> */}
            <Ionicons name="time" color={COLORS.gray} size={17} />
            <Text style={styles.bottomTimeText}>
              {moment(props.dateCreated).fromNow()}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {/* <Comments height={16} width={16} style={{marginRight: 3}} /> */}
            <Icon name="comments" color={COLORS.gray} size={17} />
            <Text style={styles.bottomComment}>View Comments</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayDark,
  },
  filter: {
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: COLORS.blackLight,
  },
  fillterText: {
    color: COLORS.white,
  },
  active: {
    backgroundColor: COLORS.yellow,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
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
    paddingHorizontal: 5,
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
    paddingTop: 3,
  },
  bottomComment: {
    fontSize: SIZES.small,
    color: COLORS.green,
  },
});
