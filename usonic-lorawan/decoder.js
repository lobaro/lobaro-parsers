function decodeUInt16(byte1, byte2) {
    var decoded = byte1 | byte2 << 8;
    if ((decoded & 1 << 15) > 0) { // value is negative (16bit 2's complement)
        decoded = ((~decoded) & 0xffff) + 1; // invert 16bits & add 1 => now positive value
        decoded = decoded * -1;
    }
    return decoded;
}


function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var decoded = {};

    if (port === 2) { // Payload
        decoded.vBat = (bytes[0] | bytes[1] << 8) / 1000.0; // byte 6-7 (originally in mV)

        decoded.temp = decodeUInt16(bytes[2], bytes[3]) / 10.0;
        decoded.numResults = bytes[4];
        var idx = 5;

        decoded.results = [];


        for (var i = 0; i < decoded.numResults; i++) {
            var result = {};

            result.distance_mm = bytes[idx] | bytes[idx + 1] << 8 | bytes[idx + 2] << 16 | bytes[idx + 3] << 24;
            result.distance_m = result.distance_mm / 1000;
            result.tof_us = bytes[idx + 4] | bytes[idx + 5] << 8;
            result.width = bytes[idx + 6];
            result.amplitude = bytes[idx + 7];
            decoded.results[i] = result;
            idx += 8;
        }
    }

    // example decoder for status packet by lobaro
    if (port === 1) { // status packet
        decoded.firmwareVersion = bytes[0] + "." + bytes[1] + "." + bytes[2]; // byte 0-3
        decoded.vBat = (bytes[4] | bytes[5] << 8) / 1000.0; // byte 6-7 (originally in mV)
        decoded.temp = decodeUInt16(bytes[6], bytes[7]) / 10.0; // byte 8-9 (originally in 10th degree C)
        decoded.msg = "Firmware Version: v" + decoded.firmwareVersion + " Battery: " + decoded.vBat + "V Temperature: " + decoded.temp + "°C";
    }

    return decoded;
}

