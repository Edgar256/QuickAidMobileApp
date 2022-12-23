// REACT NATIVE IMPORTS
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Image,
} from 'react-native';

// NPM MODULES
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import jwt_decode from 'jwt-decode';
import RadioGroup from 'react-native-radio-buttons-group';
import CheckBox from '@react-native-community/checkbox';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Config from 'react-native-config';
import {CreditCardInput} from 'react-native-credit-card-input';

// ENVIRONMENT VARIABLES
import {stripeSecretKey, stripePublishableKey} from 'react-native-dotenv';

// RESOURCE IMPORTS
import {COLORS, SIZES, images} from '../constants';

// CUSTOM COMPONENT IMPORTS
import {
  CustomLoaderSmall,
  CustomMultiLineTextInput,
  CustomSelectDropdown,
  CustomTextInput,
} from '../components';

const windowWidth = Dimensions.get('window').width;

function NewItem() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>News Item Screen!</Text>
      <View>
        {/* <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={cardDetails => {
            console.log('cardDetails', cardDetails);
          }}
          onFocus={focusedField => {
            console.log('focusField', focusedField);
          }}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayDark,
    height: '100%',
    width: '100%',
  },
  inputContainer: {
    padding: 10,
    marginVertical: 0,
  },
  textWhite: {
    color: COLORS.white,
  },
  labelText: {
    color: COLORS.white,
    fontSize: SIZES.normal,
  },
  textYellow: {
    color: COLORS.yellow,
  },
  icon: {
    marginRight: 10,
  },
  imageText: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  btnContainerInner: {
    paddingHorizontal: 5,
    width: '50%',
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 10,
    width: 200,
    marginBottom: 50,
    marginHorizontal: '25%',
  },
  groupInput: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginLeft: 20,
  },
  phoneInput: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  centeredView: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#fff',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    width: windowWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: COLORS.yellow,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 2,
  },
  submitButton: {
    backgroundColor: COLORS.black,
    padding: 10,
    width: 250,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputContainerStyle: {
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'column',
    width: '100%',
  },
  inputStyle: {
    backgroundColor: '#222242',
    paddingLeft: 15,
    borderRadius: 5,
    color: '#fff',
    // width:50
  },
  labelStyle: {
    marginBottom: 5,
    fontSize: 12,
  },
});

export default NewItem;
