/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ReactNativePickerModule, {PickerRef} from 'react-native-picker-module';
import moment from 'moment';
import { convertTimeZone } from '../../Helper/dateConverter';
// import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import { withTranslation } from 'react-i18next';
import { getData } from '../../api/UserPreference';
import axios from 'axios';
import { BASE_URL } from '../../api/ApiInfo';

class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSchdeuleMonthId: this.props.selectedSchdeuleMonthId,
      eventSchedulesDatesForMonth: this.props.eventSchedulesDatesForMonth,
      scrollToSchedulesPos: 0,
      scroller: this.props.scroller,
      timeslots: [],
      pickerValue: '',
      selectedDate: '',
    }
    this.pickerRef = React.createRef();
  }

  scrollToSchedules = () => {
    this.state.scroller.scrollTo({ x: 0, y: (2 * this.state.scrollToSchedulesPos) });
  };

  onSelectScheduleMonth = async (schedule) => {
    this.setState({ ...this.state, eventSchedulesDatesForMonth: schedule.schedule_dates.formatted_schedule_dates, selectedSchdeuleMonthId: schedule.id });
    this.scrollToSchedules();
  }

  saleFinished() {
    // return this.props.onSaleExpire()
    // Alert.alert('', 'Sale Expired', [{text: 'OK'}], {
    //   cancelable: false,
    // });

  }

  checkSaleIslive = (date) => {
    const saleStartDate = moment(date.sale_start_date)
    const saleEndDate = moment(date.sale_end_date)
    const currentTime = moment()
    return currentTime.isBetween(saleStartDate, saleEndDate, 'seconds', '[]')
  }

  handleGetTicket = async (data) => {
    console.log("Event Info:", data);
    this.props.handleGetTicket({
      date: data.date ?? data,
      timeslot: data.timeslot,
    });
  }

  CanBookTicket(eventStartDate) {
    var eventdate = moment(eventStartDate);
    var todaysdate = moment();
    const remaingDays = eventdate.diff(todaysdate, 'days');
    if (remaingDays >= 0) {
      return true;
    } else {
      return false;
    }
  }
  
  isMonthExpired(eventMonthYear) {
    var todayDate = new Date();
    
    var currentMonth = todayDate.getMonth() + 1;
    var currentYear = todayDate.getFullYear();
    
    eventMonthYear = eventMonthYear.split(",").map(function(item) {
      return item.trim();
    });
    // get month in numeric
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    
    if (new Date(eventMonthYear[1], month.indexOf(eventMonthYear[0])+1).valueOf() < new Date(currentYear, currentMonth).valueOf()) {
      return false;
    }

    return true;
  }

  isTimeGreaterThan7PM = () => {
    let time = new Date().toLocaleTimeString();
    let timeArray = time.split(':');
    if (timeArray[0] >= 19) {
      return true;
    }
    return false;
  }

  isTimeGreaterThanCurrentTime = (time) => {
    let currentTime = new Date().toLocaleTimeString();
    let timeArray = time.split(':');
    let currentTimeArray = currentTime.split(':');
    if (timeArray[0] > currentTimeArray[0]) {
      return true;
    } else if (timeArray[0] == currentTimeArray[0]) {
      if (timeArray[1] > currentTimeArray[1]) {
        return true;
      }
    }
    return false;
  }

  initialSetup = async () => {
    const { start_date, end_date, start_time, end_time } = this.props.data.event;
    const { eventId } = this.props;
    try {
      const params = {
        event_id: eventId,
        startDate: start_date,
        endDate: end_date,
        startTime: start_time,
        endTime: end_time,
      };
      console.log("Params:", params);
      // creating custom header
      let axiosConfig = {};
      // calling api
      await axios
        .post(BASE_URL + 'events/details', params, axiosConfig)
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const {success} = newResponse.data;

            let timeslots = [];
            if (success === true) {
              newResponse.data.data.event.slots.map(item => {
                let startdatetime = null;
                let currentdatetime = null;
                startdatetime = moment(
                  params.startDate + ' ' + item.ts_start_time,
                );
                currentdatetime = moment();
                // skip expired/ended timeslot
                // check event start datetime <= current datetime
                if (currentdatetime.isSameOrBefore(startdatetime)) {
                  if (newResponse.data.data.event.repetitive <= 0) {
                    // Non-Repetitive event
                    // take all timeslots
                    timeslots.push(item);
                  } else {
                    // Repetitive event
                    // take timeslots date-wise
                    if (this.yearMonth(start_date) == this.yearMonth(item.from_date)) {
                      timeslots.push(item);
                    }
                  }
                }
              });

              this.setState({
                timeslots: timeslots,
              });
              console.log("Timeslots:", timeslots);
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    this.initialSetup();
  }

  hourMinute = time => {
    let timeArray = time.split(':');
    // return time in 12 hour format with AM/PM
    return (
      (timeArray[0] > 12 ? timeArray[0] - 12 : timeArray[0]) +
      ':' +
      timeArray[1] +
      ' ' +
      (timeArray[0] >= 12 ? 'PM' : 'AM')
    );
  };

  yearMonth = date => {
    if (date) {
      let dateArray = date.split('-');
      return dateArray[0] + '-' + dateArray[1];
    }
  };

  getWeekDay = date => {
    if (date) {
      let dateArray = date.split('-');
      let dateObj = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      // return only week day name (Mon, Tue, Wed, etc.)
      return dateObj.toString().split(' ')[0];
    }
  };

  render() {
    const {
      repetitive_type, start_time_format,
      end_time_format, start_date_format, end_date_format,
      start_date, end_date, start_time, end_time
    } = this.props.data.event;
    let repititive_schedule = this.props.data.repititive_schedule;
    let tickets = this.props.data.tickets;
    
    const { t } = this.props;
    this.state.pickerRef = React.createRef(PickerRef);

    return (
      <>
        <Text style={styles.getYourTicketText}>{t('get_tickets')}</Text>
        <Text style={styles.bookTicketText}>
          {t('book_ticket')}
        </Text>

        {tickets?.length > 0 && tickets[0]?.sale_end_date != null && this.checkSaleIslive(tickets[0]) && (
          <View style={styles.eventSaleContainer}>
            <Text style={styles.eventSaleText}>{t('on_sale')}</Text>
            {/* <CountdownCircleTimer
              isPlaying
              duration={7}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[7, 5, 2, 0]}
            >
              {({ remainingTime }) => <Text>{remainingTime}</Text>}
            </CountdownCircleTimer> */}
            {/* <CountDown
              until={getSaleExpirationSeconds(tickets[0].sale_end_date)}
              size={12}
              onFinish={() => this.saleFinished()}
              digitTxtStyle={styles.digitTxtStyle}
              digitStyle={styles.digitStyle}
              timeLabelStyle={styles.timeLabelStyle}
              timeToShow={['D', 'H', 'M', 'S']}
              timeLabels={{ d: t('days'), h: t('hours'), m: t('minutes'), s: t('seconds') }}
            /> */}
          </View>
        )}
        <View style={styles.firstTicketContainer}>

          {repetitive_type != null && repititive_schedule?.map((schedule, index) => (
            <>
              { (schedule?.schedule_dates.formatted_schedule_dates.length > 0 && this.isMonthExpired(schedule.event_schedule_formatted)) && (
                <TouchableOpacity
                  onPress={() => this.onSelectScheduleMonth(schedule)}
                  key={schedule?.id}
                >
                  <View key={schedule?.id} style={(this.state.selectedSchdeuleMonthId == schedule?.id) ? styles.selectedsecondTicketContainer : styles.secondTicketContainer}>
                    <Text style={styles.dateText}>{schedule?.event_schedule_formatted}</Text>
                    <Text style={styles.eventDateCountText}>{schedule?.days_event}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          ))}
          {repetitive_type != null ? (
            <View 
              style={styles.thirdTicketContainer} 
              onLayout={event => {
                const { layout } = event.nativeEvent;
                this.setState({ ...this.state, scrollToSchedulesPos: (layout.height) });
              }}
            >
              {this.state.eventSchedulesDatesForMonth.map((date, i) => {
                let canBookTicket = this.CanBookTicket(date.date_value.start_date);
                return (
                  canBookTicket ? (
                    <TouchableOpacity
                      key={i}
                      style={styles.listCountingContainer}
                      // onPress={() => this.handleGetTicket(date.date_value)}>
                      onPress={
                        // check if current time is greater than 7 PM
                        // if yes, then show alert
                        // else, show ticket selection screen
                        this.isTimeGreaterThan7PM() ? 
                        () => {
                            Alert.alert('', 'Ticket booking is only available before 7 PM', [{ text: 'OK' }], { cancelable: false });
                            return;
                          } : 
                        this.state.timeslots.length ? 
                          () => {
                            this.pickerRef.current.show();
                            this.setState({
                              selectedDate: date?.date_value?.start_date,
                            });
                          } : 
                          () => {
                            this.handleGetTicket(date.date_value);
                            this.setState({
                              selectedDate: date?.date_value?.start_date,
                            })
                          }
                      }>
                      <View style={styles.listDateContainer} >
                        {this.props?.eventId == "14" && date.date_format_text == "11 Mar 2023" ? <Text style={styles.listDateText}>Inflata Sprint - 11 Mar 2023</Text>
                        : this.props?.eventId == "14" && date.date_format_text == "18 Mar 2023" ? <Text style={styles.listDateText}>Inflata Monster - 18 Mar 2023</Text> 
                        : <Text style={styles.listDateText}>{date.date_format_text}</Text>}
                      </View>

                      <View style={styles.listTimeContainer}>
                        <Text style={styles.listTimeText}>
                          {this.getWeekDay(date?.date_value?.start_date) == "Fri" ? "1:00 PM - 11:00 PM" : 
                          convertTimeZone(`${date?.date_value?.start_date} ${date?.date_value?.start_time}`).formattedTime
                          + ' - ' + convertTimeZone(`${date?.date_value?.end_date} ${date?.date_value?.end_time}`).formattedTime}
                        </Text>
                        <View style={styles.ticketContainer}>
                          <ReactNativePickerModule
                                  ref={this.pickerRef}
                                  value={this.state.pickerValue}
                                  title={t('select_timeslot')}
                                  // return timeslots that are greater than current time
                                  items={this.state.timeslots.filter((timeslot) => {
                                    if (this.isTimeGreaterThanCurrentTime(timeslot.ts_start_time)) {
                                      return timeslot;
                                    }}).map((item) => {
                                        const timeslot = {
                                            slot: this.hourMinute(item.ts_start_time) + ' - ' + this.hourMinute(item.ts_end_time),
                                            id: item.id,
                                        }
                                        return {
                                          label: this.hourMinute(item.ts_start_time) + ' - ' + this.hourMinute(item.ts_end_time),
                                          value: JSON.stringify(timeslot),
                                          id: item.id,
                                        };
                                  })}
                                  titleStyle={{fontSize: 18, color: 'black'}}
                                  selectedColor="#1E88E5"
                                  confirmButtonDisabledTextStyle={{color: 'grey'}}
                                  onCancel={() => {
                                      console.log('Cancelled');
                                  }}
                                  onValueChange={value => {
                                      console.log('Value:', JSON.parse(value));
                                      this.setState({pickerValue: value});
                                      this.handleGetTicket({ 
                                        date: {
                                            'selectedDate': this.state.selectedDate,
                                            'start_date': start_date, 
                                            'end_date': end_date, 
                                            start_time, 
                                            end_time
                                          },
                                        timeslot: JSON.parse(value),
                                      })
                                  }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : null
                );
              })}
            </View>
          ) : (
            <View style={styles.thirdTicketContainer}>
              <TouchableOpacity
                style={styles.listCountingContainer}
                onPress={
                      this.isTimeGreaterThan7PM() ? 
                        () => {
                            Alert.alert('', 'Ticket booking is only available before 7 PM', [{ text: 'OK' }], { cancelable: false });
                            return;
                          } : 
                      this.state.timeslots ? 
                      () => this.pickerRef.current.show() : 
                      () => this.handleGetTicket({ 'start_date': start_date, 'end_date': end_date, start_time, end_time })}
                >
                <Text style={styles.listDateText}> {start_date_format} - {end_date_format} </Text>
                <View style={styles.listTimeContainer}>
                  <Text style={styles.listTimeText}>
                    {/* {start_time_format} - {end_time_format}  */}
                    {this.getWeekDay(start_date) == "Fri" ? "1:00 PM - 11:00 PM" : 
                    convertTimeZone(`${start_date} ${start_time}`).formattedTime + 
                    ' - ' + convertTimeZone(`${end_date} ${end_time}`).formattedTime}
                  </Text>
                </View>
                <View style={styles.ticketContainer}>
                <ReactNativePickerModule
                    ref={this.pickerRef}
                    value={this.state.pickerValue}
                    title={t('select_timeslot')}
                    items={this.state.timeslots.filter((timeslot) => {
                        if (this.isTimeGreaterThanCurrentTime(timeslot.ts_start_time)) {
                          return timeslot;
                        }}).map((item) => {
                            const timeslot = {
                                slot: this.hourMinute(item.ts_start_time) + ' - ' + this.hourMinute(item.ts_end_time),
                                id: item.id,
                            }
                            return {
                              label: this.hourMinute(item.ts_start_time) + ' - ' + this.hourMinute(item.ts_end_time),
                              value: JSON.stringify(timeslot),
                              id: item.id,
                            };
                        }
                    )}
                    titleStyle={{fontSize: 18, color: 'black'}}
                    selectedColor="#1E88E5"
                    confirmButtonDisabledTextStyle={{color: 'grey'}}
                    onCancel={() => {
                        console.log('Cancelled');
                    }}
                    onValueChange={value => {
                        console.log('Value:', JSON.parse(value));
                        this.setState({pickerValue: value});
                        this.handleGetTicket({ 
                          date: {
                              'start_date': start_date, 
                              'end_date': end_date, 
                              start_time, 
                              end_time}, 
                          timeslot: JSON.parse(value),
                        })
                    }}
                />
              </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </>
    );
  }
}

export default withTranslation()(Tickets);

const pickerStyle = StyleSheet.create({
  inputIOS: {
    height: 10,
    minWidth: 70,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 5,
    borderRadius: 10,
    color: 'black',
  },
  inputAndroid: {
    height: 10,
    minWidth: 70,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 5,
    borderRadius: 10,
    color: 'black',
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  headerContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 2,
  },
  ticketContainer: {
    backgroundColor: '#fff',
    // marginHorizontal: wp(2),
    // paddingVertical: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pickerSelectStyles: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  },
  homeContainer: {
    flex: 1,
  },
  eventImageStyle: {
    height: hp(30),
    aspectRatio: 16 / 9,
  },
  eventTitleTextStyle: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#000',
    marginHorizontal: wp(2),
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(2),
  },
  eventCategory: {
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: wp(6),
    marginHorizontal: wp(1),
  },
  categoryText: {
    fontSize: wp(3),
    color: '#fff',
    marginHorizontal: wp(2),
  },
  shareEventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareEventText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#ff0084',
    // marginLeft: wp(2),
    marginHorizontal: wp(2),
  },
  iconOnPress: {
    flexDirection: 'row',
  },
  shareIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  getTicketButtonContainer: {
    flexDirection: 'row',
    height: hp(6),
    width: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
    backgroundColor: '#ff0084',
    marginVertical: hp(2),
    marginLeft: wp(2),
  },
  ticketIconStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
  },
  getTicketText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2),
  },
  whereBoxContainer: {
    height: hp(12),
    width: wp(45),
    marginHorizontal: wp(2),
    alignItems: 'center',
    borderRadius: wp(4),
  },
  whereTextStyle: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
  },
  addressTextStyle: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  bookTicketContainer: {
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  getYourTicketText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: hp(2),
  },
  bookTicketText: {
    fontSize: wp(3.5),
    color: '#eee',
    marginBottom: hp(2),
  },
  firstTicketContainer: {
    width: wp(90),
    backgroundColor: '#202020',
    marginHorizontal: wp(4),
    marginBottom: hp(2),
    alignItems: 'center',
    borderRadius: wp(3),
  },
  secondTicketContainer: {
    width: wp(80),
    borderRadius: wp(3),
    marginTop: hp(2),
    borderColor: '#fff',
    borderWidth: 1,
  },
  selectedsecondTicketContainer: {
    width: wp(80),
    borderRadius: wp(3),
    marginTop: hp(2),
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#ff0084',
    textAlign: 'center',
    marginTop: hp(2),
  },
  eventDateCountText: {
    fontSize: wp(3.5),
    color: '#969696',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  thirdTicketContainer: {
    width: wp(80),
    borderRadius: wp(2),
    backgroundColor: '#fff',
    marginVertical: hp(2),
  },
  listCountingContainer: {
    // flexDirection: 'row',
    flex: 1,
    borderRadius: wp(2),
    flexWrap: 'wrap',
    backgroundColor: '#000000',
    marginVertical: hp(1),
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    marginHorizontal: wp(2),
  },
  listDateText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'left',
    marginHorizontal: wp(2),
    marginTop: hp(0.4),
  },
  listDateContainer: {
    // width: wp(70),
    alignItems: 'center'
  },
  listTimeContainer: {
    // width: wp(30),
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: wp(6),
    backgroundColor: '#fff',
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listTimeText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#ff0084',
    marginHorizontal: wp(2),
    alignItems: 'center'
  },
  eventInfoContainer: {
    marginVertical: hp(2),
  },
  eventInfoText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  eventDescriptionText: {
    fontSize: wp(3.5),
    color: '#838383',
    marginVertical: hp(2),
  },
  DjsText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: hp(2),
  },
  djNameText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#efa506',
  },
  djSubtitleText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  eventCategoryContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000000',
  },
  categoryContainer: {
    height: hp(13),
    width: wp(40),
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: wp(2),
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImageStyle: {
    width: hp(18),
    aspectRatio: 16 / 9,
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitleText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
  },
  speakerListContainer: {
    backgroundColor: '#fff',
  },
  speakerText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginTop: hp(2),
  },
  speakerInfoContainer: {
    height: hp(20),
    width: wp(40),
    borderWidth: 4,
    borderColor: '#ccc',
    borderRadius: wp(2),
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 40,
  },
  speakerImageStyle: {
    height: hp(18),
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sponsorsImageStyle: {
    width: hp(18),
    aspectRatio: 16 / 9,
    // borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  sponsorsText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#efa506',
  },
  ratingReviewsContainer: {
    // backgroundColor: '#fff',
    marginHorizontal: wp(2),
    marginVertical: hp(2),
  },
  ratingsAndReviewsTitleText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  totalReviewsText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#000',
  },
  reviewListContainer: {
    // alignItems: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(2),
  },
  ratingIconAndTextContainer: {
    flexDirection: 'row',
  },
  startIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
  },
  ratingText: {
    fontSize: wp(3.5),
    color: '#000',
  },
  reviewText: {
    fontSize: wp(3.5),
    color: '#000',
    textAlign: 'left',
  },
  eventSaleContainer: {
    flexDirection: 'row',
    flex:1,
    paddingHorizontal: wp(2),
    marginBottom: wp(3),
    alignItems: 'center',
  },

  eventSaleText: {
    alignItems: 'center',
    color: '#fff',
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
    color: '#fff', 
  },
});
