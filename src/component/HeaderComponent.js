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
// import brand_logo from '../assets/icon/brand_logo.png';
import brand_logo from '../assets/image/logo.png';


// User Preference
import { async_keys, getData, storeData } from '../api/UserPreference';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next';

import DropDownPicker from 'react-native-dropdown-picker';

// rtl
import RNRestart from 'react-native-restart';

// API Info
import { STORAGE_URL } from '../api/ApiInfo';
import { t } from 'i18next';
const HeaderComponent = props => {

  const { i18n } = useTranslation();

  const [img, setImg] = useState('');
  const [defualtAvatar, setDefaultAvatar] = useState(login_icon);
  const { nav, title, navAction } = props;
  // let {isLogin} = React.useContext(LoginContext);
  const toggleDrawer = () => {
    nav.openDrawer();
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(i18n.language);
  const [items, setItems] = useState([
    {label: 'English', value: "en", icon: () => <Image source={require('../assets/image/en.png')} style={styles.iconStyle} />},
    {label: 'Qatar', value: "ar", icon: () => <Image source={require('../assets/image/ar.png')} style={styles.iconStyle} />},
    {label: 'Germany', value: "de", icon: () => <Image source={require('../assets/image/de.png')} style={styles.iconStyle} />},
    {label: 'France', value: "fr", icon: () => <Image source={require('../assets/image/fr.png')} style={styles.iconStyle} />},
    {label: 'Spain', value: "es", icon: () => <Image source={require('../assets/image/es.png')} style={styles.iconStyle} />},
    {label: 'India', value: "hi", icon: () => <Image source={require('../assets/image/hi.png')} style={styles.iconStyle} />},
    {label: 'Italy', value: "it", icon: () => <Image source={require('../assets/image/it.png')} style={styles.iconStyle} />},
    {label: 'Japan', value: "ja", icon: () => <Image source={require('../assets/image/ja.png')} style={styles.iconStyle} />},
    {label: 'Nederland', value: "nl", icon: () => <Image source={require('../assets/image/nl.png')} style={styles.iconStyle} />},
    {label: 'Portugal', value: "pt", icon: () => <Image source={require('../assets/image/pt.png')} style={styles.iconStyle} />},
    {label: 'Russia', value: "ru", icon: () => <Image source={require('../assets/image/ru.png')} style={styles.iconStyle} />},
    {label: 'China', value: "zh_CN", icon: () => <Image source={require('../assets/image/cn.png')} style={styles.iconStyle} />},
  ]);

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
  
  const changeLanguage = async (value) => {
    console.log('changeLanguage', value);
    await storeData(async_keys.userLang, value);

    i18n
    .changeLanguage(value)
    .then(() => {
      I18nManager.forceRTL(value == 'ar');
      RNRestart.Restart();
    });
  };


  return (
    <View style={styles.headerContainer}>
      <View style={[styles.menuItems]}>
        <TouchableOpacity
          onPress={handleNavAction}
          style={styles.menuIconContainer}>
          <Image source={navIcon} resizeMode="cover" style={styles.backIcon} />
        </TouchableOpacity>
        <Image
          source={brand_logo}
          style={styles.brandIcon}
        />
      </View>

      <View style={[styles.menuContainer, styles.menuItems]}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={(value) => {changeLanguage(value)}}
          zIndex={99999}
          containerStyle={styles.languageSwitch}
          style={{ backgroundColor: '#000' }}
          listItemContainerStyle={styles.listItemContainerStyle}
          theme="DARK"
          listMode='MODAL'
          modalProps={{animationType: "fade"}}
          modalTitle={t('select_language')}
          modalTitleStyle={{fontWeight: "bold"}}
          hideSelectedItemIcon={true}
          selectedItemContainerStyle={{display: 'none', padding: 0, margin: 0}}
          selectedItemLabelStyle={{padding: 0, margin: 0}}
        />

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
    marginTop: 3,
    width: '50%',
    height: hp(4.5),
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
    width: 100,
    backgroundColor: '#000',
  },
  languageDropdown: {
    backgroundColor:'#000',
  },
  languageDropdownContainer: {
    zIndex: 999999999999,
    // position: 'absolute',
    // top: 1,
  },
  languageDropdownListContainer: {
    zIndex: 999999999999,
    position: 'absolute',
    top: 0,
    left: 10,
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
  iconStyle: {
    width: wp(10),
    height: wp(7),
  },
  listItemContainerStyle: {
    marginBottom: hp(2),
  },
  
});
