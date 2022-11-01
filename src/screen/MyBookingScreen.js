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
  ToastAndroid,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Download} from './download';
// Component
import CustomLoader from '../component/CustomLoader';
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';
import {showToast} from '../component/CustomToast';
import ProcessingLoader from '../component/ProcessingLoader';

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

export default class MyBookingScreen extends Component {
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
    };
  }

  componentDidMount() {
    this.fetchBookedTickets();
    this.getAllEvent();
  }

  fetchBookedTickets = async () => {
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

      showToast('Something went wrong.');
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


  fetchDownloadfile = async(id,type) =>{
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
      if(type=='qr') {
        url = `qrcode-download/${id}`;
      }
      console.log(BASE_URL + url);
      
      await axios
        .get(BASE_URL + url,axiosConfig)
        .then(response => {
          this.setState({showProcessingLoader: false});
         if(response.status && response?.data?.file) {
          Download(response?.data?.file);
         }
        });
    } catch (error) {
      this.setState({showProcessingLoader: false});
      console.log(error?.response?.data);
    }
  }

  getQr = async(id) =>{
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
      let url = `get-qrcode/${id}`;
      
      await axios
        .get(BASE_URL + url,axiosConfig)
        .then(response => {
          this.setState({showProcessingLoader: false});
          if(response.status && response?.data?.file) {

          } else {
            console.log(response?.data,'////');
            // ToastAndroid.show(response?.data,ToastAndroid.SHORT);
          }
        });
    } catch (error) {
      this.setState({showProcessingLoader: false});
      if(error?.response?.data?.data){
        ToastAndroid.show(error?.response?.data?.data,ToastAndroid.SHORT);
      }
    }
  }

  
  DownloadTicketfile = async({order_number,attendees}) =>{
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
          this.setState({showProcessingLoader: false});
         if(response.status && response?.data?.data) {
          console.log(response?.data);
            Download(response?.data?.data);
          }
        });
    } catch (error) {
      this.setState({showProcessingLoader: false});
      if(error?.response?.data?.data) {
        console.log(error?.response?.data);
        ToastAndroid.show(error?.response?.data?.data,ToastAndroid.SHORT);
      }
    }
  }


  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    if (this.state.checkBookingStatus === null) {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderComponent
            title="My Booking"
            navAction="back"
            nav={this.props.navigation}
          />
          <ScrollView>
            <View style={styles.homeContainer}>
              <ImageBackground
                source={header_image}
                resizeMode="cover"
                style={styles.headerImageStyle}>
                <Text style={styles.titleText}>MY BOOKINGS</Text>
                <View style={styles.eventHeadlineContainer}>
                  <Image
                    source={ic_header_home_icon}
                    resizeMode="cover"
                    style={styles.IconStyle}
                  />

                  <Text style={styles.slashText}>/</Text>
                  <Text style={styles.eventText}>My Bookings</Text>
                </View>
              </ImageBackground>

              {/* <Text style={styles.textInputText}>Events</Text>
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  onValueChange={this.handleSelectedEvent}
                  items={[{label: 'All Events', value: 'All Events'}]}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                />
              </View> */}

              <Text style={styles.textInputText}>Booking Date</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleBookingDate}>
                  {this.state.bookingDate === '' ? (
                    <Text style={styles.descriptionText}>Booking Date</Text>
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

              <Text style={styles.textInputText}>Search Any</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Search"
                  placeholderTextColor="#000"
                  style={styles.loginFormTextInput}
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.searchText}
                  onChangeText={this.handleSearchChange}
                />
              </View>

              <Text style={styles.textInputText}>Events</Text>
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  onValueChange={this.handleSelectedEvent}
                  items={this.state.attendEventData.map(item => ({
                    label: item.event_title,
                    value: item.event_title,
                  }))}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.textInputText}>Event Date</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleEventDate}>
                  {this.state.eventDate === '' ? (
                    <Text style={styles.descriptionText}>Event Date</Text>
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

              {this.state.ticketList.map(item => {
                return (
                  <View style={styles.bookedTicketContainer}>
                    <Text style={styles.orderIdText}>Order Id</Text>
                    <Text style={styles.orderIdText}>
                      # {item.order_number}
                    </Text>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Event</Text>
                    <Text
                      style={styles.eventPlaceText}
                      onPress={() => this.handleGotoEvent(item)}>
                      {item.event_title} ({item.event_category})
                    </Text>

                    <Text style={styles.eventTitleText}>Timings</Text>
                    <Text style={styles.eventTimeText}>
                      {item.event_start_date}
                      {'\n'}
                      {item.event_start_time} - {item.event_end_time}
                      {'\n'}(IST)
                    </Text>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Ticket</Text>
                    <Text style={styles.eventTimeText}>
                      {item.ticket_title} x {item.quantity}
                    </Text>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Order Total</Text>
                    <Text style={styles.eventTimeText}>
                      {item.net_price} {this.state.currency}
                    </Text>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>
                      Promocode Reward(-)
                    </Text>
                    <Text style={styles.eventTimeText}>
                      {item.promocode} {this.state.currency}
                    </Text>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Booked On</Text>
                    <Text style={styles.eventTimeText}>{moment(item.created_at).format('DD-MMM-YYYY')} (IST)</Text>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Payment</Text>

                    <View style={styles.paymentContainer}>
                      <Text style={styles.paymentMethodText}>
                        {item.payment_type}
                      </Text>

                      <View style={styles.paymentMethodLine}></View>
                      {item.is_paid === 0 ? (
                        <Text style={styles.paymentProcessText}>Pending</Text>
                      ) : (
                        <Text style={styles.paymentProcessText}>Paid</Text>
                      )}
                    </View>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Checked in</Text>
                    <View style={styles.checkedInContainer}>
                      {item.checked_in === 0 ? (
                        <Text style={styles.checkedInText}>No</Text>
                      ) : (
                        <Text style={styles.checkedInText}>Yes</Text>
                      )}
                    </View>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Status</Text>
                    <View style={styles.statusContainer}>
                      {item.status === 1 ? (
                        <Text style={styles.statusText}>Enabled</Text>
                      ) : (
                        <Text style={styles.statusText}>Disabled</Text>
                      )}
                    </View>

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Cancellation</Text>
                    {item.booking_cancel === 0 ? (
                      <TouchableOpacity
                        style={styles.cancellationContainer}
                        onPress={() => this.handleCancelTicket(item)}>
                        <Image
                          source={ic_cancellation}
                          resizeMode="cover"
                          style={styles.cancelIconStyle}
                        />
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    ) : item.booking_cancel === 1 ? (
                      <View style={styles.cancellationContainer}>
                        {/* <Image
                          source={ic_cancellation}
                          resizeMode="cover"
                          style={styles.cancelIconStyle}
                        /> */}
                        <Text style={styles.cancelText}>
                          Cancellation pending
                        </Text>
                      </View>
                    ) : item.booking_cancel === 2 ? (
                      <View style={styles.cancellationContainer}>
                        {/* <Image
                          source={ic_cancellation}
                          resizeMode="cover"
                          style={styles.cancelIconStyle}
                        /> */}
                        <Text style={styles.cancelText}>Approved</Text>
                      </View>
                    ) : item.booking_cancel === 3 ? (
                      <View style={styles.cancellationContainer}>
                        {/* <Image
                          source={ic_cancellation}
                          resizeMode="cover"
                          style={styles.cancelIconStyle}
                        /> */}
                        <Text style={styles.cancelText}>Refunded</Text>
                      </View>
                    ) : null}

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>Expired</Text>
                    <View style={styles.expiredContainer}>
                      <Text style={styles.expiredText}>No</Text>
                    </View>

                    <View style={styles.lineContainer}></View>

                    {item.is_paid != 1 ? null : (
                      <Text style={styles.eventTitleText}>Actions</Text>
                    )}
                    {item.is_paid != 1 ? null : (
                      <View style={styles.ticketActionContainer}>
                        <TouchableOpacity onPress={()=>{
                        this.DownloadTicketfile(item)

                      }} style={styles.ticketContainer}>
                          <Image
                            source={ic_download}
                            resizeMode="cover"
                            style={styles.downloadIconStyle}
                          />
                          <Text style={styles.ticketText}>Ticket</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{
                        this.fetchDownloadfile(item.id)
                      }} style={styles.ticketContainer}>
                          <Image
                            source={ic_download}
                            resizeMode="cover"
                            style={styles.downloadIconStyle}
                          />
                          <Text style={styles.ticketText}>Invoice</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {item.is_paid != 1 ? null : (
                      <TouchableOpacity
                      onPress={()=>{
                        this.fetchDownloadfile(item.id,'qr')
                      }}
                        style={styles.downloadBookingQRcodeContainer}>
                        <Image
                          source={ic_download}
                          resizeMode="cover"
                          style={styles.downloadIconStyle}
                        />
                        <Text style={styles.ticketText}>
                          Download Booking QRcode
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.is_paid != 1 ? null : (
                      <TouchableOpacity
                        onPress={()=>{
                          this.getQr(item.id)
                        }}
                       style={styles.checkInButtonContainer}>
                        <Image
                          source={ic_check_in}
                          resizeMode="cover"
                          style={styles.downloadIconStyle}
                        />
                        <Text style={styles.ticketText}>Check in</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.lineContainer}></View>

                    <Text style={styles.eventTitleText}>
                      Checkout Countdown
                    </Text>

                    <View style={styles.checkoutContainer}>
                      <Text style={styles.expiredText}>N/A</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <FooterComponent nav={this.props.navigation} />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <HeaderComponent
            title="My Booking"
            navAction="back"
            nav={this.props.navigation}
          />
          <ScrollView>
            <View style={styles.homeContainer}>
              <ImageBackground
                source={header_image}
                resizeMode="cover"
                style={styles.headerImageStyle}>
                <Text style={styles.titleText}>MY BOOKINGS</Text>
                <View style={styles.eventHeadlineContainer}>
                  <Image
                    source={ic_header_home_icon}
                    resizeMode="cover"
                    style={styles.IconStyle}
                  />

                  <Text style={styles.slashText}>/</Text>
                  <Text style={styles.eventText}>My Bookings</Text>
                </View>
              </ImageBackground>

              <Text style={styles.textInputText}>Events</Text>
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  onValueChange={this.handleSelectedEvent}
                  items={[{label: 'All Events', value: 'All Events'}]}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.textInputText}>Booking Date</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleBookingDate}>
                  {this.state.bookingDate === '' ? (
                    <Text style={styles.descriptionText}>Booking Date</Text>
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

              <Text style={styles.textInputText}>Search Any</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Search"
                  placeholderTextColor="#000"
                  style={styles.loginFormTextInput}
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.searchText}
                  onChangeText={this.handleSearchChange}
                />
              </View>

              <Text style={styles.textInputText}>Events</Text>
              <View style={styles.inputContainer}>
                <RNPickerSelect
                  onValueChange={this.handleSelectedShow}
                  items={[{label: 'All Events', value: 'All Events'}]}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.textInputText}>Event Date</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={this.handleEventDate}>
                  {this.state.eventDate === '' ? (
                    <Text style={styles.descriptionText}>Event Date</Text>
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
                <Text>No Bookings</Text>
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

const pickerStyle = {
  // inputIOS: {
  //   color: 'white',
  //   paddingHorizontal: 10,
  //   backgroundColor: 'red',
  //   borderRadius: 5,
  // },
  // placeholder: {
  //   color: 'white',
  // },
  inputAndroid: {
    height: hp(6),
    width: wp(90),
    color: '#000',
    // paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    // borderRadius: wp(4),
    // borderWidth: 1,
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
    backgroundColor: '#00192f',
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
  textInputText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#5e5f5f',
    marginVertical: hp(1),
    marginTop: hp(2),
    marginHorizontal: wp(4),
  },
  inputContainer: {
    flexDirection: 'row',
    height: hp(7),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: wp(2),
    // marginVertical: hp(1),
    marginHorizontal: wp(4),
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    // marginLeft: wp(4),
    backgroundColor: '#f1f1f1',
    borderRadius: wp(1),
    color: '#000',
  },
  descriptionText: {
    fontSize: wp(3.5),
    // alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(2),
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
});
