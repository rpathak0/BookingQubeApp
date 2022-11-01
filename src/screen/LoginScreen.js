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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNRestart from 'react-native-restart';

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
import { LoginContext } from '../context/LoginContext';
import { User } from '../utils/user';

// Validation
// import {isEmailAddress} from '../validation/FormValidator';

// export default class LoginScreen extends Component
const LoginScreen = ({navigation}) => {
  
  const {setLogin, setType} = useContext(LoginContext);
  const [loginFrom ,setLoginForm] =  useState([
    {"hidePassword": true}
  ])
  

  const handleChange = (value,name) => {
    
    const updatedLoginForm = {
      ...loginFrom,
      [name]:value
    }
    setLoginForm(updatedLoginForm);
  };

  

  const setPasswordVisibility = () => {
    setLoginForm(
      {
        ...loginFrom,
        hidePassword:!loginFrom?.hidePassword

      }
    );
  };

  const handleRegister = async () => {
    navigation.navigate('SignUp');
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    // const {email, password} = this.state;

    // validation
    // if (!isEmailAddress(email)) {
    //   Alert.alert('', 'Please enter email!', [{text: 'OK'}], {
    //     cancelable: false,
    //   });
    //   return;
    // }

    if (loginFrom?.password.trim() === '') {
      Alert.alert('', 'Please enter valid password!', [{text: 'OK'}], {
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
        device_name: 'android',
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'login', params, true);
      if (response) {
        const {success, errors, token ,auth} = response;

        if (success === true) {
          // stopping processing loader
          setLoginForm({...loginFrom, showProcessingLoader: false});
          new User().setToken(token);
          setType(auth?.role_id);
          setLogin('true');
          await storeData(async_keys.userId, token);
          await storeData(async_keys.userInfo, response.data.role_id);
          await storeData('avatar', response.data.avatar);

          RNRestart.Restart();
          // this.forceUpdate();
          // this.props.navigation.navigate('LoggedOut');
        } else {
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
      <ImageBackground style={styles.container} source={splash_image}>
        <HeaderComponent
          title="Login"
          navAction="back"
          nav={navigation}
        />
        <View style={styles.homeContainer}>
          <Text style={styles.loginTextStyle}>Login</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.loginFormTextInput}
              placeholder="Email"
              placeholderTextColor="#c4c3cb"
              keyboardType="default"
              underlineColorAndroid="transparent"
              value={ loginFrom?.email }
              onChangeText={(value)=>{handleChange(value,'email')}}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.loginFormTextInput}
              placeholder="Password"
              placeholderTextColor="#c4c3cb"
              keyboardType="default"
              secureTextEntry={loginFrom?.hidePassword}
              underlineColorAndroid="transparent"
              // value={this.state.password}
              // onChangeText={this.handlePasswordChange}
              value={ loginFrom?.password }
              onChangeText={(value)=>{handleChange(value,'password')}}
              InputProps={{disableUnderline: true}}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.touchAbleButton}
              onPress={()=>{setPasswordVisibility}}>
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
            <Text style={styles.loginButtonTextStyle}>Login</Text>
          </TouchableOpacity>

          <View style={styles.forgetAndRegisterContainer}>
            <Text
              style={styles.additionalTextStyle}
              onPress={handleForgetPassword}>
              Forgot Password?
            </Text>

            <Text
              style={styles.additionalTextStyle}
              onPress={handleRegister}>
              Register
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

                <Text style={styles.facebookTextStyle}>Google</Text>
              </View>
            </View>
          </View> */}
        </View>

        {loginFrom?.showProcessingLoader && <ProcessingLoader />}
      </ImageBackground>
    );
  
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00192f',
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
    marginVertical: hp(1),
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    paddingLeft: wp(2),
    color: '#fff',
    backgroundColor: '#334759',
    borderRadius: wp(1),
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
    color: '#1b89ef',
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
    color: '#1b89ef',
  },
  facebookTextStyle1: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#1b89ef',
    marginLeft: wp(2),
  },
});
