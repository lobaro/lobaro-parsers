/**
 * Lobaro Universal number parsing functions for parser scripts.
 *
 * Copyright (c) by Lobaro GmbH 2020 - https://www.lobaro.com
 * For Licence and further information see https://github.com/lobaro/lobaro-parsers
 *
 */

/* ====v==== SNIP ====v==== */

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

// Wrapper for ChirpStack (former Loraserver)
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
