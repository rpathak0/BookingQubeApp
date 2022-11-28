import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  Image,
  I18nManager,
} from 'react-native';
import React, { Component } from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import RNRestart from 'react-native-restart';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';
import CustomLoader from '../component/CustomLoader';
import ProcessingLoader from '../component/ProcessingLoader';
import { showToast } from '../component/CustomToast';
import CustomField from '../component/CustomField';

import { WebView } from 'react-native-webview';

// API Info
import { BASE_URL, makeRequest } from '../api/ApiInfo';

// User Preference
import { async_keys, getData, storeData } from '../api/UserPreference';

// Validation
import { isEmailAddress, isMobileNumber } from '../validation/FormValidator';

import RadioForm from 'react-native-simple-radio-button';

import { withTranslation } from 'react-i18next';

import dropDown from '../assets/icon/down-arrows.png';
import radiocheck from '../assets/icon/radiocheck.png';
import radiouncheck from '../assets/icon/uncheck.png';
import Qpay from '../assets/image/qpay.png';
import Mastercard from '../assets/image/mastercard.png';
import { convertTimeZone, convertTimeZoneFormatted, getSaleExpirationSeconds } from '../Helper/dateConverter';
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import { NavigationActions, StackActions } from 'react-navigation';


const data = {
  custom_fields: [],
  status: true,
  fields: {
    iyenDcO8EjfKBHKFJppk: [[], [], [], []],
    '57rBbqLEJdO7UIIvak9X': [[], [], [], []],
    sylaHJudUBigFAiE6Nn9: [[], [], [], []],
    LnRfdQIefkUuhhkSEuvD: [[], [], [], []],
    nWG6GbAgtaK4PQeceD1B: [[], [], [], []],
  },
  file_field: [],
};

var paymentOption = [
  { label: "QPay", value: 7 },
  { label: "Master Card", value: 8 },

];
var rsvpOption = [
  { label: "Free (R.S.V.P)", value: 'on' },
];
const axios = require('axios');
class CheckOutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      totalPrice: 0,
      netTotal: 0,
      grandTotal: 0,
      promocodeDiscount: 0,
      totalQty: 0,
      taxAmount: 0.00,
      list: [],
      finalPrice: [],
      userId: null,
      ticketList: [],
      isLoading: true,
      promocodes: [],
      individualTickerPrice: [],
      showProcessingLoader: false,
      totalTax: 0,
      showSingleTicketPrice: 0,
      seatTicketValue: [],
      quantity: [],
      customFiled: [],
      checkModal: false,
      checkSecondModal: false,
      checkPaymentModal: false,
      name: '',
      email: '',
      phone: '',
      showModalProcessingLoader: false,
      finalData: [],
      custom_fields_response: data,
      payment_method: 7,
      showPaymentSuccessPopup: false,
      paymentModalMessage: 'demo',
      currentSelectedSeat: null,
      radioBtnsData: [
                      {
                        name:'Qpay',
                        selected:true,
                        id:1,
                        value:7,
                        image:Qpay,
                      }, {
                        name:'MasterCard',
                        selected:false,
                        id:2,
                        value:8,
                        image:Mastercard,
                      }],
      checked: 0
    };
    this.eventInfo = this.props.navigation.getParam('eventInfo', null);
  }



  componentDidMount() {
    let d_t = {};
    this.eventInfo.tickets.forEach(item => {
      d_t[item.id] = {};
    });

    setTimeout(this.initialSetup, 2000);
  }




  handleNameChange = name => {
    this.setState({ name });
  };
  saleFinished(){
    
  }
  handleEmailChange = email => {
    this.setState({ email });
  };

  handleNumberChange = phone => {
    this.setState({ phone });
  };

  initialSetup = async () => {
    // getting userId from asyncStorage
    const userId = await getData(async_keys.userInfo);

    try {
      const params = {
        event_id: this.eventInfo.eventId,
        startDate: this.eventInfo.startDate,
        endDate: this.eventInfo.endDate,
        startTime: this.eventInfo.startTime,
        endTime: this.eventInfo.endTime
      };
      console.log(params);
      // creating custom header
      let axiosConfig = {};
      // calling api
      await axios
        .post(BASE_URL + 'events/details', params, axiosConfig)
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const { success } = newResponse.data;
            console.log(newResponse)
            if (success === true) {
              this.setState({
                tickets: newResponse.data.data.tickets,
                isLoading: false,
                userId: userId,
              });
            }
          }
        });


      this.getCustomField();

    } catch (error) {
      console.log(error.message);
    }
  };

  //function returns data to be sent to booking API in c_fields parameter
  manageData = () => {
    let cfData = this.state.finalData;
    let custom_feilds = [];
    cfData.forEach((cfValues, i) => {
      // console.log(Object.entries(cfValues),this.state.customFiled);
      const cfValuesArray = Object.entries(cfValues);
      cfValuesArray.forEach((cf) => {
        if (cf[0] !== undefined) {
          const findCFData = this.state.customFiled.find(x => x.field_name == cf[0]);
          if (findCFData !== undefined) {

            const fillable = {
              label: findCFData?.label,
              event_id: findCFData?.event_id,
              input_value: cf[1],
              ticket_id: cfValues.ticket.id,
              seat_id: cfValues?.seat,
              seat_name: null,
              checked_in: 0,
              status: 1,
            }
            custom_feilds.push(fillable);
          }

        }
      })

    });

    return custom_feilds;
    // if (dd?.length > 0) {
    //   var c_field = {};
    //   var customFiled = this.state.customFiled;
    //   for (let i = 0; i < this.state.customFiled?.length; i++) {
    //     console.log(customFiled[i].field_name);
    //     c_field[`${customFiled[i].field_name}`] = [];
    //   }
    //   console.log("asdasdasd===>>>>>>>>>>",c_field);
    //   let keys = Object.keys(c_field); 
    //   keys.forEach((item, ind) => {
    //     // console.log('item', item, ind);
    //     for (let j = 0; j < dd?.length; j++) {
    //       if (item in dd[j]) {
    //         console.log("HERE===>",dd[j][item]);
    //         c_field[item].push(dd[j][item]);
    //       }
    //     }
    //   });
    //   return c_field;
    // }

  };

  getCustomField = async () => {
    const { eventId } = this.eventInfo;

    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);
    try {
      // preparing params
      const params = { event_id: eventId };

      // creating custom header
      let axiosConfig = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      // calling api
      await axios
        .post(BASE_URL + 'event/get-custom-fields', params, axiosConfig)
        // processing response
        .then(response => {
          let newResponse = response.data;
          console.log('custom fields', response);
          if (newResponse?.status) {
            this.setState({
              customFiled: newResponse.custom_fields,
              custom_fields_response: newResponse,

            });
          } else {
            this.setState({ customFiled: [] });
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  openTost = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message
    });
  }

  handleSelectValue = async (value, item, seat) => {
    try {
      var { ticketList } = this.state;

      const ticketId = item.id;
      if (seat == '') {
        var elementPos = ticketList.map(x => x.ticketId).indexOf(ticketId);
        if (elementPos !== -1) {
          ticketList.splice(elementPos, 1);
          ticketList.push({ ticketId, value, item });
        } else {
          ticketList.push({ ticketId, value, item });
        }
      } else {
        const seatId = seat.id;
        const isAnyTicketSelected = ticketList.find(t => t.ticketId == ticketId);
        if (isAnyTicketSelected === undefined) {
          const seat_ids = [seatId];
          ticketList.push({ ticketId, value, item, seat_ids });
        } else {
          if (isAnyTicketSelected?.seat_ids?.includes(seatId)) {
            const removedSeats = isAnyTicketSelected?.seat_ids.filter(s => s != seatId);
            const new_quntity = (parseInt(isAnyTicketSelected?.value) - parseInt(value));
            let newTikcetList = {
              ...isAnyTicketSelected,
              value: new_quntity,
              seat_ids: removedSeats
            }
            ticketList = ticketList.map(t => t.ticketId == ticketId ? newTikcetList : t);
          } else {
            const addedSeats = isAnyTicketSelected?.seat_ids;
            if (addedSeats.length < this.eventInfo.maxQuantity) {

              addedSeats.push(seatId);
              let new_quntity = (parseInt(isAnyTicketSelected?.value) + parseInt(value));
              let newTikcetList = {
                ...isAnyTicketSelected,
                value: new_quntity,
              }
              ticketList = ticketList.map(t => t.ticketId == ticketId ? newTikcetList : t);
            } else {
              this.openTost('error', 'Limit Over', 'Max limit for one person to book ticket is over');
              return false;
            }
          }

        }

      }



      var total_price = 0;
      var grand_total = 0;
      var totalTax = 0;
      var totalPromoDiscount = 0;
      var netAmount = 0;
      for (let index = 0; index < ticketList.length; index++) {
        let ticket = ticketList[index].item;
        let baseQuantity = ticketList[index].value;
        let { tax, price } = this.calculateTicketPriceWithTax(ticket, baseQuantity);
        const ticktPriceTotal = (tax + price);
        const promocode_discount = this.calculatePromocodeDiscounts(ticktPriceTotal, ticket);
        totalTax = totalTax + tax;
        total_price = total_price + price;
        totalPromoDiscount = totalPromoDiscount + promocode_discount;
      }
      grand_total = (total_price + totalTax)
      netAmount = (grand_total - totalPromoDiscount)
      const totalQty = ticketList.reduce((pre, curr) => pre + parseInt(curr.value), 0);
      this.setState({
        ...this.state,
        totalQty: totalQty,
        ticketList: ticketList,
        grandTotal: parseFloat(grand_total).toFixed(2),
        totalPrice: parseFloat(total_price).toFixed(2),
        taxAmount: parseFloat(totalTax).toFixed(2),
        promocodeDiscount: parseFloat(totalPromoDiscount).toFixed(2),
        netTotal: parseFloat(netAmount).toFixed(2),
        currentSelectedSeat: seat != '' ? seat?.id : null
      })

    } catch (error) {
      console.log(error.message);
    }



  };

  calculatePromocodeDiscounts = (ticketPrice, ticket) => {

    let promocode_discount = 0.00;
    if (ticket.promocode !== undefined) {
      if (ticket.promocode?.p_type === "percent") {
        promocode_discount = (promocode_discount + (parseFloat(ticket.promocode?.reward) / 100) * ticketPrice)
      } else {
        promocode_discount = (promocode_discount + parseFloat(ticket.promocode?.reward));
      }
    }
    return promocode_discount;

  }
  onSelectPaymentType = (item) =>{
    this.setState({payment_method:item.value});
    const updatedButtons =  this.state.radioBtnsData.map(r => r.id == item.id?{...r,selected:true}:{...r,selected:false} );
    this.setState({radioBtnsData:updatedButtons});
  }

  calculateTicketPriceWithTax(ticket, quntity) {
    let basePrice = ticket?.sale_start_date ? ticket?.sale_price : (ticket.price ? ticket.price : 0.00);
    let baseQuantity = quntity;
    let price = parseFloat(basePrice) * parseFloat(baseQuantity);
    const taxesforOneticket = ticket.taxes.filter(t => t.net_price == "excluding").reduce((pre, curr) =>
    (curr.rate_type == "percent"
      ?
      (pre + parseFloat((curr.rate / 100) * basePrice))
      :
      (pre + parseFloat(curr.rate))), 0);

    const tax = (taxesforOneticket * baseQuantity);
    return { price, tax };
  }

  handleCheckout = async () => {


    let c_fields = this.manageData();
    const token = await getData(async_keys.userId);
    const { tickets, userId, ticketList, payment_method } = this.state;
    let ticketID = [];
    let promocodes = ticketList.filter(t => t.item.promocode !== undefined) ? ticketList.filter(t => t.item.promocode !== undefined).map(pc => ({
      ticket_id: pc.ticketId,
      code: pc.item.promocode.code,
    })) : [];
    tickets.map(item => {
      ticketID.push(item.id);
    });
    const seats = [];
    let ticketTitle = [];
    tickets.map(item => {
      ticketTitle.push(item.title);
    });
    const { endTime, startTime, eventId, finalDate } = this.eventInfo;
    try {
      this.setState({ showProcessingLoader: true });
      var params = {
        event_id: eventId,
        booking_date: finalDate.start_date,
        booking_end_date: finalDate.end_date,
        start_time: startTime,
        end_time: endTime,
        merge_schedule: 0,
        customer_id: userId,
        phone_t: '',
        ticket_id: ticketID,
        ticket_title: ticketTitle,
        quantity: ticketList,
        is_donation: [],
        attendee: [],
        payment_method: payment_method,
        free_order: "",
        promocode: promocodes,
        is_subscribe: 1,
        c_fields: c_fields,
      };

      const seleactedSeats = ticketList.filter(t => t.seat_ids !== undefined);
      if (seleactedSeats !== undefined) {
        for (let index = 0; index < seleactedSeats.length; index++) {
          const ticket = seleactedSeats[index];
          if (ticket?.seat_ids !== undefined && ticket?.seat_ids.length > 0) {
            const cname = 'seat_id_' + ticket?.ticketId;
            params = { ...params, [cname]: ticket?.seat_ids }
          }
        }
      }

      let axiosConfig = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      
      axios
        .post(BASE_URL + 'book-tickets',
          params,
          axiosConfig,
        )
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const { status, url, redirectToPaymentUrl } = newResponse.data;
            if (status === true) {
              this.setState({ showProcessingLoader: false });
              if (redirectToPaymentUrl) {
                this.handleWebView(url);
              } else {
                showToast(newResponse.data.message);
                this.props.navigation.navigate('MyBooking');
              }
            }
          }
        })
        .catch(ERR => {
          // stopping loader
          console.log(ERR.response.data);
          this.setState({ showProcessingLoader: false });
          this.openTost('error', 'Booking Cancelled', ERR.response.data?.message ? ERR.response.data.message : (ERR.response.data.errors ? ERR.response.data.errors.error[0] : 'server error'));

        });
    } catch (error) {
      this.openTost('error', 'Booking Cancelled', error.message);
    }

  };



  onChangePromocode = (promocodeText, item) => {
    const { tickets } = this.state;
    const ticket = { ...item, promocodeText: promocodeText };
    const newTickets = tickets.map(t => t.id == ticket.id ? ticket : t);
    this.setState({ tickets: newTickets });
    //  console.log(newTickets);
    // this.setState({...this.state.tickets})
  };

  applyPromocode = async (item) => {
    const { t } = this.props;
    Keyboard.dismiss();
    const axios = require('axios');
    const token = await getData(async_keys.userId);


    if (token == 'null') {
      showToast('Please Login to use promocode');
      return false;
    }

    if (item.promocodeText != "") {
      try {
        this.setState({ showProcessingLoader: true });

        // preparing params
        const params = {
          promocode: item.promocodeText,
          ticket_id: item.id,
        };

        // creating custom header
        let axiosConfig = {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        };

        // calling api
        axios
          .post(BASE_URL + 'apply-promocode',
            params,
            axiosConfig,
          )
          .then(response => {
            let newResponse = response;

            if (newResponse) {
              const { success, data } = newResponse.data;
              if (success === true) {
                const { ticketList } = this.state;
                const ticket = { ...item, promocode: data };
                const newTicket = ticketList.map(t => t.ticketId == ticket.id ? ({ ...t, item: ticket }) : t);
                const currentSelectedTicket = ticketList.find(t => t.ticketId == ticket.id);
                this.setState({ ticketList: newTicket });
                this.handleSelectValue(currentSelectedTicket.value, ticket, '');
              }
              this.setState({ showProcessingLoader: false });
              this.openTost('success', t('promocode_discount'), t('login_to_promocode'));
            }
          })
          .catch(ERR => {

            this.setState({ showProcessingLoader: false });
            this.openTost('error', 'Error', ERR.response.data.message);
          });
      } catch (error) {
        this.openTost('error', 'Error', error.message);
      }
    }
  };

  checkPromocodeIsAppiled = (item) => {
    const { ticketList } = this.state;
    const {t} = this.props;
    const ticket = ticketList.find(t => t.ticketId == item.id);
    if ((ticket !== undefined) && (ticket?.item?.promocode !== undefined)) {
      let promocodeText = '';
      if (ticket?.item?.promocode?.p_type === "percent") {
        promocodeText = parseFloat(ticket?.item?.promocode?.reward).toFixed(2) + t('off_percent');
      } else {
        promocodeText = parseFloat(ticket?.item?.promocode.reward).toFixed(2) + " " + this.eventInfo.currency + t('off_fixed');
      }
      return (
        <Text style={styles.promocodeAppiled}>{promocodeText}</Text>
      )
    } else
      return null;
  };


  handleRegister = () => {
    this.props.navigation.navigate('SignUp');
  };

  handleWebView = (url) => {
    this.props.navigation.navigate('webView', { onPaymentCallback: this.paymentCallback, paymentUrl: url });
  };

  handleCheckoutAsGuest = async () => {
    this.setState({ checkModal: true });
  };

  handleEnableCheckOutPopUp = () => {
    this.setState({ checkSecondModal: true });
  };

  handleCheckoutAsGuestContinue = async () => {

    try {
      Keyboard.dismiss();

      const { name, email, phone } = this.state;

      // validation
      if (name.trim() === '') {
        Alert.alert('', 'Please enter name!', [{ text: 'OK' }], {
          cancelable: false,
        });
        return;
      }

      if (!isEmailAddress(email)) {
        Alert.alert('', 'Please enter email!', [{ text: 'OK' }], {
          cancelable: false,
        });
        return;
      }

      if (!isMobileNumber(phone)) {
        Alert.alert('', 'Please enter valid mobile number', [{ text: 'OK' }], {
          cancelable: false,
        });
        return;
      }
      try {
        // starting processing loader
        this.setState({ showModalProcessingLoader: true });
        // preparing params
        const params = {
          name: name,
          email: email,
          phone: phone,
        };
        // calling api
        const response = await makeRequest(
          BASE_URL + 'register-guest',
          params,
          true,
        );

        if (response) {
          var { status, token } = response;
          if (status === true) {
            // stopping processing loader
            this.setState({ showModalProcessingLoader: false });
            await storeData(async_keys.userId, token);
            this.handleCheckout()

          } else {

            this.setState({ showModalProcessingLoader: false });


          }
        }
      } catch (error) {
        this.openTost('error', 'Error', error.message);
      }
    } catch (error) {
      this.openTost('error', 'Error', error.message);
    }


  };

  handleClosePopUp = () => {
    this.setState({ checkModal: false, checkSecondModal: false });
  };

  mastercardPayment = () => {
    this.openPaymentModal();
    return (
      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: BASE_URL + "mastercard/checkout" }}
        onNavigationStateChange={(webViewState) => {
          console.log(webViewState.url)
          if (webViewState.url === BASE_URL + "mastercard/checkout") {
            console.log('payment window');
          }
        }}
      />
    );
  };

  openPaymentModal = async () => {
    this.setState({ ...this.state, showPaymentSuccessPopup: true });
  };

  closePaymentModal = () => {
    this.setState({ checkPaymentModal: false });
  };

  getQtyText = (item) => {
    const qty = this.state.ticketList.length > 0 ? (this.state.ticketList.filter((t) => t.ticketId == item.id).reduce((pre, curr) => pre + parseInt(curr.value), 0)) : null;
    return qty > 0 ? `${qty} X ` : '';
  }

  checkTaxesIsAvailable = (item) => {
    let ticket = this.state.ticketList.length > 0 ? (this.state.ticketList.find((t) => (t.ticketId == item.id && t.value > 0 && (t.item.price > 0.00)))) : null;
    if (ticket == null || ticket == undefined) {
      return 0;
    } else {
      return ticket?.item?.taxes?.length;
    }
    // return tikcet.length;
  }

  checkPromocodeIsAvailable = (item) => {
    let ticket = this.state.ticketList.length > 0 ? (this.state.ticketList.find((t) => (t.ticketId == item.id && t.value > 0 && (t.item.price > 0.00)))) : null;
    if (ticket == null || ticket == undefined) {
      return 0;
    } else {
      return ticket?.item ? 1 : 0;
    }
    // return tikcet.length;
  }

  getTicketTaxes = (item) => {
    const { t } = this.props;

    if (this.state.ticketList.length > 0) {
      let ticket = this.state.ticketList.find((t) => t.ticketId == item.id);
      if (ticket != 'undefined') {
        const taxes = ticket?.item?.taxes.map(tax => {
          let taxAmount = 0;
          if (tax.rate_type === "percent") {
            taxAmount = ((parseFloat(tax.rate) / 100) * ((ticket.item.sale_start_date ? ticket.item.sale_price : ticket.item.price)))
          } else {
            taxAmount = parseFloat(tax.rate)
          }
          return (
            <Text style={styles.taxesContainerText} key={tax?.id}>{`${tax.title} ${parseFloat(taxAmount * ticket.value).toFixed(2)} ${this.eventInfo.currency} (${parseFloat(tax.rate).toFixed(2)} ${tax?.rate_type == "percent" ? "%" : this.eventInfo.currency} ${tax.net_price == "excluding" ? t("exclusive") : t("inclusive")} )`} </Text>
          )
        })
        return taxes;
      }
    }
  }

  checkSaleIslive = (date) => {
    const saleStartDate = moment(date.sale_start_date)
    const saleEndDate = moment(date.sale_end_date)
    const currentTime = moment()
    return currentTime.isBetween(saleStartDate, saleEndDate, 'seconds', '[]')
  }
  paymentCallback = async(response) => {
    await storeData('guestCheckoutSuccess', "yes");
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'MyBooking' })],
    });
    if (response.success) {
      showToast(response.message);
      this.props.navigation.dispatch(resetAction);
      RNRestart.Restart();
    } else {
      showToast(response.message);
      this.openTost('error', 'Payment Cancelled', response.message);
    }
  }

  render() {
    const { isLoading } = this.state;
    const { t } = this.props;
    const getSeatBacgroundColor = seat => {
      const { ticketList } = this.state;
      var bgc = 'transparent';
      if (seat?.status) {
        if (seat?.is_booked) {
          bgc = "red"
        } else {
          const selectedAny = ticketList.find(t => t.ticketId == seat.ticket_id)

          if (selectedAny !== undefined && selectedAny?.seat_ids?.includes(seat.id)) {
            bgc = "green";
          }
        }
      } else {

        bgc = "grey"
      }
      return bgc;

    };
    const getTextColor = seat => {
      const { ticketList } = this.state;
      var bgc = 'green';
      if (seat?.status) {
        if (seat?.is_booked) {
          bgc = "white"
        } else {
          const selectedAny = ticketList.find(t => t.ticketId == seat.ticket_id)

          if (selectedAny !== undefined && selectedAny?.seat_ids?.includes(seat.id)) {
            bgc = "white";
          }
        }
      } else {

        bgc = "white"
      }
      return bgc;

    };

    const getListTicketQuantity = item => {
      let list = [];
      let OTNPrice = 0;
      let maxLength = this.eventInfo.maxQuantity;
      if (maxLength > item?.quantity) {
        maxLength = item?.quantity;

      }
      for (let i = 1; i <= maxLength; i++) {
        list.push({ label: JSON.stringify(i), value: i, id: item.id, OTNPrice });
      }
      return list;
    };

    const totalTicketSelected = (item, type) => {
      // console.log('item',JSON.stringify(item,null,4));
      let selected_tickets = this.state.ticketList;
      if (selected_tickets.length && selected_tickets.filter(i => i.ticketId === item.id).length) {
        return selected_tickets.filter(i => i.ticketId === item.id)[0].value;
      }
      return 0;
    };
    
    const renderCustomFieldInputs = (item) => {
      const selected_tickets = totalTicketSelected(item);

      const iscustomFields = this.state.customFiled;

      if (!selected_tickets) {
        return null;
      }
      if (iscustomFields.length == 0) {
        return null;
      }
      return (
        <View>
          {Array.from({ length: selected_tickets }, (v, k) => k + 1).map(
            (ite, index) => {
              return (
                <View>
                  <CustomField
                    title={`#${ite} `+t('attendee_details')}
                    customFieldsData={this.state.customFiled}
                    ticket={item}
                    seat={this.state.currentSelectedSeat}
                    onChange={data => {
                      let obj = this.state.finalData;
                      obj.push(data);
                      this.setState({ finalData: obj });
                    }}
                  />

                </View>
              );
            },
          )}
        </View>
      );
    };



    if (isLoading) {
      return <CustomLoader />;
    }


    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={t('checkout')}
          navAction="back"
          nav={this.props.navigation}
        />
        <ScrollView>
          <View style={styles.homeContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{t('booking_info')}</Text>
            </View>

            <View style={styles.eventInformationContainer}>
              <Text style={styles.eventCategoryText}>{t('event_category')}</Text>
              <Text style={styles.eventCategoryTitle}>
                {this.eventInfo.title}
              </Text>

              <Text style={styles.eventCategoryText}>{t('venue')}</Text>
              <Text style={styles.eventCategoryTitle}>
                {this.eventInfo.venue}
              </Text>

              <Text style={styles.eventCategoryText}>{t('start_end_date')}</Text>
              <Text style={styles.eventCategoryTitle}>
                {convertTimeZoneFormatted(this.eventInfo.finalDate.start_date, '', 'dddd MMM DD, YYYY')} -
                {convertTimeZoneFormatted(this.eventInfo.finalDate.end_date, '', ' dddd MMM DD, YYYY')}
              </Text>

              <Text style={styles.eventCategoryText}>{t('timings')}</Text>
              <Text style={styles.eventCategoryTitle}>
                {convertTimeZone(`${this.eventInfo.finalDate.start_date} ${this.eventInfo.finalDate.start_time}`).formattedTime} - {convertTimeZone(`${this.eventInfo.finalDate.end_date} ${this.eventInfo.finalDate.end_time}`).formattedTime}
              </Text>
            </View>


            {/* Tickets */}
            <View>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{t('tickets')}</Text>
              </View>

              {this.state.tickets.map((item, i) => {
                return (
                  <View key={i} style={styles.ticketContainer}>
                    {item?.sale_end_date != null && this.checkSaleIslive(item) && (
                      <View style={styles.eventSaleContainer}>
                        <Text style={styles.eventSaleText}>{t('on_sale')} </Text>
                        <CountDown
                          until={getSaleExpirationSeconds(item?.sale_end_date)}
                          size={12}
                          onFinish={() => this.saleFinished()}
                          digitTxtStyle={styles.digitTxtStyle}
                          digitStyle={styles.digitStyle}
                          timeLabelStyle={styles.timeLabelStyle}
                          timeToShow={['D', 'H', 'M', 'S']}
                          timeLabels={{ d: t('days'), h: t('hours'), m: t('minutes'), s: t('seconds') }}
                        />
                      </View>
                    )}
                    <View style={styles.ticketPricingContainer}>

                      <View style={styles.ticketNameWrapper}>
                        <Text style={styles.ticketName}>{item?.title}</Text>
                        <View style={styles.ticketQtyWrapper}>
                          <Text>
                            {!item?.sale_start_date ? this.getQtyText(item) : null}
                          </Text>
                          <Text style={!item?.sale_start_date ? {} : {
                            ...styles.ticketQtyWrapper, fontSize: 10,
                            textDecorationLine: 'line-through'
                          }}>
                            {(item?.price)} {this.eventInfo.currency}
                          </Text>
                        </View>
                        {item?.sale_start_date && (
                          <View style={styles.ticketQtyWrapper}>
                            <Text>
                              {this.getQtyText(item)}
                            </Text>
                            <Text >
                              {(item?.sale_price)} {this.eventInfo.currency}
                            </Text>
                          </View>
                        )}
                      </View>
                      {!(item?.show_sheat_chart) ? (
                        <View style={styles.selectPickerWrapper}>
                          <RNPickerSelect
                            placeholder={{
                              label: t('qty'),
                              value: 0,
                            }}
                            onValueChange={value => { this.handleSelectValue(value, item, '') }}
                            fixAndroidTouchableBug={true}
                            items={getListTicketQuantity(item).map((list, i) => ({
                              label: list.label + ' '+t('tickets'),
                              value: list.value,
                              key: i,
                            }))}
                            style={{
                              ...pickerStyle,
                              iconContainer: {
                                top: 8,
                                right: 8,
                              },
                              
                            }}
                            useNativeAndroidPickerStyle={false}
                            // Icon={() => {
                            //   return <Image
                            //     source={dropDown}
                            //     style={styles.dropDownIcon}
                            //   />
                            // }}
                          />

                        </View>
                      ) : (
                        <View>
                          {this.state.quantity.map(q => {
                            if (q.qId === item.id) {
                              return (
                                <Text style={styles.totalPriceText1}>
                                  {q?.baseQuantity}
                                </Text>
                              );
                            }
                          })}
                        </View>
                      )}
                    </View>
                    {item?.show_sheat_chart && (
                      <>
                        <View style={styles.seatingAvailabilityContainer}>
                          <View style={styles.ticketLegendsWrapper}>
                            <View style={{ ...styles.bookedContainer, backgroundColor: 'grey' }}></View>
                            <Text style={styles.seatingText}>{t('disabled')}</Text>
                          </View>
                          <View style={styles.ticketLegendsWrapper}>
                            <View style={{ ...styles.bookedContainer, backgroundColor: 'red' }}></View>
                            <Text style={styles.seatingText}>{t('reserved')}</Text>
                          </View>
                          <View style={styles.ticketLegendsWrapper}>
                            <View style={{ ...styles.bookedContainer, borderWidth: 1, borderColor: 'green' }}></View>
                            <Text style={styles.seatingText}>{t('available')}</Text>
                          </View>
                          <View style={styles.ticketLegendsWrapper}>
                            <View style={{ ...styles.bookedContainer, backgroundColor: 'green' }}></View>
                            <Text style={styles.seatingText}>{t('selected')}</Text>
                          </View>
                        </View>
                        <ScrollView
                          // contentContainerStyle={{flex: 1}}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          style={styles.seatWrapper}>
                          <View
                            style={{
                              height: item?.seatchart?.canvas_size?.height,
                              width: item?.seatchart?.canvas_size?.width,
                              backgroundColor: '#f1f1f1',
                              borderColor: 'white',
                              borderRadius: wp(1),
                              position: 'relative',
                            }}>
                            {item?.seatchart?.seats.map((seat, index) => {
                              return (
                                <TouchableOpacity
                                  disabled={seat?.status == 0 || seat?.is_booked}
                                  key={seat?.id}
                                  index={index}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    height: 24,
                                    width: 24,
                                    backgroundColor: getSeatBacgroundColor(seat),
                                    borderWidth: 1,
                                    borderColor: seat?.status
                                      ? seat?.is_booked
                                        ? 'red'
                                        : 'green'
                                      : 'grey',
                                    borderRadius: 5,
                                    marginTop: seat?.coordinates?.top - 12,
                                    marginLeft: seat?.coordinates?.left - 12,
                                  }}
                                  onPress={() =>
                                    this.handleSelectValue(1, item, seat)
                                  }>
                                  <Text
                                    style={{
                                      color: getTextColor(seat),
                                      fontSize: 9,
                                      fontWeight: 'bold',
                                    }}>
                                    {seat?.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </ScrollView>
                      </>
                    )}
                    {(this.checkTaxesIsAvailable(item) > 0) && (
                      <View style={styles.taxesContainer}>
                        {this.getTicketTaxes(item)}
                      </View>
                    )}
                    {this.state.customFiled.length > 0 && (
                      <View style={{ marginVertical: wp(1) }}>{renderCustomFieldInputs(item)}</View>
                    )}


                    {(this.checkPromocodeIsAvailable(item) > 0) && (
                      <View style={styles.promocodeContainer}>
                        <TextInput
                          style={styles.loginFormTextInput}
                          placeholder={t('enter_promocode')}
                          placeholderTextColor="#999"
                          keyboardType="default"
                          underlineColorAndroid="transparent"
                          value={item?.promocode}
                          onChangeText={(promocodeText) => { this.onChangePromocode(promocodeText, item) }}
                        />
                        <TouchableOpacity style={styles.applyContainer}
                          onPress={() => { this.applyPromocode(item) }}>
                          <Text style={styles.applyText}>{t('apply')}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {this.checkPromocodeIsAppiled(item)}
                  </View>
                );
              })}
            </View>

            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{t('payment_summary')}</Text>
            </View>

            <View style={styles.totalTicketMainContainer}>
              <View style={styles.totalTicketContainer}>
                <Text style={styles.totalTicketText}>{t('no_of_tickets')}</Text>

                <Text style={styles.totalTicketText}>
                  {this.state.ticketList.reduce((pre, curr) => pre + parseInt(curr.value), 0)}
                </Text>
              </View>
            </View>

            <View style={styles.totalTicketMainContainer}>
              <View style={styles.totalTicketContainer}>
                <Text style={styles.totalTicketText}>{t('sub_total')}</Text>
                <Text style={styles.totalTicketText}>
                  {this.state.totalPrice} {this.eventInfo.currency}
                </Text>
              </View>
              <View style={styles.totalTicketContainer}>
                <Text style={styles.totalTicketText}>{t('taxes')}</Text>

                <Text style={styles.totalTicketText}>
                  {this.state.taxAmount} {this.eventInfo.currency}
                </Text>

              </View>
              <View style={styles.totalTicketContainer}>
                <Text style={styles.totalTicketText}>{t('total_amount')}</Text>
                <Text style={styles.totalTicketText}>
                  {this.state.grandTotal} {this.eventInfo.currency}
                </Text>
              </View>
              {this.state.promocodeDiscount > 0 && (
                <>
                  <View style={styles.totalTicketContainer}>
                    <Text style={styles.totalTicketText}>{t('promocode_discount')}</Text>
                    <Text style={styles.discountOnTicketText}>
                      - {this.state.promocodeDiscount} {this.eventInfo.currency}
                    </Text>
                  </View>
                  <View style={styles.totalTicketContainer}>
                    <Text style={styles.totalTicketText}>{t('net_payable')}</Text>
                    <Text style={styles.totalTicketText}>
                      {this.state.netTotal} {this.eventInfo.currency}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View>
              {(this.state.ticketList.reduce((pre, curr) => pre + parseInt(curr.value), 0) > 0) && (parseFloat(this.state.netTotal) > 0.00) && (
                <>
                  <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{t('payment_method')}</Text>
                  </View>
                  <View style={styles.paymentMethodWrapper}>

                    <View style={styles.radioWrapper}>
                      {this.state.radioBtnsData.map((data, key) => {
                        return (
                          <View key={data.id}>
                         
                              <TouchableOpacity  style={styles.radioInner} onPress ={()=>{this.onSelectPaymentType(data)}}>
                                <Image
                                  source={data.selected ? radiocheck : radiouncheck}
                                  resizeMode="cover"
                                  style={styles.radioImg}
                                />
                                <Image source={data.image} resizeMode="cover" />
                              </TouchableOpacity>
                          </View>
                        )
                      })}
                    </View>

                    {/* <RadioForm
                      radio_props={paymentOption}
                      onPress={(value) => {
                        this.setState({ ...this.state, payment_method: value })
                      }}
                      initial={0}
                      buttonSize={10}
                      buttonOuterSize={20}
                      buttonColor={'black'}
                      LabelColor={'black'}
                      selectedButtonColor={'green'}
                      selectedLabelColor={'green'}
                      labelStyle={styles.paymentMethodLable}
                      disabled={false}
                      formHorizontal={true}
                    /> */}
                  </View>
                </>
              )}
              {(this.state.ticketList.reduce((pre, curr) => pre + parseInt(curr.value), 0) > 0) && (parseFloat(this.state.netTotal) <= 0.00) && (
                <View style={styles.paymentMethodWrapper}>
                  <RadioForm
                    radio_props={rsvpOption}

                    initial={0}
                    buttonSize={10}
                    buttonOuterSize={20}
                    buttonColor={'black'}
                    LabelColor={'black'}
                    selectedButtonColor={'green'}
                    selectedLabelColor={'green'}
                    labelStyle={styles.paymentMethodLable}
                    disabled={true}
                    formHorizontal={true}
                  />
                </View>
              )}
            </View>
            <View style={styles.checkoutContainer}>
              {this.state.userId === null ? (
                <View style={styles.checkoutContainer1}>
                  <TouchableOpacity
                    style={styles.registerButtonContainer}
                    onPress={this.handleRegister}>
                    <Text style={styles.registerText}>{t('register')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkoutAsGuest}
                    onPress={this.handleCheckoutAsGuest}>
                    <Text style={styles.registerText}>{t('checkout_guest')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.checkout}
                  onPress={this.handleCheckout}>
                  <Text style={styles.registerText}>{t('checkout')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
        <Modal
          style={styles.modalStyle}
          isVisible={this.state.checkModal}
          onBackdropPress={this.handleClosePopUp}>
          <Text style={styles.textInputText}>{t('name')}*</Text>

          <View style={styles.modalInputContainer}>
            <TextInput
              placeholder={t('name')}
              placeholderTextColor="#838383"
              style={styles.modalLoginFormTextInput}
              keyboardType="default"
              underlineColorAndroid="transparent"
              value={this.state.name}
              onChangeText={this.handleNameChange}
            />
          </View>

          <Text style={styles.textInputText}>{t('email')}*</Text>

          <View style={styles.modalInputContainer}>
            <TextInput
              placeholder={t('email')}
              placeholderTextColor="#838383"
              style={styles.modalLoginFormTextInput}
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              value={this.state.email}
              onChangeText={this.handleEmailChange}
            />
          </View>

          <Text style={styles.textInputText}>{t('phone_number')}*</Text>

          <View style={styles.modalInputContainer}>
            <TextInput
              placeholder={t('phone_number')}
              placeholderTextColor="#838383"
              style={styles.modalLoginFormTextInput}
              keyboardType="number-pad"
              underlineColorAndroid="transparent"
              value={this.state.phone}
              onChangeText={this.handleNumberChange}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.handleCheckoutAsGuestContinue}>
            <Text style={styles.saveProfileText}>{t('continue')}</Text>
          </TouchableOpacity>

          {this.state.showModalProcessingLoader && <ProcessingLoader />}
        </Modal>
        <Toast position='bottom'
          bottomOffset={70} />
        <FooterComponent nav={this.props.navigation} />

        {this.state.showProcessingLoader && <ProcessingLoader />}

      </SafeAreaView>
    );
  }
}

export default withTranslation()(CheckOutScreen);

const pickerStyle = StyleSheet.create({
  inputIOS: {
    height: 30,
    minWidth: 70,
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 0, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 30,
    minWidth: 70,
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 0, // to ensure the text is never behind the icon
  },
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeContainer: {
    flex: 1,
    marginBottom: hp(2)
  },
  checkoutText: {
    fontSize: wp(6),
    color: '#f89b15',
    textAlign: 'center',
    marginBottom: hp(6)
  },
  paymentMethodWrapper: {
    marginVertical: wp(4),
    marginHorizontal: hp(4)
  },
  paymentMethodLable: {
    fontSize: 16,
    marginRight: hp(2)
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f89b15',
    paddingVertical: hp(.5)
  },
  headerText: {
    fontSize: wp(2.5),
    fontWeight: '500',
    color: '#fff',
    textAlign: "center"
  },
  eventInformationContainer: {
    marginVertical: hp(1),
    paddingHorizontal: wp(2)
  },
  eventCategoryText: {
    fontSize: wp(2.5),
    fontWeight: '500',
    color: '#838383',
    
  },
  eventCategoryTitle: {
    fontSize: wp(3.5),
    color: '#000',
    marginBottom: hp(1),
  },
  ticketContainer: {
    backgroundColor: '#fff',
    marginHorizontal: wp(2),
    paddingVertical: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  lineContainer: {
    height: hp(0.1),
    width: 'auto',
    backgroundColor: '#ddd',
    marginVertical: hp(0.5),
  },
  seatingCalculationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: hp(2),
  },
  ticketPricingContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketQtyWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  ticketName: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  ticketNameWrapper: {
    marginVertical: hp(0)
  },
  freeText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
    marginRight: 'auto',
  },
  selectPickerWrapper: {
    marginTop: hp(2),
  },
  dropDownIcon: {
    width: 16,
    height: 16
  },
  picker: {
    width: wp(40),
    padding: 10,
    borderWidth: 1,
    borderColor: '#666',
  },
  loginFormTextInput1: {
    fontSize: wp(3.5),
    // flex: 1,
    width: wp(40),
    color: '#fff',
    textAlign :  I18nManager.isRTL ? 'right' : 'left',
  },
  priceText: {
    fontSize: wp(4),
    color: '#838383',
  },
  totalPriceText1: {
    fontSize: wp(4),
    color: '#838383',
    // marginLeft: 'auto',
  },
  totalPriceText: {
    fontSize: wp(4),
    color: '#838383',
    marginLeft: 'auto',
  },
  hideShowInfoContainer: {
    flexDirection: 'row',
  },
  showInfoText: {
    fontSize: wp(3.5),
    color: '#838383',
  },
  promocodeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(.5),
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: wp(1),
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    color: '#000',
    width: "70%",
    paddingHorizontal: wp(3),
    textAlign :  I18nManager.isRTL ? 'right' : 'left',
  },
  applyContainer: {
    width: "30%",
    height: hp(5),
    borderTopRightRadius: wp(1),
    borderBottomRightRadius: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#59cdb2',
  },
  applyText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff'
  },
  totalTicketMainContainer: {
    // marginHorizontal: hp(2),
  },
  totalTicketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(2),
    marginVertical: wp(1),
  },
  totalTicketText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#000',
  },
  discountOnTicketText: {
    fontSize: wp(4),
    backgroundColor: 'green',
    fontWeight: '700',
    borderRadius: wp(2),
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    color: '#fff',
  },
  checkoutContainer: {
    flexDirection: 'row',
    marginVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutContainer1: {
    flexDirection: 'row',
  },
  registerButtonContainer: {
    height: hp(6),
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: wp(2),
    borderBottomLeftRadius: wp(2),
    backgroundColor: '#f89b15',
  },
  registerText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  checkoutAsGuest: {
    height: hp(6),
    width: wp(45),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: wp(2),
    borderBottomRightRadius: wp(2),
    backgroundColor: '#000000',
  },
  checkout: {
    height: hp(6),
    width: wp(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
    backgroundColor: '#000000',
  },
  seatingAvailabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: wp(2),
    marginVertical: wp(3),
  },
  ticketLegendsWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: wp(.5)
  },
  bookedContainer: {
    height: 16,
    width: 16,
    marginRight: wp(2),
    borderRadius: wp(1)
  },
  seatingText: {
    fontSize: wp(3),
    borderRadius: wp(2),
    fontWeight: '700',
  },
  seatWrapper: {
    // flex: 1,
    marginBottom: wp(2)
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  QRCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: wp(2),
    marginBottom: hp(2),
  },
  modalStyle: {
    flex: 1,
    width: 'auto',
    maxHeight: hp(60),
    overflow: "scroll",
    // alignItems: 'center',
    justifyContent: 'center',
    top: hp(10),
    marginVertical: wp(2),
    backgroundColor: '#fff',
    borderRadius: wp(2),
  },
  textInputText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#000',
    marginTop: hp(2),
    marginBottom: hp(.5),
    marginHorizontal: wp(2),
  },
  modalInputContainer: {
    flexDirection: 'row',
    height: hp(6),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: wp(2),
    // marginVertical: hp(1),
    marginHorizontal: wp(4),
  },
  modalLoginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: wp(1),
    paddingStart: wp(2),
    color: '#000',
    textAlign :  I18nManager.isRTL ? 'right' : 'left',
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
    backgroundColor: '#f89b15',
  },
  saveProfileText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  activeRadio: {
    backgroundColor: 'black',
    borderWidth: 1.5,
    borderColor: 'black',
  },
  inactiveRadio: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'rgb(20,20,20)',
  },


  modalStylePayment: {
    backgroundColor: '#000',
    zIndex: 99999999,
  },
  ticketPriceOld: {
    fontSize: 10,
    textDecorationLine: 'line-through'
  },
  taxesContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: wp(2),
    marginVertical: hp(1),
    paddingHorizontal: hp(1),
    paddingVertical: wp(2)
  },
  taxesContainerText: {
    color: '#999',
    fontSize: wp(3),
    fontWeight: '500',
  },
  promocodeAppiled: {
    fontWeight: '700',
    color: 'green'
  },
  eventSaleContainer: {
    flexDirection: 'row',
    flex:1,
    alignItems: 'center',
  },
  radioImg:{
    height:20,
    width: 20,
    marginRight:wp(1),
  },
  radioWrapper:{
    flex:1,
    flexDirection: 'row',
    justifyContent:"flex-start",
    alignItems:"center"
  },
  radioInner:{
    flex:1,
    flexDirection: 'row',
    alignItems:"center",
    marginRight:wp(6),
  },
  
  eventSaleText:{
    alignItems: 'center',
    color: '#ff0084',
    fontWeight: '700',
    marginRight: wp(1),
    paddingBottom: hp(1),
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
});