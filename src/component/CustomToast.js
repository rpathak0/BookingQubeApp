import Toast from 'react-native-toast-message';

export const showToast = message => {
  Toast.show({
    type: 'info',
    text1: message,
    position: 'top'
  });

};
