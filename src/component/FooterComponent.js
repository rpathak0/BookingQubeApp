/* eslint-disable prettier/prettier */
import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  AppState,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {withTranslation} from 'react-i18next';
import * as Icon from "react-native-feather";

// Icon
import ic_home from '../assets/icon/ic_home.png';
import ic_movies from '../assets/icon/ic_movies.png';
import ic_menu from '../assets/icon/ic_menu.png';
import ic_footer_category from '../assets/icon/ic_footer_category.png';
import ic_footer_event from '../assets/icon/ic_footer_event.png';

// User Preference
import {async_keys, getData, clearData} from '../api/UserPreference';

class FooterComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      checkUserActivity: null,
      userRoleId: null,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleCheckLogin);
    this.setUserInfo();
  }

  componentWillUnmount() {
    AppState.addEventListener('change', this.handleCheckLogin);
  }

  handleCheckLogin = async nextAppState => {
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    this.setState({appState: nextAppState, checkUserActivity: token});
  };

  handleHome = () => {
    this.props.nav.navigate('DrawerHome', {
      screen: 'Home',
    });
  };

  handleEvent = async () => {
    this.props.nav.navigate('DrawerHome', {
      screen: 'EventList',
    });
  };

  handleMore = async () => {
    this.props.nav.openDrawer();
  };

  handleMovies = async () => {
    this.props.nav.navigate('DrawerHome', {
      screen: 'Movies',
    });
  };

  setUserInfo = async () => {
    const organizer = await getData(async_keys.userInfo);
    this.setState({userRoleId: organizer});
  };

  handleCategory = async () => {
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    if (token === null) {
      this.props.nav.navigate('DrawerLogin');
    } else {
      this.props.nav.navigate('MyBooking');
    }
  };

  render() {
    const {tab} = this.props;
    const {t} = this.props;
    const selectedTabStyle = [styles.footerMenu, {backgroundColor: '#ECEFFF'}];

    return (
      <SafeAreaView
        style={[
          this.state.checkDarkMode === 1
            ? styles.footerContainerBlack
            : styles.footerContainer,
        ]}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.handleHome}
          style={tab === 'Home' ? selectedTabStyle : styles.footerMenu}>
          <View style={styles.singleMenu}>
            {/* <Image source={ic_home} style={styles.footerNavigatorIcon} /> */}
            <Icon.Home stroke={"#000"}/>
            <Text
              style={[
                this.state.checkDarkMode === 1
                  ? styles.footerMenuTextBlack
                  : styles.footerMenuText,
              ]}>
              {t('home')}
            </Text>
          </View>
        </TouchableHighlight>

        {/* <TouchableHighlight
          underlayColor="transparent"
          onPress={this.handleMovies}
          style={tab === 'Home' ? selectedTabStyle : styles.footerMenu}>
          <View style={styles.singleMenu}>
            <Image source={ic_movies} style={styles.footerNavigatorIcon} />
            <Text
              style={[
                this.state.checkDarkMode === 1
                  ? styles.footerMenuTextBlack
                  : styles.footerMenuText,
              ]}>
              {t('movies')}
            </Text>
          </View>
        </TouchableHighlight> */}

        {this.state.userRoleId == 2 ? (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.handleCategory}
            style={tab === 'Game' ? selectedTabStyle : styles.footerMenu}>
            <View style={styles.singleMenu}>
              {/* <Image
                source={ic_footer_category}
                style={styles.footerNavigatorIcon}
              /> */}
              <Icon.CreditCard stroke={"#000"} />
              <Text
                style={[
                  this.state.checkDarkMode === 1
                    ? styles.footerMenuTextBlack
                    : styles.footerMenuText,
                ]}>
                {t('my_bookings')}
              </Text>
            </View>
          </TouchableHighlight>
        ) : null}

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.handleEvent}
          style={tab === 'Profile' ? selectedTabStyle : styles.footerMenu}>
          <View style={styles.singleMenu}>
            {/* <Image
              source={ic_footer_event}
              style={styles.footerNavigatorIcon}
            /> */}
            <Icon.Calendar stroke={"#000"} />
            <Text
              style={[
                this.state.checkDarkMode === 1
                  ? styles.footerMenuTextBlack
                  : styles.footerMenuText,
              ]}>
              {t('activities')}
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.handleMore}
          style={tab === 'Profile' ? selectedTabStyle : styles.footerMenu}>
          <View style={styles.singleMenu}>
            {/* <Image source={ic_menu} style={styles.footerNavigatorIcon} /> */}
            <Icon.Menu stroke={"#000"} />
            <Text
              style={[
                this.state.checkDarkMode === 1
                  ? styles.footerMenuTextBlack
                  : styles.footerMenuText,
              ]}>
              {t('more')}
            </Text>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(FooterComponent);

const styles = StyleSheet.create({
  footerContainer: {
    height: hp(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  footerContainerBlack: {
    height: hp(8),
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#121212',
  },
  footerMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleMenu: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNavigatorIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  footerMenuText: {
    fontSize: wp(3),
    color: '#000',
    fontWeight: '500',
  },
  footerMenuTextBlack: {
    fontSize: wp(3),
    color: '#fff',
  },
});
