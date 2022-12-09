// REACT NATIVE IMPORTS
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {JobCard} from './JobCard';

// RESOURCE IMPORTS
import {COLORS} from '../constants';

const windowHeight = Dimensions.get('window').height;

export default function AdvertJobCard(props) {
  return (
    <View style={styles.container}>
      <JobCard
        wage={props.wage}
        currency={props.currency}
        title={props.title}
        image={props.image}
        billing={props.billing}
        wagePeriod={props.wagePeriod}
        contractType={props.contractType}
        description={props.description}
        dateCreated={props.dateCreated}
        address={props.address}
        phone={'+' + props.countryCode + '-' + props.phone}
        openJobProfile={() => props.openJobProfile()}
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
