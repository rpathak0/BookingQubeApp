/* eslint-disable prettier/prettier */

var moment = require('moment-timezone');

export function convertTimeZone(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const date = time.clone().tz(localtz)
    const formattedDate = moment(date).format('DD MMM YYYY')
    const formattedDateBasic = moment(date).format('DD-MM-YYYY')
    const formattedTime = moment(date).format('h:mm A')
    return ({ formattedDate, formattedTime,formattedDateBasic })
}
export function convertTimeZoneDateTime(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const date = time.clone().tz(localtz)
    const formattedDate = moment(date).format('YYYY-MM-DD h:mm:ss');
    // const formattedTime = moment(date).format('h:mm A')
    return formattedDate;
}
export function getCurrentTime() {
    const localtz = moment.tz.guess()
    return moment().tz(localtz).format('YYYY-MM-DD h:mm:ss')
}
export function getSaleExpirationSeconds(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const eventDateTime = time.clone().tz(localtz)
    const currentDateTime =  moment().tz(localtz)
    return eventDateTime.diff(currentDateTime, 'seconds');
}
export function remaingDaysCount(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const eventDateTime = time.clone().tz(localtz)
    const currentDateTime =  moment().tz(localtz)
    return eventDateTime.diff(currentDateTime, 'days');
}
export function convertTimeZoneFormatted(originTime, inputTz = "Asia/Qatar",format) {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const date = time.clone().tz(localtz);
    return  moment(date).format(format);
}
export function checkoutCountDown(attendee = {}) {
            
    var ms   = 0; // milliseconds
    
    if(attendee.at_checkout !== null && attendee.at_checkout != 'undefined' && attendee.permanent_checkout != 1) {
        var local_tz = 'Asia/Qatar';
    
        var a    = moment(attendee.at_checkout, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
        var b    = moment().tz(local_tz).format('DD/MM/YYYY HH:mm:ss'); 
        var ms   = 0; // milliseconds

        let milliseconds = moment(b,"DD/MM/YYYY HH:mm:ss").tz(local_tz).diff(moment(a,"DD/MM/YYYY HH:mm:ss").tz(local_tz), 'milliseconds');
        
        
        if(milliseconds <= (15 * 60000) ){
            ms = ((15 * 60000) - milliseconds); //milliseconds
        } else {
            ms = 'checkout'
        }
    }
    return ms;

}





