/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, StatusBar, Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import './locales/i18n';
import { withTranslation } from 'react-i18next';

// Splash Screen
import SplashScreen from './src/screen/SplashScreen';

// Routes
import {createRootNavigator} from './src/routes/Routes';
import {nsSetTopLevelNavigator} from './src/routes/NavigationService';

// User Preference
import {async_keys, getData} from './src/api/UserPreference';
import LoginContextProvider from './src/context/LoginContext';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 25 : StatusBar.currentHeight;

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
    setTimeout(this.initialSetup, 2000);
  }

  initialSetup = async () => {
    const organizer = await getData(async_keys.userInfo);
    const guestCheckoutSuccess = await getData('guestCheckoutSuccess');
    try {
      this.setState({checkScanning: organizer, isLoading: false,guestCheckoutSuccess:guestCheckoutSuccess});
    } catch (error) {

    }
  };

  setNavigatorRef = ref => {
    nsSetTopLevelNavigator(ref);
  };

  render() {
    const {isLoading, checkScanning,guestCheckoutSuccess} = this.state;
    if (isLoading) {
      return <SplashScreen />;
    }

    const RootNavigator = createRootNavigator(checkScanning,guestCheckoutSuccess);
    const AppContainer = createAppContainer(RootNavigator);
    return (
      <LoginContextProvider>
        <SafeAreaProvider style={styles.container}>
          <AppContainer ref={this.setNavigatorRef}/>
          <Toast />
        </SafeAreaProvider>
      </LoginContextProvider>
    );
  }
}

export default withTranslation()(App);

const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop:STATUSBAR_HEIGHT,
  }
});