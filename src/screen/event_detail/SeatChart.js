/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { STORAGE_URL } from '../../api/ApiInfo';
import { View } from 'react-native';
import { Image } from 'react-native';

import LayoutSize from '../../Helper/LayoutSize';

import { withTranslation } from 'react-i18next';
import splash_image from '../../assets/image/spalsh_image.png';

class SeatChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 1,
      width: 1,
      loader: true
    }
  }

  componentDidMount() {
    this.getAspectRatio()
  }
  getAspectRatio() {
    const uri = STORAGE_URL + this.props.data.event.seatingchart_image;
    Image.getSize(uri, (width, height) => {
      this.setState({ width, height, loader: false });
    });
  }
  render() {

    const { seatingchart_image } = this.props.data.event;
    const { t } = this.props;


    // function onImageLoaded(data) {
    //   console.log("image width:"+data.nativeEvents.size.width);
    //   console.log("image height:"+data.nativeEvents.size.height);
    // }


    return (
      <>
        {seatingchart_image && (
          <ImageBackground
              source={splash_image}
              style={styles.eventCategoryContainer}>
            <Text style={styles.seatTitle}>{t('seating_chart')}</Text>
            <ScrollView horizontal contentContainerStyle={{ alignItems: 'center' }}>
              {!this.state.loader && (
                <View>
                  <Image
                    resizeMode='center'
                    //  onLoaded={onImageLoaded}
                    style={{
                      height:100,
                      width:LayoutSize.window.width/1.1,
                      borderRadius: 6
                    }}
                    source={{ uri: STORAGE_URL + seatingchart_image }} />
                </View>
              )}

            </ScrollView>
          </ImageBackground>
        )}
      </>
    );
  }
}

export default withTranslation()(SeatChart);

const styles = StyleSheet.create({

  eventCategoryContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000000',
  },

  seatTitle: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginVertical: hp(2),
  },

});
