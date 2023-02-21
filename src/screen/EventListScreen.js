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
  I18nManager,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import {withTranslation} from 'react-i18next';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

// Icon
import ic_reset from '../assets/icon/ic_reset.png';

// Image

// APi Info
import {BASE_URL} from '../api/ApiInfo';

// User Preference
import {async_keys, getData} from '../api/UserPreference';
import Events from './home_detail/Events';
import axios from 'axios';

class EventListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      selectedCategory: '',
      category: [],
      dateFilter: '',
      selectedPrice: '',
      price: [],
      selectedCountry: '',
      country: [],
      selectedCity: '',
      cities: [],
      eventData: [],
      featureEventList: [],
      cityCheck: true,
    };

    // fetching navigation props
    this.searchData = this.props.route.params?.searchData;
    this.searchInfo = this.props.route.params?.searchInfo;
  }

  componentDidMount() {
    if (this.searchData?.slug) {
      this.handleSelectedCategory(this.searchData?.slug);
    } else {
      if (this.searchInfo !== null) {
        this.checkSearchData();
      } else if (this?.searchData !== null) {
        this.checkSearchData1();
      } else {
        this.fetchSearchData();
      }
    }
    this.getFilters();
  }

  componentWillUnmount() {
    this.focusListener = null;
  }

  getFilters = async () => {
    try {
      await axios
        .get(BASE_URL + 'eventFilters')

        // processing response
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const {success} = newResponse.data;

            if (success === true) {
              this.setState({
                category: newResponse.data.data.categories,
                price: newResponse.data.data.price_filter,
                country: newResponse.data.data.country_filter.countries,
              });

              if (this.props?.navigation?.state?.params?.city) {
                let country = newResponse.data.data.country_filter.countries;
                for (let value of country) {
                  if (
                    value.city == this.props?.navigation?.state?.params?.city
                  ) {
                    this.setState({
                      selectedCountry: value.country_name,
                      city: value.city,
                    });
                    this.getCities(value);
                  }
                }
                // this.handleSelectedCity(navigation?.state?.params?.city);
              }
            }
          }
        });
    } catch (error) {}
  };

  fetchSearchData = async () => {
    try {
      await axios
        .post(BASE_URL + 'events')

        // processing response
        .then(response => {
          let newResponse = response;

          // console.log(newResponse.data.categories);

          if (newResponse) {
            const {success} = newResponse.data;

            if (success === true) {
              // console.log(newResponse.data.events.data);
              this.setState({featureEventList: newResponse.data.events.data});
            }
          }
        });
    } catch (error) {}
  };

  checkSearchData = async () => {
    this.setState({searchText: this.searchInfo?.search || ''});

    // preparing params
    const params = {
      search: this.searchInfo?.search || '',
    };

    // console.log(params.start_date);

    // console.log(params.search);

    await axios
      .post(BASE_URL + 'events', params)

      // processing response
      .then(response => {
        let newResponse = response;

        if (newResponse) {
          const {success} = newResponse.data;

          if (success === true) {
            // console.log(newResponse.data.events.data);
            this.setState({featureEventList: newResponse.data.events.data});
          }
        }
      });
  };

  checkSearchData1 = async () => {
    this.setState({selectedCategory: this.searchData.slug});

    // preparing params
    const params = {
      category: this.searchData.slug,
    };

    // console.log(params.start_date);

    // console.log(params.search);

    await axios
      .post(BASE_URL + 'events', params)

      // processing response
      .then(response => {
        let newResponse = response;

        if (newResponse) {
          const {success} = newResponse.data;

          if (success === true) {
            // console.log(newResponse.data.events.data);
            this.setState({featureEventList: newResponse.data.events.data});
          }
        }
      });
  };

  filterData = async ({
    selectedCategory = this.state.selectedCategory,
    dateFilter = this.state.dateFilter,
    selectedPrice = this.state.selectedPrice,
    searchText = this.state.searchText,
  }) => {
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);
    const {selectedCountry} = this.state;

    try {
      let axiosConfig = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };

      // preparing params
      const params = {
        category: selectedCategory,
        search: searchText,
        start_date: dateFilter,
        end_date: dateFilter,
        price: selectedPrice,
        country: selectedCountry,
        city: '',
      };

      // console.log(params);

      await axios
        .post(BASE_URL + 'events', params, axiosConfig)

        // processing response
        .then(response => {
          let newResponse = response;
          if (newResponse) {
            const {success} = newResponse.data;
            if (success === true) {
              // console.log(newResponse.data.events.data);
              this.setState({featureEventList: newResponse.data.events.data});
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSearchChange = searchText => {
    this.setState({searchText: searchText});
    this.filterData({searchText: searchText});
  };

  handleSelectedCategory = async value => {
    if (value) {
      this.setState({
        selectedCategory: value,
      });
      this.filterData({selectedCategory: value});
    }
  };

  handleSelectedPrice = async value => {
    if (value) {
      await this.setState({
        selectedPrice: value,
        isEnabled: true,
      });
      this.filterData({selectedPrice: value});
    }
  };

  handleSelectedCountry = async value => {
    const {country} = this.state;

    let countryCode = country.find(i => {
      return i.country_name === value;
    });
    await this.setState({
      selectedCountry: value,
      cityCheck: false,
    });

    this.getCities(countryCode);
    // this.filterData();
  };

  getCities = async countryCode => {
    const params = {country_id: countryCode?.id};

    try {
      await axios
        .post(BASE_URL + 'getCities', params)

        // processing response
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const {success} = newResponse.data;

            if (success === true) {
              this.setState({
                cities: newResponse.data.data,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDateChange = dateFilter => {
    this.setState({dateFilter});
  };

  handleShowDatePicker = () => {
    this.setState({setDatePickerVisibility: true, isDatePickerVisible: true});
  };

  handleHideDatePicker = date => {
    this.setState({isDatePickerVisible: false});
    if (date) {
      this.filterData({dateFilter: date});
    } else {
      this.filterData();
    }
  };

  handleConfirm = date => {
    date = moment(date).format('YYYY-MM-DD');
    this.setState({
      dateFilter: date,
    });
    this.handleHideDatePicker(date);
  };

  handleWebView = url => {
    this.props.navigation.navigate('webViewDirect', {
      webUrl: url,
    });
  };

  handleEvent = item => {
    const slug = item.slug;
    // open WebViewDirect
    this.handleWebView(slug);

    // this.props.navigation.navigate('ViewEvent', {slugTitle: {slug}});
  };

  handleReset = async () => {
    this.setState({
      ...this.state,
      searchText: '',
      selectedCategory: '',
      dateFilter: '',
      selectedPrice: '',
      selectedCountry: '',
      selectedCity: '',
      featureEventList: [],
    });
    this.filterData('', '', '', '');
  };

  handleChangeToCategory = () => {
    this.searchData = null;
    this.forceUpdate();
  };

  handleSelectedCity = async value => {
    // preparing params
    const params = {
      city: value,
    };

    await axios
      .post(BASE_URL + 'events', params)
      // processing response
      .then(response => {
        let newResponse = response;

        if (newResponse) {
          const {success} = newResponse.data;

          if (success === true) {
            this.setState({featureEventList: newResponse.data.events.data});
          }
        }
      });
  };

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {t} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={t('events')}
          navAction="back"
          nav={this.props.navigation}
        />
        <ScrollView>
          <View style={styles.homeContainer}>
            <TouchableOpacity
              style={styles.resetFilterContainer}
              onPress={this.handleReset}>
              <Image
                source={ic_reset}
                resizeMode="cover"
                style={styles.resetIconStyle}
              />
              <Text style={styles.resetText}>{t('reset_filters')}</Text>
            </TouchableOpacity>

            <Text style={styles.textInputText}>{t('search_events')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('search_events_ie')}
                placeholderTextColor="#c4c3cb"
                style={styles.loginFormTextInput}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.searchText}
                onChangeText={v => {
                  this.handleSearchChange(v);
                }}
              />
            </View>

            <Text style={styles.textInputText}>{t('category')}</Text>
            <View style={styles.inputContainer}>
              {this.searchData === null ? (
                <RNPickerSelect
                  onValueChange={v => {
                    this.handleSelectedCategory(v);
                  }}
                  items={this.state.category.map(item => ({
                    label: item.name,
                    value: item.name,
                  }))}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  value={this.state.selectedCategory}
                  placeholder={{label: t('select_item'), value: null}}
                />
              ) : (
                <Text onPress={this.handleChangeToCategory}>
                  {this.state.selectedCategory}
                </Text>
              )}
            </View>

            <Text style={styles.textInputText}>{t('date')}</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={this.handleShowDatePicker}>
                {this.state.dateFilter === '' ? (
                  <Text
                    style={[styles.descriptionText, styles.dateFilterPadding]}>
                    {t('date_filter')}
                  </Text>
                ) : (
                  <Text style={styles.descriptionText}>
                    {this.state.dateFilter}
                  </Text>
                )}

                <DateTimePickerModal
                  isVisible={this.state.isDatePickerVisible}
                  mode="date"
                  onConfirm={d => this.handleConfirm(d)}
                  onCancel={this.handleHideDatePicker}
                  data={this.state.dateFilter}
                  onDateChange={this.handleDateChange}
                  place
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.textInputText}>{t('price')}</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                onValueChange={v => {
                  this.handleSelectedPrice(v);
                }}
                items={this.state.price.map(item => ({
                  label: item.name,
                  value: item.value,
                }))}
                style={pickerStyle}
                useNativeAndroidPickerStyle={false}
                placeholder={{label: t('select_item'), value: null}}
              />
            </View>

            <Text style={styles.textInputText}>{t('country')}</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                items={this.state.country.map(item => ({
                  label: item.country_name,
                  value: item.country_name,
                }))}
                onValueChange={this.handleSelectedCountry}
                style={pickerStyle}
                value={this.state.selectedCountry}
                useNativeAndroidPickerStyle={false}
                placeholder={{label: t('select_item'), value: null}}
              />
            </View>

            <Text style={styles.textInputText}>{t('city')}</Text>
            <View style={[styles.inputContainer, {marginBottom: hp(4)}]}>
              <RNPickerSelect
                onValueChange={this.handleSelectedCity}
                items={this.state.cities.map(item => ({
                  label: item.city,
                  value: item.city,
                }))}
                style={pickerStyle}
                value={this.state.city}
                useNativeAndroidPickerStyle={false}
                disabled={this.state.cityCheck}
                placeholder={{label: t('select_item'), value: null}}
              />
            </View>

            <Events
              eventList={this.state.featureEventList}
              handleEvent={item => {
                this.handleEvent(item);
              }}
              name={t('browse_qube')}
              backGroundImage={false}
            />
          </View>
        </ScrollView>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(EventListScreen);

const pickerStyle = {
  inputIOS: {
    color: '#c4c3cb',
    fontSize: wp(3.5),
    marginVertical: wp(4),
  },
  placeholder: {
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
    backgroundColor: '#000000',
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
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  textInputText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#000',
    marginTop: hp(2),
    marginBottom: hp(0.5),
    marginHorizontal: wp(2),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  dropdownStyle: {
    fontSize: wp(3.5),
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  descriptionText: {
    fontSize: wp(3.5),
    color: '#c9c9c9',
    marginVertical: hp(2),
  },
  dateFilterPadding: {
    paddingLeft: 10,
  },
  resetFilterContainer: {
    flexDirection: 'row',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: wp(3),
    marginHorizontal: wp(2),
    marginTop: hp(3),
  },
  resetIconStyle: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  resetText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  memberListContent: {
    padding: wp(2),
  },
  separator: {
    height: wp(2),
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
    // width: wp(90),
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
  eventDescriptionTextStyle: {
    fontSize: wp(3.2),
    color: '#ccc',
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
  eventTypeContainer: {
    // height: hp(6),
    // width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#838383',
    backgroundColor: '#838383',
    marginTop: hp(2),
    borderBottomRightRadius: wp(4),
    borderBottomLeftRadius: wp(4),
    paddingTop: 15,
    paddingBottom: 15,
  },
  eventTypeText: {
    fontSize: wp(3.5),
    color: '#000',
  },
  daysLeftContainer: {
    position: 'absolute',
    // left: wp(73),
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
    position: 'absolute',
    // left: wp(73),
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
    left: wp(67),
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
  pickerStyle: {
    fontSize: wp(2.5),
  },
});
