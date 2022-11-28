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
import ic_reset from '../assets/icon/ic_reset.png';

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
    console.log('datadata', data);

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
      data.url_route = 'eventmie.checkout_get_booking';
      await axios
        .post(BASE_URL + 'get-booking', data, axiosConfig)
        .then(response => {
          let newResponse = response.data;

          console.log('newResponsenewResponsenewResponse', response);

          if (newResponse) {
            // console.log('here');
            const { status } = newResponse;
            if (status === true) {
              console.log('newResponse.booking.checked_in', newResponse.booking);
              this.setState({
                ticketList: [newResponse.booking],
                showQR: null,
                showProcessingLoader: false,
              });

              // autorefresh after 5 seconds
              setTimeout(() => {
                this.scannerRefresh();
              }, 5000);
            }
          }
        });
    } catch (error) {
      console.log('get-booking-error', error.response.data.message);

      this.setState({ showProcessingLoader: false });
      Alert.alert(t('alert'), JSON.stringify(error.response.data.message), [
        { text: t('ok'), onPress: () => console.log('OK Pressed') },
      ]);
    }


  };

  scannerRefresh = () => {
    this.setState({
      ticketList: [],
      showQR: 1,
    });
  };

  render() {
    const  { t } = this.props;
    if (this.state.showQR === 1) {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderComponent title={t('check_out')} nav={this.props.navigation} />

          <View style={styles.homeContainer}>
            <View style={styles.scanTicketContainer}>
              <Text style={styles.scanTextStyle}>{t('check_out')}</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttonContainerRefresh}
                onPress={() => {this.scannerRefresh()}}>
                <Image
                  source={ic_reset}
                  resizeMode="cover"
                  style={styles.ticketIconStyle}
                />
                <Text style={styles.buttonText}>{t('reload_scanner')}</Text>
              </TouchableOpacity>
            </View>    
            <View style={styles.scanTicketInner}>
              <QRCodeScanner
                onRead={this.onSuccess}
                flashMode={RNCamera.Constants.FlashMode.auto}
                cameraContainerStyle={{
                  width: '100%',
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: '#838383',
                  alignSelf: 'center',
                }}
                reactivate={true}
                reactivateTimeout={3000}
                cameraStyle={{ width: '100%', alignSelf: 'center' }}
                ref={this.scanner}
              />
            </View>
              
            
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
            {this.state.ticketList.map(item => (
              <ScrollView>
                <View>
                  <TouchableOpacity
                    style={styles.buttonContainerRefresh}
                    onPress={() => {this.scannerRefresh()}}>
                    <Image
                      source={ic_reset}
                      resizeMode="cover"
                      style={styles.ticketIconStyle}
                    />
                    <Text style={styles.buttonText}>{t('reload_scanner')}</Text>
                  </TouchableOpacity>
                </View>    
                <View style={styles.bookedTicketContainer}>
                  <View style={styles.orderIdWrapper}>
                    <Text style={styles.orderIdText}>{t('order_id')} #{item.order_number}</Text>
                  </View>
                  
                  <Text style={styles.eventTitleText}>{t('event')}</Text>
                  <Text style={styles.eventPlaceText}>
                    {item.event_title} ({item.event_category})
                  </Text>

                  <Text style={styles.eventTitleText}>{t('timings')}</Text>
                  <Text style={styles.eventTimeText}>
                    {item.event_start_date} {item.event_start_time} - {item.event_end_time}
                  </Text>

                  <View style={styles.lineContainer}></View>

                  <View style={styles.twoColumns}>
                    <View>
                      <Text style={styles.eventTitleText}>{t('customer_name')}</Text>
                      <Text style={styles.eventTimeText}>
                        {item.customer_name}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.eventTitleText}>{t('attendee_name')}</Text>
                      <Text style={styles.eventTimeText}>
                      {item.attendees[0].name}
                      </Text>
                    </View>
                    
                  </View>

                  <View style={styles.lineContainer}></View>

                  <View style={styles.twoColumns}>
                    <View>
                      <Text style={styles.eventTitleText}>{t('ticket')}</Text>
                      <Text style={styles.eventTimeText}>
                        {item.ticket_title} x {item.quantity}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.eventTitleText}>{t('order_total')}</Text>
                      <Text style={styles.eventTimeText}>
                        {item.net_price} {this.state.currency}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.eventTitleText}>{t('booked_on')}</Text>
                      <Text style={styles.eventTimeText}>{moment(item.created_at).format('DD-MMM-YYYY')}</Text>
                    </View>
                  </View>

                  <View style={styles.lineContainer}></View>

                  <View style={styles.twoColumns}>
                    <View>
                      <Text style={styles.eventTitleText}>{t('payment')}</Text>
                      <Text style={styles.eventTimeText}>
                        {item.payment_type} / 
                        {item.is_paid === 0 ? (
                          <Text style={styles.paymentProcessText}>{t('pending')}</Text>
                        ) : (
                          <Text style={styles.paymentProcessText}>{t('paid')}</Text>
                        )}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.eventTitleText}>{t('status')}</Text>
                      {item.status === 1 ? (
                        <Text style={styles.checkedInTextYes}>{t('enabled')}</Text>
                      ) : (
                        <Text style={styles.checkedInTextNo}>{t('disabled')}</Text>
                      )}
                    </View>
                    <View>
                      <Text style={styles.eventTitleText}>{t('checked_in')}</Text>
                      {item.checked_in === 0 ? (
                        <Text style={[styles.checkedInTextNo]}>{t('no')}</Text>
                      ) : (
                        <Text style={[styles.checkedInTextYes]}>{t('yes')}</Text>
                      )}
                    </View>
                  </View>
                  
                </View>
              </ScrollView>
            ))}
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
    backgroundColor: '#000000',
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
  scanTicketContainer: {
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: hp(2),
    backgroundColor: '#fb462a',
  },
  categoryIconStyle: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  scanTextStyle: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
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
    flexDirection: 'row',
    height: hp(8),
    width: '95%',
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b289',
  },
  buttonContainerRefresh: {
    height: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
    backgroundColor: '#000',
    marginTop: hp(2),
    marginHorizontal: wp(4),
    paddingVertical: hp(2.5),
  },
  buttonText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  bookedTicketContainer: {
    marginHorizontal: wp(2),
    marginVertical: hp(2),
    paddingBottom: hp(1),
    borderRadius: wp(3),
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
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#838383',
    marginHorizontal: wp(2),
    marginTop: hp(1),
    marginBottom: hp(0),
  },
  eventPlaceText: {
    fontSize: wp(3.5),
    color: '#000',
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
    backgroundColor: '#f89b15',
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
    backgroundColor: '#f89b15',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  checkoutContainer: {
    height: hp(4),
    width: wp(15),
    backgroundColor: '#f89b15',
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
    // flex: 1,
    // flexDirection: 'column',
  },
  scanTicketWrapper:{
    // flex: 1,
    // flexDirection: 'column',
  },
  scanTicketInner:{
    marginTop: hp(2),
    marginHorizontal: wp(4),
  },
  scanTicketButtonWrapper:{
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop: hp(3),
  },
  orderIdWrapper: {
    backgroundColor: '#000',
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    paddingVertical: hp(1.5),
  },
  twoColumns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkedInTextNo: {
    fontSize: wp(3.5),
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    fontWeight: '700',
    color: '#999',
  },
  checkedInTextYes: {
    fontSize: wp(3.5),
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    fontWeight: '700',
    color: '#00b289',
  },
  ticketIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },
});


