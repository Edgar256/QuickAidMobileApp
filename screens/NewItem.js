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
import {CountryPicker} from 'react-native-country-codes-picker';

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

// API URL
import {apiURL} from '../utils/apiURL';
import {currencyNames, currencySymbols} from '../utils/data';

const windowWidth = Dimensions.get('window').width;

// Icons
import ChevronDownIcon from '../assets/svgs/chevron-down.svg';
import ChevronDownIconDark from '../assets/svgs/chevron-down-dark.svg';
import PlusIcon from '../assets/svgs/plus.svg';

const radioItemButtonsData = [
  {
    id: '1',
    label: (
      <Text style={{color: '#FFFFFF', fontSize: SIZES.small}}>
        {'Community'}
      </Text>
    ),
    value: 'NEWS',
    color: COLORS.yellow,
    selected: true,
  },
  {
    id: '2',
    label: (
      <Text style={{color: '#FFFFFF', fontSize: SIZES.small}}>{'Job'}</Text>
    ),
    value: 'JOB',
    color: COLORS.yellow,
    selected: false,
  },
  {
    id: '3',
    label: (
      <Text style={{color: '#FFFFFF', fontSize: SIZES.small}}>
        {'Business'}
      </Text>
    ),
    value: 'BUSINESS',
    color: COLORS.yellow,
    selected: false,
  },
  {
    id: '4',
    label: (
      <Text style={{color: '#FFFFFF', fontSize: SIZES.small}}>{'Event'}</Text>
    ),
    value: 'EVENT',
    color: COLORS.yellow,
    selected: false,
  },
];

// create a component
const CURRENCY = 'USD';
var CARD_TOKEN = null;

function getCreditCardToken(creditCardData) {
  // alert()
  const card = {
    'card[number]': creditCardData.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    'card[cvc]': creditCardData.values.cvc,
  };

  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      // Use the correct MIME type for your server
      Accept: 'application/json',
      // Use the correct Content Type to send data to Stripe
      'Content-Type': 'application/x-www-form-urlencoded',
      // Use the Stripe publishable key as Bearer
      Authorization: `Bearer ${stripePublishableKey}`,
    },
    // Use a proper HTTP method
    method: 'post',
    // Format the credit card data to a string of key-value pairs
    // divided by &
    body: Object.keys(card)
      .map(key => key + '=' + card[key])
      .join('&'),
  })
    .then(response => response.json())
    .catch(error => console.log(error));
}

export default function({navigation}) {
  const [communities, setCommunities] = useState([]);

  const [radioItemButtons, setRadioItemButtons] =
    useState(radioItemButtonsData);

  const [toggleAddressCheckBox, setToggleAddressCheckBox] = useState(false);
  const [togglePhoneCheckBox, setTogglePhoneCheckBox] = useState(false);
  const [toggleEmailCheckBox, setToggleEmailCheckBox] = useState(false);
  const [toggleWebsiteCheckBox, setToggleWebsiteCheckBox] = useState(false);

  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [wage, setWage] = useState('');
  const [fee, setFee] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [community, setCommunity] = useState('');
  const [newsCategory, setNewsCategory] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [flagCode, setFlagCode] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [billing, setBilling] = useState('');
  const [photo, setPhoto] = useState('');
  const [wagePeriod, setWagePeriod] = useState('');
  const [contractType, setContractType] = useState('');

  const [communitiesData, setCommunitiesData] = useState([]);
  const [newsCategories, setNewsCategories] = useState([]);
  const [newsCategoriesData, setNewsCategoriesData] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobCategoriesData, setJobCategoriesData] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [businessCategoriesData, setBusinessCategoriesData] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [eventCategoriesData, setEventCategoriesData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [itemType, setItemType] = useState('NEWS');
  const [paymentTypes, setPaymentTypes] = useState('');
  const [billingCommunity, setBillingCommunity] = useState('');
  const [isRequiringPayment, setIsRequiringPayment] = useState(false);

  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [CardInput, setCardInput] = useState({});

  const [newsData, setNewsData] = useState({});
  const [jobData, setJobData] = useState({});
  const [businessData, setBusinessData] = useState({});
  const [eventData, setEventData] = useState({});

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [selectedHours, setSelectedHours] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState('');

  // console.log(currencyNames, Object.keys(currencyNames))

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async date => {
    await setSelectedDate(date);
    hideDatePicker();
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDismissModal = async () => {
    setIsRequiringPayment(false);
    setModalVisible(!modalVisible);
    return null;
  };

  const handleChoosePhoto = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      base64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
      } else {
        const uri = response.assets[0].uri;
        const type = response.assets[0].type;
        const name = response.assets[0].fileName;
        const size = response.assets[0].fileSize;
        const source = {
          uri,
          type,
          name,
          size,
        };
        setPhoto(source);
      }
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let communityNames = [];
        let allCommunityData = [];
        let newsCategoryNames = [];
        let newsCategoryData = [];
        let jobCategoryNames = [];
        let jobCategoryData = [];
        let businessCategoryNames = [];
        let businessCategoryData = [];
        let eventCategoryNames = [];
        let eventCategoryData = [];

        setIsLoading(true);

        let USER;
        const TOKEN_ID = await AsyncStorage.getItem('token').then(res => {
          return jwt_decode(res).id;
        });

        if (!TOKEN_ID) {
          return navigation.navigate('Login');
        }

        await AsyncStorage.setItem('billing', '');

        await axios.get(`${apiURL}/users/${TOKEN_ID}`).then(res => {
          if (res.data.success === true) {
            setUser(res.data.message);
            setEmail(res.data.message.email);
            // setCountryCode(res.data.message.callingCode);
            setPhoneNumber(res.data.message.telephone);
            setCommunity(res.data.message.community.name);
            return (USER = res.data.message);
          } else {
            alert('OOOPPP ! Something went wrong');
          }
        });

        await axios
          .get(`${apiURL}/communities/`)
          .then(res => {
            return res.data.message;
          })
          .then(result => {
            result.map(elem => {
              communityNames.push(elem.name);
              allCommunityData.push(elem);
            });
            setCommunities(communityNames);
            setCommunitiesData(allCommunityData);
            setIsLoading(false);
          });

        await axios
          .get(`${apiURL}/news/categories`)
          .then(res => {
            return res.data.message;
          })
          .then(result => {
            result.map(elem => {
              newsCategoryNames.push(elem.name);
              newsCategoryData.push(elem);
            });
            setNewsCategories(newsCategoryNames);
            setNewsCategoriesData(newsCategoryData);
            setIsLoading(false);
          });

        await axios
          .get(`${apiURL}/jobs/categories`)
          .then(res => {
            return res.data.message;
          })
          .then(result => {
            result.map(elem => {
              jobCategoryNames.push(elem.name);
              jobCategoryData.push(elem);
            });
            setJobCategories(jobCategoryNames);
            setJobCategoriesData(jobCategoryData);
            setIsLoading(false);
          });

        await axios
          .get(`${apiURL}/businesses/categories`)
          .then(res => {
            return res.data.message;
          })
          .then(result => {
            result.map(elem => {
              businessCategoryNames.push(elem.name);
              businessCategoryData.push(elem);
            });
            setBusinessCategories(businessCategoryNames);
            setBusinessCategoriesData(businessCategoryData);
            setIsLoading(false);
          });

        await axios
          .get(`${apiURL}/events/categories`)
          .then(res => {
            return res.data.message;
          })
          .then(result => {
            result.map(elem => {
              eventCategoryNames.push(elem.name);
              eventCategoryData.push(elem);
            });
            setEventCategories(eventCategoryNames);
            setEventCategoriesData(eventCategoryData);
            setIsLoading(false);
          });

        await axios.get(`${apiURL}/payments/types`).then(res => {
          setPaymentTypes(res.data.message);
          return setIsLoading(false);
        });
      } catch (error) {
        return error;
      }
    }
    fetchData();
  }, []);

  const radioPostButtonsData = [
    {
      id: '1',
      label: (
        <View
          style={{
            width: windowWidth,
            alignItems: 'flex-start',
            paddingVertical: 8,
          }}>
          <Text style={{color: COLORS.black, fontSize: SIZES.normal}}>
            {'FREEMIUM POST USD $0'}
          </Text>
          <Text style={{color: COLORS.black, fontSize: SIZES.normal}}>
            {`Post to your own Community for free`}
          </Text>
        </View>
      ),
      value: 'FREEMIUM',
      color: COLORS.black,
      selected: false,
    },
    {
      id: '2',
      label: (
        <View
          style={{
            width: windowWidth,
            alignItems: 'flex-start',
            paddingVertical: 8,
          }}>
          <Text style={{color: COLORS.black, fontSize: SIZES.normal}}>
            {'PREMIUM POST USD $5.5'}
          </Text>
          {/* <Text style={{color: COLORS.black, fontSize: SIZES.normal}}>
            {'USD $5.5'}
          </Text> */}
          {billing === 'PREMIUM' ? (
            <View style={{width: '80%'}}>
              <CustomSelectDropdown
                handleManageCommunity={item => handleManageCommunity(item)}
              />
            </View>
          ) : (
            <View style={{width: '80%'}}>
              <CustomSelectDropdown
                handleManageCommunity={item => handleManageCommunity(item)}
              />
            </View>
          )}
        </View>
      ),
      value: 'PREMIUM',
      color: COLORS.black,
      selected: false,
    },
    {
      id: '3',
      label: (
        <View
          style={{
            width: windowWidth,
            alignItems: 'flex-start',
            paddingVertical: 8,
          }}>
          <Text style={{color: COLORS.black, fontSize: SIZES.normal}}>
            {'VIP POST USD $15.8'}
          </Text>
          <Text style={{color: COLORS.black, fontSize: SIZES.normal}}>
            {'Post appears in All Communities and the carousel)'}
          </Text>
        </View>
      ),
      value: 'VIP',
      color: COLORS.black,
      selected: false,
    },
  ];

  const [radioPostButtons, setRadioPostButtons] =
    useState(radioPostButtonsData);

  const onPressRadioItemButton = radioButtonsArray => {
    let itemSelected = radioButtonsArray.filter(elem => elem.selected === true);
    setItemType(itemSelected[0].value);
    setRadioItemButtons(radioButtonsArray);
  };

  const onPressPostButton = async radioPostButtons => {
    try {
      let billingSelected = radioPostButtons.filter(
        elem => elem.selected === true,
      );

      if (billingSelected[0].value === 'FREEMIUM') {
        await setBillingCommunity(community);
      } else if (billingSelected[0].value === 'VIP') {
        await setBillingCommunity('All Ugandan Communities');
      } else {
        await setBillingCommunity('');
      }

      let arr = paymentTypes.filter(elem => {
        if (elem.name === billingSelected[0].value) {
          return elem;
        }
      });

      let obj = arr[0];
      await AsyncStorage.setItem('billing', JSON.stringify(obj));

      let billingObj = obj;
      await setBilling(obj);

      // return setRadioPostButtons(radioPostButtons);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE BILLING AMOUNTS
  async function handleManageCommunity(value) {
    try {
      let billString = await AsyncStorage.getItem('billing');
      let billOBJ = JSON.parse(billString);

      if (billOBJ.name === 'PREMIUM') {
        return setBillingCommunity(value);
      } else {
        return alert('Select Premium Post to select another community');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // HANDLE CREATE NEWS DATA
  async function handleCreateNewsItem() {
    try {
      if (!title) {
        return alert('Title field cannot be blank');
      }

      if (!newsCategory) {
        return alert('News Category field cannot be blank');
      }

      if (!description) {
        return alert('Description field cannot be left blank');
      }

      if (!photo) {
        return alert('Please add a photo');
      }

      setItemType('NEWS');

      return setModalVisible(true);
    } catch (err) {
      return err;
    }
  }

  // HANDLE SUBMIT NEWS DATA
  async function handleSubmitNewsItem() {
    try {
      if (!billing) {
        return alert('Please select a billing');
      }

      if (!billingCommunity) {
        return alert('Please select a Premium Community');
      }

      if (billing.name === 'FREEMIUM') {
        await setBillingCommunity(community);
      } else if (billing.name === 'VIP') {
        await setBillingCommunity('All Ugandan Communities');
      }

      let selCommunity;
      let selCommunityArr = communitiesData.filter(
        elem => elem.name === billingCommunity,
      );

      selCommunity = selCommunityArr[0].id;

      const selectedCategory = newsCategoriesData.filter(
        elem => elem.name === newsCategory,
      );

      setIsLoading(true);

      const data = new FormData();
      data.append('photo', {
        name: photo.name,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        size: photo.size,
      });

      data.append('title', title);
      data.append('author', user.id);
      data.append('description', description);
      data.append('countryCode', countryCode);
      data.append('phone', phoneNumber);
      data.append('email', email);
      data.append('website', website);
      data.append('isDisplayWebsite', toggleWebsiteCheckBox);
      // data.append('community', selectedCommunity[0].id);
      data.append('community', selCommunity);
      data.append('category', selectedCategory[0].id);
      data.append('billing', billing.name);
      data.append('billingAmount', billing.amount);

      if (billing.name === 'FREEMIUM') {
        // console.log(data)
        await axios.post(`${apiURL}/news/create`, data).then(res => {
          console.log(4321, res);
          // return res.data;
          if (res.data.success === true) {
            console.log(data.message);
            setIsLoading(false);
            alert('Your news item has been successfully created');
            setModalVisible(!modalVisible);
            return navigation.navigate('CommunityListing');
          } else {
            console.log(data.error);
            alert(data.error);
            setIsLoading(false);
            return alert(data.error);
          }
        });
        // .then(data => {

        // });
      } else {
        setIsLoading(false);
        await setNewsData(data);
        await setIsRequiringPayment(true);
      }
    } catch (err) {
      return err;
    }
  }

  const charges = async () => {
    let arr = paymentTypes.filter(elem => {
      if (elem.name === billing.name) {
        return elem;
      }
    });

    const card = {
      amount: arr[0].amount * 100,
      currency: CURRENCY,
      source: CARD_TOKEN,
      description: `UGALAV POST PAYMENT - ${billing.name} - ${description}`,
    };

    return fetch('https://api.stripe.com/v1/charges', {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${stripeSecretKey}`,
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: Object.keys(card)
        .map(key => key + '=' + card[key])
        .join('&'),
    }).then(response => {
      // console.log(response)
      return response.json();
    });
  };

  const _onChange = data => {
    setCardInput(data);
  };

  function subscribeUser(creditCardToken) {
    return new Promise(resolve => {
      CARD_TOKEN = creditCardToken.id;
      setTimeout(() => {
        resolve({status: true});
      }, 1000);
    });
  }

  // HANDLE PROCESS NEWS PAYMENT DATA
  async function handleProcessNewsPayment() {
    if (CardInput.valid == false || typeof CardInput.valid == 'undefined') {
      alert('Invalid Credit Card');
      return false;
    }

    let creditCardToken;
    setIsLoading(true);
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(CardInput);

      if (creditCardToken.error) {
        alert('creditCardToken error');
        return;
      }
    } catch (err) {
      return err;
    }

    // Send a request to your server with the received credit card token
    const {error} = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      console.log(error);
      alert(error);
    } else {
      let payment_data = await charges();

      if (payment_data.status == 'succeeded') {
        // console.log('Payment Successful');
        let createdNewsId;
        await axios
          .post(`${apiURL}/news/create`, newsData)
          .then(res => {
            if (res.data.success === true) {
              createdNewsId = res.data.message.id;
              return res.data;
            } else {
              return res.data;
            }
          })
          .catch(err => {
            return err;
          });

        const paymentPayload = {
          payee: user.id,
          news: createdNewsId,
          amount: billing.amount,
          type: billing.name,
          stripePaymentId: creditCardToken.card.id,
        };

        await axios
          .post(`${apiURL}/payments/create`, paymentPayload)
          .then(res => {
            if (res.data.success === true) {
              alert(
                'Your news item has been successfully created, and your payment has been received',
              );
              setIsLoading(false);
              return navigation.navigate('CommunityListing');
            } else {
              return alert(
                'Ooopps. Something went wrong with processing your payment',
              );
            }
          })
          .catch(err => {
            return err;
          });
      } else {
        setIsLoading(false);
        alert('Payment failed');
      }
    }
  }

  // HANDLE CREATE JOB DATA
  async function handleCreateJobItem() {
    try {
      if (!title) {
        return alert('Title field cannot be blank');
      }

      if (!businessName) {
        return alert('Company name field field cannot be blank');
      }

      if (!wage) {
        return alert('Wage field field cannot be blank');
      }

      if (!currency) {
        return alert('Currency field field cannot be blank');
      }

      if (!wagePeriod) {
        return alert('Wage Period field field cannot be blank');
      }

      if (!contractType) {
        return alert('Add contract type');
      }

      // if (!community) {
      //   return alert('Community field field cannot be blank');
      // }

      if (!jobCategory) {
        return alert('News Category field cannot be blank');
      }

      const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!email) {
        return alert('Email field cannot be blank');
      }
      if (!regexEmail.test(email)) {
        return alert('Please enter a Valid Email Address');
      }

      if (!address) {
        return alert('Address field cannot be blank');
      }

      if (!countryCode) {
        return alert('Country Code field cannot be blank');
      }
      if (!phoneNumber) {
        return alert('Phone field cannot be blank');
      }
      if (!description) {
        return alert('Description field cannot be left blank');
      }
      if (!photo) {
        return alert('Please add a photo');
      }

      const currencyAsArray = Object.entries(currencyNames);
      const filteredCurrencyCode = currencyAsArray.filter(
        ([key, value]) => value === currency,
      )[0][0];

      setCurrencyCode(filteredCurrencyCode);
      setItemType('JOB');

      return setModalVisible(true);
    } catch (err) {
      return err;
    }
  }

  // HANDLE SUBMIT JOB DATA
  async function handleSubmitJobItem() {
    try {
      let billString = await AsyncStorage.getItem('billing');
      let billOBJ = JSON.parse(billString);

      if (billing.length < 1) {
        return alert('Please select a billing');
      }

      if (!billingCommunity) {
        return alert('Please select a Premium Community');
      }

      if (billing.name === 'FREEMIUM') {
        await setBillingCommunity(community);
      } else if (billing.name === 'VIP') {
        await setBillingCommunity('All Ugandan Communities');
      }

      let selCommunity;
      let selCommunityArr = communitiesData.filter(
        elem => elem.name === billingCommunity,
      );

      selCommunity = selCommunityArr[0].id;

      const selectedCategory = jobCategoriesData.filter(
        elem => elem.name === jobCategory,
      );

      setIsLoading(true);

      const data = new FormData();
      data.append('photo', {
        name: photo.name,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        size: photo.size,
      });

      const currencyAsArray = Object.entries(currencyNames);
      const filteredCurrencyCode = currencyAsArray.filter(
        ([key, value]) => value === currency,
      )[0][0];

      data.append('businessName', businessName);
      data.append('title', title);
      data.append('wage', wage);
      data.append('currency', filteredCurrencyCode);
      data.append('contractType', contractType);
      data.append('wagePeriod', wagePeriod);
      data.append('author', user.id);
      data.append('description', description);
      data.append('address', address);
      data.append('countryCode', countryCode);
      data.append('phone', phoneNumber);
      data.append('email', email);
      data.append('website', website);
      data.append('isDisplayAddress', toggleAddressCheckBox);
      data.append('isDisplayPhone', togglePhoneCheckBox);
      data.append('isDisplayEmail', toggleEmailCheckBox);
      data.append('isDisplayWebsite', toggleWebsiteCheckBox);
      data.append('community', selCommunity);
      data.append('category', selectedCategory[0].id);
      data.append('billing', billing.name);
      data.append('billingAmount', billing.amount);

      // return setIsLoading(false);

      if (billing.name === 'FREEMIUM') {
        await axios
          .post(`${apiURL}/jobs/create`, data)
          .then(res => {
            return res.data;
          })
          .then(data => {
            if (data.success === true) {
              setIsLoading(false);
              alert('Your job item has been successfully created');
              setModalVisible(!modalVisible);
              return navigation.navigate('JobListing');
            } else {
              setIsLoading(false);
              alert(data.error);
              return alert(data.error);
            }
          });
      } else {
        setIsLoading(false);
        await setJobData(data);
        await setIsRequiringPayment(true);
      }
    } catch (err) {
      return err;
    }
  }

  // HANDLE PROCESS JOB PAYMENT DATA
  async function handleProcessJobPayment() {
    if (CardInput.valid == false || typeof CardInput.valid == 'undefined') {
      alert('Invalid Credit Card');
      return false;
    }

    let creditCardToken;
    setIsLoading(true);
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(CardInput);

      if (creditCardToken.error) {
        alert('creditCardToken error');
        return;
      }
    } catch (err) {
      return err;
    }

    // Send a request to your server with the received credit card token
    const {error} = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      alert(error);
    } else {
      let payment_data = await charges();

      if (payment_data.status == 'succeeded') {
        // console.log('Payment Successful');
        let createdJobId;

        await axios
          .post(`${apiURL}/jobs/create`, jobData)
          .then(res => {
            if (res.data.success === true) {
              createdJobId = res.data.message.id;
              return res.data;
            } else {
              return res.data;
            }
          })
          .catch(err => {
            return err;
          });

        const paymentPayload = {
          payee: user.id,
          job: createdJobId,
          amount: billing.amount,
          type: billing.name,
          stripePaymentId: creditCardToken.card.id,
        };

        await axios
          .post(`${apiURL}/payments/create`, paymentPayload)
          .then(res => {
            if (res.data.success === true) {
              alert(
                'Your job item has been successfully created, and your payment has been received',
              );
              setIsLoading(false);
              setModalVisible(!modalVisible);
              return navigation.navigate('JobListing');
            } else {
              return alert(
                'Ooopps. Something went wrong with processing your payment',
              );
            }
          })
          .catch(err => {
            return err;
          });
      } else {
        setIsLoading(false);
        alert('Payment failed');
      }
    }
  }

  // HANDLE CREATE BUSINESS DATA
  async function handleCreateBusinessItem() {
    try {
      if (!businessName) {
        return alert('Company name field field cannot be blank');
      }

      if (!businessCategory) {
        return alert('Business Category field cannot be blank');
      }

      const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!email) {
        return alert('Email field cannot be blank');
      }
      if (!regexEmail.test(email)) {
        return alert('Please enter a Valid Email Address');
      }

      if (!address) {
        return alert('Address field cannot be blank');
      }

      if (!countryCode) {
        return alert('Country Code field cannot be blank');
      }
      if (!phoneNumber) {
        return alert('Phone field cannot be blank');
      }
      if (!description) {
        return alert('Description field cannot be left blank');
      }
      if (!photo) {
        return alert('Please add a photo');
      }

      setItemType('BUSINESS');

      return setModalVisible(true);
    } catch (err) {
      return err;
    }
  }
  // HANDLE SUBMIT BUSINESS DATA
  async function handleSubmitBusinessItem() {
    try {
      if (!billing) {
        return alert('Please select a billing');
      }

      if (!billingCommunity) {
        return alert('Please select a Premium Community');
      }

      if (billing.name === 'FREEMIUM') {
        await setBillingCommunity(community);
      } else if (billing.name === 'VIP') {
        await setBillingCommunity('All Ugandan Communities');
      }

      let selCommunity;
      let selCommunityArr = communitiesData.filter(
        elem => elem.name === billingCommunity,
      );

      selCommunity = selCommunityArr[0].id;

      const selectedCategory = businessCategoriesData.filter(
        elem => elem.name === businessCategory,
      );

      setIsLoading(true);

      const data = new FormData();
      data.append('photo', {
        name: photo.name,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        size: photo.size,
      });
      data.append('businessName', businessName);
      data.append('author', user.id);
      data.append('description', description);
      data.append('address', address);
      data.append('countryCode', countryCode);
      data.append('phone', phoneNumber);
      data.append('email', email);
      data.append('website', website);
      data.append('isDisplayAddress', toggleAddressCheckBox);
      data.append('isDisplayPhone', togglePhoneCheckBox);
      data.append('isDisplayEmail', toggleEmailCheckBox);
      data.append('isDisplayWebsite', toggleWebsiteCheckBox);
      data.append('community', selCommunity);
      data.append('category', selectedCategory[0].id);
      data.append('billing', billing.name);
      data.append('billingAmount', billing.amount);

      if (billing.name === 'FREEMIUM') {
        await axios
          .post(`${apiURL}/businesses/create`, data)
          .then(res => {
            alert('Your Business item has been successfully created');
            return res.data;
          })
          .then(data => {
            if (data.success === true) {
              setIsLoading(false);
              setModalVisible(!modalVisible);
              return navigation.navigate('JobListing');
            } else {
              return alert(data.error);
            }
          });
      } else {
        setIsLoading(false);
        await setBusinessData(data);
        await setIsRequiringPayment(true);
      }

      // await axios
      //   .post(`${apiURL}/businesses/create`, data)
      //   .then(res => {
      //     alert('Your Business item has been successfully created');
      //     return res.data;
      //   })
      //   .then(data => {
      //     if (data.success === true) {
      //       setIsLoading(false);
      //       return data;
      //     } else {
      //       return alert(data.error);
      //     }
      //   })
      //   .then(data => {
      //     setModalVisible(!modalVisible);
      //     return data;
      //   })
      //   .then(data => {
      //     if (data.success === true) {
      //       navigation.navigate('BusinessListing');
      //     }
      //   });
    } catch (err) {
      return err;
    }
  }

  // HANDLE PROCESS BUSINESS PAYMENT DATA
  async function handleProcessBusinessPayment() {
    if (CardInput.valid == false || typeof CardInput.valid == 'undefined') {
      alert('Invalid Credit Card');
      return false;
    }

    let creditCardToken;
    setIsLoading(true);
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(CardInput);

      if (creditCardToken.error) {
        alert('creditCardToken error');
        return;
      }
    } catch (err) {
      return err;
    }

    // Send a request to your server with the received credit card token
    const {error} = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      alert(error);
    } else {
      let payment_data = await charges();

      if (payment_data.status == 'succeeded') {
        // console.log('Payment Successful');
        let createdBusinessId;

        await axios
          .post(`${apiURL}/businesses/create`, businessData)
          .then(res => {
            if (res.data.success === true) {
              createdBusinessId = res.data.message.id;
              return res.data;
            } else {
              return res.data;
            }
          })
          .catch(err => {
            return err;
          });

        const paymentPayload = {
          payee: user.id,
          business: createdBusinessId,
          amount: billing.amount,
          type: billing.name,
          stripePaymentId: creditCardToken.card.id,
        };

        await axios
          .post(`${apiURL}/payments/create`, paymentPayload)
          .then(res => {
            if (res.data.success === true) {
              alert(
                'Your business item has been successfully created, and your payment has been received',
              );
              setIsLoading(false);
              setIsRequiringPayment(false);
              setModalVisible(!modalVisible);
              return navigation.navigate('BusinessListing');
            } else {
              return alert(
                'Ooopps. Something went wrong with processing your payment',
              );
            }
          })
          .catch(err => {
            return err;
          });
      } else {
        setIsLoading(false);
        alert('Payment failed');
      }
    }
  }

  // HANDLE CREATE EVENT DATA
  async function handleCreateEventItem() {
    try {
      if (!title) {
        return alert('Event title field field cannot be blank');
      }

      // if (!community) {
      //   return alert('Community field field cannot be blank');
      // }

      if (!fee) {
        return alert('Fee field field cannot be blank');
      }

      if (!currency) {
        return alert('Currency field field cannot be blank');
      }

      if (!selectedHours || !selectedMinutes) {
        return alert('Time field field cannot be blank');
      }

      if (!eventCategory) {
        return alert('Event Category field cannot be blank');
      }

      const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!email) {
        return alert('Email field cannot be blank');
      }
      if (!regexEmail.test(email)) {
        return alert('Please enter a Valid Email Address');
      }

      if (!address) {
        return alert('Address field cannot be blank');
      }

      if (!countryCode) {
        return alert('Country Code field cannot be blank');
      }
      if (!phoneNumber) {
        return alert('Phone field cannot be blank');
      }
      if (!description) {
        return alert('Description field cannot be left blank');
      }
      if (!selectedDate) {
        return alert('Date field cannot be left blank');
      }
      if (!photo) {
        return alert('Please add a photo');
      }

      const currencyAsArray = Object.entries(currencyNames);
      const filteredCurrencyCode = currencyAsArray.filter(
        ([key, value]) => value === currency,
      )[0][0];

      setCurrencyCode(filteredCurrencyCode);

      setItemType('EVENT');

      return setModalVisible(true);
    } catch (err) {
      return err;
    }
  }
  // HANDLE SUBMIT EVENT DATA
  async function handleSubmitEventItem() {
    try {
      if (!billing) {
        return alert('Please select a billing');
      }

      if (!billingCommunity) {
        return alert('Please select a Premium Community');
      }

      if (billing.name === 'FREEMIUM') {
        await setBillingCommunity(community);
      } else if (billing.name === 'VIP') {
        await setBillingCommunity('All Ugandan Communities');
      }

      let selCommunity;
      let selCommunityArr = communitiesData.filter(
        elem => elem.name === billingCommunity,
      );

      selCommunity = selCommunityArr[0].id;

      const selectedCategory = eventCategoriesData.filter(
        elem => elem.name === eventCategory,
      );

      setIsLoading(true);

      const data = new FormData();
      data.append('photo', {
        name: photo.name,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        size: photo.size,
      });

      const currencyAsArray = Object.entries(currencyNames);
      const filteredCurrencyCode = currencyAsArray.filter(
        ([key, value]) => value === currency,
      )[0][0];

      data.append('title', title);
      data.append('author', user.id);
      data.append('fee', fee);
      data.append('currency', filteredCurrencyCode);
      data.append('description', description);
      data.append('address', address);
      data.append('selectedDate', selectedDate.toString());
      data.append('selectedTime', selectedHours + ':' + selectedMinutes);
      data.append('countryCode', countryCode);
      data.append('phone', phoneNumber);
      data.append('email', email);
      data.append('website', website);
      data.append('isDisplayAddress', toggleAddressCheckBox);
      data.append('isDisplayPhone', togglePhoneCheckBox);
      data.append('isDisplayEmail', toggleEmailCheckBox);
      data.append('isDisplayWebsite', toggleWebsiteCheckBox);
      data.append('community', selCommunity);
      data.append('category', selectedCategory[0].id);
      data.append('billing', billing.name);
      data.append('billingAmount', billing.amount);

      if (billing.name === 'FREEMIUM') {
        await axios
          .post(`${apiURL}/events/create`, data)
          .then(res => {
            alert('Your Event item has been successfully created');
            return res.data;
          })
          .then(data => {
            if (data.success === true) {
              setIsLoading(false);
              setModalVisible(!modalVisible);
              return navigation.navigate('EventListing');
            } else {
              return alert(data.error);
            }
          });
      } else {
        setIsLoading(false);
        await setEventData(data);
        await setIsRequiringPayment(true);
      }

      // await axios
      //   .post(`${apiURL}/events/create`, data)
      //   .then(res => {
      //     alert('Your Event item has been successfully created');
      //     return res.data;
      //   })
      //   .then(data => {
      //     if (data.success === true) {
      //       setIsLoading(false);
      //       return data;
      //     } else {
      //       return alert(data.error);
      //     }
      //   })
      //   .then(data => {
      //     setModalVisible(!modalVisible);
      //     return data;
      //   })
      //   .then(data => {
      //     if (data.success === true) {
      //       navigation.navigate('EventListing');
      //     }
      //   });
    } catch (err) {
      return err;
    }
  }

  // HANDLE PROCESS EVENT PAYMENT DATA
  async function handleProcessEventPayment() {
    if (CardInput.valid == false || typeof CardInput.valid == 'undefined') {
      alert('Invalid Credit Card');
      return false;
    }

    let creditCardToken;
    setIsLoading(true);
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(CardInput);

      if (creditCardToken.error) {
        alert('creditCardToken error');
        return;
      }
    } catch (err) {
      return err;
    }

    // Send a request to your server with the received credit card token
    const {error} = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      alert(error);
    } else {
      let payment_data = await charges();

      if (payment_data.status == 'succeeded') {
        // console.log('Payment Successful');
        let createdEventId;

        await axios
          .post(`${apiURL}/events/create`, eventData)
          .then(res => {
            if (res.data.success === true) {
              createdEventId = res.data.message.id;
              return res.data;
            } else {
              return res.data;
            }
          })
          .catch(err => {
            return err;
          });

        const paymentPayload = {
          payee: user.id,
          event: createdEventId,
          amount: billing.amount,
          type: billing.name,
          stripePaymentId: creditCardToken.card.id,
        };

        await axios
          .post(`${apiURL}/payments/create`, paymentPayload)
          .then(res => {
            if (res.data.success === true) {
              alert(
                'Your event item has been successfully created, and your payment has been received',
              );
              setIsLoading(false);
              setIsRequiringPayment(false);
              setModalVisible(!modalVisible);
              return navigation.navigate('EventListing');
            } else {
              console.log(res.data);
              setIsLoading(false);
              return alert(
                'Ooopps. Something went wrong with processing your payment',
              );
            }
          })
          .catch(err => {
            return err;
          });
      } else {
        setIsLoading(false);
        alert('Payment failed');
      }
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.grayDark,
      }}>
      {/* <Text>News Item Screen!</Text> */}
      <ScrollView style={{flexDirection: 'column', padding: 10}}>
        <RadioGroup
          radioButtons={radioItemButtons}
          onPress={onPressRadioItemButton}
          layout="row"
          style={{alignItems: 'flex-start'}}
          containerStyle={{alignItems: 'flex-start'}}
        />

        {itemType === 'NEWS' ? (
          <View>
            {/* CREATE NEWS ITEM */}
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>
                  News title(Title of your news post)
                </Text>
                <CustomTextInput
                  placeholder="Add Title"
                  onChangeText={text => setTitle(text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Select News Category</Text>
                <SelectDropdown
                  data={newsCategories}
                  onSelect={(selectedItem, index) => {
                    setNewsCategory(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={{
                    maxWidth: '100%',
                    width: '100%',
                    backgroundColor: COLORS.yellow,
                    paddingVertical: 2,
                    height: 40,
                    color: COLORS.black,
                  }}
                  defaultButtonText={'Select News Category'}
                  buttonTextStyle={{
                    fontSize: SIZES.text1,
                    textAlign: 'left',
                    width: '100%',
                    backgroundColor: COLORS.yellow,
                    color: COLORS.black,
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Website</Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <CustomTextInput
                      placeholder="Enter Website"
                      onChangeText={text => setWebsite(text)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                  Add Photos
                </Text>
                <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                  This is the title picture that will be displayed on the
                  Community listing
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{padding: 20}}
                  onPress={() => handleChoosePhoto()}>
                  <PlusIcon height="60" width="60" />
                </TouchableOpacity>
                <View>
                  {photo === '' ? (
                    <></>
                  ) : (
                    <>
                      <Image
                        source={{uri: photo.uri}}
                        style={{flex: 1, width: windowWidth - 200, height: 150}}
                      />
                    </>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>
                  Description ({1200 - description.length} characters left)
                </Text>
                <CustomMultiLineTextInput
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={text => setDescription(text)}
                  maxLength={1200}
                />
              </View>

              {isLoading ? (
                <CustomLoaderSmall />
              ) : (
                <View
                  style={{
                    flexDirection: 'column',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    marginVertical: 30,
                  }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCreateNewsItem()}>
                    <Text style={{color: COLORS.yellow, textAlign: 'center'}}>
                      POST NEWS ITEM
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View>
            {itemType === 'JOB' ? (
              <View>
                {/* CREATE JOB ITEM */}
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>
                      Company / Business Name
                    </Text>
                    <CustomTextInput
                      placeholder="Add Business or Company Name"
                      onChangeText={text => setBusinessName(text)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>
                      Job title (Title of your Job Position)
                    </Text>
                    <CustomTextInput
                      placeholder="Add Title"
                      onChangeText={text => setTitle(text)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Select Job Category</Text>
                    <SelectDropdown
                      data={jobCategories}
                      onSelect={(selectedItem, index) => {
                        setJobCategory(selectedItem);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                      buttonStyle={{
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: COLORS.yellow,
                        paddingVertical: 2,
                        height: 40,
                        color: COLORS.black,
                      }}
                      defaultButtonText={'Select Job Category'}
                      buttonTextStyle={{
                        fontSize: SIZES.text1,
                        textAlign: 'left',
                        width: '100%',
                        backgroundColor: COLORS.yellow,
                        color: COLORS.black,
                      }}
                    />
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '50%'}}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Wage Currency</Text>
                        <SelectDropdown
                          data={Object.values(currencyNames)}
                          onSelect={(selectedItem, index) => {
                            setCurrency(selectedItem);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={{
                            maxWidth: '100%',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            paddingVertical: 2,
                            height: 40,
                            color: COLORS.black,
                          }}
                          defaultButtonText={'Select Currency'}
                          buttonTextStyle={{
                            fontSize: SIZES.text1,
                            textAlign: 'left',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{width: '50%'}}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Wage Amount</Text>
                        <CustomTextInput
                          placeholder="Wage Amount"
                          onChangeText={text => setWage(text)}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '50%'}}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Pay Period</Text>
                        <SelectDropdown
                          data={['per hr', 'per wk', 'per mth']}
                          onSelect={(selectedItem, index) => {
                            setWagePeriod(selectedItem);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={{
                            maxWidth: '100%',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            paddingVertical: 2,
                            height: 40,
                            color: COLORS.black,
                          }}
                          defaultButtonText={'Select period'}
                          buttonTextStyle={{
                            fontSize: SIZES.text1,
                            textAlign: 'left',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{width: '50%'}}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Contract type</Text>
                        <SelectDropdown
                          data={['Full Time', 'Part Time']}
                          onSelect={(selectedItem, index) => {
                            setContractType(selectedItem);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={{
                            maxWidth: '100%',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            paddingVertical: 2,
                            height: 40,
                            color: COLORS.black,
                          }}
                          defaultButtonText={'Select Contract type'}
                          buttonTextStyle={{
                            fontSize: SIZES.text1,
                            textAlign: 'left',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                          }}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Location</Text>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <CustomTextInput
                          placeholder="Enter Job Location"
                          onChangeText={text => setAddress(text)}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Phone</Text>
                    <View style={styles.phoneInput}>
                      <View
                        style={{
                          width: 150,
                          padding: 2,
                          backgroundColor: '#000000',
                          paddingVertical: 5,
                        }}>
                        {countryCode ? (
                          <View
                            style={{
                              position: 'absolute',
                              zIndex: 101,
                              paddingVertical: 5,
                              opacity: 1,
                              width: '100%',
                            }}>
                            {/* <CountryPicker
                              withFilter
                              countryCode={flagCode}
                              withFlag
                              withAlphaFilter={false}
                              withCurrencyButton={false}
                              withCallingCode
                              withCallingCodeButton
                              onSelect={country => {
                                const {cca2, callingCode} = country;
                                setFlagCode(cca2);
                                setCountryCode(callingCode[0]);
                              }}
                              style={{backgroundColor: COLORS.yellow}}
                              theme={DARK_THEME}
                            /> */}
                          </View>
                        ) : (
                          <View
                            style={{
                              position: 'absolute',
                              zIndex: 101,
                              paddingVertical: 5,
                              opacity: 0,
                              width: '100%',
                            }}>
                            {/* <CountryPicker
                              withFilter
                              countryCode={flagCode}
                              withFlag
                              withAlphaFilter={false}
                              withCurrencyButton={false}
                              withCallingCode
                              withCallingCodeButton
                              onSelect={country => {
                                const {cca2, callingCode} = country;
                                setFlagCode(cca2);
                                setCountryCode(callingCode[0]);
                              }}
                              style={{backgroundColor: COLORS.yellow}}
                              theme={DARK_THEME}
                            /> */}
                          </View>
                        )}

                        {countryCode ? (
                          <View />
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              paddingVertical: 5,
                              paddingHorizontal: 2,
                              width: '100%',
                              flex: 1,
                            }}>
                            <View style={{flex: 1}}>
                              <Text
                                style={{
                                  backgroundColor: COLORS.black,
                                  color: COLORS.yellow,
                                  fontSize: 12,
                                  position: 'absolute',
                                  zIndex: 100,
                                }}>
                                Select Country
                              </Text>
                            </View>
                            <View>
                              <ChevronDownIcon height="20" width="20" />
                            </View>
                          </View>
                        )}
                      </View>
                      <View style={{flex: 1, padding: 2}}>
                        <CustomTextInput
                          placeholder="Phone Number"
                          onChangeText={text => setPhoneNumber(text)}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Email</Text>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <CustomTextInput
                          placeholder="Enter Email"
                          onChangeText={text => setEmail(text)}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Website</Text>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <CustomTextInput
                          placeholder="Enter Website"
                          onChangeText={text => setWebsite(text)}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                      Add Photos
                    </Text>
                    <Text style={{color: COLORS.white, fontSize: SIZES.normal}}>
                      This is the title picture that will be displayed on the
                      Jobs listing
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{padding: 20}}
                      onPress={() => handleChoosePhoto()}>
                      <PlusIcon height="60" width="60" />
                    </TouchableOpacity>
                    <View>
                      {photo === '' ? (
                        <></>
                      ) : (
                        <>
                          <Image
                            source={{uri: photo.uri}}
                            style={{
                              flex: 1,
                              width: windowWidth - 200,
                              height: 150,
                            }}
                          />
                        </>
                      )}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>
                      Description ({300 - description.length} characters left)
                    </Text>
                    <CustomMultiLineTextInput
                      numberOfLines={10}
                      multiline={true}
                      onChangeText={text => setDescription(text)}
                      maxLength={300}
                    />
                  </View>

                  {isLoading ? (
                    <CustomLoaderSmall />
                  ) : (
                    <View
                      style={{
                        flexDirection: 'column',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                      }}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleCreateJobItem()}>
                        <Text
                          style={{color: COLORS.yellow, textAlign: 'center'}}>
                          POST JOB
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View>
                {itemType === 'BUSINESS' ? (
                  <View>
                    {/* CREATE BUSINESS ITEM */}
                    <View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Business Name</Text>
                        <CustomTextInput
                          placeholder="Add Business or Company Name"
                          onChangeText={text => setBusinessName(text)}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>
                          Select Business Category
                        </Text>
                        <SelectDropdown
                          data={businessCategories}
                          onSelect={(selectedItem, index) => {
                            setBusinessCategory(selectedItem);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={{
                            maxWidth: '100%',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            paddingVertical: 2,
                            height: 40,
                            color: COLORS.black,
                          }}
                          defaultButtonText={'Select Business Category'}
                          buttonTextStyle={{
                            fontSize: SIZES.text1,
                            textAlign: 'left',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                          }}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Address</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <CustomTextInput
                              placeholder="Enter Address"
                              onChangeText={text => setAddress(text)}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Phone</Text>
                        <View style={styles.phoneInput}>
                          <View
                            style={{
                              width: 150,
                              padding: 2,
                              backgroundColor: '#000000',
                              paddingVertical: 5,
                            }}>
                            {countryCode ? (
                              <View
                                style={{
                                  position: 'absolute',
                                  zIndex: 101,
                                  paddingVertical: 5,
                                  opacity: 1,
                                  width: '100%',
                                }}>
                                {/* <CountryPicker
                                  withFilter
                                  countryCode={flagCode}
                                  withFlag
                                  withAlphaFilter={false}
                                  withCurrencyButton={false}
                                  withCallingCode
                                  withCallingCodeButton
                                  onSelect={country => {
                                    const {cca2, callingCode} = country;
                                    setFlagCode(cca2);
                                    setCountryCode(callingCode[0]);
                                  }}
                                  style={{backgroundColor: COLORS.yellow}}
                                  theme={DARK_THEME}
                                /> */}
                              </View>
                            ) : (
                              <View
                                style={{
                                  position: 'absolute',
                                  zIndex: 101,
                                  paddingVertical: 5,
                                  opacity: 0,
                                  width: '100%',
                                }}>
                                {/* <CountryPicker
                                  withFilter
                                  countryCode={flagCode}
                                  withFlag
                                  withAlphaFilter={false}
                                  withCurrencyButton={false}
                                  withCallingCode
                                  withCallingCodeButton
                                  onSelect={country => {
                                    const {cca2, callingCode} = country;
                                    setFlagCode(cca2);
                                    setCountryCode(callingCode[0]);
                                  }}
                                  style={{backgroundColor: COLORS.yellow}}
                                  theme={DARK_THEME}
                                /> */}
                              </View>
                            )}

                            {countryCode ? (
                              <View />
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  paddingVertical: 5,
                                  paddingHorizontal: 2,
                                  width: '100%',
                                  flex: 1,
                                }}>
                                <View style={{flex: 1}}>
                                  <Text
                                    style={{
                                      backgroundColor: COLORS.black,
                                      color: COLORS.yellow,
                                      fontSize: 12,
                                      position: 'absolute',
                                      zIndex: 100,
                                    }}>
                                    Select Country
                                  </Text>
                                </View>
                                <View>
                                  <ChevronDownIcon height="20" width="20" />
                                </View>
                              </View>
                            )}
                          </View>
                          <View style={{flex: 1, padding: 2}}>
                            <CustomTextInput
                              placeholder="Phone Number"
                              onChangeText={text => setPhoneNumber(text)}
                              keyboardType="number-pad"
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Email</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <CustomTextInput
                              placeholder="Enter Email"
                              onChangeText={text => setEmail(text)}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Website</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <CustomTextInput
                              placeholder="Enter Website"
                              onChangeText={text => setWebsite(text)}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.normal,
                          }}>
                          Add Photos
                        </Text>
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.normal,
                          }}>
                          This is the title picture that will be displayed on
                          the Businesses listing
                        </Text>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          style={{padding: 20}}
                          onPress={() => handleChoosePhoto()}>
                          <PlusIcon height="60" width="60" />
                        </TouchableOpacity>
                        <View>
                          {photo === '' ? (
                            <></>
                          ) : (
                            <>
                              <Image
                                source={{uri: photo.uri}}
                                style={{
                                  flex: 1,
                                  width: windowWidth - 200,
                                  height: 150,
                                }}
                              />
                            </>
                          )}
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>
                          Description ({180 - description.length} characters
                          left)
                        </Text>
                        <CustomMultiLineTextInput
                          numberOfLines={10}
                          multiline={true}
                          onChangeText={text => setDescription(text)}
                          maxLength={180}
                        />
                      </View>

                      {isLoading ? (
                        <CustomLoaderSmall />
                      ) : (
                        <View
                          style={{
                            flexDirection: 'column',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                          }}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleCreateBusinessItem()}>
                            <Text
                              style={{
                                color: COLORS.yellow,
                                textAlign: 'center',
                              }}>
                              POST BUSINESS
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View>
                    {/* CREATE EVENT ITEM */}
                    <View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Event Title</Text>
                        <CustomTextInput
                          placeholder="Event Title"
                          onChangeText={text => setTitle(text)}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>
                          Select Event Category
                        </Text>
                        <SelectDropdown
                          data={eventCategories}
                          onSelect={(selectedItem, index) => {
                            setEventCategory(selectedItem);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={{
                            maxWidth: '100%',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            paddingVertical: 2,
                            height: 40,
                            color: COLORS.black,
                          }}
                          defaultButtonText={'Select Event Category'}
                          buttonTextStyle={{
                            fontSize: SIZES.text1,
                            textAlign: 'left',
                            width: '100%',
                            backgroundColor: COLORS.yellow,
                            color: COLORS.black,
                          }}
                        />
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <View style={{width: '50%'}}>
                          <View style={styles.inputContainer}>
                            <Text style={styles.labelText}>Event Currency</Text>
                            <SelectDropdown
                              data={Object.values(currencyNames)}
                              onSelect={(selectedItem, index) => {
                                setCurrency(selectedItem);
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index,
                              ) => {
                                return selectedItem;
                              }}
                              rowTextForSelection={(item, index) => {
                                return item;
                              }}
                              buttonStyle={{
                                maxWidth: '100%',
                                width: '100%',
                                backgroundColor: COLORS.yellow,
                                paddingVertical: 2,
                                height: 40,
                                color: COLORS.black,
                              }}
                              defaultButtonText={'Select Currency'}
                              buttonTextStyle={{
                                fontSize: SIZES.text1,
                                textAlign: 'left',
                                width: '100%',
                                backgroundColor: COLORS.yellow,
                                color: COLORS.black,
                              }}
                            />
                          </View>
                        </View>
                        <View style={{width: '50%'}}>
                          <View style={styles.inputContainer}>
                            <Text style={styles.labelText}>Event Fee</Text>
                            <CustomTextInput
                              placeholder="Event Fee e.g 3,000"
                              onChangeText={text => setFee(text)}
                              keyboardType="number-pad"
                            />
                          </View>
                        </View>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <View style={{width: '50%'}}>
                          <View style={styles.inputContainer}>
                            <Text style={styles.labelText}>Select Date</Text>
                            <TouchableOpacity
                              style={{
                                backgroundColor: COLORS.yellow,
                                paddingHorizontal: 5,
                                fontSize: 10,
                                paddingVertical: 10,
                              }}
                              onPress={showDatePicker}>
                              {selectedDate ? (
                                <Text
                                  style={{fontSize: 10, paddingVertical: 2}}>
                                  {moment(selectedDate).format('LL')}
                                </Text>
                              ) : (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingVertical: 2,
                                  }}>
                                  <Text style={{fontSize: 10}}>
                                    Select Date
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
                          </View>
                        </View>
                        <View style={{width: '50%'}}>
                          <View style={styles.inputContainer}>
                            <Text style={styles.labelText}>Select Time</Text>
                            <View style={{flexDirection: 'row'}}>
                              <SelectDropdown
                                data={[
                                  '00',
                                  '01',
                                  '02',
                                  '03',
                                  '04',
                                  '05',
                                  '06',
                                  '07',
                                  '08',
                                  '09',
                                  '10',
                                  '11',
                                  '12',
                                  '13',
                                  '14',
                                  '15',
                                  '16',
                                  '17',
                                  '18',
                                  '19',
                                  '20',
                                  '21',
                                  '22',
                                  '23',
                                  '24',
                                ]}
                                onSelect={(selectedItem, index) => {
                                  setSelectedHours(selectedItem);
                                }}
                                buttonTextAfterSelection={(
                                  selectedItem,
                                  index,
                                ) => {
                                  return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                  return item;
                                }}
                                buttonStyle={{
                                  maxWidth: '100%',
                                  width: '50%',
                                  backgroundColor: COLORS.yellow,
                                  paddingVertical: 2,
                                  paddingHorizontal: 0,
                                  textAlign: 'center',
                                  height: 40,
                                  color: COLORS.black,
                                }}
                                defaultButtonText={'HRS'}
                                buttonTextStyle={{
                                  fontSize: SIZES.text1,
                                  // textAlign: 'left',
                                  paddingHorizontal: 0,
                                  textAlign: 'center',
                                  width: '100%',
                                  backgroundColor: COLORS.yellow,
                                  color: COLORS.black,
                                }}
                              />
                              <SelectDropdown
                                data={[
                                  '00',
                                  '01',
                                  '02',
                                  '03',
                                  '04',
                                  '05',
                                  '06',
                                  '07',
                                  '08',
                                  '09',
                                  '10',
                                  '11',
                                  '12',
                                  '13',
                                  '14',
                                  '15',
                                  '16',
                                  '17',
                                  '18',
                                  '19',
                                  '20',
                                  '21',
                                  '22',
                                  '23',
                                  '24',
                                  '25',
                                  '26',
                                  '27',
                                  '28',
                                  '29',
                                  '30',
                                  '31',
                                  '32',
                                  '33',
                                  '34',
                                  '35',
                                  '36',
                                  '37',
                                  '38',
                                  '39',
                                  '40',
                                  '41',
                                  '42',
                                  '43',
                                  '44',
                                  '45',
                                  '46',
                                  '47',
                                  '48',
                                  '49',
                                  '50',
                                  '51',
                                  '52',
                                  '53',
                                  '54',
                                  '55',
                                  '56',
                                  '57',
                                  '58',
                                  '59',
                                ]}
                                onSelect={(selectedItem, index) => {
                                  setSelectedMinutes(selectedItem);
                                }}
                                buttonTextAfterSelection={(
                                  selectedItem,
                                  index,
                                ) => {
                                  return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                  return item;
                                }}
                                buttonStyle={{
                                  maxWidth: '100%',
                                  width: '50%',
                                  backgroundColor: COLORS.yellow,
                                  paddingVertical: 2,
                                  paddingHorizontal: 0,
                                  textAlign: 'center',
                                  height: 40,
                                  color: COLORS.black,
                                }}
                                defaultButtonText={'MINS'}
                                buttonTextStyle={{
                                  fontSize: SIZES.text1,
                                  // textAlign: 'left',
                                  paddingHorizontal: 0,
                                  textAlign: 'center',
                                  width: '100%',
                                  backgroundColor: COLORS.yellow,
                                  color: COLORS.black,
                                }}
                              />
                            </View>

                            {/* <DateTimePickerModal
                              isVisible={isTimePickerVisible}
                              mode="time"
                              onConfirm={handleConfirmTime}
                              onCancel={hideTimePicker}
                            /> */}
                            {/* <Text>
                              <TimePicker
                                selectedHours={selectedHours}
                                //initial Hourse value
                                selectedMinutes={selectedMinutes}
                                //initial Minutes value
                                onChange={(hours, minutes) => {
                                  setSelectedHours(hours);
                                  setSelectedMinutes(minutes);
                                }}
                              />
                            </Text> */}
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Address</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <CustomTextInput
                              placeholder="Enter Address"
                              onChangeText={text => setAddress(text)}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Phone</Text>
                        <View style={styles.phoneInput}>
                          <View
                            style={{
                              width: 150,
                              padding: 2,
                              backgroundColor: '#000000',
                              paddingVertical: 5,
                            }}>
                            {countryCode ? (
                              <View
                                style={{
                                  position: 'absolute',
                                  zIndex: 101,
                                  paddingVertical: 5,
                                  opacity: 1,
                                  width: '100%',
                                }}>
                                {/* <CountryPicker
                                  withFilter
                                  countryCode={flagCode}
                                  withFlag
                                  withAlphaFilter={false}
                                  withCurrencyButton={false}
                                  withCallingCode
                                  withCallingCodeButton
                                  onSelect={country => {
                                    const {cca2, callingCode} = country;
                                    setFlagCode(cca2);
                                    setCountryCode(callingCode[0]);
                                  }}
                                  style={{backgroundColor: COLORS.yellow}}
                                  theme={DARK_THEME}
                                /> */}
                              </View>
                            ) : (
                              <View
                                style={{
                                  position: 'absolute',
                                  zIndex: 101,
                                  paddingVertical: 5,
                                  opacity: 0,
                                  width: '100%',
                                }}>
                                {/* <CountryPicker
                                  withFilter
                                  countryCode={flagCode}
                                  withFlag
                                  withAlphaFilter={false}
                                  withCurrencyButton={false}
                                  withCallingCode
                                  withCallingCodeButton
                                  onSelect={country => {
                                    const {cca2, callingCode} = country;
                                    setFlagCode(cca2);
                                    setCountryCode(callingCode[0]);
                                  }}
                                  style={{backgroundColor: COLORS.yellow}}
                                  theme={DARK_THEME}
                                /> */}
                              </View>
                            )}

                            {countryCode ? (
                              <View />
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  paddingVertical: 5,
                                  paddingHorizontal: 2,
                                  width: '100%',
                                  flex: 1,
                                }}>
                                <View style={{flex: 1}}>
                                  <Text
                                    style={{
                                      backgroundColor: COLORS.black,
                                      color: COLORS.yellow,
                                      fontSize: 12,
                                      position: 'absolute',
                                      zIndex: 100,
                                    }}>
                                    Select Country
                                  </Text>
                                </View>
                                <View>
                                  <ChevronDownIcon height="20" width="20" />
                                </View>
                              </View>
                            )}
                          </View>
                          <View style={{flex: 1, padding: 2}}>
                            <CustomTextInput
                              placeholder="Phone Number"
                              onChangeText={text => setPhoneNumber(text)}
                              keyboardType="number-pad"
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Email</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <CustomTextInput
                              placeholder="Enter Email"
                              onChangeText={text => setEmail(text)}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>Website</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <CustomTextInput
                              placeholder="Enter Website"
                              onChangeText={text => setWebsite(text)}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.normal,
                          }}>
                          Add Photos
                        </Text>
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: SIZES.normal,
                          }}>
                          This is the title picture that will be displayed on
                          the Events listing
                        </Text>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          style={{padding: 20}}
                          onPress={() => handleChoosePhoto()}>
                          <PlusIcon height="60" width="60" />
                        </TouchableOpacity>
                        <View>
                          {photo === '' ? (
                            <></>
                          ) : (
                            <>
                              <Image
                                source={{uri: photo.uri}}
                                style={{
                                  flex: 1,
                                  width: windowWidth - 200,
                                  height: 150,
                                }}
                              />
                            </>
                          )}
                        </View>
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.labelText}>
                          Description ({180 - description.length} characters
                          left)
                        </Text>
                        <CustomMultiLineTextInput
                          numberOfLines={10}
                          multiline={true}
                          onChangeText={text => setDescription(text)}
                          maxLength={180}
                        />
                      </View>

                      {isLoading ? (
                        <CustomLoaderSmall />
                      ) : (
                        <View
                          style={{
                            flexDirection: 'column',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                          }}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleCreateEventItem()}>
                            <Text
                              style={{
                                color: COLORS.yellow,
                                textAlign: 'center',
                              }}>
                              POST EVENT
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal for Details filled in */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <ScrollView style={styles.centeredView}>
            <View style={styles.modalView}>
              {itemType === 'NEWS' ? (
                <View style={{padding: 10}}>
                  {!isRequiringPayment ? (
                    <View>
                      <View
                        style={{
                          backgroundColor: '#2196F3',
                          padding: 10,
                          // width: windowWidth - 10,
                          width: '100%',
                          marginBottom: 10,
                          alignSelf: 'center',
                          borderRadius: 5,
                        }}>
                        <Text style={{color: '#fff', textAlign: 'center'}}>
                          POSTING NEWS ITEM
                        </Text>
                      </View>
                      <View style={{flexDirection: 'column'}}>
                        <Text style={styles.modalText}>Title: {title}</Text>
                        <Text style={styles.modalText}>
                          Category: {newsCategory}
                        </Text>
                        <Text style={styles.modalText}>
                          Description: {description}
                        </Text>
                        <Text style={styles.modalText}>
                          Phone: +{user.callingCode} -{user.telephone}
                        </Text>
                        <Text style={styles.modalText}>
                          Email: {user.email}
                        </Text>
                        {website ? (
                          <Text style={styles.modalText}>
                            Website: {website}
                          </Text>
                        ) : (
                          <View />
                        )}
                        <View>
                          {photo === '' ? (
                            <View></View>
                          ) : (
                            <View
                              style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                              }}>
                              <Image
                                source={{uri: photo.uri}}
                                style={{
                                  width: windowWidth - 100,
                                  height: 200,
                                }}
                              />
                            </View>
                          )}
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          {isLoading ? (
                            <CustomLoaderSmall />
                          ) : (
                            <RadioGroup
                              radioButtons={radioPostButtons}
                              onPress={onPressPostButton}
                              layout="column"
                              style={{
                                alignItems: 'left',
                                alignSelf: 'left',
                                width: windowWidth,
                                textAlign: 'left',
                                flex: 1,
                              }}
                              borderColor={COLORS.yellow}
                              color={COLORS.yellow}
                            />
                          )}
                        </View>
                      </View>

                      {isLoading ? (
                        <CustomLoaderSmall />
                      ) : (
                        <Pressable
                          style={styles.submitButton}
                          onPress={() => handleSubmitNewsItem()}>
                          <Text style={styles.textStyle}>SUBMIT NEWS POST</Text>
                        </Pressable>
                      )}
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          backgroundColor: '#2196F3',
                          padding: 10,
                          // width: windowWidth - 10,
                          width: '100%',
                          marginBottom: 10,
                          alignSelf: 'center',
                          borderRadius: 5,
                        }}>
                        <Text style={{color: '#fff', textAlign: 'center'}}>
                          PAYMENT FOR NEWS ITEM
                        </Text>
                      </View>
                      <View>
                        <Text>
                          You are paying ${billing.amount} for {billing.name}{' '}
                          NEWS POST
                        </Text>
                      </View>
                      <CreditCardInput
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        validColor="#fff"
                        invalidColor="red"
                        requiresName={true}
                        allowScroll={true}
                        placeholderColor="#ccc"
                        onChange={_onChange}
                      />

                      {isLoading ? (
                        <CustomLoaderSmall />
                      ) : (
                        <Pressable
                          style={styles.submitButton}
                          onPress={() => handleProcessNewsPayment()}>
                          <Text style={styles.textStyle}>MAKE PAYMENT</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  {itemType === 'JOB' ? (
                    <View style={{padding: 10}}>
                      {!isRequiringPayment ? (
                        <View>
                          <View
                            style={{
                              backgroundColor: '#252e44',
                              padding: 10,
                              // width: windowWidth - 10,
                              width: '100%',
                              marginBottom: 10,
                              alignSelf: 'center',
                              borderRadius: 5,
                            }}>
                            <Text style={{color: '#fff', textAlign: 'center'}}>
                              POSTING JOB ITEM
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.modalText}>
                              Company/ Business Name: {businessName}
                            </Text>
                            <Text style={styles.modalText}>Title: {title}</Text>
                            <Text style={styles.modalText}>
                              Category: {jobCategory}
                            </Text>
                            <Text style={styles.modalText}>
                              Description: {description}
                            </Text>
                            <Text style={styles.modalText}>
                              Wage: {currencyCode ? currencyCode : '$'} {wage}
                            </Text>
                            <Text style={styles.modalText}>
                              Address: {address}
                            </Text>
                            <Text style={styles.modalText}>
                              Phone: +{countryCode} -{phoneNumber}
                            </Text>
                            <Text style={styles.modalText}>Email: {email}</Text>
                            <Text style={styles.modalText}>
                              Website: {website}
                            </Text>
                            <View>
                              {photo === '' ? (
                                <View></View>
                              ) : (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                  }}>
                                  <Image
                                    source={{uri: photo.uri}}
                                    style={{
                                      width: windowWidth - 100,
                                      height: 200,
                                    }}
                                  />
                                </View>
                              )}
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              {isLoading ? (
                                <CustomLoaderSmall />
                              ) : (
                                <RadioGroup
                                  radioButtons={radioPostButtons}
                                  onPress={onPressPostButton}
                                  layout="column"
                                  style={{
                                    alignItems: 'left',
                                    alignSelf: 'left',
                                    width: windowWidth,
                                    textAlign: 'left',
                                    flex: 1,
                                  }}
                                  borderColor={COLORS.yellow}
                                  color={COLORS.yellow}
                                />
                              )}
                            </View>
                          </View>

                          {isLoading ? (
                            <CustomLoaderSmall />
                          ) : (
                            <Pressable
                              style={styles.submitButton}
                              onPress={() => handleSubmitJobItem()}>
                              <Text style={styles.textStyle}>
                                SUBMIT JOB POST
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      ) : (
                        <View>
                          <View
                            style={{
                              backgroundColor: '#252e44',
                              padding: 10,
                              // width: windowWidth - 10,
                              width: '100%',
                              marginBottom: 10,
                              alignSelf: 'center',
                              borderRadius: 5,
                            }}>
                            <Text style={{color: '#fff', textAlign: 'center'}}>
                              PAYMENT FOR JOB ITEM
                            </Text>
                          </View>
                          <View>
                            <Text>
                              You are paying ${billing.amount} for{' '}
                              {billing.name} JOB POST
                            </Text>
                          </View>
                          <CreditCardInput
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                            labelStyle={styles.labelStyle}
                            validColor="#fff"
                            invalidColor="red"
                            requiresName={true}
                            allowScroll={true}
                            placeholderColor="#ccc"
                            onChange={_onChange}
                          />

                          {isLoading ? (
                            <CustomLoaderSmall />
                          ) : (
                            <Pressable
                              style={styles.submitButton}
                              onPress={() => handleProcessJobPayment()}>
                              <Text style={styles.textStyle}>MAKE PAYMENT</Text>
                            </Pressable>
                          )}
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      {itemType === 'BUSINESS' ? (
                        <View style={{padding: 10}}>
                          {!isRequiringPayment ? (
                            <View>
                              <View
                                style={{
                                  backgroundColor: '#a90217',
                                  padding: 10,
                                  // width: windowWidth - 10,
                                  width: '100%',
                                  marginBottom: 10,
                                  alignSelf: 'center',
                                  borderRadius: 5,
                                }}>
                                <Text
                                  style={{color: '#fff', textAlign: 'center'}}>
                                  POSTING BUSINESS ITEM
                                </Text>
                              </View>
                              <View>
                                <Text style={styles.modalText}>
                                  Business Name: {businessName}
                                </Text>
                                <Text style={styles.modalText}>
                                  Category: {businessCategory}
                                </Text>
                                <Text style={styles.modalText}>
                                  Description: {description}
                                </Text>
                                <Text style={styles.modalText}>
                                  Address: {address}
                                </Text>
                                <Text style={styles.modalText}>
                                  Phone: {countryCode} -{phoneNumber}
                                </Text>
                                <Text style={styles.modalText}>
                                  Email: {email}
                                </Text>
                                <Text style={styles.modalText}>
                                  Website: {website}
                                </Text>
                                <View>
                                  {photo === '' ? (
                                    <View></View>
                                  ) : (
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                      }}>
                                      <Image
                                        source={{uri: photo.uri}}
                                        style={{
                                          width: windowWidth - 100,
                                          height: 200,
                                        }}
                                      />
                                    </View>
                                  )}
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                  }}>
                                  {isLoading ? (
                                    <CustomLoaderSmall />
                                  ) : (
                                    <RadioGroup
                                      radioButtons={radioPostButtons}
                                      onPress={onPressPostButton}
                                      layout="column"
                                      style={{
                                        alignItems: 'left',
                                        alignSelf: 'left',
                                        width: windowWidth,
                                        textAlign: 'left',
                                        flex: 1,
                                      }}
                                      borderColor={COLORS.yellow}
                                      color={COLORS.yellow}
                                    />
                                  )}
                                </View>
                              </View>

                              {isLoading ? (
                                <CustomLoaderSmall />
                              ) : (
                                <Pressable
                                  style={styles.submitButton}
                                  onPress={() => handleSubmitBusinessItem()}>
                                  <Text style={styles.textStyle}>
                                    SUBMIT BUSINESS POST
                                  </Text>
                                </Pressable>
                              )}
                            </View>
                          ) : (
                            <View>
                              <View
                                style={{
                                  backgroundColor: '#a90217',
                                  padding: 10,
                                  // width: windowWidth - 10,
                                  width: '100%',
                                  marginBottom: 10,
                                  alignSelf: 'center',
                                  borderRadius: 5,
                                }}>
                                <Text
                                  style={{color: '#fff', textAlign: 'center'}}>
                                  PAYMENT FOR BUSINESS ITEM
                                </Text>
                              </View>
                              <View>
                                <Text>
                                  You are paying ${billing.amount} for{' '}
                                  {billing.name} BUSINESS POST
                                </Text>
                              </View>
                              <CreditCardInput
                                inputContainerStyle={styles.inputContainerStyle}
                                inputStyle={styles.inputStyle}
                                labelStyle={styles.labelStyle}
                                validColor="#fff"
                                invalidColor="red"
                                requiresName={true}
                                allowScroll={true}
                                placeholderColor="#ccc"
                                onChange={_onChange}
                              />

                              {isLoading ? (
                                <CustomLoaderSmall />
                              ) : (
                                <Pressable
                                  style={styles.submitButton}
                                  onPress={() =>
                                    handleProcessBusinessPayment()
                                  }>
                                  <Text style={styles.textStyle}>
                                    MAKE PAYMENT
                                  </Text>
                                </Pressable>
                              )}
                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={{padding: 10}}>
                          {!isRequiringPayment ? (
                            <View>
                              <View
                                style={{
                                  backgroundColor: '#084502',
                                  padding: 10,
                                  // width: windowWidth - 10,
                                  width: '100%',
                                  marginBottom: 10,
                                  alignSelf: 'center',
                                  borderRadius: 5,
                                }}>
                                <Text
                                  style={{color: '#fff', textAlign: 'center'}}>
                                  POSTING EVENT ITEM
                                </Text>
                              </View>
                              <View>
                                <Text style={styles.modalText}>
                                  Title: {title}
                                </Text>
                                <Text style={styles.modalText}>
                                  Category: {eventCategory}
                                </Text>
                                <Text style={styles.modalText}>
                                  Fee: {currencyCode ? currencyCode : ''} {fee}
                                </Text>
                                <Text style={styles.modalText}>
                                  Description: {description}
                                </Text>
                                <Text style={styles.modalText}>
                                  Address: {address}
                                </Text>
                                <Text style={styles.modalText}>
                                  Phone: {countryCode} -{phoneNumber}
                                </Text>
                                <Text style={styles.modalText}>
                                  Email: {email}
                                </Text>
                                <Text style={styles.modalText}>
                                  Website: {website}
                                </Text>
                                <View>
                                  {photo === '' ? (
                                    <View></View>
                                  ) : (
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                      }}>
                                      <Image
                                        source={{uri: photo.uri}}
                                        style={{
                                          width: windowWidth - 100,
                                          height: 200,
                                        }}
                                      />
                                    </View>
                                  )}
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                  }}>
                                  {isLoading ? (
                                    <CustomLoaderSmall />
                                  ) : (
                                    <RadioGroup
                                      radioButtons={radioPostButtons}
                                      onPress={onPressPostButton}
                                      layout="column"
                                      style={{
                                        alignItems: 'left',
                                        alignSelf: 'left',
                                        width: windowWidth,
                                        textAlign: 'left',
                                        flex: 1,
                                      }}
                                      borderColor={COLORS.yellow}
                                      color={COLORS.yellow}
                                    />
                                  )}
                                </View>
                              </View>

                              {isLoading ? (
                                <CustomLoaderSmall />
                              ) : (
                                <Pressable
                                  style={styles.submitButton}
                                  onPress={() => handleSubmitEventItem()}>
                                  <Text style={styles.textStyle}>
                                    SUBMIT EVENT POST
                                  </Text>
                                </Pressable>
                              )}
                            </View>
                          ) : (
                            <View>
                              <View
                                style={{
                                  backgroundColor: '#084502',
                                  padding: 10,
                                  // width: windowWidth - 10,
                                  width: '100%',
                                  marginBottom: 10,
                                  alignSelf: 'center',
                                  borderRadius: 5,
                                }}>
                                <Text
                                  style={{color: '#fff', textAlign: 'center'}}>
                                  PAYMENT FOR EVENT ITEM
                                </Text>
                              </View>
                              <View>
                                <Text>
                                  You are paying ${billing.amount} for{' '}
                                  {billing.name} EVENT POST
                                </Text>
                              </View>
                              <CreditCardInput
                                inputContainerStyle={styles.inputContainerStyle}
                                inputStyle={styles.inputStyle}
                                labelStyle={styles.labelStyle}
                                validColor="#fff"
                                invalidColor="red"
                                requiresName={true}
                                allowScroll={true}
                                placeholderColor="#ccc"
                                onChange={_onChange}
                              />

                              {isLoading ? (
                                <CustomLoaderSmall />
                              ) : (
                                <Pressable
                                  style={styles.submitButton}
                                  onPress={() => handleProcessEventPayment()}>
                                  <Text style={styles.textStyle}>
                                    MAKE PAYMENT
                                  </Text>
                                </Pressable>
                              )}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={{width: 200, alignSelf: 'center', padding: 20}}
                onPress={() => handleDismissModal()}>
                <Text style={{color: COLORS.gray, textAlign: 'center'}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
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

// export default NewItem;
