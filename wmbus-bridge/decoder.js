/**
 * Parser for LOB-GW-WMBUS-LW and LOB-GW-WMBUS-LW2
 *
 * Copyright (c) by Lobaro GmbH 2020 - https://www.lobaro.com
 * For Licence and further information see https://github.com/lobaro/lobaro-parsers
 *
 * This is a JavaScript parser to be used for the Lobaro Wireless M-Bus Bridge (LoRaWAN).
 *
 * The latest version of this parser can be found at:
 * https://github.com/lobaro/lobaro-parsers/tree/master/wmbus-bridge
 *
 * Device online manual:
 * https://doc.lobaro.com/doc/lorawan-devices/wireless-m-bus-bridge-v2-lorawan
 *
 * This parser can be used in:
 *   - The IoT Lobaro Platform
 *   - The Things Network (TTN)
 *   - ChirpStack (former LoRaServer)
 *   - niota.io (Digimondo)
 */

function readVersion(bytes, i) {
    if (bytes.length < 3) {
        return null;
    }
    return "v" + bytes[i] + "." + bytes[i + 1] + "." + bytes[i + 2];
}
 
function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var decoded = {};
 
    if (port === 9) {
        decoded.devStatus = bytes[0];
        decoded.devID = bytes[1] | bytes[2] << 8 | bytes[3] << 16 | bytes[4] << 24;
        decoded.dif = bytes[5];
        decoded.vif = bytes[6];
        decoded.data0 = bytes[7];
        decoded.data1 = bytes[8];
        decoded.data2 = bytes[9];
    }
 
    // example decoder for status packet by lobaro
    if (port === 1 && bytes.length == 9) { // status packet
        decoded.FirmwareVersion = String.fromCharCode.apply(null, bytes.slice(0, 5)); // byte 0-4
        decoded.Vbat = (bytes[5] | bytes[6] << 8) / 1000.0; // byte 6-7 (originally in mV)
        decoded.Temp = (bytes[7] | bytes[8] << 8) / 10.0; // byte 8-9 (originally in 10th degree C)
        decoded.msg = "Firmware Version: v" + decoded.FirmwareVersion + " Battery: " + decoded.Vbat + "V Temperature: " + decoded.Temp + "°C";
    } else if (port === 1 && bytes.length == 7) {
        decoded.FirmwareVersion = readVersion(bytes, 0); // byte 0-2
        decoded.Vbat = (bytes[3] | bytes[4] << 8) / 1000.0; // originally in mV
        decoded.Temp = (bytes[5] | bytes[6] << 8) / 10.0; // originally in 10th degree C
        decoded.msg = "Firmware Version: " + decoded.FirmwareVersion + " Battery: " + decoded.Vbat + "V Temperature: " + decoded.Temp + "°C";
    }
 
    return decoded;
}
 
// Wrapper for Lobaro Platform
function Parse(input) {
    // Decode an incoming message to an object of fields.
    var b = bytes(atob(input.data));
    var decoded = Decoder(b, input.fPort);
  
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
