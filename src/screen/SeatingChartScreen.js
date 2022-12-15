/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { withTranslation } from 'react-i18next';

// Component
import HeaderComponent from '../component/HeaderComponent';
import FooterComponent from '../component/FooterComponent';

// Image
// import header_image from '../assets/image/header_image.png';

class SeatingChartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      royalPlatinum: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
      royalB: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
      royalC: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
      clubD: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
      clubE: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
      clubF: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
      executiveG: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
      executiveH: [
        {
          id: 1,
          text: '1',
        },
        {
          id: 2,
          text: '2',
        },
        {
          id: 3,
          text: '3',
        },
        {
          id: 4,
          text: '4',
        },
        {
          id: 5,
          text: '5',
        },
        {
          id: 6,
          text: '6',
        },
        {
          id: 7,
          text: '7',
        },
        {
          id: 8,
          text: '8',
        },
        {
          id: 9,
          text: '9',
        },
        {
          id: 10,
          text: '10',
        },
        {
          id: 11,
          text: '11',
        },
        {
          id: 12,
          text: '12',
        },
      ],
    };
  }

  render() {
    const { t } = this.props;

    const royalPlatinumList = () => {
      return this.state.royalPlatinum.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    const royalList = () => {
      return this.state.royalB.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    const royalListC = () => {
      return this.state.royalC.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    const clubD = () => {
      return this.state.clubD.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    const clubE = () => {
      return this.state.clubE.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    const clubF = () => {
      return this.state.clubF.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    const executiveG = () => {
      return this.state.executiveG.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    const executiveH = () => {
      return this.state.executiveH.map(item => {
        return (
          <View style={styles.ticketRowContainer}>
            <TouchableOpacity style={styles.seatContainer}>
              <Text style={styles.seatNumberText}>{item.text}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={t('seating_chart')}
          navAction="back"
          nav={this.props.navigation}
        />
        <ScrollView>
          <View style={styles.homeContainer}>
            <Text style={styles.textInputText}>{t('seating_chart')}</Text>
            {/* <ImageBackground
              source={header_image}
              resizeMode="cover"
              style={styles.ImageBackgroundStyle}> */}
            <View style={styles.mainSeatContainer}>
              <Text style={styles.seatText}>Royal Platinum</Text>
              <View style={styles.lineContainer}></View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>A</Text>
                {royalPlatinumList()}
              </View>
            </View>

            <View style={styles.mainSeatContainer}>
              <Text style={styles.seatText}>Royal</Text>
              <View style={styles.lineContainer}></View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>B</Text>
                {royalList()}
              </View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>C</Text>
                {royalListC()}
              </View>
            </View>

            <View style={styles.mainSeatContainer}>
              <Text style={styles.seatText}>Club</Text>
              <View style={styles.lineContainer}></View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>D</Text>
                {clubD()}
              </View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>E</Text>
                {clubE()}
              </View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>F</Text>
                {clubF()}
              </View>
            </View>

            <View style={styles.mainSeatContainer}>
              <Text style={styles.seatText}>Executive</Text>
              <View style={styles.lineContainer}></View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>G</Text>
                {executiveG()}
              </View>

              <View style={styles.seatBoxContainer}>
                <Text style={styles.sectionText}>H</Text>
                {executiveH()}
              </View>
            </View>
            {/* </ImageBackground> */}
          </View>
        </ScrollView>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(SeatingChartScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
  },
  textInputText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#000',
    marginTop: hp(2),
    marginBottom: hp(.5),
    marginHorizontal: wp(2),
  },
  ImageBackgroundStyle: {
    flex: 1,
    // height: hp(20),
    width: '100%',
  },
  mainSeatContainer: {
    marginHorizontal: wp(4),
  },
  seatText: {
    fontSize: wp(3.5),
    color: '#838383',
  },
  lineContainer: {
    height: hp(0.2),
    width: 'auto',
    backgroundColor: '#838383',
    marginVertical: hp(0.5),
  },
  seatBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  ticketRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatContainer: {
    height: hp(5),
    width: wp(10),
    borderWidth: 2,
    borderColor: '#7e9c80',
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(0.5),
    marginHorizontal: wp(2),
  },
  seatNumberText: {
    fontSize: wp(3.5),
    color: '#7e9c80',
  },
  sectionText: {
    fontSize: wp(4),
    color: '#838383',
    marginHorizontal: wp(0.5),
  },
});
