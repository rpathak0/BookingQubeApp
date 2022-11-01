/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Splash Screen
import SplashScreen from './src/screen/SplashScreen';

// Routes
import {createRootNavigator} from './src/routes/Routes';
import {nsSetTopLevelNavigator} from './src/routes/NavigationService';

// User Preference
import {async_keys, getData} from './src/api/UserPreference';
import LoginContextProvider from './src/context/LoginContext';

export default class App extends Component {
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
        <SafeAreaProvider>
          <AppContainer ref={this.setNavigatorRef} />
        </SafeAreaProvider>
      </LoginContextProvider>
    );
  }
}
