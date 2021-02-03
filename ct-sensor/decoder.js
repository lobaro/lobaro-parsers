function uint16_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return (bytes[0] << 8 | bytes[1] << 0);
}

function readVersion(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return "v" + bytes[0] + "." + bytes[1] + "." + bytes[2];
}



// EXAMPLE
// Example Base64: AAEACmSMl4yXjJeMlw4PDg8ODw4PDg8AIQAk
// Example Hex: 0001000a648c978c978c978c970e0f0e0f0e0f0e0f0e0f00210024
// Decoder function for TTN
function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.



    var decoded = {
        "version": readVersion(bytes, 0),
        "shuntValue": bytes[3] / 100,
        "amplifierGain": bytes[4],
        "vsysCurrent": uint16_BE(bytes, 5) / 10,
        "vsysMin": uint16_BE(bytes, 7) / 10,
        "vsysMax": uint16_BE(bytes, 9) / 10,
        "vsysRms": uint16_BE(bytes, 11) / 10,
        "isecCurrent": uint16_BE(bytes, 13) / 10,
        "isecAvgLong": uint16_BE(bytes, 15) / 100,
        "isecAvgShort": uint16_BE(bytes, 17) / 100,
        "isecMin": uint16_BE(bytes, 19) / 100,
        "isecMax": uint16_BE(bytes, 21) / 100,
        "measurmentsCounter": uint16_BE(bytes, 23),
        "lastUploadSec": uint16_BE(bytes, 25),
    };

    Device.setProperty("version", decoded.version);
    Device.setProperty("shuntValue", decoded.shuntValue);
    Device.setProperty("amplifierGain", decoded.amplifierGain);


    return decoded;
}

// Wrapper for Lobaro Platform
function Parse(input) {
    // Decode an incoming message to an object of fields.
    var b = bytes(atob(input.data));
    var decoded = Decoder(b, input.fPort);

    return decoded;
}

// Wrapper for Loraserver / ChirpStack
function Decode(fPort, bytes) {
    return Decoder(bytes, fPort);
}

// Wrapper for Digimondo niota.io
// module is not defined in most environments
try {
    module.exports = function (payload, meta) {
        var port = meta.lora.fport;
        var buf = Buffer.from(payload, 'hex');
        return Decoder(buf, port);
    }
} catch(e) {}