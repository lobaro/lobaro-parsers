/**
 * TTN-compatible data decoder for the Lobaro LoRaWAN Floating Switch Sensor.
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

function readVersion(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    if (bytes.length<3) {
        return null;
    }
    return "v" + bytes[0] + "." + bytes[1] + "." + bytes[2];
}

function int40_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return bytes[0] << 32 |
        bytes[1] << 24 | bytes[2] << 16 | bytes[3] << 8 | bytes[4] << 0;
}

function int16_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return bytes[0] << 8 | bytes[1] << 0;
}

function port1(bytes) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var decoded = {
        version: readVersion(bytes, 0),
        flags: bytes[3],
        temp: int16_BE(bytes, 4) / 10,
        vBat: int16_BE(bytes, 6) / 1000,
        state: bytes[8],
        closed: !!(bytes[8]&1),
    };
  return decoded;
}

function Decoder(bytes, port) {
    switch (port) {
        case 1:
            return port1(bytes);
        default:
            return {"error":"invalid port", "port":port};
    }
}
