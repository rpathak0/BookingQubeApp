/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {StyleSheet, StatusBar, Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import './locales/i18n';

// Splash Screen
import SplashScreen from './src/screen/SplashScreen';

// Routes
import {createRootNavigator} from './src/routes/Routes';
import {nsSetTopLevelNavigator} from './src/routes/NavigationService';

// User Preference
import {async_keys, getData} from './src/api/UserPreference';
import LoginContextProvider from './src/context/LoginContext';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 25 : StatusBar.currentHeight;

export default App = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [checkScanning, setCheckScanning] = useState(null);
  const [guestCheckoutSuccess, setGuestCheckoutSuccess] = useState(null);
  
  const RootNavigator = createRootNavigator(checkScanning,guestCheckoutSuccess);
  const AppContainer = createAppContainer(RootNavigator);


  const initialSetup = async () => {
    const organizer = await getData(async_keys.userInfo);
    const guestCheckoutSuccess = await getData('guestCheckoutSuccess');
    try {
      this.setState({checkScanning: organizer, isLoading: false,guestCheckoutSuccess:guestCheckoutSuccess});
    } catch (error) {

    }
  };
    
  const setNavigatorRef = ref => {
    nsSetTopLevelNavigator(ref);
  };

  useEffect(() => {
    setTimeout(initialSetup, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  } else {
      return (
        <LoginContextProvider>
          <SafeAreaProvider style={styles.container}>
            <AppContainer ref={this.setNavigatorRef} />
            <Toast />
          </SafeAreaProvider>
        </LoginContextProvider>
      );
  }

};


const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop:STATUSBAR_HEIGHT,
  }
});