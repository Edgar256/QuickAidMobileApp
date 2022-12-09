import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

// CUSTOM IMPORTS
import {COLORS, images, SIZES} from '../constants';
import Location from '../assets/svgs/location-white.svg';
import PhoneRinging from '../assets/svgs/phone-ringing.svg';
import EventsIcon from '../assets/svgs/events-white.svg';
import Star from '../assets/svgs/star.svg';
import Review from '../components/Review';

export default function EventProfileReviews({navigation}) {
  return (
    <View style={styles.container}>
      {/* <TopProfileNavigation
        navigation={navigation}
        header="UGANDAN MUSIC FESTIVAL, NEWYORK"
      /> */}
      <ScrollView>
        <ImageBackground source={images.Lady} style={styles.bgImage}>
          <View style={styles.overlayText}>
          <View style={styles.imageText}>
              <EventsIcon width={20} height={20} style={styles.icon} />
              <Text style={{color:COLORS.white, fontSize:SIZES.text1, flex:1}}>Starts xx/xx/xxxx - </Text>
              <Text style={{color:COLORS.white, fontSize:SIZES.text1, flex:1}}>Ends xx/xx/xxxx</Text>
            </View>
            <View style={styles.imageText}>
              <Location width={20} height={20} style={styles.icon} />
              <Text style={{color:COLORS.white, fontSize:SIZES.text1, flex:1}}>
                1600 Amphitheatre Parkwat in Moutain View, California, USA
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.btnContainer}>
          <View style={styles.btnContainerInner}>
            <TouchableOpacity style={styles.buttonCall}>
              <PhoneRinging width={20} height={20} />
              <Text>Call</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainerInner}>
            <TouchableOpacity style={styles.buttonMessage}>
              <Text style={{color: COLORS.yellow}}>Attend</Text>
              <PhoneRinging width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{padding: 10}}>
          <Text style={styles.description}>
            Coffee Place Company, add a description here
          </Text>
        </View>
        <View style={{padding: 10}}>
          <TouchableOpacity style={styles.buttonComment}>
            <Text style={{flex: 1, color: COLORS.white, textAlign: 'center'}}>
              Reviews
            </Text>
            <View>
              <Text style={{color: COLORS.green}}>12</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{padding: 10}}>
          <Review
            image={images.Office}
            name="Agnes Nandutu"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat."
          />
        </View>
        <View style={{padding: 10, marginBottom: 40, paddingBottom: 40}}>
          <Text style={{flex: 1, color: COLORS.white, fontSize: SIZES.text2}}>
            Leave your review here !
          </Text>
          <View style={styles.comment}>
            <Image source={images.Lady} style={styles.imageComment} />
            <View style={{flexDirection: 'column', flex: 1}}>
              <Text style={{fontSize: 16, color: COLORS.white}}>
                Agness Nandutu
              </Text>
              <View style={{flexDirection: 'row', paddingVertical: 3}}>
                <Star width={20} height={20} />
                <Star width={20} height={20} />
                <Star width={20} height={20} />
                <Star width={20} height={20} />
                <Star width={20} height={20} />
              </View>
              <TextInput
                placeholder="Leave your review here"
                color={COLORS.white}
                multiline={true}
                numberOfLines={2}
                style={{
                  borderColor: COLORS.white,
                  borderWidth: 1,
                  flex: 1,
                  width: '100%',
                  color: COLORS.white,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayDark,
    width: '100%',
    height: '100%',
  },
  filter: {
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: COLORS.blackLight,
  },
  description: {
    color: COLORS.white,
    fontSize: SIZES.text1,
  },
  fillterText: {
    color: COLORS.white,
  },
  active: {
    backgroundColor: COLORS.yellow,
  },
  containerSlider: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  bgImage: {
    height: 300,
    width: '100%',
  },
  overlayText: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.blackOpacity,
    padding: 10,
  },
  textWhite: {
    color: COLORS.white,
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
  buttonCall: {
    padding: 10,
    backgroundColor: COLORS.yellow,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonMessage: {
    padding: 10,
    backgroundColor: COLORS.black,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonComment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.white,
    padding: 10,
  },
  comment: {
    flexDirection: 'row',
  },
  imageComment: {
    width: 70,
    height: 70,
    borderRadius: 70,
    marginRight: 10,
  },
});
