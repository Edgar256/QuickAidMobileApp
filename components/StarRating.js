import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {COLORS, images, SIZES} from '../constants';
import StarActive from '../assets/svgs/star-active.svg';
import StarHalfActive from '../assets/svgs/star-half-active.svg';
import Star from '../assets/svgs/star.svg';

export default function StarRating(props) {
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{flexDirection: 'row', flex: 1}}>
        {props.rating >= 0 && props.rating < 0.5 ? (
          <View style={{flexDirection: 'row', paddingVertical: 3}}>
            <Star width={20} height={20} />
            <Star width={20} height={20} />
            <Star width={20} height={20} />
            <Star width={20} height={20} />
            <Star width={20} height={20} />
            <Text style={styles.text}>{props.rating}</Text>
          </View>
        ) : (
          <View>
            {props.rating >= 0.5 && props.rating < 1 ? (
              <View style={{flexDirection: 'row', paddingVertical: 3}}>
                <StarHalfActive width={20} height={20} />
                <Star width={20} height={20} />
                <Star width={20} height={20} />
                <Star width={20} height={20} />
                <Star width={20} height={20} />
                <Text style={styles.text}>{props.rating}</Text>
              </View>
            ) : (
              <View>
                {props.rating >= 1 && props.rating < 1.5 ? (
                  <View style={{flexDirection: 'row', paddingVertical: 3}}>
                    <StarActive width={20} height={20} />
                    <Star width={20} height={20} />
                    <Star width={20} height={20} />
                    <Star width={20} height={20} />
                    <Star width={20} height={20} />
                    <Text style={styles.text}>{props.rating}</Text>
                  </View>
                ) : (
                  <View>
                    {props.rating >= 1.5 && props.rating < 2 ? (
                      <View style={{flexDirection: 'row', paddingVertical: 3}}>
                        <StarActive width={20} height={20} />
                        <StarHalfActive width={20} height={20} />
                        <Star width={20} height={20} />
                        <Star width={20} height={20} />
                        <Star width={20} height={20} />
                        <Text style={styles.text}>{props.rating}</Text>
                      </View>
                    ) : (
                      <View>
                        {props.rating >= 2 && props.rating < 2.5 ? (
                          <View
                            style={{flexDirection: 'row', paddingVertical: 3}}>
                            <StarActive width={20} height={20} />
                            <StarActive width={20} height={20} />
                            <Star width={20} height={20} />
                            <Star width={20} height={20} />
                            <Star width={20} height={20} />
                            <Text style={styles.text}>{props.rating}</Text>
                          </View>
                        ) : (
                          <View>
                            {props.rating >= 2.5 && props.rating < 3 ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  paddingVertical: 3,
                                }}>
                                <StarActive width={20} height={20} />
                                <StarActive width={20} height={20} />
                                <StarHalfActive width={20} height={20} />
                                <Star width={20} height={20} />
                                <Star width={20} height={20} />
                                <Text style={styles.text}>{props.rating}</Text>
                              </View>
                            ) : (
                              <View>
                                {props.rating >= 3 && props.rating < 3.5 ? (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      paddingVertical: 3,
                                    }}>
                                    <StarActive width={20} height={20} />
                                    <StarActive width={20} height={20} />
                                    <StarActive width={20} height={20} />
                                    <Star width={20} height={20} />
                                    <Star width={20} height={20} />
                                    <Text style={styles.text}>
                                      {props.rating}
                                    </Text>
                                  </View>
                                ) : (
                                  <View>
                                    {props.rating >= 3.5 && props.rating < 4 ? (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          paddingVertical: 3,
                                        }}>
                                        <StarActive width={20} height={20} />
                                        <StarActive width={20} height={20} />
                                        <StarActive width={20} height={20} />
                                        <StarHalfActive
                                          width={20}
                                          height={20}
                                        />
                                        <Star width={20} height={20} />
                                        <Text style={styles.text}>
                                          {props.rating}
                                        </Text>
                                      </View>
                                    ) : (
                                      <View>
                                        {props.rating >= 4 &&
                                        props.rating < 4.5 ? (
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              paddingVertical: 3,
                                            }}>
                                            <StarActive
                                              width={20}
                                              height={20}
                                            />
                                            <StarActive
                                              width={20}
                                              height={20}
                                            />
                                            <StarActive
                                              width={20}
                                              height={20}
                                            />
                                            <StarActive
                                              width={20}
                                              height={20}
                                            />
                                            <Star width={20} height={20} />
                                            <Text style={styles.text}>
                                              {props.rating}
                                            </Text>
                                          </View>
                                        ) : (
                                          <View>
                                            {props.rating >= 4.5 &&
                                            props.rating < 5 ? (
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  paddingVertical: 3,
                                                }}>
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarHalfActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <Text style={styles.text}>
                                                  {props.rating}
                                                </Text>
                                              </View>
                                            ) : (
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  paddingVertical: 3,
                                                }}>
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <StarActive
                                                  width={20}
                                                  height={20}
                                                />
                                                <Text style={styles.text}>
                                                  {props.rating}
                                                </Text>
                                              </View>
                                            )}
                                          </View>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        <Text
          style={{
            color: COLORS.white,
            flex: 1,
            flexDirection: 'row',
            fontSize: SIZES.normal,
          }}>
          {props.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 3,
    color: COLORS.white,
  },
});
