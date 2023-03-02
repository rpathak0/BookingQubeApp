/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
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
import parsePhoneNumber, { parse } from 'libphonenumber-js'

import { async_keys, getData } from '../api/UserPreference';
const axios = require('axios');

// Component
import HeaderComponent from '../component/HeaderComponent';
import ProcessingLoader from '../component/ProcessingLoader';
import { showToast } from '../component/CustomToast';

// Icon
import ic_login from '../assets/icon/ic_login.png';
import facebook from '../assets/icon/facebook.png';
import google from '../assets/icon/google.png';

// Image
import splash_image from '../assets/image/spalsh_image.png';

// API
import { BASE_URL, makeRequest } from '../api/ApiInfo';

// Validation
import { isEmailAddress } from '../validation/FormValidator';

import { withTranslation } from 'react-i18next';
import { t } from 'i18next';
import { ScrollView } from 'react-native-gesture-handler';

const countryCodes = require("../static/CountryCodes.json");

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phone: '',
      hidePassword: true,
      showProcessingLoader: false,

      OpenGender: false,
      ValueGender: '',
      ItemsGender: [
        { label: 'Male', value: "male" },
        { label: 'Female', value: "female" },
      ],

      OpenCountry: false,
      ValueCountry: '',
      LoadingCountry: false,
      ItemsCountry: [],

      OpenCountryCallingCode: false,
      CountryCallingCode: '+974',
      CountryCode: '',
      CountryCodes: [],
      LoadingCountryCode: false,
    };
  }

  componentDidMount() {
    setTimeout(this.getCountries, 2000);
  }

  handleFirstNameChange = name => {
    this.setState({
      firstname: name,
    });
  };

  handleLastNameChange = name => {
    this.setState({ 
      lastname: name,
     });
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

   handlePhoneChange = phone => {
    this.setState({ phone });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
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
    this.setState(state => ({
      ItemsGender: callback(state.ItemsGender)
    }));
  }

  setOpenCountry = (OpenCountry) => {
    this.setState({
      OpenCountry
    });
  }

  setOpenCountryCallingCode = (OpenCountryCallingCode) => {
    this.setState({
      OpenCountryCallingCode
    });
  }

  setLoadingCountry = (LoadingCountry) => {
    this.setState({
      LoadingCountry
    });
  }

  setLoadingCountryCode = (LoadingCountryCode) => {
    this.setState({
      LoadingCountryCode
    });
  }

  setValueCountry = (callback) => {
    this.setState(state => ({
      ValueCountry: callback(state.ValueCountry)
    }));
  }

  setCountryCallingCode = (callback) => {
    this.setState(state => ({
      CountryCallingCode: callback(state.CountryCallingCode)
    }));
  }

  setItemsCountry = (countries) => {

    this.setState(state => ({
      ItemsCountry: countries
    }));
  }

  setItemsCountryCode = (countries) => {

    this.setState(state => ({
      CountryCodes: countries
    }));
  }

  getCountries = async () => {
    // getting userId from asyncStorage
    try {
      this.setLoadingCountry(true);
      // calling api
      await axios
        .get(BASE_URL + 'get-countries')
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const { status, countries } = newResponse.data;
            let ItemsCountry = [];


            if (status === true) {
              countries.map(item => {
                ItemsCountry.push({ label: item.country_name, value: item.id });
              });

              this.setItemsCountry(ItemsCountry);
              this.setLoadingCountry(false);
            }

            let CountryCodes = [];
            countryCodes.map((item, index) => {
              // do not push country code which are already in the array
              if (CountryCodes.findIndex(code => code.value === item.dial_code) === -1)
                CountryCodes.push({ id: index, label: `(${item.dial_code}) ${item.name}`, value: item.dial_code, code: item.code });
            })

            this.setState({ CountryCodes: CountryCodes });
          }
        });

    } catch (error) {
      console.log(error.message);
      this.setLoadingCountry(false);
    }
  };

  handleRegister = async () => {
    const { t } = this.props;
    Keyboard.dismiss();

    const { 
      firstname, 
      lastname, 
      email, 
      password, 
      ValueGender, 
      ValueCountry, 
      phone, 
      CountryCallingCode, 
      CountryCode } = this.state;

    console.log({
      firstname,
      lastname,
      email,
      password,
      ValueGender,
      ValueCountry,
      phone,
      CountryCallingCode,
      CountryCode
    })


    // validation
    if (firstname.trim() === '' || lastname.trim() === '') {
      Alert.alert('', t('enter_name_first'), [{ text: t('ok') }], {
        cancelable: false,
      });
      return;
    }

    if (!isEmailAddress(email)) {
      Alert.alert('', t('enter_email_first'), [{ text: t('ok') }], {
        cancelable: false,
      });
      return;
    }

    if (password.trim() === '') {
      Alert.alert('', t('enter_valid_password'), [{ text: t('ok') }], {
        cancelable: false,
      });
      return;
    }

    if (ValueGender == '' || ValueGender == null) {
      Alert.alert('', t('select_gender'), [{ text: t('ok') }], {
        cancelable: false,
      });
      return;
    }

    if (ValueCountry == '' || ValueCountry == null) {
      Alert.alert('', t('select_country'), [{ text: t('ok') }], {
        cancelable: false,
      });
      return;
    }

    if (phone.trim() === '') {
      Alert.alert('', t('enter_phone'), [{ text: t('ok') }], {
        cancelable: false,
      });
      return;
    }

    const parsedPhone = parsePhoneNumber(CountryCallingCode + phone, CountryCode);
    if (parsedPhone) {
      console.log("Phone Number Valid:", parsedPhone.isValid())
      if (!parsedPhone.isValid()) {
        Alert.alert('', t('enter_valid_phone'), [{ text: t('ok') }], {
          cancelable: false,
        });
        return;
      }
    }

    try {
      // starting processing loader
      // this.setState({showProcessingLoader: true});

      // preparing params
      const params = {
        name: firstname + ' ' + lastname,
        email: email,
        password: password,
        gender: ValueGender,
        country_id: ValueCountry,
        phone: CountryCallingCode + phone,
        accept: 'true',
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'register', params, true);

      // processing response
      if (response) {
        const { status, message, errors } = response;

        if (status === true) {
          // stopping processing loader
          this.setState({ showProcessingLoader: false });

          // showing toast
          showToast(message);

          // navigating to login screen
          this.props.navigation.navigate('Login');
        } else if (errors) {
          // const {name, email, password} = errors;

          //   // stopping processing loader
          this.setState({ showProcessingLoader: false });

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
        <ScrollView>
          <View style={styles.homeContainer}>
            <Text style={styles.loginTextStyle}>{t('register')}</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.loginFormTextInput}
                placeholder={t('first_name')}
                placeholderTextColor="#c4c3cb"
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.firstname}
                onChangeText={this.handleFirstNameChange}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.loginFormTextInput}
                placeholder={t('last_name')}
                placeholderTextColor="#c4c3cb"
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.lastname}
                onChangeText={this.handleLastNameChange}
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
                zIndex={1000}
                theme="DARK"
                listMode='MODAL'
                modalProps={{ animationType: "fade" }}
                modalTitle={t('select_gender')}
                placeholder={t('select_gender')}
                modalTitleStyle={{ fontWeight: "bold" }}
                style={{ backgroundColor: 'transparent' }}
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
                loading={this.setLoadingCountry}
                searchable={true}
                zIndex={1000}
                theme="DARK"
                listMode='MODAL'
                modalProps={{ animationType: "fade" }}
                modalTitle={t('select_country')}
                placeholder={t('select_country')}
                searchPlaceholder={t('search_country')}
                modalTitleStyle={{ fontWeight: "bold" }}
                style={{ backgroundColor: 'transparent' }}
              />
            </View>

            <View style={{
              flexDirection: 'row',
              width: '100%',
            }}>
              <View style={{
                ...styles.inputContainerDropdown,
                height: hp(7),
                width: 100,
                alignSelf: 'flex-start',
              }}>
                <DropDownPicker
                  open={this.state.OpenCountryCallingCode}
                  value={this.state.CountryCallingCode}
                  items={this.state.CountryCodes}
                  setOpen={this.setOpenCountryCallingCode}
                  setValue={this.setCountryCallingCode}
                  setItems={this.setItemsCountryCode}
                  loading={this.setLoadingCountryCode}
                  searchable={true}
                  zIndex={1000}
                  theme="DARK"
                  listMode='MODAL'
                  modalProps={{ animationType: "fade" }}
                  modalTitle={t('select_country_code')}
                  placeholder={"(+974)"}
                  searchPlaceholder={t('search_country_code')}
                  modalTitleStyle={{ fontWeight: "bold" }}
                  style={{ backgroundColor: 'transparent' }}
                  onSelectItem={(item) => {
                    console.log(item);
                    this.setState({
                      CountryCode: item.code
                    })
                  }}
                />
              </View>

              <View style={{
                ...styles.inputContainer,
                width: '65%',
              }}>
                <TextInput
                  style={styles.loginFormTextInput}
                  placeholder={t('phone_number')}
                  autoCapitalize="none"
                  placeholderTextColor="#c4c3cb"
                  keyboardType="phone-pad"
                  underlineColorAndroid="transparent"
                  value={this.state.phone}
                  onChangeText={this.handlePhoneChange}
                />
              </View>
            </View>

            <Text style={styles.agreeTextStyle}>
              By clicking "Register", I accept the{' '}
              Terms of Service and have
              read the Privacy Policy.{' '}
              {'\n\n'}I agree that bookingqube may share my information with event
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
        </ScrollView>
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
    textAlign: I18nManager.isRTL ? 'right' : 'left',
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
    textAlign: 'center',
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
    color: '#000000',
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
    color: '#000000',
  },
  facebookTextStyle1: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#000000',
    marginLeft: wp(2),
  },
});
