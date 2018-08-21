/**
 * TTN-compatible data decoder for the Lobaro LoRaWAN GPS tracker.
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
 * Copyright (c) 2018 Lobaro
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

function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.

    var button_number = 0;
    var Temp10tel = 0;
    var VBat1000tel = 0;
    var lat_deg = 0;
    var lat_min = 0;
    var lat_10000min = 0;
    var long_deg = 0;
    var long_min = 0;
    var long_10000min = 0;
    
 
    button_number = bytes[0];
    Temp10tel = (bytes[1] << 8) | (bytes[2] << 0);
    VBat1000tel = (bytes[3] << 8) | (bytes[4] << 0);
    lat_deg = bytes[5];
    lat_min = bytes[6];
    lat_10000min = (bytes[7] << 8) | (bytes[8] << 0);
    long_deg = bytes[9];
    long_min = bytes[10];
    long_10000min = (bytes[11] << 8) | (bytes[12] << 0);
    gpsValid = (bytes[13] !== 0);  // Missing byte = true

  var decoded = {
    button_number:button_number || 0,
    Temp10tel: Temp10tel || 0,
    VBat1000tel: VBat1000tel || 0,
    lat_deg: lat_deg || 0,
    lat_min: lat_min || 0,
    lat_10000min: lat_10000min || 0,
    long_deg: long_deg || 0,
    long_min: long_min || 0,
    long_10000min: long_10000min || 0,
    gps_valid: gpsValid || false,
  };
  
  return decoded;
}
