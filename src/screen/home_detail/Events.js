/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import moment from 'moment';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { STORAGE_URL } from '../../api/ApiInfo';
import CountDown from 'react-native-countdown-component';
import { convertTimeZoneDateTime, getCurrentTime, getSaleExpirationSeconds, remaingDaysCount } from '../../Helper/dateConverter';
// Component

import { withTranslation } from 'react-i18next';




class Events extends Component {
  constructor(props) {
    super(props);
   
    // fetching navigation props
    // this.slugTitle = this.props.navigation.getParam('slugTitle', null);
  }
 

  daysRemaining(eventStartDate) {
    const remaingDays  = (remaingDaysCount(eventStartDate) + 1)
    const { t } = this.props;
    if (remaingDays >= 0) {
      return remaingDays +' '+ t('days_left');
    } else {
      return moment(eventStartDate).format('DD MMM YYYY');
    }
  }
  eventStatusText(event) {
    var eventStartDate = convertTimeZoneDateTime(`${event.start_date} ${event.start_time}`)
    var eventEndDate = convertTimeZoneDateTime(`${event.end_date} ${event.end_time}`)
    var eventDate = moment(eventStartDate);
    var todaysDate = getCurrentTime() ;
    var endDate = moment(eventEndDate);
    const remaingDaysFromStartDate = eventDate.diff(todaysDate, 'days');
    const remaingDaysFromEndDate = endDate.diff(todaysDate, 'days');

    const { t } = this.props;

    if (remaingDaysFromStartDate >= 0) {
      return t('upcomming');
    }
    if (remaingDaysFromStartDate <= 0 && remaingDaysFromEndDate >= 0) {
      return t('started');
    }
    if (remaingDaysFromStartDate <= 0) {
      return t('ended');
    }
  }
  handleEvent (item){
    return this.props.handleEvent(item);
  }

  saleFinished (){
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
  

  renderTicketCategory(item) {
    const { t } = this.props;
    let type = "sale";
    let tickets = item?.tickets.filter(t=>t.sale_start_date != null && this.checkSaleIslive(t));
    console.log("tickets=============",tickets);
    if(tickets.length <= 0){
      tickets = item?.tickets.filter(t=>t.sale_start_date == null);
      type = "not_sale";
    }
    
    return(
        <>
        {type == "sale" && (
          <View style={styles.eventSaleContainer}>
              <Text style={styles.eventSaleText}>{t('on_sale')}</Text>
              <CountDown
                until={ getSaleExpirationSeconds(tickets[0].sale_end_date)}
                size={12}
                onFinish={() => this.saleFinished()}
                digitTxtStyle={styles.digitTxtStyle}
                digitStyle={styles.digitStyle}
                timeLabelStyle={styles.timeLabelStyle}
                timeToShow={['D','H','M','S']}
                timeLabels={{d:t('days'),h:t('hours'),m: t('minutes'), s: t('seconds')}}
            />
          </View>
        )}
          <View style={styles.eventBidContainer}>
            {tickets?.map((ticket,index)=>(
              <View key={`${index}-prices`} >
                { index <= 1  &&  (
                <View style={styles.eventCostContainer}>
                  <Text style={styles.constTextStyle}>
                    {ticket.title} 
                  </Text>
                  {type == 'sale' ? (
                    <>
                      <Text style={styles.constTextStrikeThroughStyle}>
                      {ticket.price} 
                      </Text>
                      <Text style={styles.constTextStyle}>
                      {" "+ ticket.sale_price} {item.currency ? item.currency : 'QAR'} 
                      </Text>
                    </>
                  ): (
                    <Text style={styles.constTextStyle}>
                      {ticket.price} {item.currency ? item.currency : 'QAR'}
                    </Text>
                  )}
                </View>
                )}
              </View>
            ))}
          </View>
        </>
    );

  }



  render() {

    var eventList = this.props.eventList;
    var backGroundImage = this.props.backGroundImage;
    const { t } = this.props;
    
    return (
        <View style={styles.featuredEventContainer}>
          <Text style={styles.featuredEventText}>{this.props.name}</Text>
          {eventList.map((item, index) => {
            
            return (
              <TouchableOpacity
                activeOpacity={1}
                key={`${index}-events`}
                style={styles.featuredEventBox}
                onPress={() => {
                  this.handleEvent(item);
                }}>
                <Image
                  source={{ uri: STORAGE_URL + item.thumbnail }}
                  resizeMode="cover"
                  style={styles.featuredImageStyle}
                />

                <View style={styles.eventDateAndPlaceContainer}>
                  <Text style={styles.featuredEventDateText}>
                    { moment(item.start_date).format('DD MMM YYYY')}
                  </Text>

                  <Text style={styles.featuredEventDateText}>
                    { moment(item.end_date).format('DD MMM YYYY')}
                  </Text>

                  <Text style={styles.featuredEventDateText}>
                    {item.city}
                  </Text>
                </View>

                <Text style={styles.eventTitleTextStyle}>
                  {item.title}
                </Text>

                <Text
                  style={styles.eventDescriptionTextStyle}
                  numberOfLines={2}>
                  {item.excerpt}
                </Text>

                <Text style={styles.postedByTextStyle}>
                  {'@' + item.venue}
                </Text>
                {this.renderTicketCategory(item)}
                

                <View style={styles.eventTypeContainer}>
                  <Text style={styles.eventTypeText}>
                    {item.category_name}
                  </Text>
                </View>
                  {item?.online_location == "1" && (
                    <>
                      <View style={styles.onlineLeftContainer}>
                        <Text style={styles.eventDaysLeftText}>
                          {t('online')}
                        </Text>
                      </View>
                      <View style={styles.eventOnlineContainer}>
                        <Text style={styles.eventTimeText}>{t('event')}</Text>
                      </View>
                    </>
                    
                  ) }

                <View style={styles.daysLeftContainer}>
                  <Text style={styles.eventDaysLeftText}>
                    {this.daysRemaining(`${item.start_date} ${item.start_time}`)}
                  </Text>
                </View>
                <View style={styles.eventTimeContainer}>
                  <Text style={styles.eventTimeText}>{this.eventStatusText(item)}</Text>
                </View>

                {item.tickets.map(ticket => {
                  if (ticket.title === 'Free') {
                    return (
                      <View key={`${index}-${ticket.title}-${Math.random(5)}`} style={styles.eventWorthContainer}>
                        <Text style={styles.eventWorthText}>{t('free')}</Text>
                      </View>
                    );
                  }
                })}

                {item.repetitive_type === 1 ? (
                  <View style={styles.eventRoutineContainer}>
                    <Text style={styles.eventRoutineText}>{t('repetitive_daily')}</Text>
                  </View>
                ) : item.repetitive_type === 2 ? (
                  <View style={styles.eventRoutineContainer}>
                    <Text style={styles.eventRoutineText}>{t('repetitive_weekly')}</Text>
                  </View>
                ) : item.repetitive_type === 3 ? (
                  <View style={styles.eventRoutineContainer}>
                    <Text style={styles.eventRoutineText}>{t('repetitive_monthly')}</Text>
                  </View>
                ) : item.repetitive_type === null ? null : null}
              </TouchableOpacity>
            );
          })}
        </View>
      
    );
  }
}

export default withTranslation()(Events);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
  },
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    marginHorizontal: wp(2),
  },
  bannerImageStyle: {
    height: hp(18),
    aspectRatio: 683 / 284,
  },
  searchContainer: {
    height: hp(8),
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: wp(4),
    marginVertical: hp(2),
    marginHorizontal: wp(4),
  },
  inputContainer: {
    flexDirection: 'row',
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  eventIconStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
  },
  searchButtonContainer: {
    flexDirection: 'row',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
    backgroundColor: '#000000',
    elevation: 30,
    // marginVertical: hp(4),
    marginHorizontal: wp(4),
  },
  searchIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  searchEventText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  featuredEventContainer: {
    marginVertical: 0,
  },
  featuredEventText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginTop: hp(4),
  },
  gridView: {
    // marginTop: 10,
    // flex: 1,
  },
  featuredEventText1: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginVertical: hp(1),
  },
  featuredEventBox: {
    width: 'auto',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: wp(4),
    overflow: 'hidden',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
  },
  featuredImageStyle: {
    height: hp(30),
    width: wp(100),
  },
  eventDateAndPlaceContainer: {
    flexDirection: 'row',
    width: 'auto',
    justifyContent: 'space-between',
    marginVertical: hp(1),
    paddingHorizontal: wp(2),
    backgroundColor: '#fff'
  },
  featuredEventDateText: {
    fontSize: wp(3),
    color: '#000000',
  },
  eventTitleTextStyle: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#000',
    marginHorizontal: wp(2),
  },
  eventTitleTextStyle1: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(2),
  },
  eventTitleTextStyle2: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(2),
  },
  eventDescriptionTextStyle: {
    fontSize: wp(3.2),
    color: '#838383',
    marginHorizontal: wp(2),
  },
  postedByTextStyle: {
    fontSize: wp(3.5),
    color: '#000000',
    marginVertical: hp(1),
    marginHorizontal: wp(2),
  },
  eventBidContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(2),
    justifyContent: 'space-between',
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
    color: '#ff0084',
    fontWeight: '700',
    marginRight: wp(1),
    paddingBottom: hp(1),
  },
  eventCostContainer: {
    flex:1,
    flexDirection:'row',
    backgroundColor: '#fff',
  },
  constTextStyle: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: wp(.5),
  },
  constTextStrikeThroughStyle: {
    fontSize: wp(2),
    color: '#838383',
    textDecorationLine: 'line-through',
  },
  eventBidAmountContainer: {
    height: hp(4),
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: wp(1),
  },
  bidTextStyle: {
    fontSize: wp(2.3),
    color: '#838383',
  },
  eventTypeContainer: {
    height: hp(6),
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#000000',
    marginTop: hp(2),
    borderBottomRightRadius: wp(4),
    borderBottomLeftRadius: wp(4),
  },
  eventTypeText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  daysLeftContainer: {
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: hp(2),
    height: hp(2),

    backgroundColor: '#000000',
    borderTopLeftRadius: wp(3),
  },
  onlineLeftContainer: {
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: hp(2),
    height: hp(2),

    backgroundColor: '#1de9b6cc',
    borderTopRightRadius: wp(3),
  },
  eventDaysLeftText: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(1),
  },
  eventTimeContainer: {
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: hp(4),
    height: hp(2),
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderBottomLeftRadius: wp(3),
  },
  eventOnlineContainer: {
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: hp(4),
    height: hp(2),
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderBottomRightRadius: wp(3),
  },

  eventTimeText: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(1),
  },
  eventWorthContainer: {
    position: 'absolute',
    right: wp(81.5),
    top: hp(26.5),
    height: hp(3.5),
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderTopRightRadius: wp(3),
  },
  eventWorthText: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(1),
  },
  eventRoutineContainer: {
    position: 'absolute',
    right: 0,
    // left: wp(67),
    top: hp(30),
    height: hp(3.5),
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderBottomLeftRadius: wp(3),
  },
  eventRoutineText: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(1),
  },
  button: {
    height: hp(6),
    width: wp(40),
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#ff0084',
    borderRadius: wp(4),
    marginBottom: hp(2),
  },
  buttonText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  eventCategoryContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000000',
    // paddingLeft:20,
    // paddingRight:20,
  },
  eventCategoryContainer1: {
    // height: hp(60),
    // width: '50%',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    backgroundColor: '#000000',
    // marginHorizontal: wp(4),
    marginVertical: hp(2),
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
