/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { StyleSheet, Text, View, onGoBack } from 'react-native';
import { SafeAreaView, TouchableOpacity } from "react-native";
import { WebView } from 'react-native-webview';
import CustomLoader from '../component/CustomLoader';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { withTranslation } from 'react-i18next';

class WebViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      url: null,
      exitButton: null,
    }
    this.paymentUrl = this.props.navigation.getParam('paymentUrl', null);
  }
  componentDidMount() {
    setTimeout(this.initialSetup, 1000);
  }

  initialSetup = async () => {
    // getting userId from asyncStorage
    try {
      this.setState({
        isLoading: false,
        url: this.paymentUrl,

      });

    } catch (error) {
      console.log(error.message);
    }
  };

  handleNavigationStateChanged = navState => {
    const { t } = this.props;
    const { url, title } = navState;
    console.log('statechanged title', title);
    if (title == 'fail') {
      this.setState({ exitButton: 'events' });
      this.props.navigation.state.params.onPaymentCallback({ success: false, message: t('payment_cancelled') });
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 1000);
    } else if (title == 'success') {
      this.setState({ exitButton: 'mybookings' });
      this.props.navigation.state.params.onPaymentCallback({ success: true, message: t('payment_success') });
      setTimeout(() => {
        this.props.navigation.navigate('MyBooking');
      }, 1000);
    }
  };

  handleGoBack = async () => {
    if(this.state.exitButton == 'mybookings') {
      this.props.navigation.navigate('MyBooking');
      return true;
    }
    
    if(this.state.exitButton == 'events') {
      this.props.navigation.goBack();
      return true;
    }
    
  }


  render() {
    const { t } = this.props;

    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          startInLoadingState={false}
          ref={r => (this.webref = r)}
          source={{ uri: this.state.url }}
          onNavigationStateChange={this.handleNavigationStateChanged}
          style={{ height: 350, width: '100%', resizeMode: 'cover', flex: 1 }}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          scalesPageToFit={true}
        />

        {this.state.exitButton == 'mybookings' ? (
        <TouchableOpacity
          style={styles.buttonContainerSuccess}
          onPress={this.handleGoBack}>
          <Text style={styles.saveProfileText}>{t('go_to_mybookings')}</Text>
        </TouchableOpacity>
        ) : null}
        
        {this.state.exitButton == 'events' ? (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.handleGoBack}>
          <Text style={styles.saveProfileText}>{t('go_back')}</Text>
        </TouchableOpacity>
        ) : null}
        
        
      </SafeAreaView>
    );
  }
}

export default withTranslation()(WebViewScreen);


const styles = StyleSheet.create({
  container: {
    height: 350,
  },
  buttonContainer: {
    height: hp(6),
    width: wp(80),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#000',
  },
  buttonContainerSuccess: {
    height: hp(6),
    width: wp(80),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#00b289',
  },
  saveProfileText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
})