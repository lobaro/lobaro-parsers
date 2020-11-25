/**
 * Lobaro Universal number parsing functions for parser scripts.
 *
 * For licence, see end of file.
 *
 */

/**
 * Interpret `val` as unsigned integer of `bits` bits that is reinterpreted
 * as signed integer with the same number of bits.
 * This works for any bit number up to 48 bit integers (56 bit integers beyond the precision
 * of js numbers).
 */
function signed(val, bits) {
    // max positive value possible for signed int with bits:
    var mx = Math.pow(2, bits-1);
    if (val < mx) {
        // is positive value, just return
        return val;
    } else {
        // is negative value, convert to neg:
        return val - (2 * mx);
    }
}
/**
 * Universal parsing of unsigned integers of arbitrary byte number (1-6) in big endian.
 */
function uint_BE(data, bytes, idx) {
    idx = idx||0;
    if (data.length < bytes + idx) {
        return 0;
    }
    var val = 0;
    for (var n=0;n<bytes;n++) {
        val = val * 0x100 + data[n + (idx||0)];
    }
    return val;
}
/**
 * Universal parsing of signed integers of arbitrary byte number (1-6) in big endian.
 */
function int_BE(data, bytes, idx) {
    return signed(uint_BE(data, bytes, idx), bytes * 8);
}
/**
 * Universal parsing of unsigned integers of arbitrary byte number (1-6) in little endian.
 */
function uint_LE(data, bytes, idx) {
    idx = idx||0;
    if (data.length < bytes + idx) {
        return 0;
    }
    var val = 0;
    for (var n=bytes;n--;) {
        val = val * 0x100 + data[n+idx];
    }
    return val;
}
/**
 * Universal parsing of signed integers of arbitrary byte number (1-6) in little endian.
 */
function int_LE(data, bytes, idx) {
    return signed(uint_LE(data, bytes, idx), bytes * 8);
}

// convenience wrapper functions for each supported datatype with optional index parameter:
function uint8(bytes, idx) { return bytes[idx||0]; }
function int8(bytes, idx) { return signed(bytes[idx||0], 8); }
function uint16_BE(bytes, idx) { return uint_BE(bytes, 2, idx); }
function uint24_BE(bytes, idx) { return uint_BE(bytes, 3, idx); }
function uint32_BE(bytes, idx) { return uint_BE(bytes, 4, idx); }
function uint40_BE(bytes, idx) { return uint_BE(bytes, 5, idx); }
function uint48_BE(bytes, idx) { return uint_BE(bytes, 6, idx); }
function int16_BE(bytes, idx) { return int_BE(bytes, 2, idx); }
function int24_BE(bytes, idx) { return int_BE(bytes, 3, idx); }
function int32_BE(bytes, idx) { return int_BE(bytes, 4, idx); }
function int40_BE(bytes, idx) { return int_BE(bytes, 5, idx); }
function int48_BE(bytes, idx) { return int_BE(bytes, 6, idx); }
function uint16_LE(bytes, idx) { return uint_LE(bytes, 2, idx); }
function uint24_LE(bytes, idx) { return uint_LE(bytes, 3, idx); }
function uint32_LE(bytes, idx) { return uint_LE(bytes, 4, idx); }
function uint40_LE(bytes, idx) { return uint_LE(bytes, 5, idx); }
function uint48_LE(bytes, idx) { return uint_LE(bytes, 6, idx); }
function int16_LE(bytes, idx) { return int_LE(bytes, 2, idx); }
function int24_LE(bytes, idx) { return int_LE(bytes, 3, idx); }
function int32_LE(bytes, idx) { return int_LE(bytes, 4, idx); }
function int40_LE(bytes, idx) { return int_LE(bytes, 5, idx); }
function int48_LE(bytes, idx) { return int_LE(bytes, 6, idx); }

function float32FromInt(asInt) {
    //bytes = bytes.slice(idx||0);
    var sign = (asInt & 0x80000000) ? -1 : 1;
    var exponent = ((asInt >> 23) & 0xFF) - 127;
    var significand = (asInt & ~(-1 << 23));
    if (exponent === 128)
        return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);
    if (exponent === -127) {
        if (significand === 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 22);
    } else significand = (significand | (1 << 23)) / (1 << 23);
    return sign * significand * Math.pow(2, exponent);
}
function float32_BE(bytes, idx) { return float32FromInt(int32_BE(bytes, idx)); }
function float32_LE(bytes, idx) { return float32FromInt(int32_LE(bytes, idx)); }

// export api for testing:
module.exports = {
    signed,
    uint8,
    int8,
    uint_BE,
    uint16_BE,
    uint24_BE,
    uint32_BE,
    uint40_BE,
    uint48_BE,
    int_BE,
    int16_BE,
    int24_BE,
    int32_BE,
    int40_BE,
    int48_BE,
    uint_LE,
    uint16_LE,
    uint24_LE,
    uint32_LE,
    uint40_LE,
    uint48_LE,
    int_LE,
    int16_LE,
    int24_LE,
    int32_LE,
    int40_LE,
    int48_LE,
    float32FromInt,
    float32_BE,
    float32_LE,
};


/**
 * MIT License
 *
 * Copyright (c) 2020 Lobaro GmbH -- https://www.lobaro.com
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
