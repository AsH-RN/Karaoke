/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {COLORS} from './Color';
import {FONTS} from './Font';
import {IMAGES} from './Images';

const HeaderComponent = props => {
  const handleBack = () => {
    alert('Pressed Back!');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack}>
        <IonIcons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Image
        source={IMAGES.badge}
        resizeMode="cover"
        style={styles.badgeIcon}
      />

      <Text style={styles.points}>2903 PTS</Text>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  header: {
    height: hp(7),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
  badgeIcon: {
    width: hp(4.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(10),
  },
  points: {
    fontSize: wp(3.9),
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
  },
});
