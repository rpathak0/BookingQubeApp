/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {Image, StyleSheet, ScrollView, View, Text, Alert, StatusBar} from 'react-native';
import {withTranslation, useTranslation} from 'react-i18next';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {version} from '../../package.json';
import LayoutSize from '../Helper/LayoutSize';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

// Screens
import LoginScreen from '../screen/LoginScreen';
import SignUpScreen from '../screen/SignUpScreen';
import WebViewScreen from '../screen/WebViewScreen';
import WebViewDirectScreen from '../screen/WebViewDirectScreen';
import ForgetPasswordScreen from '../screen/ForgetPasswordScreen';

// Home Screen
import HomeScreen from '../screen/HomeScreen';

import AboutScreen from '../screen/AboutScreen';
import ContactScreen from '../screen/ContactScreen';
import TermsScreen from '../screen/TermsScreen';
import PrivacyScreen from '../screen/PrivacyScreen';
import FaqScreen from '../screen/FaqScreen';

// Event Screen
import EventListScreen from '../screen/EventListScreen';
import ViewEventScreen from '../screen/ViewEventScreen';

// Category Screen
import MoviesScreen from '../screen/MoviesScreen';

// Scan Ticket Screen
import ScanTicketScreen from '../screen/ScanTicketScreen';
import ScanOutScreen from '../screen/ScanOutScreen';

// Profile Screen
import ProfileScreen from '../screen/ProfileScreen';

// MyBooking Screen
import MyBookingScreen from '../screen/MyBookingScreen';
import CheckoutScreen from '../screen/CheckOutScreen';
import AttendeeScreen from '../screen/AttendeeScreen';
import SeatingChartScreen from '../screen/SeatingChartScreen';

// Component
import {showToast} from '../component/CustomToast';

// Logo
import logo from '../assets/image/logo.png';
import homeIcon from '../assets/icon/ic_home.png';
import moviesIcon from '../assets/icon/ic_movies.png';
import eventIcon from '../assets/icon/ic_footer_event.png';
import loginIcon from '../assets/icon/login.png';
import faqIcon from '../assets/icon/faq.png';
import contactIcon from '../assets/icon/contact_us.png';
import termsIcon from '../assets/icon/terms.png';
import privacyIcon from '../assets/icon/privacy.png';
import aboutIcon from '../assets/icon/about_us.png';
import checkinIcon from '../assets/icon/checkin.png';
import checkoutIcon from '../assets/icon/checkout.png';
import logoutIcon from '../assets/icon/logout.png';
import mybookingsIcon from '../assets/icon/mybookings.png';

// User Preference
import {clearData} from '../api/UserPreference';
import {CommonActions, DrawerActions, NavigationContainer} from '@react-navigation/native';
import { useLoginContext } from '../context/LoginContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Routes = ({checkScanning, guestCheckoutSuccess}) => {
  const {t} = useTranslation();

  const {isLogin, type} = useLoginContext();

  const setDrawerItemIcon = itemIcon => (
    <Image source={itemIcon} resizeMode="cover" style={styles.drawerItemIcon} />
  );

  const drawerContentContainerInset = {
    top: 'always',
    horizontal: 'never',
  };

  const CustomDrawerContentComponent = props => {
    const {state, navigation, descriptors} = props;
    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor.options;

    const {
      drawerActiveTintColor,
      drawerInactiveTintColor,
      drawerActiveBackgroundColor,
      drawerInactiveBackgroundColor,
    } = focusedOptions;

    const onLogoutYesPress = (nav, t) => async () => {
      try {
        // Clearing user preferences from local storage
        await clearData();
        showToast(t('logout_success'));
        // Resetting Navigation to initial state for login again
        nav.navigate('LoggedOut');
      } catch (error) {
        console.log(error.message);
      }
    };
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#000' }}>
        <View
          style={styles.drawerContentContainer}
          forceInset={drawerContentContainerInset}>
          <View style={styles.drawerHeader}>
            <Image source={logo} style={styles.profileImage} />
            <Text style={styles.drawerTitle}>{t('welcome_to')}</Text>
          </View>

          {state.routes.map((route, i) => {
            const focused = i === state.index;

            const onPress = () => {
              if (route.name === 'DrawerLogout') {
                Alert.alert(
                  t('logout'),
                  t('sure_logout'),
                  [
                    {text: t('no'), style: 'cancel'},
                    {
                      text: t('yes'),
                      onPress: onLogoutYesPress(props.navigation, t),
                    },
                  ],
                  {
                    cancelable: false,
                  },
                );
                return;
              }
              navigation.dispatch({
                ...(focused
                  ? DrawerActions.closeDrawer()
                  : CommonActions.navigate({name: route.name, merge: true})),
                target: state.key,
              });
            };

            const {
              title,
              drawerLabel,
              drawerIcon,
              drawerLabelStyle,
              drawerItemStyle,
              drawerAllowFontScaling,
            } = descriptors[route.key].options;

            return (
              <DrawerItem
                key={route.key}
                label={
                  drawerLabel !== undefined
                    ? drawerLabel
                    : title !== undefined
                    ? title
                    : route.name
                }
                icon={drawerIcon}
                focused={focused}
                activeTintColor={drawerActiveTintColor}
                inactiveTintColor={drawerInactiveTintColor}
                activeBackgroundColor={drawerActiveBackgroundColor}
                inactiveBackgroundColor={drawerInactiveBackgroundColor}
                allowFontScaling={drawerAllowFontScaling}
                labelStyle={[styles.drawerLabel, drawerLabelStyle]}
                style={[styles.drawerItemStyle, drawerItemStyle]}
                onPress={onPress}
              />
            );
          })}

          <View style={styles.versionView}>
            <Text>Version: {version}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const AdminNavigator = () => {
    return (
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'SignUp'} component={SignUpScreen} />
        <Stack.Screen name={'webView'} component={WebViewScreen} />
        <Stack.Screen name={'webViewDirect'} component={WebViewDirectScreen} />
        <Stack.Screen
          name={'ForgetPassword'}
          component={ForgetPasswordScreen}
        />
      </Stack.Navigator>
    );
  };

  const HomeNavigator = () => {
    return (
      <Stack.Navigator
        id="HomeNavigator"
        initialRouteName={'Home'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'Home'} component={HomeScreen} />
        <Stack.Screen name={'EventList'} component={EventListScreen} />
        <Stack.Screen name={'ViewEvent'} component={ViewEventScreen} />
        <Stack.Screen name={'ScanTicket'} component={ScanTicketScreen} />
        <Stack.Screen name={'ScanOut'} component={ScanOutScreen} />
        <Stack.Screen name={'Movies'} component={MoviesScreen} />
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'SignUp'} component={SignUpScreen} />
        <Stack.Screen name={'webView'} component={WebViewScreen} />
        <Stack.Screen name={'webViewDirect'} component={WebViewDirectScreen} />
        <Stack.Screen
          name={'ForgetPassword'}
          component={ForgetPasswordScreen}
        />
        <Stack.Screen name={'Profile'} component={ProfileScreen} />
        <Stack.Screen name={'MyBooking'} component={MyBookingScreen} />
        <Stack.Screen name={'SeatingChart'} component={SeatingChartScreen} />
        <Stack.Screen name={'Checkout'} component={CheckoutScreen} />
        <Stack.Screen name={'Attendee'} component={AttendeeScreen} />
        <Stack.Screen name={'About'} component={AboutScreen} />
        <Stack.Screen name={'Contact'} component={ContactScreen} />
        <Stack.Screen name={'Terms'} component={TermsScreen} />
        <Stack.Screen name={'Privacy'} component={PrivacyScreen} />
        <Stack.Screen name={'Faq'} component={FaqScreen} />
      </Stack.Navigator>
    );
  };

  const ProfileNavigator = () => {
    return (
      <Stack.Navigator
        id="ProfileNavigator"
        initialRouteName={'Profile'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'Profile'} component={ProfileScreen} />
      </Stack.Navigator>
    );
  };

  const EventListingNavigator = () => {
    return (
      <Stack.Navigator
        id="EventListingNavigator"
        initialRouteName={'EventList'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'EventList'} component={EventListScreen} />
        <Stack.Screen name={'ViewEvent'} component={ViewEventScreen} />
      </Stack.Navigator>
    );
  };

  const MyBookingNavigator = () => {
    return (
      <Stack.Navigator
        initialRouteName={'MyBooking'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'MyBooking'} component={MyBookingScreen} />
        <Stack.Screen name={'SeatingChart'} component={SeatingChartScreen} />
        <Stack.Screen name={'Checkout'} component={CheckoutScreen} />
        <Stack.Screen name={'Attendee'} component={AttendeeScreen} />
      </Stack.Navigator>
    );
  };

  // this is showing after organizer login
  const OrganizerNavigator = () => {
    return (
      <Drawer.Navigator
        id="OrganizerNavigator"
        initialRouteName="DrawerHome"
        screenOptions={{
          unmountOnBlur: true,
          headerShown: false,
        }}
        drawerContent={CustomDrawerContentComponent}>
        <Drawer.Screen
          name={'DrawerHome'}
          component={HomeNavigator}
          options={() => ({
            title: t('home', {order: 1}),
            drawerIcon: () => setDrawerItemIcon(homeIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerEvent'}
          component={EventListingNavigator}
          options={() => ({
            title: t('activities', {order: 2}),
            drawerIcon: () => setDrawerItemIcon(eventIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerProfile'}
          component={ProfileNavigator}
          options={() => ({
            title: t('profile', {order: 5}),
            drawerIcon: () => setDrawerItemIcon(loginIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerCheckIn'}
          component={ScanTicketScreen}
          options={() => ({
            title: t('check_in', {order: 6}),
            drawerIcon: () => setDrawerItemIcon(checkinIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerCheckOut'}
          component={ScanOutScreen}
          options={() => ({
            title: t('check_out', {order: 7}),
            drawerIcon: () => setDrawerItemIcon(checkoutIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerAbout'}
          component={AboutScreen}
          options={() => ({
            title: t('about', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(aboutIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerContact'}
          component={ContactScreen}
          options={() => ({
            title: t('contact', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(contactIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerTerms'}
          component={TermsScreen}
          options={() => ({
            title: t('terms', {order: 9}),
            drawerIcon: () => setDrawerItemIcon(termsIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerPrivacy'}
          component={PrivacyScreen}
          options={() => ({
            title: t('privacy', {order: 10}),
            drawerIcon: () => setDrawerItemIcon(privacyIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerFaq'}
          component={FaqScreen}
          options={() => ({
            title: t('faq', {order: 11}),
            drawerIcon: () => setDrawerItemIcon(faqIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerLogout'}
          component={'NA'}
          options={() => ({
            title: t('logout', {order: 6}),
            drawerIcon: () => setDrawerItemIcon(logoutIcon),
          })}
        />
      </Drawer.Navigator>
    );
  };


  // this is showing after customer login
  const CustomerNavigator = () => {
    return (
      <Drawer.Navigator
        id="CustomerNavigator"
        initialRouteName="DrawerHome"
        screenOptions={{
          unmountOnBlur: true,
          headerShown: false,
        }}
        drawerContent={CustomDrawerContentComponent}>
        <Drawer.Screen
          name={'DrawerHome'}
          component={HomeNavigator}
          options={() => ({
            title: t('home', {order: 1}),
            drawerIcon: () => setDrawerItemIcon(homeIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerEvent'}
          component={EventListingNavigator}
          options={() => ({
            title: t('activities', {order: 2}),
            drawerIcon: () => setDrawerItemIcon(eventIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerMyBookings'}
          component={MyBookingNavigator}
          options={() => ({
            title: t('my_bookings', {order: 4}),
            drawerIcon: () => setDrawerItemIcon(mybookingsIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerAbout'}
          component={AboutScreen}
          options={() => ({
            title: t('about', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(aboutIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerContact'}
          component={ContactScreen}
          options={() => ({
            title: t('contact', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(contactIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerTerms'}
          component={TermsScreen}
          options={() => ({
            title: t('terms', {order: 9}),
            drawerIcon: () => setDrawerItemIcon(termsIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerPrivacy'}
          component={PrivacyScreen}
          options={() => ({
            title: t('privacy', {order: 10}),
            drawerIcon: () => setDrawerItemIcon(privacyIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerFaq'}
          component={FaqScreen}
          options={() => ({
            title: t('faq', {order: 11}),
            drawerIcon: () => setDrawerItemIcon(faqIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerProfile'}
          component={ProfileNavigator}
          options={() => ({
            title: t('profile', {order: 5}),
            drawerIcon: () => setDrawerItemIcon(loginIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerLogout'}
          component={() => null}
          options={() => ({
            title: t('logout', {order: 6}),
            drawerIcon: () => setDrawerItemIcon(logoutIcon),
          })}
        />
      </Drawer.Navigator>
    );
  };

  const GuestNavigator = () => {
    return (
      <Drawer.Navigator
        id="GuestNavigator"
        initialRouteName="DrawerMyBookings"
        screenOptions={{
          unmountOnBlur: true,
          headerShown: false,
        }}
        drawerContent={CustomDrawerContentComponent}>
        <Drawer.Screen
          name={'DrawerHome'}
          component={HomeNavigator}
          options={() => ({
            title: t('home', {order: 1}),
            drawerIcon: () => setDrawerItemIcon(homeIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerEvent'}
          component={EventListingNavigator}
          options={() => ({
            title: t('activities', {order: 2}),
            drawerIcon: () => setDrawerItemIcon(eventIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerMyBookings'}
          component={MyBookingNavigator}
          options={() => ({
            title: t('my_bookings', {order: 4}),
            drawerIcon: () => setDrawerItemIcon(mybookingsIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerAbout'}
          component={AboutScreen}
          options={() => ({
            title: t('about', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(aboutIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerContact'}
          component={ContactScreen}
          options={() => ({
            title: t('contact', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(contactIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerTerms'}
          component={TermsScreen}
          options={() => ({
            title: t('terms', {order: 9}),
            drawerIcon: () => setDrawerItemIcon(termsIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerPrivacy'}
          component={PrivacyScreen}
          options={() => ({
            title: t('privacy', {order: 10}),
            drawerIcon: () => setDrawerItemIcon(privacyIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerFaq'}
          component={FaqScreen}
          options={() => ({
            title: t('faq', {order: 11}),
            drawerIcon: () => setDrawerItemIcon(faqIcon),
          })}
        />
         <Drawer.Screen
          name={'DrawerProfile'}
          component={ProfileNavigator}
          options={() => ({
            title: t('profile', {order: 5}),
            drawerIcon: () => setDrawerItemIcon(loginIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerLogout'}
          component={() => null}
          options={() => ({
            title: t('logout', {order: 6}),
            drawerIcon: () => setDrawerItemIcon(logoutIcon),
          })}
        />
      </Drawer.Navigator>
    );
  };

  /* ==================== LoggedOutNavigator ================== */
  const LoggedOutNavigator = () => {
    return (
      <Drawer.Navigator
        id="LoggedOutNavigator"
        initialRouteName="DrawerHome"
        screenOptions={{
          unmountOnBlur: true,
          headerShown: false,
        }}
        drawerContent={CustomDrawerContentComponent}>
        <Drawer.Screen
          name={'DrawerHome'}
          component={HomeNavigator}
          options={() => ({
            title: t('home', {order: 1}),
            drawerIcon: () => setDrawerItemIcon(homeIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerEvent'}
          component={EventListingNavigator}
          options={() => ({
            title: t('activities', {order: 2}),
            drawerIcon: () => setDrawerItemIcon(eventIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerAbout'}
          component={AboutScreen}
          options={() => ({
            title: t('about', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(aboutIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerContact'}
          component={ContactScreen}
          options={() => ({
            title: t('contact', {order: 8}),
            drawerIcon: () => setDrawerItemIcon(contactIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerTerms'}
          component={TermsScreen}
          options={() => ({
            title: t('terms', {order: 9}),
            drawerIcon: () => setDrawerItemIcon(termsIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerPrivacy'}
          component={PrivacyScreen}
          options={() => ({
            title: t('privacy', {order: 10}),
            drawerIcon: () => setDrawerItemIcon(privacyIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerFaq'}
          component={FaqScreen}
          options={() => ({
            title: t('faq', {order: 11}),
            drawerIcon: () => setDrawerItemIcon(faqIcon),
          })}
        />
        <Drawer.Screen
          name={'DrawerLogin'}
          component={AdminNavigator}
          options={() => ({
            title: t('login', {order: 3}),
            drawerIcon: () => setDrawerItemIcon(loginIcon),
          })}
        />
      </Drawer.Navigator>
    );
  };

  // let initialRouteName = 'LoggedOut';
  // if (guestCheckoutSuccess == 'yes') {
  //   initialRouteName = 'GuestNavigator';
  // } else {
  //   if (checkScanning == 3) {
  //     initialRouteName = 'OrganizerNavigator';
  //   } else if (checkScanning == 2) {
  //     initialRouteName = 'CustomerNavigator';
  //   } else {
  //     initialRouteName = 'LoggedOut';
  //   }
  // };

  useEffect(() => {
     console.log("Login:", isLogin);
     console.log("Type:", type)
  }, [])

  const Tab = createBottomTabNavigator();

  return (
    <Stack.Navigator
      id='MainNavigator'
      initialRouteName={type == 3 ? 'OrganizerNavigator' : type == 2 ? 'CustomerNavigator' : 'LoggedOut'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'LoggedOut'} component={LoggedOutNavigator} />
      <Stack.Screen
        name={'OrganizerNavigator'}
        component={OrganizerNavigator}
      />
      <Stack.Screen
        name={'CustomerNavigator'}
        component={CustomerNavigator}
      />
      <Stack.Screen
        name={'GuestNavigator'}
        component={GuestNavigator}
      />
    </Stack.Navigator>
    // <Tab.Navigator 
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarStyle: {
    //       backgroundColor: '#000',
    //     },
    //     tabBarActiveTintColor: '#fff',
    //     tabBarLabelStyle: {
    //       fontSize: 12
    //     }
    //   }}>
    //   <Tab.Screen name="Home" component={HomeNavigator} options={({navigation}) => ({
    //     tabBarIcon: () => (
    //       <Image source={homeIcon} style={styles.tabIcon}/>
    //     )
    //   })}/>
    //   <Tab.Screen name="Movies" component={MoviesScreen} options={({navigation}) => ({
    //     tabBarIcon: () => (
    //       <Image source={moviesIcon} style={styles.tabIcon}/>
    //     )
    //   })}/>
    //   <Tab.Screen name="Activities" component={EventListScreen} options={({navigation}) => ({
    //     tabBarIcon: () => (
    //       <Image source={eventIcon} style={styles.tabIcon}/>
    //     )
    //   })}/>
    // </Tab.Navigator>
  );
};

export default withTranslation()(Routes);

const styles = StyleSheet.create({
  drawerItemIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: '#fff',
    marginRight: -wp(5),
  },
  drawerItemStyle: {
    marginHorizontal: 0,
  },
  drawerContentContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  drawerHeader: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000000',
    paddingBottom: 20,
  },
  profileImage: {
    height: 50,
    width: 'auto',
    marginTop: 20,
  },
  drawerTitle: {
    color: '#fff',
    marginLeft: wp(2),
    fontWeight: '700',
    textAlign: 'center',
  },
  drawerLabel: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  versionView: {
    position: 'absolute',
    top: LayoutSize.window.height - 50,
    right: 10,
    zIndex: 999999,
  },
  tabIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
    marginTop: 10,
    marginBottom: 5
  },
});