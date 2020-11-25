/**
 * TTN-compatible data decoder for the Lobaro LoRaWAN Humidity Sensor.
 *
 * For the current version of this and other data formats check out:
 * https://github.com/lobaro/ttn-data-formats/
 *
 * For more information go to:
 * https://www.lobaro.com/
 *
 *
 * MIT License
 *
 * Copyright (c) 2020 Lobaro
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// number parsing functions, minified:
function signed(n,t){var i=Math.pow(2,t-1);return n<i?n:n-2*i}function uint_BE(n,t,i){if(i=i||0,n.length<t+i)return 0;for(var u=0,E=0;E<t;E++)u=256*u+n[E+(i||0)];return u}function int_BE(n,t,i){return signed(uint_BE(n,t,i),8*t)}function uint_LE(n,t,i){if(i=i||0,n.length<t+i)return 0;for(var u=0,E=t;E--;)u=256*u+n[E+i];return u}function int_LE(n,t,i){return signed(uint_LE(n,t,i),8*t)}function uint8(n,t){return n[t||0]}function int8(n,t){return signed(n[t||0],8)}function uint16_BE(n,t){return uint_BE(n,2,t)}function uint24_BE(n,t){return uint_BE(n,3,t)}function uint32_BE(n,t){return uint_BE(n,4,t)}function uint40_BE(n,t){return uint_BE(n,5,t)}function uint48_BE(n,t){return uint_BE(n,6,t)}function int16_BE(n,t){return int_BE(n,2,t)}function int24_BE(n,t){return int_BE(n,3,t)}function int32_BE(n,t){return int_BE(n,4,t)}function int40_BE(n,t){return int_BE(n,5,t)}function int48_BE(n,t){return int_BE(n,6,t)}function uint16_LE(n,t){return uint_LE(n,2,t)}function uint24_LE(n,t){return uint_LE(n,3,t)}function uint32_LE(n,t){return uint_LE(n,4,t)}function uint40_LE(n,t){return uint_LE(n,5,t)}function uint48_LE(n,t){return uint_LE(n,6,t)}function int16_LE(n,t){return int_LE(n,2,t)}function int24_LE(n,t){return int_LE(n,3,t)}function int32_LE(n,t){return int_LE(n,4,t)}function int40_LE(n,t){return int_LE(n,5,t)}function int48_LE(n,t){return int_LE(n,6,t)}function float32FromInt(n){var t=2147483648&n?-1:1,i=(n>>23&255)-127,u=8388607&n;if(128===i)return t*(u?Number.NaN:Number.POSITIVE_INFINITY);if(-127===i){if(0===u)return 0*t;i=-126,u/=1<<22}else u=(u|1<<23)/(1<<23);return t*u*Math.pow(2,i)}function float32_BE(n,t){return float32FromInt(int32_BE(n,t))}function float32_LE(n,t){return float32FromInt(int32_LE(n,t))}
// status message decoding:
var REBOOT_REASON={1:"LOW_POWER_RESET",2:"WINDOW_WATCHDOG_RESET",3:"INDEPENDENT_WATCHDOG_RESET",4:"SOFTWARE_RESET",5:"POWER_ON_RESET",6:"EXTERNAL_RESET_PIN_RESET",7:"OBL_RESET"},
    FINAL_WORDS={0:"NONE",1:"RESET",2:"ASSERT",3:"STACK_OVERFLOW",4:"HARD_FAULT",16:"INVALID_CONFIG",17:"REMOTE_RESET",18:"NETWORK_LOST",19:"NETWORK_FAIL"},
    STATUS_CODE={0:"OK",101:"PROBE_ERROR"};
function status_decode(e,t,_){return e[t]?e[t]:_||"UNKNOWN"}function status_version(e,t){return(e=e.slice(t||0)).length<3?null:"v"+e[0]+"."+e[1]+"."+e[2]}function status_Decoder(e){return{firmware:String.fromCharCode.apply(null,e.slice(0,3)),version:status_version(e,3),status_code:e[6],status_text:status_decode(STATUS_CODE,e[6]),reboot_code:e[7],reboot_reason:status_decode(REBOOT_REASON,e[7]),final_code:e[8],final_words:status_decode(FINAL_WORDS,e[8]),voltage:int16_BE(e,9)/1e3||0,temperature:int16_BE(e,11)/10||-32768,app_data:e.slice(13)}}function status_update_device(e){if(Device&&Device.setProperty){for(var t=["firmware","version","status_code","status_text","reboot_code","reboot_reason","final_code","final_words","app_data","temperature","voltage"],_=0;_<t.length;_++){var a=t[_];e[a]&&Device.setProperty(a,e[a])}e.latitude&&e.longitude&&Device.setLocation(e.latitude,e.longitude)}}function Parse(e){var t=bytes(atob(e.data)),_=Decoder(t,e.fPort);return status_update_device(_),_}

/* Port 1: Data */
function data_Decoder(bytes) {
    return {
        pressure: float32_LE(bytes, 0),
        temp: int16_LE(bytes,4) / 100,
        voltage: int16_LE(bytes,6) / 1000,
    }
}

// TTN compatible decoder function:
function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields
    switch (port) {
        case 1:
            // date message:
            return data_Decoder(bytes);
        case 64:
            // lobaro unified status telegram
            return status_Decoder(bytes);
        case 128:
        case 129:
        case 130:
        case 131:
            // remote config responses
            return {};
        default:
            // unsupported port:
            return null;
    }
}
