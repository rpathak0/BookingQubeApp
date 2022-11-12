/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { withTranslation } from 'react-i18next';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

class AttendeeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organization: '',
      dateOfEvent: '',
      startTime: '',
      eventVenue: '',
    };
  }

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="#1 Attendi"
          navAction="back"
          nav={this.props.navigation}
        />
        <View style={styles.homeContainer}>
          <Text style={styles.textInputText}>Organization/Playgroup</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Organization/Playgroup*"
              placeholderTextColor="#838383"
              style={styles.loginFormTextInput}
              keyboardType="default"
              underlineColorAndroid="transparent"
              value={this.state.organization}
              onChangeText={this.handleOrganizationChange}
            />
          </View>

          <Text style={styles.textInputText}>Date Of Event</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Date Of Event*"
              placeholderTextColor="#838383"
              style={styles.loginFormTextInput}
              keyboardType="default"
              underlineColorAndroid="transparent"
              value={this.state.dateOfEvent}
              onChangeText={this.handleDateOfEventChange}
            />
          </View>

          <Text style={styles.textInputText}>Start Time</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Start Time*"
              placeholderTextColor="#838383"
              style={styles.loginFormTextInput}
              keyboardType="default"
              underlineColorAndroid="transparent"
              value={this.state.startTime}
              onChangeText={this.handleOrganizationChange}
            />
          </View>

          <Text style={styles.textInputText}>Event Venue</Text>

          <View style={styles.textAreaContainer}>
            <TextInput
              placeholder="Event Venue*"
              placeholderTextColor="#838383"
              style={styles.textArea}
              keyboardType="default"
              underlineColorAndroid="transparent"
              value={this.state.eventVenue}
              onChangeText={this.handleEventVenueChange}
            />
          </View>

          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.saveProfileText}>{t('continue')}</Text>
          </TouchableOpacity>
        </View>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(AttendeeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
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
    borderRadius: wp(1),
    color: '#000',
  },
  textAreaContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: wp(2),
    // marginVertical: hp(1),
    marginHorizontal: wp(4),
  },
  textArea: {
    height: hp(20),
    textAlignVertical: 'top',
    fontSize: wp(3.5),
    color: '#333',
  },
  buttonContainer: {
    height: hp(6),
    width: wp(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#1b89ef',
    marginLeft: 'auto',
  },
  saveProfileText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
});
