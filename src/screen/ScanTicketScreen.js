/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import moment from 'moment';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';
import { showToast } from '../component/CustomToast';
import ProcessingLoader from '../component/ProcessingLoader';

// Icon
import ic_header_home_icon from '../assets/icon/ic_header_home_icon.png';
import ic_categories from '../assets/icon/ic_categories.png';
// import ic_camera from '../assets/icon/ic_camera.png';

// Image
import header_image from '../assets/image/header_image.png';

// API Info
import { BASE_URL } from '../api/ApiInfo';

// User Preference
import { async_keys, getData } from '../api/UserPreference';
import { ScrollView } from 'react-native-gesture-handler';

import { withTranslation } from 'react-i18next';

class ScanTicketScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scannerData: null,
      checkedIn: 0,
      showProcessingLoader: false,
      ticketList: [],
      showQR: 1,
    };
  }

  onSuccess = async e => {
    const data = JSON.parse(e.data);
    const { t } = this.props;
    console.log(data);

    this.setState({ scannerData: data });

    // showing custom toast
    showToast(t('ticket_scanned'));

    // axios
    const axios = require('axios');

    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      // starting processing loader
      this.setState({ showProcessingLoader: true });

      // calling api
      await axios
        .post(BASE_URL + 'get-booking', data, axiosConfig)
        .then(response => {
          let newResponse = response.data;

          console.log(newResponse);

          if (newResponse) {
            // console.log('here');
            const { status } = newResponse;
            if (status === true) {
              // console.log(newResponse.booking.checked_in);
              this.setState({
                ticketList: newResponse.booking,
                showQR: null,
                showProcessingLoader: false,
              });
            }
          }
        });
    } catch (error) {
      console.log(error.response.data.message);

      this.setState({ showProcessingLoader: false });
      Alert.alert(t('alert'), JSON.stringify(error.response.data.message), [
        { text: t('ok'), onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  // handleGetBooking = async () => {
  //   const {scannerData} = this.state;

  //   // axios
  //   const axios = require('axios');

  //   // getting token from AsyncStorage
  //   const token = await getData(async_keys.userId);

  //   // creating custom header
  //   let axiosConfig = {
  //     headers: {
  //       Authorization: 'Bearer ' + token,
  //     },
  //   };

  //   try {
  //     // starting processing loader
  //     this.setState({showProcessingLoader: true});

  //     // calling api
  //     await axios
  //       .post(BASE_URL + 'get-booking', scannerData, axiosConfig)
  //       .then(response => {
  //         let newResponse = response.data;

  //         if (newResponse) {
  //           const {status} = newResponse;
  //           if (status === true) {
  //             // console.log(newResponse.booking.checked_in);
  //             this.setState({
  //               checkedIn: newResponse.booking.checked_in,
  //               showProcessingLoader: false,
  //             });
  //           }
  //         }
  //       });
  //   } catch (error) {
  //     console.log(error.response.data.message);

  //     this.setState({showProcessingLoader: false});
  //     Alert.alert('Alert', JSON.stringify(error.response.data.message), [
  //       {text: 'OK', onPress: () => console.log('OK Pressed')},
  //     ]);
  //   }
  // };

  scanner = () => {
    this.scanner.reactivate();
  };

  handleCheckedIn = async () => {
    const { scannerData } = this.state;
    const { t } = this.props;

    // axios
    const axios = require('axios');

    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      // starting processing loader
      this.setState({ showProcessingLoader: true });

      // calling api
      await axios
        .post(BASE_URL + 'get-booking', scannerData, axiosConfig)
        .then(response => {
          let newResponse = response.data;

          if (newResponse) {
            const { status } = newResponse;
            if (status === true) {
              // console.log(newResponse.booking.checked_in);
              this.setState({
                checkedIn: newResponse.booking.checked_in,
                showQR: 1,
                showProcessingLoader: false,
              });
            }
          }
        });
    } catch (error) {
      console.log(error.response.data.message);

      this.setState({ showProcessingLoader: false });
      Alert.alert(t('alert'), JSON.stringify(error.response.data.message), [
        { text: t('ok'), onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  handleCheckedOut = async () => {
    const { scannerData } = this.state;
    const { t } = this.props;

    // axios
    const axios = require('axios');

    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      // starting processing loader
      this.setState({ showProcessingLoader: true });

      // calling api
      await axios
        .post(BASE_URL + 'get-booking', scannerData, axiosConfig)
        .then(response => {
          let newResponse = response.data;

          if (newResponse) {
            const { status } = newResponse;
            if (status === true) {
              // console.log(newResponse.booking.checked_in);
              this.setState({
                showQR: 1,
                checkedIn: 0,
                showProcessingLoader: false,
              });
            }
          }
        });
    } catch (error) {
      console.log(error.response.data.message);

      this.setState({ showProcessingLoader: false });
      Alert.alert(t('alert'), JSON.stringify(error.response.data.message), [
        { text: t('ok'), onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  render() {
    let scanner;
    const  { t } = this.props;
    if (this.state.showQR === 1) {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderComponent title={t('check_in')} nav={this.props.navigation} />

          <View style={styles.homeContainer}>
            {/* <ImageBackground
              source={header_image}
              resizeMode="cover"
              style={styles.headerImageStyle}>
              <View style={styles.eventHeadlineContainer}>
                <Image
                  source={ic_header_home_icon}
                  resizeMode="cover"
                  style={styles.IconStyle}
                />

                <Text style={styles.slashText}>/</Text>
                <Text style={styles.eventText}>Scan Ticket</Text>
              </View>
            </ImageBackground> */}


            <View style={styles.scanTicketOuter}>
              <View style={styles.scanTicketContainer}>
                <Image
                  source={ic_categories}
                  resizeMode="cover"
                  style={styles.categoryIconStyle}
                />
                <Text style={styles.scanTextStyle}>{t('scan_ticket')}</Text>
              </View>
              <View style={styles.scanTicketWrapper}>
                <View style={styles.scanTicketInner}>
                  <QRCodeScanner
                    onRead={this.onSuccess}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    cameraContainerStyle={{
                      width: '75.3%',
                      borderWidth: 1,
                      borderColor: '#838383',
                      alignSelf: 'center',
                    }}
                    reactivate={true}
                    reactivateTimeout={2000}
                    cameraStyle={{ width: '90%', alignSelf: 'center' }}
                    ref={camera => (scanner = camera)}
                  />
                </View>
                <View  style={styles.scanTicketButtonWrapper}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this.handleCheckedIn}>
                    <Text style={styles.buttonText}>{t('check_in')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>



            {/*
            <View style={styles.cameraScanContainer}>
              <Image
                source={ic_camera}
                resizeMode="cover"
                style={styles.categoryIconStyle}
              />
              <Text style={styles.cameraTextStyle}>Camera not detected!</Text>
            </View> */}
          </View>

          <FooterComponent nav={this.props.navigation} />

          {this.state.showProcessingLoader && <ProcessingLoader />}
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderComponent title={t('scan_ticket')} nav={this.props.navigation} />

          <View style={styles.homeContainer}>
            <ImageBackground
              source={header_image}
              resizeMode="cover"
              style={styles.headerImageStyle}>
              <View style={styles.eventHeadlineContainer}>
                <Image
                  source={ic_header_home_icon}
                  resizeMode="cover"
                  style={styles.IconStyle}
                />

                <Text style={styles.slashText}>/</Text>
                <Text style={styles.eventText}>{t('scan_ticket')}</Text>
              </View>
            </ImageBackground>

            <View style={styles.scanTicketContainer}>
              <Image
                source={ic_categories}
                resizeMode="cover"
                style={styles.categoryIconStyle}
              />

              <Text style={styles.scanTextStyle}>{t('scan_ticket')}</Text>
            </View>

            {this.state.ticketList.map(item => (
              <ScrollView>
                <View style={styles.bookedTicketContainer}>
                  <Text style={styles.orderIdText}>{t('order_id')}</Text>
                  <Text style={styles.orderIdText}># {item.common_order}</Text>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('event')}</Text>
                  <Text style={styles.eventPlaceText}>
                    {item.event_title} ({item.event_category})
                  </Text>

                  <Text style={styles.eventTitleText}>{t('timings')}</Text>
                  <Text style={styles.eventTimeText}>
                    {item.event_start_date}
                    {'\n'}
                    {item.event_start_time} - {item.event_end_time}
                    {'\n'}(IST)
                  </Text>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('ticket')}</Text>
                  <Text style={styles.eventTimeText}>
                    {item.ticket_title} x {item.quantity}
                  </Text>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('order_total')}</Text>
                  <Text style={styles.eventTimeText}>
                    {item.net_price} {this.state.currency}
                  </Text>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('promocode_reward')}</Text>
                  <Text style={styles.eventTimeText}>
                    {item.promocode} {this.state.currency}
                  </Text>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('booked_on')}</Text>
                  <Text style={styles.eventTimeText}>{moment(item.created_at).format('DD-MMM-YYYY')}</Text>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('payment')}</Text>

                  <View style={styles.paymentContainer}>
                    <Text style={styles.paymentMethodText}>
                      {item.payment_type}
                    </Text>

                    <View style={styles.paymentMethodLine}></View>
                    {item.is_paid === 0 ? (
                      <Text style={styles.paymentProcessText}>{t('pending')}</Text>
                    ) : (
                      <Text style={styles.paymentProcessText}>{t('paid')}</Text>
                    )}
                  </View>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('check_in')}</Text>
                  <View style={styles.checkedInContainer}>
                    {item.checked_in === 0 ? (
                      <Text style={styles.checkedInText}>{t('no')}</Text>
                    ) : (
                      <Text style={styles.checkedInText}>{t('yes')}</Text>
                    )}
                  </View>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('status')}</Text>
                  <View style={styles.statusContainer}>
                    {item.status === 1 ? (
                      <Text style={styles.statusText}>{t('enabled')}</Text>
                    ) : (
                      <Text style={styles.statusText}>{t('disabled')}</Text>
                    )}
                  </View>

                  <View style={styles.lineContainer}></View>

                  <Text style={styles.eventTitleText}>{t('expired')}</Text>
                  <View style={styles.expiredContainer}>
                    <Text style={styles.expiredText}>{t('no')}</Text>
                  </View>
                </View>
              </ScrollView>
            ))}

            {/*
            <View style={styles.cameraScanContainer}>
              <Image
                source={ic_camera}
                resizeMode="cover"
                style={styles.categoryIconStyle}
              />
  
              <Text style={styles.cameraTextStyle}>Camera not detected!</Text>
            </View> */}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.handleCheckedIn}>
              <Text style={styles.buttonText}>{t('check_in')}</Text>
            </TouchableOpacity>
          </View>

          <FooterComponent nav={this.props.navigation} />

          {this.state.showProcessingLoader && <ProcessingLoader />}
        </SafeAreaView>
      );
    }
  }
}

export default withTranslation()(ScanTicketScreen);

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
    backgroundColor: '#00192f',
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
    backgroundColor: '#1b89ef',
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
  scanTicketContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: hp(2),
    marginHorizontal: wp(4),
    backgroundColor: '#d9edf7',
    paddingVertical: hp(2),
  },
  categoryIconStyle: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  scanTextStyle: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#3d4b62',
    textAlign: 'center',
    marginLeft: wp(2),
  },
  cameraScanContainer: {
    height: hp(6),
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: hp(2),
    marginHorizontal: wp(4),
    backgroundColor: '#f2dede',
    paddingVertical: hp(2),
  },
  cameraTextStyle: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#a94546',
    textAlign: 'center',
    marginLeft: wp(2),
  },
  buttonContainer: {
    width:'75%',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b89ef',
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    marginTop: hp(3),
    // borderRadius: wp(4),
  },
  buttonText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  bookedTicketContainer: {
    marginHorizontal: wp(2),
    marginVertical: hp(2),
    borderWidth: 1,
    borderColor: '#838383',
    borderRadius: wp(1),
    backgroundColor: '#fff',
  },
  orderIdText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#838383',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  lineContainer: {
    height: hp(0.2),
    width: 'auto',
    backgroundColor: '#838383',
    marginVertical: hp(0.5),
  },
  eventTitleText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#838383',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  eventPlaceText: {
    fontSize: wp(3.5),
    color: '#1b89ef',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  eventTimeText: {
    fontSize: wp(3.5),
    color: '#838383',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  paymentContainer: {
    height: hp(8),
    width: wp(18),
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    borderRadius: wp(4),
  },
  paymentMethodText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  paymentMethodLine: {
    height: hp(0.3),
    width: wp(10),
    backgroundColor: '#fff',
    marginVertical: hp(0.5),
  },
  paymentProcessText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: 'green',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  checkedInContainer: {
    height: hp(4),
    width: wp(10),
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    borderRadius: wp(4),
  },
  checkedInText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  statusContainer: {
    height: hp(4),
    width: wp(20),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    borderRadius: wp(4),
  },
  statusText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  cancellationContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    borderRadius: wp(4),
    backgroundColor: '#ff7273',
  },
  cancelIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  cancelText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  expiredContainer: {
    height: hp(4),
    width: wp(10),
    backgroundColor: '#1b89ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    borderRadius: wp(4),
  },
  expiredText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  ticketActionContainer: {
    flexDirection: 'row',
    // marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  ticketContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: wp(30),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b289',
    marginHorizontal: wp(2),
  },
  downloadIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },
  ticketText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  downloadBookingQRcodeContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: 'auto',
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b289',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  checkInButtonContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: wp(30),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b89ef',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  checkoutContainer: {
    height: hp(4),
    width: wp(15),
    backgroundColor: '#1b89ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    borderRadius: wp(4),
  },
  noBookingStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2),
  },
  noBookingText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
  },
  scanTicketOuter:{
    flex: 1,
    flexDirection: 'column',
  },
  scanTicketWrapper:{
    flex: 1,
    flexDirection: 'column',
  },
  scanTicketInner:{
    flex: 8,
  },
  scanTicketButtonWrapper:{
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  }
});


