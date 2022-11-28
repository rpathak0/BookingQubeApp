/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { convertTimeZone, getSaleExpirationSeconds } from '../../Helper/dateConverter';
import CountDown from 'react-native-countdown-component';

import { withTranslation } from 'react-i18next';


class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSchdeuleMonthId: this.props.selectedSchdeuleMonthId,
      eventSchedulesDatesForMonth: this.props.eventSchedulesDatesForMonth,
    }
  }

  onSelectScheduleMonth = async (schedule) => {
    this.setState({ ...this.state, eventSchedulesDatesForMonth: schedule.schedule_dates.formatted_schedule_dates, selectedSchdeuleMonthId: schedule.id });

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

  handleGetTicket = async (date) => {
    this.props.handleGetTicket(date);
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

  render() {
    console.log('this.props.data.repititive_schedule', this.props.data.repititive_schedule);
    const {
      repetitive_type, start_time_format,
      end_time_format, start_date_format, end_date_format,
      start_date, end_date, start_time, end_time
    } = this.props.data.event;
    let repititive_schedule = this.props.data.repititive_schedule;
    let tickets = this.props.data.tickets;
    console.log(tickets);

    const { t } = this.props;

    return (
      <>
        <Text style={styles.getYourTicketText}>{t('get_tickets')}</Text>
        <Text style={styles.bookTicketText}>
          {t('book_ticket')}
        </Text>

        {tickets?.length > 0 && tickets[0]?.sale_end_date != null && this.checkSaleIslive(tickets[0]) && (
          <View style={styles.eventSaleContainer}>
            <Text style={styles.eventSaleText}>{t('on_sale')}</Text>
            <CountDown
              until={getSaleExpirationSeconds(tickets[0].sale_end_date)}
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
        <View style={styles.firstTicketContainer}>

          {repetitive_type != null && repititive_schedule?.map((schedule) => (
            <>
              {schedule?.schedule_dates.formatted_schedule_dates.length > 0 && (
                <TouchableOpacity
                  onPress={() => this.onSelectScheduleMonth(schedule)}
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
            <View style={styles.thirdTicketContainer}>
              {this.state.eventSchedulesDatesForMonth.map((date, i) => {
                let canBookTicket = this.CanBookTicket(date.date_value.start_date);
                return (
                  <TouchableOpacity
                    key={i}
                    style={canBookTicket ? styles.listCountingContainer : { ...styles.listCountingContainer, backgroundColor: '#ddd' }}
                    onPress={() => canBookTicket ? this.handleGetTicket(date.date_value) : false}>
                    <View style={styles.listDateContainer} >
                      <Text style={styles.listDateText} >{date.date_format_text}</Text>
                    </View>
                    {canBookTicket ? (
                      <View style={styles.listTimeContainer}>
                        <Text style={styles.listTimeText}>
                          {convertTimeZone(`${date?.date_value?.start_date} ${date?.date_value?.start_time}`).formattedTime}
                          -
                          {convertTimeZone(`${date?.date_value?.end_date} ${date?.date_value?.end_time}`).formattedTime}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.listTimeContainer}>
                        <Text style={styles.listTimeText}>
                          {t('ended')}
                        </Text>
                      </View>
                    )}

                  </TouchableOpacity>

                );
              })}
            </View>
          ) : (
            <View style={styles.thirdTicketContainer}>
              <TouchableOpacity
                style={styles.listCountingContainer}
                onPress={() => this.handleGetTicket({ 'start_date': start_date, 'end_date': end_date, start_time, end_time })}
              >
                <Text style={styles.listDateText}> {start_date_format} - {end_date_format} </Text>

                <View style={styles.listTimeContainer}>
                  <Text style={styles.listTimeText}>
                    {/* {start_time_format} - {end_time_format}  */}
                    {convertTimeZone(`${start_date} ${start_time}`).formattedTime}
                    -
                    {convertTimeZone(`${end_date} ${end_time}`).formattedTime}
                  </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
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
    backgroundColor: '#f89b15',
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
    backgroundColor: '#f89b15',
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
    backgroundColor: '#000000',
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
    color: '#f89b15',
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
    flexDirection: 'row',
    flex: 1,
    borderRadius: wp(3),
    flexWrap: 'wrap',
    backgroundColor: '#f89b15',
    marginVertical: hp(1),
    alignContent: 'center',
    justifyContent: 'center',
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
