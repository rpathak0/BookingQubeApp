/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { StyleSheet, Text, View, onGoBack } from 'react-native';
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import CustomLoader from '../component/CustomLoader';

import { withTranslation } from 'react-i18next';

class WebViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      url: null
    }
    this.paymentUrl = this.props.navigation.getParam('paymentUrl', null);
  }
  componentDidMount() {
    setTimeout(this.initialSetup, 2000);
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
    if (title.includes('payment/cancel')) {
      this.props.navigation.state.params.onPaymentCallback({ success: false, message: t('payment_cancelled') });
      this.props.navigation.goBack();
    } else if (title.includes('payment/success')) {
      this.props.navigation.state.params.onPaymentCallback({ success: true, message: t('payment_success') });
      this.props.navigation.goBack();
    }
  };


  render() {
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
        />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(WebViewScreen);


const styles = StyleSheet.create({
  container: {
    height: 350,
  }
})