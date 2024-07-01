import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const COLORS = {
  // base colors
  success: '#FFCC09',
  red: '#EB2226',
  orange: '#F89A1E',
  yellow: '#F0E91A',

  primary: '#DF3A26',
  secondary: '#EE4D9C',
  danger: '#ED1C24',
  lightGreen:"#00ff3c8c",
  
  // colors
  black: '#0A0A0A',
  blackLight: '#333332',
  blackOpacity: '#00000087',
  lightGray: '#E5E5E5',
  white: '#FFFFFF',
  gray: '#989997',
  grayDark: '#56584A',
  green: '#43ae60',
  maroon: '#AF1E23',
};

export const SIZES = {
  // global styles
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  small: 9,
  normal: 12,
  text1: 12,
  text2: 14,
  text3: 16,
  text4: 18,
  text5: 20,
  text6: 22,
  text7: 24,
  text8: 26,

  // app dimensions
  windowWidth,
  windowHeight,
};

export const FONTS = {
  // font styling
  h1: {fontFamily: 'FSAlbert-Bold', fontSize: SIZES.h1, lineHeight: 30},
  h2: {fontFamily: 'FSAlbert-Bold', fontSize: SIZES.h2, lineHeight: 22},
  h3: {fontFamily: 'FSAlbert-Bold', fontSize: SIZES.h3, lineHeight: 16},
  h4: {fontFamily: 'FSAlbert-Bold', fontSize: SIZES.h4, lineHeight: 14},
  body1: {
    fontFamily: 'FSAlbert-Bold',
    fontSize: SIZES.body1,
    lineHeight: 30,
  },
  body2: {
    fontFamily: 'FSAlbert-Bold',
    fontSize: SIZES.body2,
    lineHeight: 22,
  },
  body3: {
    fontFamily: 'FSAlbert-Bold',
    fontSize: SIZES.body3,
    lineHeight: 16,
  },
  body4: {
    fontFamily: 'FSAlbert-Bold',
    fontSize: SIZES.body4,
    lineHeight: 14,
  },
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
