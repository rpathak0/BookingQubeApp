/* eslint-disable prettier/prettier */
// deviceInfo.js
import DeviceInfo from 'react-native-device-info';

var output = {};

exports.populateDeviceInfo = async () => {
  output.isEmulator = await DeviceInfo.isEmulator();
  output.version = await DeviceInfo.getVersion();
  // ... and whatever else you may need
};

export default output;
