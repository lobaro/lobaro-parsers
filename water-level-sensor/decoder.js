/**
 * Parser for LOB-S-PR-LW-BOX and LOB-S-PR-LW-PIPE
 *
 * Copyright (c) by Lobaro GmbH 2020 - https://www.lobaro.com
 * For Licence and further information see https://github.com/lobaro/lobaro-parsers
 *
 * This is a JavaScript parser to be used for the Lobaro LoRaWAN Water Level Sensor
 * (aka Pressure Probe, aka Pegelsonde).
 *
 * The latest version of this parser can be found at:
 * https://github.com/lobaro/lobaro-parsers/tree/master/water-level-sensor
 *
 * Device online manual:
 * https://doc.lobaro.com/doc/lorawan-devices/water-level-sensor-lorawan
 *
 * This parser can be used in:
 *   - The IoT Lobaro Platform
 *   - The Things Network (TTN)
 *   - ChirpStack (former LoRaServer)
 *   - niota.io (Digimondo)
 */

// Number parsing functions, source: https://github.com/lobaro/lobaro-parsers/blob/master/lib/parseNumbers.js
// "cast" signed form unsigned int, 2 - 46 bits
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
// universal parsing of signed integers 1-6 bytes, big endian
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
function int_BE(data, bytes, idx) { return signed(uint_BE(data, bytes, idx), bytes * 8); }
// universal parsing of signed integers 1-6 bytes, little endian
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
function int_LE(data, bytes, idx) { return signed(uint_LE(data, bytes, idx), bytes * 8); }
// convenience wrapper functions for each supported datatype with optional index parameter:
function int16_BE(bytes, idx) { return int_BE(bytes, 2, idx); }
function uint32_LE(bytes, idx) { return uint_LE(bytes, 4, idx); }
function int16_LE(bytes, idx) { return int_LE(bytes, 2, idx); }
function float32FromInt(asInt) {
    var sign = (asInt & 0x80000000) ? -1 : 1;
    var exponent = ((asInt >> 23) & 0xFF) - 127;
    var significand = (asInt & ~(-1 << 23));
    if (exponent === 128)
        return null;
        // return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);
    if (exponent === -127) {
        if (significand === 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 22);
    } else significand = (significand | (1 << 23)) / (1 << 23);
    return sign * significand * Math.pow(2, exponent);
}
function float32_LE(bytes, idx) { return float32FromInt(uint32_LE(bytes, idx)); }

// Status Message parsing functions, source: https://github.com/lobaro/lobaro-parsers/blob/master/lib/status.js
var REBOOT_REASON = {
    1: "LOW_POWER_RESET",
    2: "WINDOW_WATCHDOG_RESET",
    3: "INDEPENDENT_WATCHDOG_RESET",
    4: "SOFTWARE_RESET",
    5: "POWER_ON_RESET",
    6: "EXTERNAL_RESET_PIN_RESET",
    7: "OBL_RESET",
};
var FINAL_WORDS = {
    // fixed codes from hal:
    0x00: "NONE",
    0x01: "RESET",
    0x02: "ASSERT",
    0x03: "STACK_OVERFLOW",
    0x04: "HARD_FAULT",
    0x10: "INVALID_CONFIG",
    0x11: "REMOTE_RESET",
    0x12: "NETWORK_LOST",
    0x13: "NETWORK_FAIL",
    // 0x40 - 0x5f can be used by app:
}
var STATUS_CODE = {
    0: "OK",
    101: "PROBE_ERROR",
};
function status_decode(texts, code, def) {
    if (texts[code]) {
        return texts[code];
    } else {
        return def||"UNKNOWN";
    }
}
function status_version(bytes, idx) {
    bytes = bytes.slice(idx||0)
    if (bytes.length < 3) {
        return null;
    }
    return "v" + bytes[0] + "." + bytes[1] + "." + bytes[2];
}
function status_Decoder(bytes) {
    return {
        "firmware": String.fromCharCode.apply(null, bytes.slice(0, 3)),
        "version": status_version(bytes, 3),
        "status_code": bytes[6],
        "status_text": status_decode(STATUS_CODE, bytes[6]),
        "reboot_code": bytes[7],
        "reboot_reason": status_decode(REBOOT_REASON, bytes[7]),
        "final_code": bytes[8],
        "final_words": status_decode(FINAL_WORDS, bytes[8]),
        "voltage": (int16_BE(bytes, 9) / 1000) || 0.0,
        "temperature": (int16_BE(bytes, 11) / 10) || -0x8000,
        "app_data": bytes.slice(13)
    };
}
function status_update_device(decoded) {
    try {
        Device.setProperty;
    } catch (e) {
        // only works in Lobaro Platform parser
        return;
    }
    var keys = ["firmware", "version", "status_code", "status_text", "reboot_code", "reboot_reason",
            "final_code", "final_words", "app_data", "temperature", "voltage"];
    for (var i=0; i< keys.length; i++) {
        var key = keys[i];
        if (decoded[key]) {
            Device.setProperty(key, decoded[key]);
        }
    }
    if (decoded["latitude"] && decoded["longitude"]) {
        try {
            Device.setLocation(decoded["latitude"], decoded["longitude"]);
        } catch(e) {
            // only works in Lobaro Platform parser
        }
    }
}
// Wrapper for Lobaro Platform
function Parse(input) {
    // Decode an incoming message to an object of fields.
    var b = bytes(atob(input.data));
    // use TTN decoder:
    var decoded = Decoder(b, input.fPort);
    // Update values in device properties
    status_update_device(decoded);
    return decoded;
}

// Wrapper for ChirpStack (former LoRaServer)
function Decode(fPort, bytes) {
    return Decoder(bytes, fPort);
}

// Wrapper for Digimondo niota.io
try {
    module.exports = function (payload, meta) {
        var port = meta.lora.fport;
        var buf = Buffer.from(payload, 'hex');
        return Decoder(buf, port);
    }
} catch(e) {
    // module not declared
}

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
