/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, I18nManager } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_menu from '../assets/icon/ic_menu.png';
import ic_back from '../assets/icon/ic_back.png';
import ic_man from '../assets/icon/ic_man.png';
import login_icon from '../assets/icon/login.png';
import brand_logo from '../assets/icon/brand_logo.png';

// User Preference
import { async_keys, getData } from '../api/UserPreference';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/image/logo.png';

import { useTranslation } from 'react-i18next';
import english_icon from '../assets/image/english.png';
import qatar_icon from '../assets/image/qatar.png';

// rtl
import RNRestart from 'react-native-restart';

// API Info
import { BASE_URL, makeRequest, STORAGE_URL } from '../api/ApiInfo';
import { LoginContext } from '../context/LoginContext';
const HeaderComponent = props => {

  const { t, i18n } = useTranslation();

  const [img, setImg] = useState('');
  const [defualtAvatar, setDefaultAvatar] = useState(login_icon);
  const { nav, title, navAction } = props;
  // let {isLogin} = React.useContext(LoginContext);
  const toggleDrawer = () => {
    nav.openDrawer();
  };

  useEffect(() => {

    AsyncStorage.getItem('guestCheckoutSuccess').then((guestCheckoutSuccess) => {

      if (guestCheckoutSuccess == '"yes"') {
        setDefaultAvatar(ic_man);

      } else {

        AsyncStorage.getItem('avatar').then((avatar) => {
          avatar = avatar?.replace(/['"]+/g, '')
          if (avatar !== 'users/default.png') {
            setImg(avatar);
          } else {
            setDefaultAvatar(ic_man);
          }
        })
      }

    })


  }, [img])


  const handleBack = async () => {
    nav.pop();
  };

  let navIcon = ic_menu;
  let handleNavAction = toggleDrawer;

  if (navAction === 'back') {
    navIcon = ic_back;
    handleNavAction = handleBack;
  }


  const handleProfile = async () => {
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    if (token === null) {
      nav.navigate('Login');
    } else {
      nav.navigate('Profile');
    }
  };


  return (
    <View style={styles.headerContainer}>
      <View style={styles.menuItems}>
        <TouchableOpacity
          onPress={handleNavAction}
          style={styles.menuIconContainer}>
          <Image source={navIcon} resizeMode="cover" style={styles.backIcon} />
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          value={props.value}
        >
          {title}
        </Text>
      </View>

      <View style={[styles.menuItems, styles.menuItemsCenter]}>
        <Image
          source={brand_logo}
          resizeMode="cover"
          style={styles.brandIcon}
        />
      </View>

      <View style={[styles.menuContainer, styles.menuItems]}>

        <TouchableOpacity
          onPress={() => {
            i18n
              .changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')
              .then(() => {
                I18nManager.forceRTL(i18n.language === 'ar');
                RNRestart.Restart();
              });
          }}
          activeOpacity={1}
          style={styles.languageSwitch}>
          {(i18n.language === 'en') ?
            <Image
              source={english_icon}
              resizeMode="cover"
              style={styles.cartIconStyle}
            /> : 
            <Image
              source={qatar_icon}
              resizeMode="cover"
              style={styles.cartIconStyle}
            />
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleProfile}
          activeOpacity={1}
          style={styles.notificationIconContainer}>
          {(img) ?
            <Image
              source={{ uri: STORAGE_URL+`${img}` }}
              resizeMode="cover"
              style={styles.cartIconStyle}
            /> : 
            <Image
              source={defualtAvatar}
              resizeMode="cover"
              style={styles.cartIconStyle}
            />
          }
        </TouchableOpacity>
      </View>

      
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    paddingHorizontal: wp(2),
    backgroundColor: '#000',
  },
  menuIconContainer: {
    padding: wp(2),
  },
  backIcon: {
    width: wp(5),
    height: wp(5),
  },
  cartIconStyle: {
    width: wp(6),
    height: wp(6),
    aspectRatio: 1 / 1,
    borderRadius: wp(20),
  },
  brandIcon: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(8),
    height: wp(8),
    aspectRatio: 1 / 1,
    borderRadius: wp(20),
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp(4.4),
    marginLeft: wp(1.2),
  },
  cartContainer: {
    position: 'absolute',
    top: hp(0.5),
    left: wp(7),
    backgroundColor: 'red',
    borderRadius: wp(10),
    height: hp(2),
    width: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    fontSize: wp(2.5),
    color: '#fff',
    textAlign: 'center',
  },
  notificationIconContainer: {
    padding: wp(2),
  },
  languageSwitch: {
    padding: wp(2),
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  menuItems: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItemsCenter: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    
  },
  notificationIcon: {
    width: wp(5.6),
    height: wp(5.6),
  },
  notificationBadgeContainer: {
    width: wp(3.3),
    height: wp(3.3),
    backgroundColor: 'red',
    borderRadius: wp(1.7),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: wp(2),
    left: wp(2),
  },
  notificationBadge: {
    color: '#fff',
    fontSize: wp(2.2),
    textAlign: 'center',
  },
  profileImage: {
    width: wp(30),
    height: wp(10),
    marginLeft: wp(2)
  },
});
