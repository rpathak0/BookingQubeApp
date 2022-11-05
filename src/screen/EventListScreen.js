/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  // FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

// Icon
import ic_header_home_icon from '../assets/icon/ic_header_home_icon.png';
import ic_reset from '../assets/icon/ic_reset.png';

// Image
import header_image from '../assets/image/header_image.png';
// import featured_event_image from '../assets/image/featured_event_image.jpg';

// APi Info
import { BASE_URL } from '../api/ApiInfo';

// User Preference
import { async_keys, getData } from '../api/UserPreference';
import Events from './home_detail/Events';

export default class EventListScreen extends Component {
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
    this.searchData = this.props.navigation.getParam('searchData', null);
    this.searchInfo = this.props.navigation.getParam('searchInfo', null);
    // console.log(this.searchData.slug + ' ' + 'here search data');
  }

  componentDidMount() {

    const { navigation } = this.props;
    this.focusListener = navigation?.addListener("didFocus", () => {
      if (navigation?.state?.params?.searchData?.slug) {
        this.handleSelectedCategory(navigation?.state?.params?.searchData?.slug);
      }
      else {
        if (this.searchInfo !== null) {
          this.checkSearchData();
        } else if (this.searchData !== null) {
          this.checkSearchData1();
        } else {
          this.fetchSearchData();
        }
      }
      this.getFilters();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  getFilters = async () => {
    const axios = require('axios');

    try {
      await axios
        .get(BASE_URL + 'eventFilters')

        // processing response
        .then(response => {
          let newResponse = response;


          if (newResponse) {
            const { success } = newResponse.data;

            if (success === true) {
              this.setState({
                category: newResponse.data.data.categories,
                price: newResponse.data.data.price_filter,
                country: newResponse.data.data.country_filter.countries,
              });


              if (this.props?.navigation?.state?.params?.city) {
                let country = newResponse.data.data.country_filter.countries;
                for (let value of country) {
                  if (value.city == this.props?.navigation?.state?.params?.city) {
                    this.setState({
                      selectedCountry: value.country_name,
                      city: value.city,
                    })
                    this.getCities(value);
                  }
                }
                // this.handleSelectedCity(navigation?.state?.params?.city);
              }

            }
          }
        });
    } catch (error) {
    }
  };

  fetchSearchData = async () => {
    const axios = require('axios');

    try {
      await axios
        .post(BASE_URL + 'events')

        // processing response
        .then(response => {
          let newResponse = response;

          // console.log(newResponse.data.categories);

          if (newResponse) {
            const { success } = newResponse.data;

            if (success === true) {
              // console.log(newResponse.data.events.data);
              this.setState({ featureEventList: newResponse.data.events.data });
            }
          }
        });
    } catch (error) {
    }
  };

  checkSearchData = async () => {
    this.setState({ searchText: this.searchInfo.search });

    const axios = require('axios');

    // preparing params
    const params = {
      search: this.searchInfo.search,
    };

    // console.log(params.start_date);

    // console.log(params.search);

    await axios
      .post(BASE_URL + 'events', params)

      // processing response
      .then(response => {
        let newResponse = response;


        if (newResponse) {
          const { success } = newResponse.data;

          if (success === true) {
            // console.log(newResponse.data.events.data);
            this.setState({ featureEventList: newResponse.data.events.data });
          }
        }
      });
  };

  checkSearchData1 = async () => {
    this.setState({ selectedCategory: this.searchData.slug });

    const axios = require('axios');

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
          const { success } = newResponse.data;

          if (success === true) {
            // console.log(newResponse.data.events.data);
            this.setState({ featureEventList: newResponse.data.events.data });
          }
        }
      });
  };

  filterData = async ({ selectedCategory = this.state.selectedCategory, dateFilter = this.state.dateFilter, selectedPrice = this.state.selectedPrice, searchText = this.state.searchText }) => {
    const axios = require('axios');
    // getting token from AsyncStorage
    const token = await getData(async_keys.userId);
    const {
      selectedCountry,
    } = this.state;

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
            const { success } = newResponse.data;
            if (success === true) {
              // console.log(newResponse.data.events.data);
              this.setState({ featureEventList: newResponse.data.events.data });
            }
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSearchChange = searchText => {
    this.setState({ searchText: searchText });
    this.filterData({ searchText: searchText });
  };

  handleSelectedCategory = async value => {
    if (value) {
      this.setState({
        selectedCategory: value,
      });
      this.filterData({ selectedCategory: value });
    }
  };

  handleSelectedPrice = async value => {
    if (value) {
      await this.setState({
        selectedPrice: value,
        isEnabled: true,
      });
      this.filterData({ selectedPrice: value });
    }

  };

  handleSelectedCountry = async value => {
    const { country } = this.state;

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
    const axios = require('axios');

    const params = { country_id: countryCode.id };

    try {
      await axios
        .post(BASE_URL + 'getCities', params)

        // processing response
        .then(response => {
          let newResponse = response;

          if (newResponse) {
            const { success } = newResponse.data;

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
    this.setState({ dateFilter });
  };

  handleShowDatePicker = () => {
    this.setState({ setDatePickerVisibility: true, isDatePickerVisible: true });
  };

  handleHideDatePicker = (date) => {
    this.setState({ isDatePickerVisible: false });
    if (date) {
      this.filterData({ dateFilter: date });
    } else {
      this.filterData();

    }

  };

  handleConfirm = date => {
    date = moment(date).format('YYYY-MM-DD')
    this.setState({
      dateFilter: date,
    });
    this.handleHideDatePicker(date);
  };

  handleViewEvent = async () => {
    this.props.navigation.navigate('ViewEvent');
  };

  handleEvent = item => {
    const slug = item.slug;
    // console.log(slug);
    this.props.navigation.navigate('ViewEvent', { slugTitle: { slug } });
  };

  handleReset = async() => {
    this.setState ({
      ...this.state,
      searchText: '',
      selectedCategory: '',
      dateFilter: '',
      selectedPrice: '',
      selectedCountry: '',
      selectedCity: '',
      featureEventList: [],
    })
    this.filterData('', '', '', '' );
  };

  handleChangeToCategory = () => {
    this.searchData = null;
    this.forceUpdate();
  };

  handleSelectedCity = async value => {
    const axios = require('axios');

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
          const { success } = newResponse.data;

          if (success === true) {
            console.warn(value, '//////');
            this.setState({ featureEventList: newResponse.data.events.data });
          }
        }
      });
  };

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="Event"
          navAction="back"
          nav={this.props.navigation}
        />
        <ScrollView>
          <View style={styles.homeContainer}>
            <ImageBackground
              source={header_image}
              resizeMode="cover"
              style={styles.headerImageStyle}>
              <Text style={styles.titleText}>EVENTS</Text>
              <View style={styles.eventHeadlineContainer}>
                <Image
                  source={ic_header_home_icon}
                  resizeMode="cover"
                  style={styles.IconStyle}
                />

                <Text style={styles.slashText}>/</Text>
                <Text style={styles.eventText}>Events</Text>
              </View>
            </ImageBackground>

            <Text style={styles.textInputText}>Search Event</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Type Event Name/Venue/City/State"
                placeholderTextColor="#c4c3cb"
                style={styles.loginFormTextInput}
                keyboardType="default"
                underlineColorAndroid="transparent"
                value={this.state.searchText}
                onChangeText={(v) => { this.handleSearchChange(v) }}
              />
            </View>

            <Text style={styles.textInputText}>Category</Text>

            <View style={styles.inputContainer}>
              {this.searchData === null ? (
                <RNPickerSelect
                  onValueChange={(v) => { this.handleSelectedCategory(v) }}
                  items={this.state.category.map(item => ({
                    label: item.name,
                    value: item.name,
                  }))}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  value={this.state.selectedCategory}
                />
              ) : (
                <Text onPress={this.handleChangeToCategory}>
                  {this.state.selectedCategory}
                </Text>
              )}
            </View>

            <Text style={styles.textInputText}>Date</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={this.handleShowDatePicker}>
                {this.state.dateFilter === '' ? (
                  <Text style={[styles.descriptionText, styles.dateFilterPadding]}>Date Filter</Text>
                ) : (
                  <Text style={styles.descriptionText}>
                    {this.state.dateFilter}
                  </Text>
                )}

                <DateTimePickerModal
                  isVisible={this.state.isDatePickerVisible}
                  mode="date"
                  onConfirm={(d) => this.handleConfirm(d)}
                  onCancel={this.handleHideDatePicker}
                  data={this.state.dateFilter}
                  onDateChange={this.handleDateChange}
                  place
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.textInputText}>Price</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                onValueChange={(v) => { this.handleSelectedPrice(v) }}
                items={this.state.price.map(item => ({
                  label: item.name,
                  value: item.value,
                }))}
                style={pickerStyle}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <Text style={styles.textInputText}>Country</Text>
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
              />
            </View>

            <Text style={styles.textInputText}>City</Text>
            <View style={styles.inputContainer}>
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
              />
            </View>

            <TouchableOpacity
              style={styles.resetFilterContainer}
              onPress={this.handleReset}>
              <Image
                source={ic_reset}
                resizeMode="cover"
                style={styles.resetIconStyle}
              />
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>

            <Events
              eventList={this.state.featureEventList}
              handleEvent={(item) => { this.handleEvent(item) }}
              name="All Events"
              backGroundImage={false}
            />
          </View>
        </ScrollView>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const pickerStyle = {
  // inputIOS: {
  //   color: 'white',
  //   paddingHorizontal: 10,
  //   backgroundColor: 'red',
  //   borderRadius: 5,
  // },
  placeholder: {
    color: '#000',
    fontSize: wp(3.5),
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputAndroid: {
    color: '#000',
    fontSize: wp(3.5),
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
  inputContainer: {
    flexDirection: 'row',
    height: hp(7),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: wp(2),
    // marginVertical: hp(1),
    marginHorizontal: wp(2),
    paddingLeft: 5,
    paddingRight: 5,
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    // marginLeft: wp(4),
    // backgroundColor: '#fff',
    borderRadius: wp(1),
    color: '#000',
  },
  textInputText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#5e5f5f',
    marginVertical: hp(1),
    marginTop: hp(2),
    marginHorizontal: wp(2),
  },
  dropdownStyle: {
    fontSize: wp(3.5),
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  descriptionText: {
    fontSize: wp(3.5),
    // alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(2),
    
  },
  dateFilterPadding:{
    paddingLeft:10,
  },
  resetFilterContainer: {
    flexDirection: 'row',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b89ef',
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
    shadowOffset: { width: 0, height: 2 },
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
    color: '#1b89ef',
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
    color: '#1b89ef',
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
    backgroundColor: '#1b89ef',
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
    color: '#1b89ef',
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
    backgroundColor: '#1b89ef',
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
    backgroundColor: '#1b89ef',
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
  }

});
