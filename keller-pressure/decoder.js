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
function decodeFloat32(bytes) {
    var sign = (bytes & 0x80000000) ? -1 : 1;
    var exponent = ((bytes >> 23) & 0xFF) - 127;
    var significand = (bytes & ~(-1 << 23));

    if (exponent == 128)
        return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);

    if (exponent == -127) {
        if (significand == 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 22);
    } else significand = (significand | (1 << 23)) / (1 << 23);

    return sign * significand * Math.pow(2, exponent);
}

function decodeInt16(bytes) {
    if ((bytes & 1 << 15) > 0) { // value is negative (16bit 2's complement)
        bytes = ((~bytes) & 0xffff) + 1; // invert 16bits & add 1 => now positive value
        bytes = bytes * -1;
    }
    return bytes;
}

function int16_LE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return bytes[0] << 0 | bytes[1] << 8;
}

function int32_LE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return bytes[0] << 0 | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24;
}

function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var decoded = {
        pressure: decodeFloat32(int32_LE(bytes, 0)),
        temp: decodeInt16(int16_LE(bytes,4)) / 100,
    };

    // if (port === 1) decoded.led = bytes[0];

    return decoded;
}