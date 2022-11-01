/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { StyleSheet, Text, View, onGoBack } from 'react-native';
import { SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import CustomLoader from '../component/CustomLoader';

export default class WebViewScreen extends Component {
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
    const { url, title } = navState;
    if (title.includes('payment/cancel')) {
      this.props.navigation.state.params.onPaymentCallback({ success: false, message: "You have cancelled the payment, Please complete the payment." });
      this.props.navigation.goBack();
    } else if (title.includes('payment/success')) {
      this.props.navigation.state.params.onPaymentCallback({ success: true, message: "Your ticket has been booked successfully." });
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
const styles = StyleSheet.create({
  container: {
    height: 350,
  }
})