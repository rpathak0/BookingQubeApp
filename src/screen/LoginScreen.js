/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React, {Component, useContext, useState} from 'react';
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
  Platform,
  I18nManager,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNRestart from 'react-native-restart';

import {useTranslation} from 'react-i18next';

// Component
import ProcessingLoader from '../component/ProcessingLoader';
import {showToast} from '../component/CustomToast';
import HeaderComponent from '../component/HeaderComponent';

// Icon
import ic_login from '../assets/icon/ic_login.png';
// import facebook from '../assets/icon/facebook.png';
// import google from '../assets/icon/google.png';

// Image
import splash_image from '../assets/image/spalsh_image.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, storeData} from '../api/UserPreference';
import {LoginContext} from '../context/LoginContext';
import {User} from '../utils/user';

// Validation
import {isEmailAddress} from '../validation/FormValidator';

// export default class LoginScreen extends Component
const LoginScreen = ({navigation}) => {
  const {setLogin, setType} = useContext(LoginContext);
  const [loginFrom, setLoginForm] = useState({hidePassword: true});

  const {t} = useTranslation();

  const handleChange = (value, name) => {
    const updatedLoginForm = {
      ...loginFrom,
      [name]: value,
    };
    setLoginForm(updatedLoginForm);
  };

  const setPasswordVisibility = () => {
    setLoginForm({
      ...loginFrom,
      hidePassword: !loginFrom?.hidePassword,
    });
  };

  const handleRegister = async () => {
    navigation.navigate('SignUp');
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    const {email, password} = loginFrom;

    // validation
    if (!isEmailAddress(email)) {
      Alert.alert('', t('enter_valid_email'), [{text: t('ok')}], {
        cancelable: false,
      });
      return;
    }

    if (loginFrom?.password.trim() === '') {
      Alert.alert('', t('enter_valid_password'), [{text: t('ok')}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting processing loader
      setLoginForm({...loginFrom, showProcessingLoader: true});

      // preparing params
      const params = {
        email: loginFrom?.email,
        password: loginFrom?.password,
        device_name: Platform.OS,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'login', params, true);
      if (response) {
        const {success, errors, token, auth} = response;

        if (success === true) {
          // stopping processing loader
          setLoginForm({...loginFrom, showProcessingLoader: false});
          new User().setToken(token);
          setType(auth?.role_id);
          setLogin('true');

          console.log('async_keys.userId', async_keys.userId);
          console.log('token', token);

          console.log('async_keys.userInfo', async_keys.userInfo);
          console.log('response.data.role_id', response.data.role_id);

          console.log('response.data.avatar', response.data.avatar);

          await storeData(async_keys.userId, token);
          await storeData(async_keys.userInfo, response.data.role_id);
          await storeData('avatar', response.data.avatar);

          RNRestart.Restart();
          // this.forceUpdate();
          // this.props.navigation.navigate('LoggedOut');
        } else {
          console.log('errorrrrs', errors);
          const {username} = errors;

          // stopping processing loader
          setLoginForm({...loginFrom, showProcessingLoader: false});

          if (errors.username) {
            showToast(username[0]);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ImageBackground style={styles.container} source={splash_image}>
        <HeaderComponent title={t('login')} navAction="back" nav={navigation} />
        <View style={styles.homeContainer}>
          <Text style={styles.loginTextStyle}>{t('login')}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.loginFormTextInput}
              placeholder={t('email')}
              placeholderTextColor="#c4c3cb"
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              value={loginFrom?.email}
              onChangeText={value => {
                handleChange(value, 'email');
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.loginFormTextInput}
              placeholder={t('password')}
              placeholderTextColor="#c4c3cb"
              keyboardType="default"
              secureTextEntry={loginFrom?.hidePassword}
              underlineColorAndroid="transparent"
              // value={this.state.password}
              // onChangeText={this.handlePasswordChange}
              value={loginFrom?.password}
              onChangeText={value => {
                handleChange(value, 'password');
              }}
              InputProps={{disableUnderline: true}}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.touchAbleButton}
              onPress={() => {
                setPasswordVisibility;
              }}>
              <Image
                source={
                  loginFrom?.hidePassword
                    ? require('../assets/icon/ic_hide.png')
                    : require('../assets/icon/ic_show.png')
                }
                style={styles.buttonImage}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleLogin}>
            <Image
              source={ic_login}
              resizeMode="cover"
              style={styles.loginIconStyle}
            />
            <Text style={styles.loginButtonTextStyle}>{t('login')}</Text>
          </TouchableOpacity>

          <View style={styles.forgetAndRegisterContainer}>
            <Text
              style={styles.additionalTextStyle}
              onPress={handleForgetPassword}>
              {t('forgot_password_1')}
            </Text>

            <Text style={styles.additionalTextStyle} onPress={handleRegister}>
              {t('register')}
            </Text>
          </View>
        </View>

        {loginFrom?.showProcessingLoader && <ProcessingLoader />}
      </ImageBackground>
    </SafeAreaView>
  );
};
export default LoginScreen;

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
