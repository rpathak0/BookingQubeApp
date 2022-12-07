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
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager,
  ActivityIndicator,
  Platform
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { withTranslation } from 'react-i18next';

import {Download} from './Download';
import { STORAGE_URL } from '../api/ApiInfo';
// Component
import CustomLoader from '../component/CustomLoader';
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';
import {showToast} from '../component/CustomToast';
import ProcessingLoader from '../component/ProcessingLoader';

import LayoutSize from '../Helper/LayoutSize';
import CountDown from 'react-native-countdown-component';
import { checkoutCountDown } from '../Helper/dateConverter';

// Icon
import ic_header_home_icon from '../assets/icon/ic_header_home_icon.png';
import ic_cancellation from '../assets/icon/ic_cancellation.png';
import ic_download from '../assets/icon/ic_download.png';
import ic_check_in from '../assets/icon/ic_check_in.png';

// Image
import header_image from '../assets/image/header_image.png';

// API Info
import {BASE_URL} from '../api/ApiInfo';

// User Preference
import {async_keys, getData} from '../api/UserPreference';

class MyBookingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: '',
      events: [
        {
          itemName: 'All Events',
        },
      ],
      bookingDate: '',
      searchText: '',
      selectedShow: '',
      show: [
        {
          itemName: 'All',
        },
      ],
      eventDate: '',
      ticketList: [],
      checkBookingStatus: null,
      currency: null,
      attendEventData: [],
      isLoading: true,
      showProcessingLoader: false,

      checkModal: false,
      qrCodeFile: null,
      barCodeFile: null,
      qrCodeOrderNumber: null,
    };
  }

  componentDidMount() {
    this.fetchBookedTickets();
    this.getAllEvent();
  }

  fetchBookedTickets = async () => {
    const { t } = this.props;
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    const axios = require('axios');

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      // calling api
      await axios
        .post(BASE_URL + 'my-bookings', {}, axiosConfig)
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const {status} = newResponse;

            console.log(newResponse);

            if (status === 200) {
              // console.log(newResponse.data.currency);

              if (newResponse?.data?.bookings?.data === 0) {
                this.setState({
                  checkBookingStatus: null,
                  isLoading: false,
                });
              } else {
                this.setState({
                  ticketList: newResponse.data.bookings.data,
                  currency: newResponse.data.currency,
                  isLoading: false,
                });
              }
            }
          }
        });
    } catch (error) {
      console.log(error.response?.data);

      this.setState({isLoading: false});

      showToast(t('went_wrong'));
    }
  };

  getAllEvent = async () => {
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    // axios
    const axios = require('axios');

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      // calling api
      await axios.get(BASE_URL + 'my-events', axiosConfig).then(response => {
        // console.log(response?.data);
        let newResponse = response?.data;

        if (newResponse) {
          const {status} = newResponse;

          if (status === true) {
            this.setState({attendEventData: newResponse.data});
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  getAllFilterData = async () => {
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    const {bookingDate, eventDate, searchText, selectedEvent} = this.state;

    // axios
    const axios = require('axios');

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      // preparing params
      const params = {
        event_start_date: bookingDate,
        event_end_date: eventDate,
        search: searchText || selectedEvent,
      };

      // calling api
      await axios
        .post(BASE_URL + 'my-bookings', params, axiosConfig)
        .then(response => {
          let newResponse = response;

          console.log(newResponse);

          if (newResponse) {
            const {status} = newResponse;

            if (status === 200) {
              // console.log(newResponse.data.currency);

              if (newResponse?.data?.bookings?.data === 0) {
                this.setState({
                  checkBookingStatus: null,
                  isLoading: false,
                });
              } else {
                this.setState({
                  ticketList: newResponse.data.bookings.data,
                  currency: newResponse.data.currency,
                  isLoading: false,
                });
              }
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSelectedEvent = async value => {
    await this.setState({
      selectedEvent: value,
      isEnabled: true,
    });
    this.getAllFilterData();
  };

  handleBookingDateChange = bookingDate => {
    this.setState({bookingDate});
  };

  handleEventDateChange = eventDate => {
    this.setState({eventDate});
  };

  handleSearchChange = searchText => {
    this.setState({searchText});
    this.getAllFilterData();
  };

  handleBookingDate = async () => {
    const {bookingDate} = this.state;

    await this.setState(
      {
        setDatePickerVisibility: true,
        isDatePickerVisible: true,
        bookingDate: bookingDate,
      },
      () => {
        console.log(bookingDate);
      },
    );
  };

  handleEventDate = async () => {
    const {eventDate} = this.state;

    await this.setState(
      {
        setDatePickerVisibility1: true,
        isDatePickerVisible1: true,
        eventDate: eventDate,
      },
      () => {
        console.log(this.state.eventDate);
      },
    );
  };

  handleHideBookingDatePicker = () => {
    this.setState({isDatePickerVisible: false});
    this.getAllFilterData();
  };

  handleBookingDateConfirm = date => {
    this.setState({
      bookingDate: moment(date).format('YYYY-MM-DD'),
    });
    this.handleHideBookingDatePicker();
  };

  handleSelectedShow = async value => {
    await this.setState({
      selectedShow: value,
      isEnabled: true,
    });
  };

  handleEventDateConfirm = date => {
    this.setState({
      eventDate: moment(date).format('YYYY-MM-DD'),
    });
    this.handleHideEventDatePicker();
  };

  handleHideEventDatePicker = () => {
    this.setState({isDatePickerVisible1: false});
    this.getAllFilterData();
  };

  handleGotoEvent = async item => {
    const slug = item.event_title;

    this.props.navigation.navigate('ViewEvent', {slugTitle: {slug}});
  };

  confirmCancelBooking = async (item) => {
    const {t} = this.props;
    
    // confirmation dialog
    Alert.alert(
      t('cancel_booking'),
      t('cancel_booking_ie'),
      [
        {text: t('cancel'), style: 'cancel'},
        {text: t('yes'), onPress: this.handleCancelTicket(item)},
      ],
      {cancelable: false},
    );
  }

  handleCancelTicket = async item => {
    let booking_id = [];
    item.attendees.map(i => {
      booking_id.push(i.booking_id);
    });

    const id = JSON.parse(booking_id);
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);

    // axios
    const axios = require('axios');

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };

    const data = {
      event_id: item.event_id,
      ticket_id: item.ticket_id,
      booking_id: id,
    };

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // calling api
      await axios
        .post(BASE_URL + 'cancel-booking', data, axiosConfig)
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const {status, message} = newResponse.data;

            console.log(newResponse.data);

            if (status === true) {
              // stopping loader
              this.setState({showProcessingLoader: false});

              // showing toast
              showToast(message);
              // this.forceUpdate();
              this.componentDidMount();
            } else {
              // stopping loader
              this.setState({showProcessingLoader: false});

              // showing toast
              showToast(message);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };


  DownloadInvoicefile = async(id, type) =>{
    const { t } = this.props;
    try {
      
      const axios = require('axios');
      const token = await getData(async_keys.userId);

      // creating custom header
      let axiosConfig = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      // starting loader
      this.setState({showProcessingLoader: true});
      // calling api
      let url = `invoice-download/${id}`;
      if(type == 'qrcodes') {
        url = `qrcode-download/${id}`;
      }
      
      console.log(BASE_URL + url);
      
      await axios
      .get(BASE_URL + url,axiosConfig)
      .then(response => {
        this.setState({showProcessingLoader: false});
        if(response.status && response?.data?.data) {
          console.log('hello download invoice please', response?.data);
          Download(response?.data?.data, t);
        }
      });
    } catch (error) {
      this.setState({showProcessingLoader: false});
      console.log(error?.response?.data);
      if(error?.response?.data?.message) {
        console.log(error?.response?.data);
        showToast(error?.response?.data?.message);
      }
    }
  }

  getQr = async(id) =>{
    console.log('getQr', id);
    try {
      const axios = require('axios');
      const token = await getData(async_keys.userId);

      // creating custom header
      let axiosConfig = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      // starting loader
      this.setState({showProcessingLoader: true});
      // calling api
      let url = `get-qrcode`;
      let data = {
        "booking_id": id,
      }
      
      await axios
      .post(BASE_URL + url, data,axiosConfig)
      .then(response => {
        console.log('get-qrcode', response);
        this.setState({showProcessingLoader: false});
        if(response.status && response?.data?.qrcode_file) {
          this.setState({ checkModal: true, qrCodeFile: response.data.qrcode_file, barCodeFile: response.data.barcode_file, qrCodeOrderNumber: response.data.qrcode_data.order_number });
        } else {
          console.log(response?.data,'////');
          showToast();
        }
      });
    } catch (error) {
      this.setState({showProcessingLoader: false});
      console.log('get-qrcode error', error);
      if(error?.response?.data?.data){
        showToast(error?.response?.data?.data);
      }
    }
  }

  
  DownloadTicketfile = async({order_number,attendees}) =>{
    console.log('dwnlaoda alciet', attendees?.[0].booking_id+'odrrrr-->'+order_number);
    const { t } = this.props;

    try {
    this.setState({showProcessingLoader: true});
    const axios = require('axios');
    const token = await getData(async_keys.userId);

    // creating custom header
    let axiosConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
      // starting loader
      
      // calling api
      let url = `ticket-download`;
      let data = {
        "booking_id": `${attendees?.[0].booking_id}`,
        "order_number": `${order_number}`
      }
      
      await axios
        .post(BASE_URL + url, data,axiosConfig)
        .then(response => {
          console.log('downloadticket', response);
          this.setState({showProcessingLoader: false});
          if(response.status && response?.data?.data) {
            console.log('hello download please', response?.data);
            Download(response?.data?.data, t);
          }
        });
    } catch (error) {
      this.setState({showProcessingLoader: false});
      console.log('downloadticket error', error);
      if(error?.response?.data?.message) {
        console.log(error?.response?.data);
        showToast(error?.response?.data?.message);
      }
    }
  }

  handleClosePopUp = () => {
    this.setState({ checkModal: false, qrCodeFile: null, barCodeFile: null, qrCodeOrderNumber: null });
  };


  render() {
    const { t } = this.props;

    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    if (this.state.checkBookingStatus === null) {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderComponent
            title={t('my_bookings')}
            navAction="back"
            nav={this.props.navigation}
          />
          <ScrollView>
            <View style={styles.homeContainer}>
              <Text style={styles.textInputText}>{t('booking_date')}</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleBookingDate}>
                  {this.state.bookingDate === '' ? (
                    <Text style={styles.descriptionText}>{t('booking_date')}</Text>
                  ) : (
                    <Text style={styles.descriptionText}>
                      {this.state.bookingDate}
                    </Text>
                  )}

                  <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    mode="date"
                    onConfirm={this.handleBookingDateConfirm}
                    onCancel={this.handleHideBookingDatePicker}
                    data={this.state.dateFilter}
                    onDateChange={this.handleBookingDateChange}
                    place
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.textInputText}>{t('search_any')}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={t('search')}
                  placeholderTextColor="#000"
                  style={styles.loginFormTextInput}
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.searchText}
                  onChangeText={this.handleSearchChange}
                />
              </View>

              <Text style={styles.textInputText}>{t('events')}</Text>
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  onValueChange={this.handleSelectedEvent}
                  items={this.state.attendEventData.map(item => ({
                    label: item.event_title,
                    value: item.event_title,
                  }))}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{label: t('select_item'),value: null}}
                />
              </View>

              <Text style={styles.textInputText}>{t('event_date')}</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleEventDate}>
                  {this.state.eventDate === '' ? (
                    <Text style={styles.descriptionText}>{t('event_date')}</Text>
                  ) : (
                    <Text style={styles.descriptionText}>
                      {this.state.eventDate}
                    </Text>
                  )}

                  <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible1}
                    mode="date"
                    onConfirm={this.handleEventDateConfirm}
                    onCancel={this.handleHideEventDatePicker}
                    data={this.state.eventDate}
                    onDateChange={this.handleEventDateChange}
                    place
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.downloadNotificationContainer}>
                <View style={styles.downloadNotification}>
                  <Text style={styles.orderIdText}>
                    { (Platform.OS === 'ios') ? t('download_ios') : t('download_android')}
                  </Text>
                </View>
              </View>

              {this.state.ticketList.map(item => {
                return (
                  <View style={styles.bookedTicketContainer}>
                    <View style={styles.orderIdWrapper}>
                      <Text style={styles.orderIdText}>{t('order_id')} #{item.order_number}</Text>
                    </View>

                    <Text style={styles.eventTitleText}>{t('event')}</Text>
                    <Text
                      style={styles.eventPlaceText}
                      onPress={() => this.handleGotoEvent(item)}>
                      {item.event_title} ({item.event_category})
                    </Text>

                    <Text style={styles.eventTimeText}>
                      @{item.event_start_date} ({item.event_start_time.split(':').slice(0, 2).join(':')} - {item.event_end_time.split(':').slice(0, 2).join(':')})
                    </Text>

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
                    </View>
                    
                    <View style={styles.lineContainer}></View>

                    <View style={styles.twoColumns}>
                      <View>
                        <Text style={styles.eventTitleText}>
                          {t('discount')}
                        </Text>
                        <Text style={styles.eventTimeText}>
                            {item.promocode != null && item.promocode != '' ? item.promocode : 0} {this.state.currency}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.eventTitleText}>{t('booked_on')}</Text>
                        <Text style={styles.eventTimeText}>{moment(item.created_at).format('DD-MMM-YYYY')}</Text>
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

                    <View style={styles.lineContainer}></View>

                    <View style={styles.twoColumns}>
                      <View>
                        <Text style={styles.eventTitleText}>{t('status')}</Text>
                        {item.status === 1 ? (
                          <Text style={styles.checkedInTextYes}>{t('enabled')}</Text>
                        ) : (
                          <Text style={styles.checkedInTextNo}>{t('disabled')}</Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.eventTitleText}>{t('expired')}</Text>
                        
                        {(moment(item.event_end_date+' '+item.event_end_time, 'YYYY-MM-DD HH:mm:ss') <= moment()) ? (
                          <Text style={styles.checkedInTextNo}>{t('yes')}</Text>
                        ) : (
                          <Text style={styles.checkedInTextYes}>{t('no')}</Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.eventTitleText}>{t('cancellation')}</Text>
                        {item.booking_cancel === 0 ? (
                          <TouchableOpacity
                            style={styles.cancellationContainer}
                            onPress={() => {(!this.state.showProcessingLoader) ? this.confirmCancelBooking(item) : true;}}>
                            <Image
                              source={ic_cancellation}
                              resizeMode="cover"
                              style={styles.cancelIconStyle}
                            />
                            <Text style={styles.cancelTextWhite}>{t('cancel')}</Text>
                          </TouchableOpacity>
                        ) : item.booking_cancel === 1 ? (
                          <View>
                            <Text style={styles.cancelText}>
                              {t('cancellation_pending')}
                            </Text>
                          </View>
                        ) : item.booking_cancel === 2 ? (
                          <View>
                            <Text style={styles.cancelText}>{t('approved')}</Text>
                          </View>
                        ) : item.booking_cancel === 3 ? (
                          <View>
                            <Text style={styles.cancelText}>{t('refunded')}</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.lineContainer}></View>

                    {item.is_paid != 1 ? null : (
                    <View style={styles.twoColumns}>
                      <View>
                        <Text style={styles.eventTitleText}>{t('check_in')}</Text>
                        <TouchableOpacity
                          onPress={() => {(!this.state.showProcessingLoader) ? this.getQr(item.id) : true;}}
                          style={styles.checkInButtonContainer}>
                          {this.state.showProcessingLoader && <ActivityIndicator size="small" color="black" />}
                          <Image
                            source={ic_check_in}
                            resizeMode="cover"
                            style={styles.downloadIconStyle}
                          />
                          <Text style={styles.ticketText}>{t('check_in')}</Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Text style={styles.eventTitleText}>{t('download')}</Text>
                        <TouchableOpacity 
                          onPress={() => {(!this.state.showProcessingLoader) ? this.DownloadTicketfile(item) : true;}}
                          style={styles.ticketContainerBtn}
                        >
                          {this.state.showProcessingLoader && <ActivityIndicator size="small" color="black" />}
                          <Image
                            source={ic_download}
                            resizeMode="cover"
                            style={styles.downloadIconStyle}
                          />
                          <Text style={styles.ticketText}>{t('ticket')}</Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Text style={styles.eventTitleText}>{t('download')}</Text>
                        <TouchableOpacity 
                          onPress={() => {(!this.state.showProcessingLoader) ? this.DownloadInvoicefile(item.id, 'invoice') : true;}}
                          style={styles.ticketContainerBtn}>
                          {this.state.showProcessingLoader && <ActivityIndicator size="small" color="black" />}
                          <Image
                            source={ic_download}
                            resizeMode="cover"
                            style={styles.downloadIconStyle}
                          />
                          <Text style={styles.ticketText}>{t('invoice')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    )}

                    <View style={styles.lineContainer}></View>

                    {item.is_paid != 1 ? null : (
                    <View style={styles.twoColumns}>
                      <View>
                        <Text style={styles.eventTitleText}>{t('checkout_countdown')}</Text>
                        
                        {(checkoutCountDown(item.attendees[0]) > 0 && checkoutCountDown(item.attendees[0]) != 'checkout') ? (
                          <CountDown
                          until={ checkoutCountDown(item.attendees[0])}
                          size={12}
                          digitTxtStyle={styles.digitTxtStyle}
                          digitStyle={styles.digitStyle}
                          timeLabelStyle={styles.timeLabelStyle}
                          timeToShow={['H','M','S']}
                          timeLabels={{h:t('hours'),m: t('minutes'), s: t('seconds')}}
                        />  
                        ) : null}

                        {(checkoutCountDown(item.attendees[0]) == 'checkout') ? (
                          <Text style={styles.checkedInTextNo}>{t('checked_out')}</Text>
                        ) : null}

                        {(checkoutCountDown(item.attendees[0]) != 'checkout' && checkoutCountDown(item.attendees[0]) <= 0) ? (
                          <Text style={styles.checkedInTextNo}>{t('n/a')}</Text>
                        ) : null}
                        
                      </View>
                      <View>
                        <Text style={styles.eventTitleText}>{t('download')}</Text>
                        <TouchableOpacity 
                          onPress={() => {(!this.state.showProcessingLoader) ? this.DownloadInvoicefile(item.id, 'qrcodes') : true;}}
                          style={styles.ticketContainerBtn2}
                        >
                          {this.state.showProcessingLoader && <ActivityIndicator size="small" color="black" />}
                          <Image
                            source={ic_download}
                            resizeMode="cover"
                            style={styles.downloadIconStyle}
                          />
                          <Text style={styles.ticketText}>{t('all_qrcodes')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <Modal
            style={styles.modalStyle}
            isVisible={this.state.checkModal}
            onBackdropPress={this.handleClosePopUp}>
            
            <View style={styles.qrCodeModalContainer}>
              <Text style={styles.qrCodeModalText}>#{this.state.qrCodeOrderNumber}</Text>
              <Image
                source={{ uri: STORAGE_URL + this.state.qrCodeFile }}
                resizeMode="contain"
                style={styles.qrCodeModalImage}
              />
              <Image
                source={{ uri: STORAGE_URL + this.state.barCodeFile }}
                resizeMode="contain"
                style={styles.barCodeModalImage}
              />
            </View>

            {this.state.showModalProcessingLoader && <ProcessingLoader />}
          </Modal>
          <FooterComponent nav={this.props.navigation} />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderComponent
            title={t('my_bookings')}
            navAction="back"
            nav={this.props.navigation}
          />
          <ScrollView>
            <View style={styles.homeContainer}>

              <Text style={styles.textInputText}>{t('events')}</Text>
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  onValueChange={this.handleSelectedShow}
                  items={[{label: t('all_events'), value: t('all_events')}]}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{label: t('select_item'),value: null}}
                />
              </View>
              
              <Text style={styles.textInputText}>{t('booking_date')}</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleBookingDate}>
                  {this.state.bookingDate === '' ? (
                    <Text style={styles.descriptionText}>{t('booking_date')}</Text>
                  ) : (
                    <Text style={styles.descriptionText}>
                      {this.state.bookingDate}
                    </Text>
                  )}

                  <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    mode="date"
                    onConfirm={this.handleBookingDateConfirm}
                    onCancel={this.handleHideBookingDatePicker}
                    data={this.state.dateFilter}
                    onDateChange={this.handleBookingDateChange}
                    place
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.textInputText}>{t('search_any')}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={t('search')}
                  placeholderTextColor="#000"
                  style={styles.loginFormTextInput}
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.searchText}
                  onChangeText={this.handleSearchChange}
                />
              </View>

              <Text style={styles.textInputText}>{t('event_date')}</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleEventDate}>
                  {this.state.eventDate === '' ? (
                    <Text style={styles.descriptionText}>{t('event_date')}</Text>
                  ) : (
                    <Text style={styles.descriptionText}>
                      {this.state.eventDate}
                    </Text>
                  )}

                  <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible1}
                    mode="date"
                    onConfirm={this.handleEventDateConfirm}
                    onCancel={this.handleHideEventDatePicker}
                    data={this.state.eventDate}
                    onDateChange={this.handleEventDateChange}
                    place
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.noBookingStatus}>
                <Text>{t('no_bookings')}</Text>
              </View>
            </View>
          </ScrollView>

          {this.state.showProcessingLoader && <ProcessingLoader />}
          <FooterComponent nav={this.props.navigation} />
        </SafeAreaView>
      );
    }
  }
}

export default withTranslation()(MyBookingScreen);

const pickerStyle = {
  inputIOS: {
    color: '#c4c3cb',
    fontSize: wp(3.5),
    marginVertical: wp(4),
  },
  placeholder: {
    color: '#c4c3cb',
    fontSize: wp(3.5),
    marginVertical: wp(4),
  },
  inputAndroid: {
    color: '#c4c3cb',
    fontSize: wp(3.5),
    marginVertical: wp(4),
  },
};

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
  textInputText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#000',
    marginTop: hp(1),
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
  descriptionText: {
    fontSize: wp(3.5),
    // alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(2),
  },
  downloadNotificationContainer: {
    marginHorizontal: wp(2),
    marginTop: hp(2),
    borderRadius: wp(3),
  },
  bookedTicketContainer: {
    marginHorizontal: wp(2),
    marginVertical: hp(2),
    paddingBottom: hp(1),
    borderRadius: wp(3),
    backgroundColor: '#fff',
  },
  orderIdText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#fff',
    marginHorizontal: wp(2),
    marginTop: hp(0.5),
  },
  orderIdWrapper: {
    backgroundColor: '#000',
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    paddingVertical: hp(1.5),
  },
  downloadNotification: {
    backgroundColor: '#14caf0',
    borderRadius: wp(2),
    paddingVertical: hp(2),
  },
  lineContainer: {
    height: hp(0.2),
    width: 'auto',
    backgroundColor: '#ddd',
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
    color: '#000',
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
    width: LayoutSize.window.width/4,
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff7273',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  cancelIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  cancelText: {
    fontSize: wp(3.5),
    color: '#ff7273',
    fontWeight: '700',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  cancelTextWhite: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: '700',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
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
  
  downloadIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
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
  ticketContainerBtn2: {
    flexDirection: 'row',
    height: hp(6),
    width: LayoutSize.window.width/3,
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b289',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  ticketContainerBtn: {
    flexDirection: 'row',
    height: hp(6),
    width: LayoutSize.window.width/4,
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b289',
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  checkInButtonContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: LayoutSize.window.width/4,
    borderRadius: wp(2),
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
  twoColumns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  digitTxtStyle: {
    color: '#fff',
  },
  digitStyle: {
    backgroundColor: '#ff0084'
  },
  timeLabelStyle: {
    fontWeight: '700',
    color: '#ff0084', 
  },
  modalStyle: {
    flex: 1,
    width: 'auto',
    maxHeight: hp(80),
    overflow: "scroll",
    // alignItems: 'center',
    justifyContent: 'center',
    top: hp(10),
    marginVertical: wp(2),
    backgroundColor: '#fff',
    borderRadius: wp(2),
  },
  qrCodeModalImage: {
    flex: 1,
    height: hp(64),
    width: wp(64),
    alignSelf: 'center',
  },
  barCodeModalImage: {
    flex: 1,
    marginTop: hp(10),
    height: hp(80),
    width: wp(80),
    alignSelf: 'center',
  },
  qrCodeModalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },  
  qrCodeModalText: {
    flex: .2,
    fontSize: wp(5),
    fontWeight: '500',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: hp(2),
  },  
});
