/* eslint-disable prettier/prettier */
// @ts-nocheck
import 'react-native-gesture-handler';
import 'intl-pluralrules';
import React, { Component } from 'react';
import { StyleSheet, I18nManager, Platform, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import './locales/i18n';
import { withTranslation } from 'react-i18next';

// Splash Screen
import SplashScreen from './src/screen/SplashScreen';

// Routes
import Routes from './src/routes/Routes';
import { nsSetTopLevelNavigator } from './src/routes/NavigationService';

// User Preference
import { async_keys, getData } from './src/api/UserPreference';
import LoginContextProvider from './src/context/LoginContext';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      checkScanning: null,
      guestCheckoutSuccess: null,
    };
  }

  componentDidMount() {
    // Initial setup
    setTimeout(this.initialSetup, 1000);
    this.setUserLang();
  }

  initialSetup = async () => {
    const organizer = await getData(async_keys.userInfo);
    const guestCheckoutSuccess = await getData('guestCheckoutSuccess');
    try {
      this.setState({ checkScanning: organizer, isLoading: false, guestCheckoutSuccess: guestCheckoutSuccess });
    } catch (error) {

    }
  };

  setUserLang = async () => {
    const { t, i18n } = this.props;
    const userLang = await getData(async_keys.userLang);
    i18n
      .changeLanguage(userLang)
      .then(() => {
        I18nManager.forceRTL(userLang == 'ar');
      });
  };



  setNavigatorRef = ref => {
    nsSetTopLevelNavigator(ref);
  };

  render() {
    const { t, i18n } = this.props;
    const { isLoading, checkScanning, guestCheckoutSuccess } = this.state;

    if (isLoading) {
      return <SplashScreen />;
    }

    // const RootNavigator = () => createRootNavigator(checkScanning, guestCheckoutSuccess);
    // const AppContainer = createAppContainer(RootNavigator);
    return (
      <LoginContextProvider>
        <SafeAreaProvider style={styles.container}>
          <SafeAreaView style={{
            flex: 0,
            backgroundColor: 'black',
          }} />
          <SafeAreaView style={styles.container}>
            <StatusBar animated={true} barStyle="light-content" />
            {/* <AppContainer ref={this.setNavigatorRef} screenProps={{ t, i18n }} /> */}
            <NavigationContainer>
              <Routes
                checkScanning={checkScanning} guestCheckoutSuccess={guestCheckoutSuccess}
              />
            </NavigationContainer>
            <Toast />
          </SafeAreaView>
        </SafeAreaProvider>
      </LoginContextProvider>
    );
  }
}

export default withTranslation()(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});