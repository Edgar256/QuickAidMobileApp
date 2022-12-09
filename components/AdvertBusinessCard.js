// REACT NATIVE IMPORTS
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {BusinessCard} from './BusinessCard';

// RESOURCE IMPORTS
import {COLORS} from '../constants';

const windowHeight = Dimensions.get('window').height;

export default function AdvertBusinessCard(props) {
  return (
    <View style={styles.container}>
      <BusinessCard
        key={props.id}
        name={props.name}
        image={props.image}
        billing={props.billing}
        description={props.description}
        email={props.email}
        address={props.address}
        phone={props.phone}
        openBusinessProfile={() => props.openBusinessProfile()}
        navigation={props.navigation}
      />
      <View style={styles.buttons}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => props.openEdit()}
            style={{borderRightColor: COLORS.gray, borderRightWidth: 2}}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.yellow,
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}>
              {props.editText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.openDelete()} style={{}}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.red,
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}>
              {props.deleteText}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View>
          <TouchableOpacity
            style={{
              borderColor: COLORS.yellow,
              borderWidth: 1,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.yellow,
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}>
              {props.republishText}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: windowHeight / 2,
  },
  top: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  image: {
    width: 120,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,
  },
});
