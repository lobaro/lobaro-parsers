function toHexString(byteArray) {
    var s = '';
    byteArray.forEach(function (byte) {
        s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    });
    return s;
}

function signed(val, bits) {
    if ((val & 1 << (bits - 1)) > 0) { // value is negative (16bit 2's complement)
        var mask = Math.pow(2, bits) - 1;
        val = (~val & mask) + 1; // invert all bits & add 1 => now positive value
        val = val * -1;
    }
    return val;
}

function int16_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return signed(bytes[0] << 8 | bytes[1] << 0, 16);
}

function int24_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return signed(bytes[0] << 16 | bytes[1] << 8 | bytes[2] << 0, 24);
}

function int32_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3] << 0, 32);
}

function int16_LE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return signed(bytes[1] << 8 | bytes[0] << 0, 16);
}

function int24_LE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return signed(bytes[2] << 16 | bytes[1] << 8 | bytes[0] << 0, 24);
}

function int32_LE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return signed(bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0] << 0, 32);
}

function int64_LE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return signed(
        bytes[7] << 56 | bytes[6] << 48 | bytes[5] << 40 | bytes[4] << 32 |
        bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0] << 0, 32);
}

function toNumber(bytes) {
    var res = 0;
    for (var i = 0, s = 0; i < bytes.length; i++) {
        res |= bytes[i] << s;
        s += 8;
    }
    return res;
}

function bit(byte, idx) {
    return (byte & (0x01 << idx)) != 0;
}

function readVersion(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return "v" + bytes[0] + "." + bytes[1] + "." + bytes[2];
}

// EXAMPLE PARSER:

// 0001000566566D38000000000600E600EA0C02400040E740C7
// 00 01 00 05 66 56 6D 38 00 00 00 00 06 00 E6 00 EA 0C 02 400040E740C7
/*
Alarm
----------
reason: Button 2 (5)
sensorTime: 946689638
vBat: 3306
temperature: 230
mems: <64,-6336,-14528>
button1State: 0
button2State: 1
alarmAgeSec: 6
 */
function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var decoded = {
        "version": readVersion(bytes, 0),
        "reason": bytes[3],
        "sensorTime": int64_LE(bytes, 4),
        "alarmAgeSec": int16_LE(bytes, 12),
        "temperature": int16_LE(bytes, 14) / 10,
        "vBat": int16_LE(bytes, 16) / 1000,
        "button1State": bit(bytes[18], 0),
        "button2State": bit(bytes[18], 1),
        "memsX": int16_LE(bytes, 19),
        "memsY": int16_LE(bytes, 21),
        "memsZ": int16_LE(bytes, 23),
    };

    // if (port === 1) decoded.led = bytes[0];

    return decoded;
}

