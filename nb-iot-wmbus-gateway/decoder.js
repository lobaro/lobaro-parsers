function NB_ParseDeviceQuery(input) {
    for (var key in input.d) {
        var v = input.d[key];
        switch (key) {
            case "temperature":
                v = v / 10.0;
                break;
            case "vbat":
                v = v / 1000.0;
                break;
        }
        Device.setProperty("device." + key, v);
    }
    return null;
}

function NB_ParseConfigQuery(input) {
    for (var key in input.d) {
        Device.setConfig(key, input.d[key]);
    }
    return null;
}

function NB_ExtractStatus(input) {
    if (input.d) {
        var d = input.d;
        if (d.vbat) {
            Device.setProperty("device.vbat", d.vbat / 1000.0);
        }
        if (d.monitor) {
            Device.setProperty("debug.monitor", d.monitor);
        }
        if (d.temperature) {
            Device.setProperty("device.temperature", d.temperature / 10.0);
        }
    }
}

function NB_ExtractMainWmbusValue(wmbus){

    // DWZ Lorenz GmbH Aufputzwasserzähler
    // Zählerplatform Artikelnummer: LZ-S-OMS-2020
    // Verbaut in TR Test Liegenschaft
    if(wmbus.MFieldCodeString === "DWZ"
        && wmbus.DeviceString === "Water"){
        if(wmbus.Body && wmbus.Body.DataRecords){

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if(wmbus.Body.DataRecords[i].VifQuantity==="Volume"
                    && wmbus.Body.DataRecords[i].DifFunctionString==="Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit){
                    return wmbus.Body.DataRecords[i].ValueString + " "+wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    // Zenner
    if(wmbus.MFieldCodeString === "ZRI"
        && wmbus.DeviceString === "Radio converter (meter side)"){
        if(wmbus.Body && wmbus.Body.DataRecords){

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if(wmbus.Body.DataRecords[i].VifQuantity==="Volume"
                    && wmbus.Body.DataRecords[i].DifFunctionString==="Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit){
                    return wmbus.Body.DataRecords[i].ValueString + " "+wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    // Müller HCA
    if(wmbus.MFieldCodeString === "MEH"
        && wmbus.DeviceString === "Heat Cost"){
        if(wmbus.Body && wmbus.Body.DataRecords){

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if(wmbus.Body.DataRecords[i].VifQuantity==="H.C.A."
                    && wmbus.Body.DataRecords[i].DifFunctionString==="Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit){
                    return wmbus.Body.DataRecords[i].ValueString + " "+wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    if(wmbus.MFieldCodeString === "REL"
        && wmbus.DeviceString === "Radio converter (meter side)"){
        if(wmbus.Body && wmbus.Body.DataRecords){

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if(wmbus.Body.DataRecords[i].VifQuantity==="Energy"
                    && wmbus.Body.DataRecords[i].DifFunctionString==="Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit){
                    return wmbus.Body.DataRecords[i].ValueString + " "+wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    return "";
}

function NB_ParseUDPDataQuery(input) {
    NB_ExtractStatus(input);
    for (var key in input.d) {
        Device.setProperty("status." + key, input.d[key]);
    }
    return null;
}


function NB_ParseDataQuery(input) {
    NB_ExtractStatus(input);

    if (!input.d.telegram){
        return null;
    }

    var wmbus = Parser.parseWmbus(parseBase64(input.d.telegram));

    // Decode an incoming message to an object of fields.
    return {
        "mainValue" : NB_ExtractMainWmbusValue(wmbus),
        "mbus": wmbus,
        "time": input.d.timestamp * 1000 || 0,
        "rssi": input.d.rssi,
        "gwImei": input.i
    };
}

function NB_ParseStatusQuery(input) {
    NB_ParseDeviceQuery(input);
}

function NB_Parse(input) {
    var query = input.q || "data";
    switch (query) {
        case "udp":
            return NB_ParseUDPDataQuery(input);
        case "device":
            return NB_ParseDeviceQuery(input);
        case "config":
            return NB_ParseConfigQuery(input);
        case "data":
            return NB_ParseDataQuery(input);
        case "status":
            return NB_ParseStatusQuery(input);
        default:
            throw new Error("Unknown message type: '" + query + "'");
    }
}


//LORA Decoder Stack:
function lw_readVersion(bytes, i) {
    if (bytes.length < 3) {
        return null;
    }
    return "v" + bytes[i] + "." + bytes[i + 1] + "." + bytes[i + 2];
}

function signed(val, bits) {
    if ((val & 1 << (bits - 1)) > 0) { // value is negative (16bit 2's complement)
        var mask = Math.pow(2, bits) - 1;
        val = (~val & mask) + 1; // invert all bits & add 1 => now positive value
        val = val * -1;
    }
    return val;
}
function uint40_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return bytes[0] << 32 |
        bytes[1] << 24 | bytes[2] << 16 | bytes[3] << 8 | bytes[4] << 0;
}
function uint16_BE(bytes, idx) {
    bytes = bytes.slice(idx || 0);
    return bytes[0] << 8 | bytes[1] << 0;
}
function int40_BE(bytes, idx) {return signed(uint40_BE(bytes, idx), 40);}
function int16_BE(bytes, idx) {return signed(uint16_BE(bytes, idx), 16);}



function LW_Decoder(bytes, port) {
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
    if (port === 1 && bytes.length == 8) { // status packet
        decoded.FirmwareVersion = lw_readVersion(bytes, 0);
        decoded.Vbat = uint16_BE(bytes, 3) / 1000.0;
        decoded.Temp = int16_BE(bytes, 5) / 10.0; // byte 8-9 (originally in 10th degree C)
        decoded.msg = "Firmware Version: " + decoded.FirmwareVersion + " Battery: " + decoded.Vbat + "V Temperature: " + decoded.Temp + "°C";
        decoded.forced = Boolean(bytes[7]);
    }

    return decoded;
}

function LW_Parse(input) {
    // Decode an incoming message to an object of fields.
    var bytes = parseBase64(input.data);
    var port = input.fPort;
    var decoded = null;

    Device.setProperty("status.SF", input.spreadingFactor);
    Device.setProperty("status.RSSI", input.rssi);
    Device.setProperty("status.fcnt", input.fCnt);


    if (port >= 11 && port <= 99) {
        var part = Math.floor(port / 10);
        var total = port % 10;
        //decoded.part = part;
        //decoded.total = total;
        if (part == 1) {
            Parser.clearPartial("wmbus");
        }
        if (part < total) {
            Parser.joinPartial(bytes, "wmbus");
        } else if (part == total) {
            decoded = {};
            var joined = Parser.joinPartial(bytes, "wmbus");
            Parser.clearPartial("wmbus");
            var wmbus = Parser.parseWmbus(joined);
            decoded.mbus = wmbus;
        }
    } else if(port == 1) {
        // status
        decoded = LW_Decoder(bytes, port);
        Device.setProperty("status.firmware", decoded.FirmwareVersion);
        Device.setProperty("status.voltage", decoded.Vbat);
        // Only show temperature when value is plausible
        if (decoded.Temp > -300) {
            Device.setProperty("status.temperature", decoded.Temp);
        }

        // return nil to avoid emptry entry in device data
        decoded = null;
    } else {
        // unknown port or port 0
        // return null to drop avoid empty data entry
        decoded = null;
    }


    return decoded;
}


function Parse(input) {
    if (input.i){
        //IMEI = nb iot input
        return NB_Parse(input)
    } else if(input.devEUI){
        //devEUI = lorawan input
        return LW_Parse(input)
    } else {
        throw new Error("Neither NB IoT nor LORWAN Msg detected.");
    }

}