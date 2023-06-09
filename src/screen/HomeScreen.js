/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
  StatusBar,
  Platform,
  I18nManager,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Component
import CustomLoader from '../component/CustomLoader';
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

// Icon

import ic_event from '../assets/icon/ic_event.png';
import ic_search from '../assets/icon/ic_search.png';

// Image
import splash_image from '../assets/image/spalsh_image.png';

import {withTranslation} from 'react-i18next';

import {SliderBox} from 'react-native-image-slider-box';

// API Info
import {BASE_URL, STORAGE_URL} from '../api/ApiInfo';
import axios from 'axios';
import {black} from 'react-native-paper/lib/typescript/styles/colors';
import Events from './home_detail/Events';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      featureEventList: [],
      eventCategoryList: [],
      upcomingEventList: [],
      topSellingEvents: [],
      exploreCitiesList: [],
      categoryEvents: [],
      imageURL: null,
      checkFilter: null,
      searchResponse: [],
      isLoading: true,
      imageUrlPrefix: null,
      saleExpired: false,
      banners: [],
      banners_images: [require('../assets/image/banner.jpg')],
    };
  }

  componentDidMount() {
    this.fetchEventData();
    this.fetchBannersData();
    // this.pay();
  }

  pay = () => {
    const params = {
      amount: 100,
      currency: 'QAR',
      source: {
        type: 'qpay',
        description: 'QPay Demo Payment',
        language: 'en',
        quantity: '1',
        national_id: '070AYY010BU234M',
      },
    };
    let axiosConfig = {
      headers: {
        'Cko-Idempotency-Key': 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
    };
    // creating custom header

    // calling api
    axios
      .post('https://api.sandbox.checkout.com/payments', params, axiosConfig)
      .then(response => {
        console.log(response);
      })
      .catch(e => {
        console.log(e);
      });
  };

  fetchBannersData = async () => {
    try {
      // calling api
      await axios
        .get(BASE_URL + 'banners')

        // processing response
        .then(response => {
          let newResponse = response;
          if (newResponse) {
            const {success} = newResponse.data;

            if (success === true) {
              let bannersImages = newResponse.data.data.banners.map(banner => {
                return STORAGE_URL + banner.image;
              });

              this.setState({
                banners: newResponse.data.data.banners,
                banners_images: bannersImages,
                isLoading: false,
              });
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchEventData = async () => {
    try {
      // calling api
      await axios
        .get(BASE_URL + 'landingPage')

        // processing response
        .then(response => {
          let newResponse = response;
          this.setState({imageURL: newResponse.data.data.image_url_prefix});

          if (newResponse) {
            const {success} = newResponse.data;

            if (success === true) {
              this.setState({
                featureEventList: newResponse.data.data.featured_events,
                eventCategoryList: newResponse.data.data.categories,
                upcomingEventList: newResponse.data.data.upcomming_events,
                topSellingEvents: newResponse.data.data.top_selling_events,
                exploreCitiesList: newResponse.data.data.cities_events,
                categoryEvents: newResponse.data.data.category_events,
                imageUrlPrefix: newResponse.data.data.image_url_prefix,
                isLoading: false,
              });
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchFilterData = async () => {
    const {search} = this.state;

    this.props.navigation.navigate('EventList', {searchInfo: {search}});
  };

  handleSearchChanged = search => {
    this.setState({search});
  };

  handleWebView = url => {
    this.props.navigation.navigate('webViewDirect', {
      webUrl: url,
    });
  };

  handleEvent = item => {
    const {imageUrlPrefix} = this.state;

    const slug = item.slug;
    // console.log(slug);
    this.props.navigation.navigate('ViewEvent', {
      slugTitle: {slug, imageUrlPrefix},
    });

    // open WebViewDirect
    // this.handleWebView(slug);
  };

  handleBannerClick = item => {
    const {imageUrlPrefix} = this.state;
    const slug = item.app_event_slug;
    console.log('banner slg', item);
    if (slug != null && slug != '') {
      this.handleWebView(slug);
      // this.props.navigation.navigate('ViewEvent', {
      //   slugTitle: {slug, imageUrlPrefix},
      // });
    }
    return true;
  };

  handleAllEvent = () => {
    this.props.navigation.navigate('EventList');
  };

  handleAllEvent1 = ({name}) => {
    this.props.navigation.navigate('EventList', {searchData: {slug: name}});
  };

  handleCity = item => {
    this.props.navigation.navigate('EventList', {
      city: item.city,
      id: item.cities,
    });
  };

  render() {
    const {t} = this.props;
    const {isLoading} = this.state;

    const imageUrl = STORAGE_URL;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {isLoading && <CustomLoader />}
        <HeaderComponent title={t('home')} nav={this.props.navigation} />
        <ScrollView>
          <View style={styles.homeContainer}>
            <View>
              <SliderBox
                images={this.state.banners_images}
                autoplay
                circleLoop
                onCurrentImagePressed={index =>
                  this.handleBannerClick(this.state.banners[index])
                }
                autoplayInterval={9000}
              />
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_event}
                  resizeMode="cover"
                  style={styles.eventIconStyle}
                />
                <TextInput
                  style={styles.loginFormTextInput}
                  placeholder={t('search_events_ie')}
                  placeholderTextColor="#838383"
                  keyboardType="default"
                  underlineColorAndroid="transparent"
                  value={this.state.search}
                  onChangeText={this.handleSearchChanged}
                  // InputProps={{disableUnderline: true}}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.searchButtonContainer}
              onPress={this.fetchFilterData}>
              <Image
                source={ic_search}
                resizeMode="cover"
                style={styles.searchIconStyle}
              />
              <Text style={styles.searchEventText}>{t('search_events')}</Text>
            </TouchableOpacity>

            <Text style={{
              fontSize: wp('7'),
              fontWeight: '700',
              marginLeft: 20,
              marginBottom: 10,
            }}>
              {t('things_to_do_in_qatar')}
            </Text>

            {this.state.featureEventList.length > 0 ? (
              <View>
                <Events
                  eventList={this.state.featureEventList}
                  handleEvent={item => {
                    this.handleEvent(item);
                  }}
                  name={t('featured_events')}
                  backGroundImage={false}
                  navigation={this.props.navigation}
                />
              </View>
            ) : null}

            {this.state.upcomingEventList.length > 0 ? (
              <View>
                <Events
                  eventList={this.state.upcomingEventList}
                  handleEvent={item => {
                    this.handleEvent(item);
                  }}
                  name={t('upcomming_events')}
                  backGroundImage={false}
                  navigation={this.props.navigation}
                />
              </View>
            ) : null}

            {this.state.categoryEvents.length > 0
              ? this.state.categoryEvents.map((cevent, cindex) => (
                  <View key={cindex}>
                    <Events
                      key={cindex}
                      eventList={cevent.events}
                      handleEvent={item => {
                        this.handleEvent(item);
                      }}
                      name={cevent.name}
                      backGroundImage={false}
                      navigation={this.props.navigation}

                    />
                  </View>
                ))
              : null}

            {this.state.topSellingEvents.length > 0 ? (
              <View>
                <Events
                  eventList={this.state.topSellingEvents}
                  handleEvent={item => {
                    this.handleEvent(item);
                  }}
                  name={t('top_selling')}
                  backGroundImage={true}
                  navigation={this.props.navigation}
                />
              </View>
            ) : null}

          </View>
        </ScrollView>
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
  homeContainer: {
    flex: 1,
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
    marginBottom: hp(2),
    marginHorizontal: wp(4),
  },
  inputContainer: {
    flexDirection: 'row',
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: 1,
    // borderColor: '#ccc',
    marginHorizontal: wp(2),
  },
  eventIconStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: wp(1),
    color: '#000',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  searchButtonContainer: {
    flexDirection: 'row',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
    backgroundColor: '#000000',
    elevation: 30,
    marginBottom: hp(4),
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
    marginVertical: hp(2),
  },
  featuredEventText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginVertical: hp(2),
  },
  featuredEventText1: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginVertical: hp(1),
  },
  featuredEventBox: {
    // height: hp(62),
    width: 'auto',
    borderWidth: 1,
    borderColor: '#ccc',
    // alignItems: 'center',
    borderRadius: wp(4),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 10,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: {width: 1, height: 1},
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // // elevation: 5,
    marginHorizontal: wp(4),
    marginVertical: hp(2),
  },
  featuredImageStyle: {
    height: hp(30),
    width: wp(100),
    // aspectRatio: 1 / 1,
    borderRadius: wp(4),
  },
  eventDateAndPlaceContainer: {
    flexDirection: 'row',
    width: 'auto',
    // alignItems: 'center',
    justifyContent: 'space-around',
    // marginHorizontal: hp(2),
    marginVertical: hp(4),
  },
  featuredEventDateText: {
    fontSize: wp(2.5),
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCostContainer: {
    height: hp(4),
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    marginLeft: wp(1),
  },
  constTextStyle: {
    fontSize: wp(2.3),
    color: '#838383',
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
  eventTypeText: {
    fontSize: wp(3.5),
    color: '#000',
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
  eventTimeText: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#000000',
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
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#000000',
    borderRadius: wp(4),
    marginTop: 0,
    marginBottom: 0,
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
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: wp(2),
    marginHorizontal: wp(2),
    marginVertical: hp(2),
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
});
