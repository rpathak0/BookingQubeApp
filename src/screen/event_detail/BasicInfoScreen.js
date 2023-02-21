/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  FlatList,
} from 'react-native';
import {showToast} from '../../component/CustomToast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {withTranslation} from 'react-i18next';

import RNFetchBlob from 'rn-fetch-blob';
import Clipboard from '@react-native-clipboard/clipboard';
import {STORAGE_URL} from '../../api/ApiInfo';
// Component

import {SERVER} from '../../services/apiConfig';

// Icon
import ic_facebook from '../../assets/icon/ic_facebook.png';
import ic_twitter from '../../assets/icon/ic_twitter.png';
import ic_linkedin from '../../assets/icon/ic_linkedin.png';
import ic_whatsapp from '../../assets/icon/ic_whatsapp.png';
import ic_reddit from '../../assets/icon/ic_reddit.png';
import ic_chain from '../../assets/icon/ic_chain.png';
import onlineBar from '../../assets/image/bar.png';

class BasicInfoScreen extends Component {
  constructor(props) {
    super(props);
  }

  handleFacebook = async () => {
    try {
      const {poster, title, description} = this.props.data.event;
      const htmlTagRegex = /<[^>]*>?/gm;
      const dsc = description.replace(htmlTagRegex, '').replace(/&nbsp;/gm, '');

      const imageUrl = STORAGE_URL + '/' + poster;

      // console.log(imageUrl, title, description);

      // Downloading Image for sharing
      let imagePath = null;
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', imageUrl)
        // the image is now downloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then(async base64Data => {
          var base64Data = `data:image/png;base64,` + base64Data;
          let facebookParameters = [];

          facebookParameters.push('u=' + encodeURI(SERVER));
          if (title) {
            facebookParameters.push('quote=' + encodeURI(title));
            const url =
              'https://www.facebook.com/sharer/sharer.php?' +
              facebookParameters.join('&');

            Linking.openURL(url);
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTwitter = async () => {
    let twitterParameters = [];

    const {title} = this.props.data.event;
    twitterParameters.push('url=' + encodeURI(SERVER));

    twitterParameters.push('text=' + encodeURI(title));

    const url =
      'https://twitter.com/intent/tweet?' + twitterParameters.join('&');
    Linking.openURL(url)
      .then(data => {
        // alert('Twitter Opened');
      })
      .catch(() => {
        alert('Something went wrong');
      });
  };

  handleLinkedin = async () => {
    const {title, description} = this.props.data.event;
    try {
      const url =
        `https://www.linkedin.com/shareArticle?mini=true&summary=${description}&title=${title}&url=` +
        SERVER +
        `events/${title}`;
      Linking.openURL(url);
    } catch (error) {}
  };

  handleWhatsApp = async () => {
    try {
      const {title} = this.props.data.event;

      Linking.openURL(`whatsapp://send?text=` + SERVER + `events/${title}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  handleReddit = async () => {
    try {
      const {title} = this.props.data.event;
      let url =
        `https://www.reddit.com/submit?title=${title}&url=` +
        SERVER +
        `events/${title}`;
      Linking.openURL(url);
    } catch (error) {
      console.log(error.message);
    }
  };

  copyclipboard = async () => {
    const {t} = this.props;
    try {
      const {title} = this.props.data.event;
      let url = SERVER + `events/${title}`;
      Clipboard.setString(url);
      showToast(t('url_copied'));
    } catch (error) {
      console.log(error.message);
    }
  };

  handleChain = async () => {
    try {
      Linking.openURL(SERVER);
    } catch (error) {
      console.log(error.message);
    }
  };

  getRenderView = item => {
    if (item.title != null && item.title != '') {
      return (
        <View
          style={
            item.title === 'Online event'
              ? styles.eventOnlineContainer
              : styles.eventCategory
          }>
          <View
            style={
              item.title === 'Online event' ? styles.onlineInnerContainer : {}
            }>
            <Text style={styles.categoryText}>{item.title}</Text>
          </View>
        </View>
      );
    }
  };

  render() {
    const {t} = this.props;
    var listItems = [];
    const {
      title,
      poster,
      event_type_text,
      category_name,
      online_location,
      orgainser,
    } = this.props.data.event;
    var isFreeTickets = this.props.data.free_tickets?.length > 0 ? true : false;
    if (online_location)
      listItems.push({title: 'Online event', icon: onlineBar});
    listItems.push({title: category_name, icon: ''});
    if (isFreeTickets) {
      listItems.push({title: 'Free Tickets', icon: ''});
    }
    listItems.push({title: event_type_text, icon: ''});

    return (
      <>
        <Image
          source={{uri: STORAGE_URL + poster}}
          resizeMode="cover"
          style={styles.eventImageStyle}
        />

        <Text style={styles.eventTitleTextStyle}>{title}</Text>
        <Text style={styles.eventOrganiserTextStyle}>
          {t('organizer')} {orgainser}
        </Text>

        <View style={styles.eventTypeContainer}>
          <FlatList
            keyExtractor={item => item.thumb}
            horizontal={false}
            numColumns={3}
            data={listItems}
            renderItem={({item}) => this.getRenderView(item)}
          />
        </View>

        <View style={styles.shareEventContainer}>
          <Text style={styles.shareEventText}>{t('share_event')}</Text>

          <TouchableOpacity
            style={styles.iconOnPress}
            onPress={this.handleFacebook}>
            <Image
              source={ic_facebook}
              resizeMode="cover"
              style={styles.shareIconStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconOnPress}
            onPress={this.handleTwitter}>
            <Image
              source={ic_twitter}
              resizeMode="cover"
              style={styles.shareIconStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconOnPress}
            onPress={this.handleLinkedin}>
            <Image
              source={ic_linkedin}
              resizeMode="cover"
              style={styles.shareIconStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconOnPress}
            onPress={this.handleWhatsApp}>
            <Image
              source={ic_whatsapp}
              resizeMode="cover"
              style={styles.shareIconStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconOnPress}
            onPress={this.handleReddit}>
            <Image
              source={ic_reddit}
              resizeMode="cover"
              style={styles.shareIconStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconOnPress}
            onPress={this.copyclipboard}>
            <Image
              source={ic_chain}
              resizeMode="cover"
              style={styles.shareIconStyle}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

export default withTranslation()(BasicInfoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
  },
  eventImageStyle: {
    aspectRatio: 16 / 9,
  },
  eventTitleTextStyle: {
    fontSize: wp(6),
    fontWeight: '500',
    color: '#000',
    marginHorizontal: wp(2),
    marginTop: wp(2),
    paddingLeft: wp(2),
  },
  eventOrganiserTextStyle: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#444',
    marginHorizontal: wp(2),
    paddingLeft: wp(2),
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(2),
  },
  eventCategory: {
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: wp(2),
    marginHorizontal: wp(1),
    marginBottom: wp(1),
  },
  eventOnlineContainer: {
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1de9b6',
    borderRadius: wp(2),
    marginHorizontal: wp(1),
    marginBottom: wp(1),
  },
  onlineInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: wp(3),
    color: '#fff',
    marginHorizontal: wp(2),
  },
  onlineEventText: {
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
    fontWeight: '800',
    color: '#ff0084',
    marginHorizontal: wp(4),
  },
  iconOnPress: {
    flexDirection: 'row',
  },
  shareIconStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  onlineIconStyle: {
    width: hp(2),
    height: hp(2),
    // backgroundColor:'#fff'
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
    alignItems: 'center',
  },
  listTimeContainer: {
    // width: wp(30),
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: wp(6),
    backgroundColor: '#fff',
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTimeText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#ff0084',
    marginHorizontal: wp(2),
    alignItems: 'center',
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
