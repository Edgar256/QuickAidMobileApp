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
// import { CardField, useStripe } from '@stripe/stripe-react-native';

// import {
//   CreditCardInput,
//   LiteCreditCardInput,
// } from 'react-native-credit-card-input-plus';

// import {CreditCardInput} from 'react-native-credit-card-input';
// import {
//   CreditCardInput,
//   LiteCreditCardInput,
// } from 'react-native-credit-card-input-plus';

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

function NewItem() {
  console.log({
    stripeSecretKey,
    stripePublishableKey,
  });
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

export default NewItem;
