/* eslint-disable prettier/prettier */

import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';
// import  axios  from 'axios';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const SeatingScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  useEffect(() => {
    getSeatingData();
  }, []);

  const getSeatingData = async () => {
    try {
      const response = await fetch(
        BASE_URL+'events/show/open-air-concert-reserved-seating',
      );
      const json = await response.json();
      setTickets(json.data.tickets);
      console.log(json.data.tickets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getSeatBacgroundColor = seat => {
    return seat?.status ? (seat?.is_booked ? 'red' : 'transparent') : 'grey';
  };

  const handleSelectSeat = (ticket, seat) => {
    const findticket = tickets.find(t => t.id == ticket?.id);
    const newSeats = findticket.seatchart.seats.find(s => s.id == seat?.id);
    console.log(newSeats);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {loading ? (
          <View style={{backgroundColor: Colors.black}}>
            <Text style={styles.color}>Loading Data...</Text>
          </View>
        ) : (
          <>
            {tickets?.map(ticket => (
              <View key={ticket?.id}>
                <Text style={{backgroundColor: Colors.white, color: 'black'}}>
                  {ticket?.title}
                </Text>
                <ScrollView horizontal={true} style={styles.seatWrapper}>
                  <View
                    style={{
                      height: ticket?.seatchart?.canvas_size?.height,
                      width: ticket?.seatchart?.canvas_size?.width,
                      backgroundColor: 'white',
                      borderColor: 'white',
                      position: 'relative',
                    }}>
                    {ticket?.seatchart?.seats.map((seat, i) => (
                      <TouchableHighlight
                        key={seat?.id}
                        onPress={() => handleSelectSeat(ticket, seat)}>
                        <View
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            height: 24,
                            width: 24,
                            backgroundColor: getSeatBacgroundColor(seat),
                            borderWidth: 1,
                            borderColor: seat?.status
                              ? seat?.is_booked
                                ? 'red'
                                : 'green'
                              : 'grey',
                            borderRadius: 5,
                            marginTop: seat?.coordinates?.top - 12,
                            marginLeft: seat?.coordinates?.left - 12,
                          }}>
                          <Text
                            style={{
                              color: seat?.status
                                ? seat?.is_booked
                                  ? 'white'
                                  : 'green'
                                : 'white',
                              fontSize: 9,
                              fontWeight: 'bold',
                            }}>
                            {seat?.name}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  seatWrapper: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default SeatingScreen;
