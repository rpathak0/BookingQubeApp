/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

import RenderHtml from 'react-native-render-html';
const width = Dimensions.get('window').width;

// API Info
import {BASE_URL} from '../api/ApiInfo';

import {withTranslation} from 'react-i18next';

class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageContent: '',
    };
  }

  componentDidMount() {
    this.getPageContent();
  }

  getPageContent = async () => {
    // axios
    const axios = require('axios');
    try {
      // calling api
      let slug = 'about';
      await axios.get(BASE_URL + 'page-content/' + slug).then(response => {
        // console.log(response?.data);
        let newResponse = response?.data;

        if (newResponse) {
          const {status} = newResponse;

          if (status === true) {
            this.setState({pageContent: newResponse.data.body});
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {t} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={t('about')}
          navAction="home"
          nav={this.props.navigation}
        />

        <ScrollView>
          <View style={styles.homeContainer}>
            <RenderHtml
              tagsStyles={{p: {fontSize: wp(3.5)}}}
              contentWidth={width}
              source={{html: this.state.pageContent}}
            />
          </View>
        </ScrollView>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(AboutScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
    paddingLeft: wp(4),
    paddingRight: wp(4),
  },
});
