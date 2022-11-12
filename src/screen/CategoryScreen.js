/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

import { withTranslation } from 'react-i18next';

class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={t('category')}
          navAction="back"
          nav={this.props.navigation}
        />

        <View style={styles.homeContainer}>
          <Text>{t('coming_soon')}</Text>
        </View>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(CategoryScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
