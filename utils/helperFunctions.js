import {currencySymbols} from './data';
import {
  Linking
} from 'react-native';

/* eslint-disable prettier/prettier */
export function titleCase(str) {
  if (str === undefined) return null;
  if (str.length === 0) return str;
  return str.toLowerCase().replace(/(^|\s)(\w)/g, x => x.toUpperCase());
}

export function upperCase(str) {
  if (str === undefined) return null;
  if (str.length === 0) return str;
  return str.toUpperCase();
}

export function trimDate(str) {
  if (str === undefined || str === null) return null;
  return str.substring(0, 10);
}

export function numberWithCommas(number) {
  if (number === undefined) return null;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function trimString(str, start, end) {
  if (str === undefined || str === null) return null;
  return str.substring(start, end);
}

export function limitStringLength(str, start, end) {
  if (str === undefined || str === null) return null;
  if (str.length < end) {
    return str;
  } else {
    let modifiedStr = str.substring(start, end) + ' ...';
    return modifiedStr;
  }
}

export function isOnLine() {
  return navigator.onLine;
}

// export function timeAgo(input) {
//   const date = input instanceof Date ? input : new Date(input);
//   const formatter = new Intl.RelativeTimeFormat('en');
//   const ranges = {
//     years: 3600 * 24 * 365,
//     months: 3600 * 24 * 30,
//     weeks: 3600 * 24 * 7,
//     days: 3600 * 24,
//     hours: 3600,
//     minutes: 60,
//     seconds: 1,
//   };
//   const secondsElapsed = (date.getTime() - Date.now()) / 1000;
//   for (let key in ranges) {
//     if (ranges[key] < Math.abs(secondsElapsed)) {
//       const delta = secondsElapsed / ranges[key];
//       return formatter.format(Math.round(delta), key);
//     }
//   }
// }

// export function timeSince(date) {
//   var seconds = Math.floor((new Date() - date) / 1000);

//   var interval = Math.floor(seconds / 31536000);

//   if (interval > 1) {
//     return interval + ' years';
//   }
//   interval = Math.floor(seconds / 2592000);
//   if (interval > 1) {
//     return interval + ' months';
//   }
//   interval = Math.floor(seconds / 86400);
//   if (interval > 1) {
//     return interval + ' days';
//   }
//   interval = Math.floor(seconds / 3600);
//   if (interval > 1) {
//     return interval + ' hours';
//   }
//   interval = Math.floor(seconds / 60);
//   if (interval > 1) {
//     return interval + ' minutes';
//   }
//   return Math.floor(seconds) + ' seconds';
// }

export function sumOfArray(arr) {
  let numArr = arr.map(elem => parseFloat(elem));
  return numArr.reduce((pv, cv) => pv + cv);
}

export function averageOfArray(arr) {
  let numArr = arr.map(elem => parseFloat(elem));
  return (numArr.reduce((pv, cv) => pv + cv) / arr.length).toFixed(2);
}

export function dateManipulator(d) {
  let firstTwo = d.charAt(0) + d.charAt(1);
  let digits = parseInt(firstTwo);
  let timePeriod = '',
    digit00 = '';
  if (digits < 12) {
    digit00 = digits;
    timePeriod = 'AM';
  } else {
    digit00 = digits - 12;
    timePeriod = 'PM';
  }
  let lastTwo = d.charAt(3) + d.charAt(4);
  return digit00 + ':' + lastTwo + timePeriod;
}

export function currencySymbolConverter(initial ="USD") {
  // Handle null parameter 
  if(!initial || initial === undefined || initial === "") return ""

  // const currencySymbols = currencySymbols;
  const selCurrency = [initial];
  const filteredCurrencies = Object.keys(currencySymbols)
    .filter(key => selCurrency.includes(key))
    .reduce((obj, key) => {
      obj[key] = currencySymbols[key];
      return obj;
    }, {});

  return Object.values(filteredCurrencies)[0];
}

export function openURL(website){
  if(website.startsWith("https://") || website.startsWith("http://")){
    return Linking.openURL(website)
  }else{    
    return Linking.openURL(`https://${website}`)
  }  
}
