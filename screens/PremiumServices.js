import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLORS, images, SIZES} from '../constants';

export default function PremiumServices({navigation}) {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{flexDirection: 'column', padding: 20}}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: SIZES.text2,
              textAlign: 'center',
            }}>
            You can reach more Clients!!
          </Text>
          <Text
            style={{
              color: COLORS.yellow,
              fontSize: SIZES.normal,
              textAlign: 'center',
            }}>
            Get 10X, 25x, or 50x more clients with PREMIUM SERVICES
          </Text>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={{width: '100%', padding: 4}}>
              <View
                style={{
                  backgroundColor: COLORS.yellow,
                  marginTop: 20,
                  padding: 5,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '700'}}>FREEMIUM</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Get upto 10X clients reach
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Let Business, Event , Job or News Announcement be seen by
                  people in your community
                </Text>
              </View>
            </View>
            <View style={{width: '100%', padding: 4}}>
              <View
                style={{
                  backgroundColor: '#09f618',
                  marginTop: 20,
                  padding: 5,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '700'}}>PREMIUM</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Get upto 25X clients reach
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Let Business, Event , Job or News Announcement be seen by
                  people in your desired community
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Get analytics for your Business, Event , Job or News
                  Announcement
                </Text>
              </View>
            </View>
            <View style={{width: '100%', padding: 4}}>
              <View
                style={{
                  backgroundColor: '#f24f07',
                  marginTop: 20,
                  padding: 5,
                  borderRadius: 8,
                  alignItems: 'center',
                }}>
                <Text>VIP</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Get upto 50X clients reach
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Let Business, Event , Job or News Announcement be seen by
                  people in your all communities
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Get analytics for your Business, Event , Job or News
                  Announcement
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textYellow}>- </Text>
                <Text style={styles.textYellow}>
                  Your Business, Event , Job or News Announcement appaers in
                  carousel in the listing page.
                </Text>
              </View>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={{
                marginVertical: 50,
                padding: 12,
                backgroundColor: COLORS.black,
                borderRadius: 10,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('CreateNewCommunityItem')}>
              <Text style={{color: COLORS.yellow}}>CREATE A POST NOW</Text>
            </TouchableOpacity>
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
  textYellow: {
    color: COLORS.yellow,
    fontSize: SIZES.text1,
  },
});
