/* eslint-disable prettier/prettier */
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import { Image, StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Screens
import LoginScreen from '../screen/LoginScreen';
import SignUpScreen from '../screen/SignUpScreen';
import WebViewScreen from '../screen/WebViewScreen';

import ForgetPasswordScreen from '../screen/ForgetPasswordScreen';

// Home Screen
import HomeScreen from '../screen/HomeScreen';

// Event Screen
import EventListScreen from '../screen/EventListScreen';
import ViewEventScreen from '../screen/ViewEventScreen';

// Category Screen
import CategoryScreen from '../screen/CategoryScreen';

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
import { showToast } from '../component/CustomToast';

// Logo
import logo from '../assets/image/logo.png';

// User Preference
import { clearData } from '../api/UserPreference';
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
// Style Sheet
const styles = StyleSheet.create({
  drawerItemIcon: {
    width: wp(5),
    height: wp(5),
  },
  drawerContentContainer: {
    flex: 1,
  },
  drawerHeader: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#2c9ed8',
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileImage: {
    height: 50,
    width: 'auto',
    marginTop: 20
  },
  drawerTitle: {
    color: '#333',
    marginLeft: wp(2),
    fontWeight: '700',
    textAlign: 'center'
  },
  drawerLabel: {
    fontSize: wp(3.5),
    color: '#000',
  },
});

const setDrawerItemIcon = itemIcon => ({
  drawerIcon: (
    <Image source={itemIcon} resizeMode="cover" style={styles.drawerItemIcon} />
  ),
});

const drawerContentContainerInset = {
  top: 'always',
  horizontal: 'never',
};

const onLogoutYesPress = nav => async () => {
  try {
    // Clearing user preferences from local storage
    await clearData();
    showToast('Logout Successfully');
    // Resetting Navigation to initial state for login again
    nav.navigate('LoggedOut');
  } catch (error) {
    console.log(error.message);
  }
};

const onDrawerItemPress = props => route => {
  if (route.route.routeName !== 'Logout') {
    props.onItemPress(route);
    return;
  }

  // If 'Logout' route pressed
  props.navigation.closeDrawer();

  Alert.alert(
    'Logout',
    'Are you sure, you want to logout?',
    [
      { text: 'NO', style: 'cancel' },
      { text: 'YES', onPress: onLogoutYesPress(props.navigation) },
    ],
    {
      cancelable: false,
    },
  );
};

const CustomDrawerContentComponent = props => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <SafeAreaView
      style={styles.drawerContentContainer}
      forceInset={drawerContentContainerInset}>
      <View style={styles.drawerHeader}>
        <Image source={logo} style={styles.profileImage} />
        <Text style={styles.drawerTitle}>Welcome to BOOKING QUBE</Text>
      </View>
      <DrawerItems
        {...props}
        onItemPress={onDrawerItemPress(props)}
        labelStyle={styles.drawerLabel}
      />
    </SafeAreaView>
  </ScrollView>
);

const AdminNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    SignUp: SignUpScreen,
    webView: WebViewScreen,
    ForgetPassword: ForgetPasswordScreen,
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HomeNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    EventList: EventListScreen,
    ViewEvent: ViewEventScreen,
    ScanTicket: ScanTicketScreen,
    ScanOut: ScanOutScreen,
    Category: CategoryScreen,
    Login: LoginScreen,
    SignUp: SignUpScreen,
    webView: WebViewScreen,
    ForgetPassword: ForgetPasswordScreen,
    Profile: ProfileScreen,
    MyBooking: MyBookingScreen,
    SeatingChart: SeatingChartScreen,
    Checkout: CheckoutScreen,
    Attendee: AttendeeScreen,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Profile',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const EventListingNavigator = createStackNavigator(
  {
    EventList: EventListScreen,
    ViewEvent: ViewEventScreen,
  },
  {
    initialRouteName: 'EventList',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const MyBookingNavigator = createStackNavigator(
  {
    MyBooking: MyBookingScreen,
    SeatingChart: SeatingChartScreen,
    Checkout: CheckoutScreen,
    Attendee: AttendeeScreen,
  },
  {
    initialRouteName: 'MyBooking',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const LoggedOutNavigator1 = createDrawerNavigator(
  {
    Home: {
      screen: HomeNavigator,
    },
    Event: {
      screen: EventListingNavigator,
    },
    'My Booking': {
      screen: MyBookingNavigator,
    },
    Profile: {
      screen: ProfileNavigator,
    },
    'Check In': {
      screen: ScanTicketScreen,
    },
    'Check Out': {
      screen: ScanOutScreen,
    },
    Logout: {
      screen: 'No Screen',
    },
  },
  {
    initialRouteName: 'Home',
    unmountInactiveRoutes: true,
    contentComponent: CustomDrawerContentComponent,
  },
);

const LoggedOutNavigator2 = createDrawerNavigator(
  {
    Home: {
      screen: HomeNavigator,
    },
    Event: {
      screen: EventListingNavigator,
    },
    'My Booking': {
      screen: MyBookingNavigator,
    },
    Profile: {
      screen: ProfileNavigator,
    },
    Logout: {
      screen: 'No Screen',
    },
  },
  {
    initialRouteName: 'Home',
    unmountInactiveRoutes: true,
    contentComponent: CustomDrawerContentComponent,
  },
);
const AfterGuestLoginNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeNavigator,
    },
    Event: {
      screen: EventListingNavigator,
    },
    'My Booking': {
      screen: MyBookingNavigator,
    },
    Profile: {
      screen: ProfileNavigator,
    },
    Logout: {
      screen: 'No Screen',
    },
  },
  {
    initialRouteName: 'My Booking',
    unmountInactiveRoutes: true,
    contentComponent: CustomDrawerContentComponent,
  },
);

const LoggedOutNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeNavigator,
    },
    Event: {
      screen: EventListingNavigator,
    },
    Login: {
      screen: AdminNavigator,
    },
  },
  {
    initialRouteName: 'Home',
    unmountInactiveRoutes: true,
    contentComponent: CustomDrawerContentComponent,
  },
);

export const createRootNavigator = (checkScanning, guestCheckoutSuccess,paymentFailed) => {
  let initialRouteName = 'LoggedOut';
  if(guestCheckoutSuccess =='yes'){
    initialRouteName = 'AfterGuestLoginNavigator';
  }else{
    if (checkScanning === 3) {
      initialRouteName = 'LoggedOutNavigator1';
    } else if (checkScanning === 2) {
      initialRouteName = 'LoggedOutNavigator2';
    } else {
      initialRouteName = 'LoggedOut';
    }
  }

  const ROUTES = {
    LoggedOut: LoggedOutNavigator,
    LoggedIn: LoggedOutNavigator,
    LoggedOutNavigator1: LoggedOutNavigator1,
    LoggedOutNavigator2: LoggedOutNavigator2,
    AfterGuestLoginNavigator: AfterGuestLoginNavigator,
  };

  
  return createSwitchNavigator(ROUTES, { initialRouteName });
};
