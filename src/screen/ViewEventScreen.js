/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RenderHtml from 'react-native-render-html';

import { withTranslation } from 'react-i18next';

// Component
import CustomLoader from '../component/CustomLoader';
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

// Icon
import ic_ticket from '../assets/icon/ic_ticket.png';
import { BASE_URL } from '../api/ApiInfo';

// User Preference
import { async_keys, getData } from '../api/UserPreference';
import { showToast } from '../component/CustomToast';
import BasicInfoScreen from './event_detail/BasicInfoScreen';
import LocationTimimg from './event_detail/LocationTimimg';
import Tickets from './event_detail/Tickets';
import TagGroups from './event_detail/TagGroups';
import Gallery from './event_detail/Gallery';
import ReviewRatings from './event_detail/ReviewRatings';
import SeatChart from './event_detail/SeatChart';
import { t } from 'i18next';

const width = Dimensions.get('window').width;

class ViewEventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      eventSchedulesDatesForMonth: [],
      selectedSchdeuleMonthId: 0,
      isLoading: true,
      scrollYPos: 0,
    };
    
    this.scroller = React.createRef();

    // fetching navigation props
    this.slugTitle = this.props.navigation.getParam('slugTitle', null);
  }

  componentDidMount() {
    this.fetchEventDetail();
  }

  fetchEventDetail = async () => {

    const axios = require('axios');

    try {
      // calling api

      await axios.get(BASE_URL + 'events/show/' + this.slugTitle.slug)
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const { success } = newResponse.data;

            if (success === true) {
              this.setState({
                data: newResponse.data.data,
                eventSchedulesDatesForMonth: newResponse.data.data.repititive_schedule.length > 0 ? newResponse.data.data.repititive_schedule[0].schedule_dates.formatted_schedule_dates : [],
                selectedSchdeuleMonthId: newResponse.data.data.repititive_schedule.length > 0 ? newResponse.data.data.repititive_schedule[0].id : 0, // show repetitive schedule selectedf
                showSheatChart: newResponse.data.data.tickets[0].show_sheat_chart,
                isLoading: false,
              });
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleGetTicket = async date => {
    console.log('this.state.data?.event?.faq', this.state.data?.event?.faq);
    const { t } = this.props;

    const organizer = await getData(async_keys.userInfo);
    if (organizer == 3) {
      showToast(t('organizer_not_book'));
    } else {

      const checkOutScreenData = {
        title: this.state.data.event.title,
        startDate: date.start_date,
        endDate: date.end_date,
        startTime: this.state.data.event.start_time,
        endTime: this.state.data.event.end_time,
        venue: this.state.data.event.venue,
        tickets: this.state.data.tickets,
        eventId: this.state.data.event.id,
        finalDate: date,
        maxQuantity: this.state.data.max_ticket_qty,
        currency: this.state.data.currency,
      }
      
      this.props.navigation.navigate('Checkout', {
        eventInfo: checkOutScreenData
      });
    }
  };

  scrollToGetTicket = () => {
    this.scroller.scrollTo({ x: 0, y: (2 * this.state.scrollYPos) });
  };
  render() {

    const { isLoading } = this.state;
    const { t } = this.props;

    if (isLoading) {
      return <CustomLoader />;
    }


    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={t('event')}
          navAction="back"
          nav={this.props.navigation}
        />
        <ScrollView ref={(scroller) => { this.scroller = scroller }}>

          <View style={styles.homeContainer}>
            {/* Basic Info */}
            <BasicInfoScreen data={this.state.data} />
            
            <TouchableOpacity
              style={styles.getTicketButtonContainer}
              onPress={this.scrollToGetTicket}>
              <Image
                source={ic_ticket}
                resizeMode="cover"
                style={styles.ticketIconStyle}
              />
              <Text style={styles.getTicketText}>{t('get_tickets')}</Text>
            </TouchableOpacity>
            
            <View style={{ marginHorizontal: wp(4) }}>
              <RenderHtml tagsStyles={{ p: { fontSize: wp(3.5) } }}
                contentWidth={width}
                source={{ html: this.state.data?.event?.description }}
              />
            </View>

            <LocationTimimg data={this.state.data} />
            {/* Ticket month wise */}

            {this.state.data.event?.seatingchart_image && (
              <SeatChart data={this.state.data} />
            )}

            <TouchableOpacity
              style={styles.bookTicketContainer}
              activeOpacity={1}
              onLayout={event => {
                const { layout } = event.nativeEvent;
                this.setState({ ...this.state, scrollYPos: (layout.height) });
              }}
            >
              <Tickets
                data={this.state.data}
                eventSchedulesDatesForMonth={this.state.eventSchedulesDatesForMonth}
                selectedSchdeuleMonthId={this.state.selectedSchdeuleMonthId}
                handleGetTicket={(date) => this.handleGetTicket(date)}
                scroller={this.scroller}

              />
            </TouchableOpacity>
            {/* Event Info */}
            { (this.state.data?.event?.faq != null && this.state.data?.event?.faq != '') ? (
              <View style={styles.eventInfoContainer}>
                <Text style={styles.eventInfoText}>{t('event_info')}</Text>
                <View style={{ marginHorizontal: wp(4) }}>

                  <RenderHtml tagsStyles={{ p: { fontSize: wp(2.5) } }}
                    contentWidth={width}
                    source={{ html: this.state.data?.event?.faq }}
                  />
                </View>
              </View>
            ) : null}
            
            {/* Tage Grops (HOST,DANCER,etc)  */}
            <TagGroups
              data={this.state.data}
            />
            {/* Event gallery  */}
            <Gallery data={this.state.data} />

            {/* Event Review and rating  */}
            <ReviewRatings data={this.state.data} />
          </View>
        </ScrollView>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(ViewEventScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
    backgroundColor: '#ff0084',
    marginVertical: hp(2),
    marginHorizontal: wp(4),
    paddingVertical: wp(3),
  },
  ticketIconStyle: {
    width: wp(6),
    aspectRatio: 1 / 1,
    marginRight: wp(1.5),
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
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
    marginTop: hp(2),
  },
  bookTicketText: {
    fontSize: wp(3.5),
    color: '#fff',
    marginTop: hp(1),
  },
  firstTicketContainer: {
    width: wp(90),
    backgroundColor: '#000000',
    marginHorizontal: wp(4),
    alignItems: 'center',
    borderRadius: wp(3),
  },
  secondTicketContainer: {
    width: wp(80),
    height: hp(8),
    borderRadius: wp(3),
    marginVertical: hp(2),
    backgroundColor: '#fff',
  },
  selectedsecondTicketContainer: {
    width: wp(80),
    height: hp(8),
    borderRadius: wp(3),
    marginVertical: hp(2),
    backgroundColor: '#f5f5',
  },
  dateText: {
    fontSize: wp(3.5),
    color: '#000000',
    textAlign: 'center',
    marginTop: hp(2),
  },
  eventDateCountText: {
    fontSize: wp(3.5),
    color: '#000000',
    textAlign: 'center',
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
    backgroundColor: '#000000',
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
});
