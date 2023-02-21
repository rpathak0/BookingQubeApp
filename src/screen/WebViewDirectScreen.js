/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, Text, View, onGoBack} from 'react-native';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import CustomLoader from '../component/CustomLoader';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {withTranslation} from 'react-i18next';
import {SERVER} from '../services/apiConfig';

class WebViewDirectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      webUrl: null,
      exitButton: null,
    };
    this.webUrl = SERVER+'events/'+this.props.route.params.webUrl;
    console.log('this.webUrl', this.webUrl)
  }
  componentDidMount() {
    setTimeout(this.initialSetup, 1000);
  }

  initialSetup = async () => {
    // getting userId from asyncStorage
    try {
      this.setState({
        isLoading: false,
        webUrl: this.webUrl,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleNavigationStateChanged = navState => {
    
  };

  handleGoBack = async () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.isLoading && <CustomLoader />}

        <WebView
          startInLoadingState={true}
          ref={r => (this.webref = r)}
          source={{uri: this.state.webUrl}}
          onNavigationStateChange={this.handleNavigationStateChanged}
          style={{height: 350, width: '100%', resizeMode: 'cover', flex: 1}}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          scalesPageToFit={true}
        />

      </SafeAreaView>
    );
  }
}

export default withTranslation()(WebViewDirectScreen);

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
});
