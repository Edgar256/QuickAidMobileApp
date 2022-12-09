// REACT NATIVE IMPORTS
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {EventCard} from './EventCard';

// CUSTOM IMPORTS
import {COLORS} from '../constants';

const windowHeight = Dimensions.get('window').height;

export default function AdvertEventCard(props) {
  return (
    <View style={styles.container}>
      <EventCard
        key={props.id}
        id={props.id}
        title={props.title}
        currency={props.currency}
        image={props.image}
        billing={props.billing}
        fee={props.fee}
        date={props.date}
        time={props.time}
        description={props.description}
        address={props.address}
        phone={'+' + props.countryCode + '-' + props.phone}
        openEventProfile={() => props.openEventProfile()}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: windowHeight / 2,
    marginVertical: 8,
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
