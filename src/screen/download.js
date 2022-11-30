import RNFetchBlob from 'rn-fetch-blob';
var RNFS = require('react-native-fs');
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import {showToast} from '../component/CustomToast';
import moment from 'moment';

export const Download = async(url, t) =>{
    console.log('iaushdkasjhkasjdhkasjdhkas', url);
    if (Platform.OS === 'ios') { 
        return DownloadDirectIOS(url, t);
    } else {
        return checkDownloadPermissionAndroid(url, t);
    }
}

const DownloadDirectIOS = async(url, t) =>{
    
    //Define path to store file along with the extension
    let fileName   = `${moment().unix()}`;
    const path     = `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;
    const headers  = {
        'Accept': 'application/pdf',
        'Content-Type': 'application/pdf',
    }
    //Define options
    const options = {
        fromUrl: url,
        toFile: path,
        headers: headers
    };
    //Call downloadFile
    const response =  await RNFS.downloadFile(options);
    return response.promise
    .then(async (res) => {
        console.log('iosdownload res', res);
        showToast(t('file_downloaded'));
        return true;
    })
    .catch((err) => {
        //To handle permission related issue
        console.log('error', err);
        showToast(t('file_not_found'));
        return false
    });
        
    
}

/* for Android Only */
const DownloadDirectAndroid = async(url, t) =>{
    console.log('urllll', url);
    if(url){
        const { fs } = RNFetchBlob;
        let PictureDir = fs.dirs.DownloadDir;
        
        let ext = url.split('.').pop();
        let name = `${moment().unix()}`;
        RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: PictureDir +'/'+`${name}.${ext}`,
                description: `${name}.${ext}`,
            },
        })
        .fetch("GET", url, {
            //some headers ..
        })
        .then((res) => {
            // the temp file path
            console.log('resss new', res);
            console.log("The file saved to ", res.path());
            showToast(t('file_downloaded'));

            return true;
        })
        .catch((err) => {
            //To handle permission related issue
            console.log('error', err);
            showToast(t('file_not_found'));
            return false
        });
    }
}

/* for Android Only */
const checkDownloadPermissionAndroid = (url, t) => {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission
    try {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title:'storage title',
                message:'storage_permission',
            },
        ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //Once user grant the permission start downloading
                console.log('Storage Permission Granted.');
                return DownloadDirectAndroid(url, t);
            } else {
                //If permission denied then show alert 'Storage Permission Not Granted'
                Alert.alert('storage_permission');
                return false;
            }
        });
    } catch (err) {
        //To handle permission related issue
        console.log('error', err);
        return false
    }
}