/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  Alert,
  I18nManager,
  SafeAreaView
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DropDownPicker from 'react-native-dropdown-picker';

import { async_keys, getData } from '../api/UserPreference';
const axios = require('axios');

// Component
import HeaderComponent from '../component/HeaderComponent';
import ProcessingLoader from '../component/ProcessingLoader';
import {showToast} from '../component/CustomToast';

// Icon
import ic_login from '../assets/icon/ic_login.png';
import facebook from '../assets/icon/facebook.png';
import google from '../assets/icon/google.png';

// Image
import splash_image from '../assets/image/spalsh_image.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// Validation
import {isEmailAddress} from '../validation/FormValidator';

import { withTranslation } from 'react-i18next';
import { t } from 'i18next';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      hidePassword: true,
      showProcessingLoader: false,
      
      OpenGender: false,
      ValueGender: '',
      ItemsGender: [
        {label: 'Male', value: "male"},
        {label: 'Female', value: "female"},
      ],
      
      OpenCountry: false,
      ValueCountry: '',
      LodingCountry: false,
      ItemsCountry: [],
    };
  }

  componentDidMount() {
    setTimeout(this.getCountries, 2000);
  }

  handleNameChange = name => {
    this.setState({name});
  };

  handleEmailChange = email => {
    this.setState({email});
  };

  handlePasswordChange = password => {
    this.setState({password});
  };

  setPasswordVisibility = () => {
    this.setState({hidePassword: !this.state.hidePassword});
  };

  setOpenGender = (OpenGender) => {
    this.setState({
      OpenGender
    });
  }

  setValueGender = (callback) => {
    this.setState(state => ({
      ValueGender: callback(state.ValueGender)
    }));
  }

  setItemsGender = (callback) => {
    console.log('setItemsGender', callback);
    this.setState(state => ({
      ItemsGender: callback(state.ItemsGender)
    }));
  }

  setOpenCountry = (OpenCountry) => {
    this.setState({
      OpenCountry
    });
  }
  
  setLodingCountry = (LodingCountry) => {
    this.setState({
      LodingCountry
    });
  }

  setValueCountry = (callback) => {
    this.setState(state => ({
      ValueCountry: callback(state.ValueCountry)
    }));
  }

  setItemsCountry = (countries) => {
    console.log('setItemsCountry-----', countries);
    this.setState(state => ({
      ItemsCountry: countries
    }));
  }

  getCountries = async () => {
    // getting userId from asyncStorage
    try {
      this.setLodingCountry(true);
      // calling api
      await axios
        .get(BASE_URL + 'get-countries')
        .then(response => {
          let newResponse = response;
          console.log('newResponsenewResponse',newResponse);
          if (newResponse) {
            const { status, countries } = newResponse.data;
            let ItemsCountry = [];
            console.log('countries', newResponse);
            console.log('status', status);
            if (status === true) {
              countries.map(item => {
                ItemsCountry.push({label: item.country_name, value: item.id});
              });
              console.log('ItemsCountry', ItemsCountry);
              this.setItemsCountry(ItemsCountry);
              this.setLodingCountry(false);
            }
          }
        });

    } catch (error) {
      console.log(error.message);
      this.setLodingCountry(false);
    }
  };

  handleRegister = async () => {
    const { t } = this.props;
    Keyboard.dismiss();

    const {name, email, password, ValueGender, ValueCountry} = this.state;
    console.log('handleregis', this.state);

    // validation
    if (name.trim() === '') {
      Alert.alert('', t('enter_name_first'), [{text: t('ok')}], {
        cancelable: false,
      });
      return;
    }

    if (!isEmailAddress(email)) {
      Alert.alert('', t('enter_email_first'), [{text: t('ok')}], {
        cancelable: false,
      });
      return;
    }

    if (password.trim() === '') {
      Alert.alert('', t('enter_valid_password'), [{text: t('ok')}], {
        cancelable: false,
      });
      return;
    }
    
    if (ValueGender == '' || ValueGender == null) {
      Alert.alert('', t('select_gender'), [{text: t('ok')}], {
        cancelable: false,
      });
      return;
    }
    
    if (ValueCountry == '' || ValueCountry == null) {
      Alert.alert('', t('select_country'), [{text: t('ok')}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting processing loader
      // this.setState({showProcessingLoader: true});

      // preparing params
      const params = {
        name: name,
        email: email,
        password: password,
        gender: ValueGender,
        country_id: ValueCountry,
        accept: 'true',
      };

      console.log('paramspost', params);

      // calling api
      const response = await makeRequest(BASE_URL + 'register', params, true);
      
      // processing response
      if (response) {
        const {status, message, errors} = response;
        console.log('2',errors);

        if (status === true) {
          // stopping processing loader
          this.setState({showProcessingLoader: false});
          console.log(',');
          // showing toast
          showToast(message);

          // navigating to login screen
          this.props.navigation.navigate('Login');
        } else if (errors) {
          // const {name, email, password} = errors;

          //   // stopping processing loader
          this.setState({showProcessingLoader: false});

          if (errors.name) {
            // showing toast
            showToast(errors?.name[0]);
          } else if (errors.email) {
            // showing toast
            showToast(errors?.email[0]);
          } else if (errors.password) {
            // showing toast
            showToast(errors.password[0]);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLogin = async () => {
    this.props.navigation.navigate('Login');
  };

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <ImageBackground style={styles.container} source={splash_image}>
          <HeaderComponent
            title={t('register')}
            navAction="back"
            nav={this.props.navigation}
          />

          <View style={styles.homeContainer}>
            <Text style={styles.loginTextStyle}>{t('register')}</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.loginFormTextInput}
                placeholder={t('name')}
                placeholderTextColor="#c4c3cb"
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.name}
                onChangeText={this.handleNameChange}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.loginFormTextInput}
                placeholder={t('email')}
                autoCapitalize="none"
                placeholderTextColor="#c4c3cb"
                keyboardType="email-address"
                underlineColorAndroid="transparent"
                value={this.state.email}
                onChangeText={this.handleEmailChange}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.loginFormTextInput}
                placeholder={t('password')}
                placeholderTextColor="#c4c3cb"
                keyboardType="default"
                secureTextEntry={this.state.hidePassword}
                underlineColorAndroid="transparent"
                value={this.state.password}
                onChangeText={this.handlePasswordChange}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchAbleButton}
                onPress={this.setPasswordVisibility}>
                <Image
                  source={
                    this.state.hidePassword
                      ? require('../assets/icon/ic_hide.png')
                      : require('../assets/icon/ic_show.png')
                  }
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainerDropdown}>
              <DropDownPicker
                open={this.state.OpenGender}
                value={this.state.ValueGender}
                items={this.state.ItemsGender}
                setOpen={this.setOpenGender}
                setValue={this.setValueGender}
                setItems={this.setItemsGender}
                zIndex={99999}
                theme="DARK"
                listMode='MODAL'
                modalProps={{animationType: "fade"}}
                modalTitle={t('select_gender')}
                placeholder={t('select_gender')}
                modalTitleStyle={{fontWeight: "bold"}}
              />
            </View>
            
            <View style={styles.inputContainerDropdown}>
              <DropDownPicker
                open={this.state.OpenCountry}
                value={this.state.ValueCountry}
                items={this.state.ItemsCountry}
                setOpen={this.setOpenCountry}
                setValue={this.setValueCountry}
                setItems={this.setItemsCountry}
                loading={this.setLodingCountry}
                searchable={true}
                zIndex={99999}
                theme="DARK"
                listMode='MODAL'
                modalProps={{animationType: "fade"}}
                modalTitle={t('select_country')}
                placeholder={t('select_country')}
                searchPlaceholder={t('search_country')}
                modalTitleStyle={{fontWeight: "bold"}}
              />
            </View>
            
            <Text style={styles.agreeTextStyle}>
              By clicking "Register", I accept the{' '}
              <Text style={{color: '#f89b15'}}>Terms of Service</Text> and have
              read the <Text style={{color: '#f89b15'}}>Privacy Policy</Text>.{' '}
              {'\n'} I agree that bookingqube may share my information with event
              organizers.
            </Text>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.handleRegister}>
              <Image
                source={ic_login}
                resizeMode="cover"
                style={styles.loginIconStyle}
              />
              <Text style={styles.loginButtonTextStyle}>{t('register')}</Text>
            </TouchableOpacity>

            <View style={styles.forgetAndRegisterContainer}>
              <Text style={styles.additionalTextStyle}>
                {t('already_account')}
              </Text>

              <Text style={styles.additionalTextStyle} onPress={this.handleLogin}>
                {t('login')}
              </Text>
            </View>

            {/* <View style={styles.lineContainer}></View> */}

            {/* <View style={styles.socialMediaContainer}>
              <Text style={styles.socialTextStyle}>Or Continue with</Text>
              <View style={styles.socialLoginContainer}>
                <View style={styles.facebookViewContainer}>
                  <Image
                    source={facebook}
                    resizeMode="cover"
                    style={styles.socialMediaIconStyle}
                  />

                  <Text style={styles.facebookTextStyle}>Facebook</Text>
                </View>

                <View style={styles.googleViewContainer}>
                  <Image
                    source={google}
                    resizeMode="cover"
                    style={styles.socialMediaIconStyle}
                  />

                  <Text style={styles.facebookTextStyle1}>Google</Text>
                </View>
              </View>
            </View> */}
          </View>

          {this.state.showProcessingLoader && <ProcessingLoader />}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(SignUpScreen);

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(3),
  },
  loginTextStyle: {
    fontSize: wp(8),
    fontWeight: '700',
    color: '#fff',
    marginVertical: hp(4),
  },
  inputContainer: {
    flexDirection: 'row',
    height: hp(7),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: wp(2),
    marginHorizontal: wp(2),
    marginVertical: wp(2),
    paddingLeft: wp(2),
    paddingRight: wp(2),
  },
  inputContainerDropdown: {
    flexDirection: 'row',
    height: hp(7.5),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: wp(2),
    marginHorizontal: wp(2),
    marginVertical: wp(2),
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    paddingLeft: wp(2),
    color: '#fff',
    borderRadius: wp(1),
    textAlign :  I18nManager.isRTL ? 'right' : 'left',
  },
  touchAbleButton: {
    position: 'absolute',
    right: 10,
    height: hp(6),
    width: wp(7),
    padding: 2,
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
  agreeTextStyle: {
    fontSize: wp(3.7),
    fontWeight: '700',
    color: '#fff',
    marginTop: hp(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: wp(95),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(3),
    marginVertical: hp(4),
  },
  loginIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },
  loginButtonTextStyle: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#f89b15',
    marginLeft: wp(2),
  },
  forgetAndRegisterContainer: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  additionalTextStyle: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  lineContainer: {
    height: hp(0.1),
    width: wp(90),
    backgroundColor: '#fff',
    marginVertical: hp(4),
  },
  socialMediaContainer: {},
  socialTextStyle: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'left',
    marginBottom: hp(2),
  },
  socialLoginContainer: {
    flexDirection: 'row',
    width: wp(90),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  facebookViewContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: wp(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
    backgroundColor: '#fff',
    marginTop: hp(1),
  },
  googleViewContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: wp(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
    backgroundColor: '#fff',
    marginTop: hp(1),
  },
  socialMediaIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },
  facebookTextStyle: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#f89b15',
  },
  facebookTextStyle1: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#f89b15',
    marginLeft: wp(2),
  },
});
