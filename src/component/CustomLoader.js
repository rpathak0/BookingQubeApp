import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

const CustomLoader = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0,0.6)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    zIndex: 9999,
  },
});

export default CustomLoader;
