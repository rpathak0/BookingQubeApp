/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Keyboard,
  I18nManager,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';
import CustomLoader from '../component/CustomLoader';
import ProcessingLoader from '../component/ProcessingLoader';

// Icon
import ic_header_home_icon from '../assets/icon/ic_header_home_icon.png';
import ic_man from '../assets/icon/ic_man.png';

// Image
import header_image from '../assets/image/header_image.png';

// API Info
import { BASE_URL, makeRequest, STORAGE_URL } from '../api/ApiInfo';

// User Preference
import { async_keys, getData, clearData } from '../api/UserPreference';

import { showToast } from '../component/CustomToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { withTranslation } from 'react-i18next';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      name: '',
      email: '',
      address: '',
      phone: '',
      taxpayerNumber: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      isLoading: true,
      showProcessingLoader: false,
      hideCurrentPassword: true,
      hideNewPassword: true,
      hideConfirmPassword: true,
    };
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
    const axios = require('axios');

    // getting id from async storage
    const token = await getData(async_keys.userId);

    try {
      // calling api
      await axios
        .get(BASE_URL + 'profile', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })

        // processing response
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const { success, data } = newResponse.data;
            AsyncStorage.setItem('avatar', data.avatar);
            if (success === true) {
              this.setState({
                isLocalFile: false,
                name: data.name,
                email: data.email,
                address: data.address,
                phone: data.phone,
                taxpayerNumber: data.taxpayer_number,
                selectedFile: data.avatar,
                isLoading: false,
              });
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handleAddressChange = address => {
    this.setState({ address });
  };

  handlePhoneChange = phone => {
    this.setState({ phone });
  };

  handleTaxpayerNumberChange = taxpayerNumber => {
    this.setState({ taxpayerNumber });
  };

  handleCurrentPasswordChange = currentPassword => {
    this.setState({ currentPassword });
  };

  handleNewPasswordChange = newPassword => {
    this.setState({ newPassword });
  };

  handleConfirmPasswordChange = confirmPassword => {
    this.setState({ confirmPassword });
  };

  setCurrentPasswordVisibility = () => {
    this.setState({ hideCurrentPassword: !this.state.hideCurrentPassword });
  };

  setNewPasswordVisibility = () => {
    this.setState({ hideNewPassword: !this.state.hideNewPassword });
  };

  setConfirmPasswordVisibility = () => {
    this.setState({ hideConfirmPassword: !this.state.hideConfirmPassword });
    console.log('here');
  };

  handlePermissions = async () => {
    const { t } = this.props;
    try {
      if (Platform.OS === 'android') {
        const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            break;
          case RESULTS.GRANTED:
            // console.log("The permission is granted");
            this.handleFilePick();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            Alert.alert(
              t('permission_blocked'),
              t('permission_blocked_ie'),
              [
                {
                  text: t('cancel'),
                  style: 'cancel',
                },
                {
                  text: t('ok'),
                  onPress: this.handleOpenSettings,
                },
              ],
              { cancelable: false },
            );
        }
      } else if (Platform.OS === 'ios') {
        this.handleFilePick();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleFilePick = async () => {
    try {
      // Pick a single file
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      this.setState({ selectedFile: response, isLocalFile: true });
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  handleOpenSettings = async () => {
    const { t } = this.props;
    try {
      await openSettings();
    } catch (error) {
      console.log('cannot open settings', error);
    }
  };

  confirmProfileDelete = async () => {
    const { t } = this.props;
    // confirmation dialog
    Alert.alert(
      t('delete_account'),
      t('delete_account_ie'),
      [
        {text: t('cancel'), style: 'cancel'},
        {text: t('yes'), onPress: this.handleDeleteProfile},
      ],
      {cancelable: false},
    );
  }

  handleDeleteProfile = async () => {
    const { t } = this.props;

    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    // axios
    const axios = require('axios');

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      // starting processing loader
      this.setState({ showProcessingLoader: true });

      var data = new FormData();
      await axios
        .post(BASE_URL + 'profile/delete', data, axiosConfig)
        .then(response => {
          console.log('response', response);
          let newResponse = response.data;

          if (newResponse) {
            const { success, data } = newResponse;

            if (success === true) {
              // starting processing loader
              this.setState({ showProcessingLoader: false });

              // showing toast
              showToast(t('profile_deleted'));
              
              // Logout the user
              this.handleLogoutOkPress()
            }
          }
        });
    } catch (error) {
      // starting processing loader
      this.setState({ showProcessingLoader: false });

      showToast('Something went wrong.');
      console.log('error--->', error)
    }
  };

  handleLogoutOkPress = async () => {
    try {
      // clearing user preferences
      await clearData();

      // resetting navigation
      this.props.navigation.navigate('Home');
    } catch (error) {
      console.log(error.message);
    }
  };

  handleUpdateProfile = async () => {
    Keyboard.dismiss();

    const { t } = this.props;

    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    // axios
    const axios = require('axios');

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    };

    const {
      name,
      email,
      address,
      phone,
      taxpayerNumber,
      currentPassword,
      newPassword,
      confirmPassword,
      selectedFile,
    } = this.state;

    try {
      // starting processing loader
      this.setState({ showProcessingLoader: true });

      var data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('current', currentPassword);
      data.append('password', newPassword);
      data.append('password_confirmation', confirmPassword);
      data.append('address', address);
      data.append('taxpayer_number', taxpayerNumber);
      if (selectedFile) {
        data.append('profile_image', {
          name: selectedFile.name,
          type: selectedFile.type,
          uri: selectedFile.uri,
        });
      }


      await axios
        .post(BASE_URL + 'profile/update', data, axiosConfig)
        .then(response => {
          let newResponse = response.data;

          if (newResponse) {
            this.fetchProfile();

            const { success, data } = newResponse;

            if (success === true) {
              // starting processing loader
              this.setState({ showProcessingLoader: false });

              // showing toast
              showToast(data);
              this.componentDidMount();
            }
          }
        });
    } catch (error) {
      // starting processing loader
      this.setState({ showProcessingLoader: false });

      showToast(t('went_wrong'));
    }
  };

  render() {
    const { isLoading } = this.state;
    const { t } = this.props;

    if (isLoading) {
      return <CustomLoader />;
    }

    const url = STORAGE_URL;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={t("profile")}
          navAction="back"
          nav={this.props.navigation}
        />
        <ScrollView>
          <View style={styles.homeContainer}>
            <View style={styles.profileAvatarContainer}>
              {this.state.selectedFile === null ? (
                <Image
                  source={ic_man}
                  resizeMode="cover"
                  style={styles.profileAvatarIcon}
                />
              ) : (
                <>
                  {this.state.isLocalFile ? (
                    <Image
                      source={{ uri: this.state.selectedFile?.uri }}
                      resizeMode="cover"
                      style={styles.profileAvatarIcon1}
                    />
                  ) : (
                    <Image
                      source={{ uri: url + this.state.selectedFile }}
                      resizeMode="cover"
                      style={styles.profileAvatarIcon1}
                    />
                  )}
                </>
              )}
            </View>

            <Text style={styles.textInputText}>{t('avatar')}*</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.loginFormTextInput} onPress={this.handleFilePick}>{t('choose_avatar')}</Text>
            </View>

            <Text style={styles.textInputText}>{t('name')}*</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('name')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.name}
                onChangeText={this.handleNameChange}
              />
            </View>

            <Text style={styles.textInputText}>{t('email')}*</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('email')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.email}
                onChangeText={this.handleEmailChange}
              />
            </View>

            <Text style={styles.textInputText}>{t('address')}*</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('address')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.address}
                onChangeText={this.handleAddressChange}
              />
            </View>

            <Text style={styles.textInputText}>{t('phone_number')}*</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('phone_number')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.phone}
                onChangeText={this.handlePhoneChange}
              />
            </View>

            <Text style={styles.textInputText}>{t('taxpayer')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('taxpayer')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.taxpayerNumber}
                onChangeText={this.handleTaxpayerNumberChange}
              />
            </View>

            <Text style={styles.textInputText}>{t('current_password')}*</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('current_password')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                secureTextEntry={this.state.hideCurrentPassword}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.currentPassword}
                onChangeText={this.handleCurrentPasswordChange}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchAbleButton}
                onPress={this.setCurrentPasswordVisibility}>
                <Image
                  source={
                    this.state.hideCurrentPassword
                      ? require('../assets/icon/ic_hidden.png')
                      : require('../assets/icon/ic_view.png')
                  }
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.textInputText}>{t('new_password')}*</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('new_password')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                secureTextEntry={this.state.hideNewPassword}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.newPassword}
                onChangeText={this.handleNewPasswordChange}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchAbleButton}
                onPress={this.setNewPasswordVisibility}>
                <Image
                  source={
                    this.state.hideNewPassword
                      ? require('../assets/icon/ic_hidden.png')
                      : require('../assets/icon/ic_view.png')
                  }
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.textInputText}>{t('confirm_password')}*</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('confirm_password')}
                placeholderTextColor="#000"
                style={styles.loginFormTextInput}
                secureTextEntry={this.state.hideConfirmPassword}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.confirmPassword}
                onChangeText={this.handleConfirmPasswordChange}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchAbleButton}
                onPress={this.setConfirmPasswordVisibility}>
                <Image
                  source={
                    this.state.hideConfirmPassword
                      ? require('../assets/icon/ic_hidden.png')
                      : require('../assets/icon/ic_view.png')
                  }
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.handleUpdateProfile}>
              <Text style={styles.saveProfileText}>{t('save_profile')}</Text>
            </TouchableOpacity>

            <View style={styles.lineContainer}></View>
            
            <TouchableOpacity
              style={styles.buttonContainerDelete}
              onPress={this.confirmProfileDelete}>
              <Text style={styles.saveProfileText}>{t('delete_account')}</Text>
            </TouchableOpacity>

            {/* <Text style={styles.hostText}>Want to create & host events ?</Text> */}

            {/* <TouchableOpacity style={styles.hostButtonContainer}>
              <Text style={styles.saveProfileText}>Become Organizer</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>

        <FooterComponent nav={this.props.navigation} />

        {this.state.showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

export default withTranslation()(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
  },
  headerImageStyle: {
    height: hp(20),
    width: 'auto',
    backgroundColor: '#000000',
  },
  titleText: {
    position: 'absolute',
    top: hp(10),
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  eventHeadlineContainer: {
    position: 'absolute',
    top: hp(14),
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: wp(6),
    backgroundColor: '#f89b15',
    marginHorizontal: wp(4),
  },
  IconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(0.8),
    marginLeft: wp(2),
  },
  slashText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(0.8),
  },
  eventText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#c9c9c9',
    marginHorizontal: wp(0.8),
  },
  profileAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2),
  },
  profileAvatarIcon: {
    height: hp(14),
    aspectRatio: 1 / 1,
    
  },
  profileAvatarIcon1: {
    height: hp(14),
    aspectRatio: 1 / 1,
    borderRadius: wp(20),
  },
  textInputText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#000',
    marginTop: hp(2),
    marginBottom: hp(.5),
    marginHorizontal: wp(2),
  },
  inputContainer: {
    flexDirection: 'row',
    height: hp(7),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: wp(2),
    marginHorizontal: wp(2),
    paddingLeft: wp(2),
    paddingRight: wp(2),
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: wp(1),
    color: '#000',
    textAlign :  I18nManager.isRTL ? 'right' : 'left',
  },
  buttonContainer: {
    height: hp(6),
    width: wp(90),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#f89b15',
  },
  buttonContainerDelete: {
    height: hp(6),
    width: wp(90),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#ff7273',
  },
  saveProfileText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  hostText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#838383',
    marginHorizontal: wp(4),
    marginVertical: hp(1),
  },
  hostButtonContainer: {
    height: hp(6),
    width: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#000000',
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
  lineContainer: {
    height: hp(0.2),
    width: 'auto',
    backgroundColor: '#ddd',
    marginVertical: hp(0.5),
  },
});
