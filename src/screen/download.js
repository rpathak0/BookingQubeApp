import RNFetchBlob from 'rn-fetch-blob';
import {PermissionsAndroid} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';

export const Download = async(url) =>{
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

    if(url && granted=='granted'){
        let ext = url.split('.').pop();
        return new Promise(async(resolve)=>{
            let name = `${moment().unix()}`;
            const { config, fs } = RNFetchBlob;
            let PictureDir = fs.dirs.DownloadDir;
            let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path:
                PictureDir +'/'+
                `${name}.${ext}`,
                description: `${name}.${ext} Download`,
            },
            };
            config(options)
            .fetch('GET', url)
            .then(async(res) => {
                resolve(res);
                SimpleToast.show('File Downloaded!')
            }).catch((err)=>{
                SimpleToast.show('File Not Found!')
                console.log(err)
            });
        })
    }
    else
    {
        SimpleToast.show('File not Found!')
    }
        
}

