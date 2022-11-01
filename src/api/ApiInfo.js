/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */

// User Preference
import {async_keys, getData} from './UserPreference';

// Base URL
//export const BASE_URL = 'https://devdemo.shrigenesis.com/events_app/api/v1/';
export const BASE_URL = 'https://bookingqube.com/api/v1/';
export const STORAGE_URL = 'https://bookingqube.com/storage/';

// Methods
export const makeRequest = async (url, params = null) => {
  const token = await getData(async_keys.userId);

  if (token === '') {
    try {
      // request info
      let info = {};

      if (params) {
        // request method type
        info.method = 'POST';

        // var myHeaders = new Headers();
        // myHeaders.append('Authorization', 'Bearer ' + token);

        // Preparing multipart/form-data
        const formData = new FormData();
        for (const key in params) {
          formData.append(key, params[key]);
        }

        // request body
        info.body = formData;
        // info.headers = myHeaders;
      } else {
        // headers to prevent cache in GET request
        info.headers = {
          // 'Cache-Control': 'no-cache, no-store, must-revalidate',
          // Pragma: 'no-cache',
          // Expires: 0,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
      }

      console.log('Request URL:', url);
      console.log('Request Params:', info);

      const response = await fetch(url, info);
      // console.log(response)

      const result = await response.json();
      console.log('Request Response:', result);

      return result;
    } catch (error) {
      console.log(error.message);
    }
  } else {
    const token = await getData(async_keys.userId);
    try {
      // request info
      let info = {};

      if (params) {
        // request method type
        info.method = 'POST';

        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + token);

        console.log(async_keys.userId);

        // Preparing multipart/form-data
        const formData = new FormData();
        for (const key in params) {
          formData.append(key, params[key]);
        }

        // request body
        info.body = formData;
        info.headers = myHeaders;
      } else {
        // headers to prevent cache in GET request
        info.headers = {
          // 'Cache-Control': 'no-cache, no-store, must-revalidate',
          // Pragma: 'no-cache',
          // Expires: 0,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
      }

      console.log('Request URL:', url);
      console.log('Request Params:', info);

      const response = await fetch(url, info);
      // console.log(response)

      const result = await response.json();
      console.log('Request Response:', result);

      return result;
    } catch (error) {
      console.log(error.message);
    }
  }
};
