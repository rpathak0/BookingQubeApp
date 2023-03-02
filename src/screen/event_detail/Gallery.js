/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImageView from "react-native-image-viewing";
import splash_image from '../../assets/image/spalsh_image.png';
import { withTranslation } from 'react-i18next'

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      index: 0,
    };
  }

  render() {

    const { imageGallery } = this.props.data;
    const { t } = this.props;
    let images = [];
    imageGallery.map((item) => {
      images.push({ uri: item.img });
    });

    return (
      <View>
        {(imageGallery.length > 0) ? (
          <ImageBackground
            source={splash_image}
            style={styles.eventCategoryContainer}>
            <Text style={styles.DjsText}>{t('event_gallery')}</Text>
              {imageGallery.map((item, index) => {
                if (index % 2 === 0) {
                  return (
                    <View style={{ flexDirection: 'row' }} key={index}>
                      <TouchableOpacity style={styles.categoryContainer} onPress={() => {
                        this.setState({ visible: true, index: index });
                      }}>
                        <ImageBackground
                          source={{ uri: item.img }}
                          resizeMode="cover"
                          style={styles.categoryImageStyle}>
                        </ImageBackground>
                      </TouchableOpacity>
                      {imageGallery[index + 1] && (
                        <TouchableOpacity style={styles.categoryContainer} 
                          onPress={() => this.setState({ visible: true, index: index + 1 })}>
                          <ImageBackground
                            source={{ uri: imageGallery[index + 1]?.img }}
                            resizeMode="cover"
                            style={styles.categoryImageStyle}>
                          </ImageBackground>
                      </TouchableOpacity>
                      )}
                    </View>
                  )
                }
              })
              }
            <ImageView
              images={images}
              imageIndex={this.state.index}
              visible={this.state.visible}
              onRequestClose={() => this.setState({ visible: false })}
            />
          </ImageBackground>
        ) : null}
      </View>
    );
  }
}

export default withTranslation()(Gallery);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
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
    height: hp(6),
    width: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
    backgroundColor: '#ff0084',
    marginVertical: hp(2),
    marginLeft: wp(2),
  },
  ticketIconStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
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
    marginTop: hp(5),
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
    borderWidth: 2,
    borderColor: '#fff',
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
