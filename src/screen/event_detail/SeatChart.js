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



export default class SeatChart extends Component {
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


    // function onImageLoaded(data) {
    //   console.log("image width:"+data.nativeEvents.size.width);
    //   console.log("image height:"+data.nativeEvents.size.height);
    // }


    return (
      <>
        {seatingchart_image && (
          <View
            style={styles.eventCategoryContainer}>
            <Text style={styles.seatTitle}>Seating Chart </Text>
            <ScrollView horizontal contentContainerStyle={{ alignItems: 'center' }}>

              {!this.state.loader && (
                <View
                  style={{
                    height: this.state.height / 2,
                    width: this.state.width / 2,
                    // aspectRatio: (1679/297)
                  }}>

                  <Image
                    resizeMode='contain'
                    //  onLoaded={onImageLoaded}
                    style={{
                      height: '100%',
                      width: undefined,
                      aspectRatio: ((this.state.width / 2) / (this.state.height / 2))
                    }}
                    source={{ uri: STORAGE_URL + seatingchart_image }} />
                </View>
              )}

            </ScrollView>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({

  eventCategoryContainer: {
    // alignItems: 'center',
    flex: 1,
    width: wp(100),

  },

  seatTitle: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginVertical: hp(2),
  },

});
