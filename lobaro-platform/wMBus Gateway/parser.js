// This is v0.0.5
// Source: https://github.com/lobaro/lobaro-parsers/tree/master/lobaro-platform/wMBus%20Gateway

function NB_SetBatteryStatus(vbat) {
    Device.setProperty("device.vbat", vbat);
    if(vbat > 4.0) {
        Device.setProperty("platform.powerType", "external");
    }else{
        Device.setProperty("platform.powerType", "battery");
    }

    //powerStatus Score:
    if (vbat > 3.4) {
        Device.setProperty("platform.powerStatus", 9);
    } else if (vbat > 3.2) {
        Device.setProperty("platform.powerStatus", 5);
    } else {
        Device.setProperty("platform.powerStatus", 2);
    }
}

function NB_ESM_reason(esm){

    switch (esm){
        case 0:
            return "-";
        case 255:
            return "-";
        case parseInt("00001000",2):
            return "Operator Determined Barring"+" ("+esm+")";
        case parseInt("00011010",2):
            return  "Insufficient resources"+" ("+esm+")";
        case parseInt("00011011",2):
            return  "Missing or unknown APN"+" ("+esm+")";
        case parseInt("00011100",2):
            return  "Unknown PDN type"+" ("+esm+")";
        case parseInt("00011101",2):
            return  "User authentication failed"+" ("+esm+")";
        case parseInt("00011110",2):
            return  "Request rejected by Serving GW or PDN GW"+" ("+esm+")";
        case parseInt("00011111",2):
            return  "Request rejected, unspecified"+" ("+esm+")";
        case parseInt("00100000",2):
            return  "Service option not supported"+" ("+esm+")";
        case parseInt("00100001",2):
            return  "Requested service option not subscribed"+" ("+esm+")";
        case parseInt("00100010",2):
            return  "Service option temporally out of order"+" ("+esm+")";
        case parseInt("00100011",2):
            return  "PTI already in use"+" ("+esm+")";
        case parseInt("00100100",2):
            return  "Regular deactivation"+" ("+esm+")";
        case parseInt("00100101",2):
            return  "EPS QoS not accepted"+" ("+esm+")";
        case parseInt("00100110",2):
            return  "Network failure"+" ("+esm+")";
        case parseInt("00100111",2):
            return  "Reactivation requested"+" ("+esm+")";
        case parseInt("00101001",2):
            return  "Semantic error in the TFT operation"+" ("+esm+")";
        case parseInt("00101010",2):
            return  "Syntactical error in the TFT operation"+" ("+esm+")";
        case parseInt("00101011",2):
            return  "Invalid EPS bearer identity"+" ("+esm+")";
        case parseInt("00101100",2):
            return  "Semantic errors in packet filters"+" ("+esm+")";
        case parseInt("00101101",2):
            return  "Syntactical errors in packet filters"+" ("+esm+")";
        case parseInt("00101110",2):
            return  "Unused, protocol error, unspecified"+" ("+esm+")";
        case parseInt("00101111",2):
            return  "PTI mismatch"+" ("+esm+")";
        case parseInt("00110001",2):
            return  "Last PDN disconnection not allowed"+" ("+esm+")";
        case parseInt("00110010",2):
            return  "PDN type IPv4 only allowed"+" ("+esm+")";
        case parseInt("00110011",2):
            return  "PDN type IPv6 only allowed"+" ("+esm+")";
        case parseInt("00111001",2):
            return  "PDN type IPv4v6 only allowed"+" ("+esm+")";
        case parseInt("00111010",2):
            return  "PDN type non IP only allowed"+" ("+esm+")";
        case parseInt("00110100",2):
            return  "Single address bearers only allowed"+" ("+esm+")";
        case parseInt("00110101",2):
            return  "ESM information not received"+" ("+esm+")";
        case parseInt("00110110",2):
            return  "PDN connection does not exist"+" ("+esm+")";
        case parseInt("00110111",2):
            return  "Multiple PDN connections for a given APN not allowed"+" ("+esm+")";
        case parseInt("00111000",2):
            return  "Collision with network initiated request"+" ("+esm+")";
        case parseInt("00111011",2):
            return  "Unsupported QCI value"+" ("+esm+")";
        case parseInt("00111100",2):
            return  "Bearer handling not supported"+" ("+esm+")";
        case parseInt("01000001",2):
            return  "Maximum number of EPS bearers reached"+" ("+esm+")";
        case parseInt("01000010",2):
            return  "Requested APN not supported in current RAT and PLMN combination"+" ("+esm+")";
        case parseInt("01010001",2):
            return  "Invalid PTI value"+" ("+esm+")";
        case parseInt("01011111",2):
            return  "Semantically incorrect message"+" ("+esm+")";
        case parseInt("01100000",2):
            return  "Invalid mandatory information"+" ("+esm+")";
        case parseInt("01100001",2):
            return  "Message type non-existent or not implemented"+" ("+esm+")";
        case parseInt("01100010",2):
            return  "Message type not compatible with the protocol state"+" ("+esm+")";
        case parseInt("01100011",2):
            return  "Information element non-existent or not implemented"+" ("+esm+")";
        case parseInt("01100100",2):
            return  "Conditional IE error"+" ("+esm+")";
        case parseInt("01100101",2):
            return  "Message not compatible with the protocol state"+" ("+esm+")";
        case parseInt("01101111",2):
            return  "Protocol error, unspecified"+" ("+esm+")";
        case parseInt("01110000",2):
            return  "APN restriction value incompatible with active EPS bearer context"+" ("+esm+")";
        case parseInt("01110001",2):
            return  "Multiple accesses to a PDN connection not allowed"+" ("+esm+")";
        default:
            return "esm unknown value"+" ("+esm+")";
    }

}

function NB_EMM_reason(emm){

    switch (emm) {
        case 0:
            return "-";
        case 255:
            return "-";
        case parseInt("00000010",2):
            return "IMSI unknown in HSS"+" ("+emm+")";
        case parseInt("00000011",2):
            return "Illegal UE"+" ("+emm+")";
        case parseInt("00000101",2):
            return "IMEI not accepted"+" ("+emm+")";
        case parseInt("00000110",2):
            return "Illegal ME"+" ("+emm+")";
        case parseInt("00000111",2):
            return "EPS services not allowed"+" ("+emm+")";
        case parseInt("00001000",2):
            return "EPS services and non-EPS services not allowed"+" ("+emm+")";
        case parseInt("00001001",2):
            return "UE identity cannot be derived by the network"+" ("+emm+")";
        case parseInt("00001010",2):
            return "Implicitly detached"+" ("+emm+")";
        case parseInt("00001011",2):
            return "PLMN not allowed"+" ("+emm+")";
        case parseInt("00001100",2):
            return "Tracking Area not allowed"+" ("+emm+")";
        case parseInt("00001101",2):
            return "Romaing not allowed in this Tracking Area"+" ("+emm+")";
        case parseInt("00001110",2):
            return "EPS services not allowed in this tracking area"+" ("+emm+")";
        case parseInt("00001111",2):
            return "No Suitable Cells in tracking area"+" ("+emm+")";
        case parseInt("00010000",2):
            return "MSC temporarily not reachable"+" ("+emm+")";
        case parseInt("00010001",2):
            return "Network failure"+" ("+emm+")";
        case parseInt("00010010",2):
            return "CS domain not available"+" ("+emm+")";
        case parseInt("00010011",2):
            return "ESM failure"+" ("+emm+")";
        case parseInt("00010100",2):
            return "MAC failure"+" ("+emm+")";
        case parseInt("00010101",2):
            return "Synch failure"+" ("+emm+")";
        case parseInt("00010110",2):
            return "Congestion"+" ("+emm+")";
        case parseInt("00010111",2):
            return "UE security capabilities mismatch"+" ("+emm+")";
        case parseInt("00011000",2):
            return "Security mode rejected, unspecified"+" ("+emm+")";
        case parseInt("00011001",2):
            return "Not authorized for this CSG"+" ("+emm+")";
        case parseInt("00011010",2):
            return "Non-EPS authentication unacceptable"+" ("+emm+")";
        case parseInt("00100011",2):
            return "Requested service option not authorized in this PLMN"+" ("+emm+")";
        case parseInt("00100111",2):
            return "CS service temporarily not available"+" ("+emm+")";
        case parseInt("00101000",2):
            return "No EPS bearer context activated"+" ("+emm+")";
        case parseInt("00101010",2):
            return "Severe network failure"+" ("+emm+")";
        case parseInt("01011111",2):
            return "Semantically incorrect message"+" ("+emm+")";
        case parseInt("01100000",2):
            return "Invalid mandatory information"+" ("+emm+")";
        case parseInt("01100001",2):
            return "Message type non-existent or not implemented"+" ("+emm+")";
        case parseInt("01100010",2):
            return "Message type not compatible with the protocol state"+" ("+emm+")";
        case parseInt("01100011",2):
            return "Information element non-existent or not implemented"+" ("+emm+")";
        case parseInt("01100100",2):
            return "Conditional IE error"+" ("+emm+")";
        case parseInt("01100101",2):
            return "Message not compatible with the protocol state"+" ("+emm+")";
        case parseInt("01101111",2):
            return "Protocol error, unspecified"+" ("+emm+")";
        default:
            return "EMM unknown"+" ("+emm+")";
    }

}


function NB_UpdateDerivedStatistics() {
    var count = Device.getProperty("device.txCount");
    if (count) {
        var rsrp = Device.getProperty("device.txRsrp") || 0;
        Device.setProperty("platform.avgRsrp", (-1 * rsrp / count).toFixed(2));
        var rsrq = Device.getProperty("device.txRsrq") || 0;
        Device.setProperty("platform.avgRsrq", (-1 * rsrq / count).toFixed(2));
    }
    var rsrpRaw = Device.getProperty("device.rsrp") || 0;
    Device.setProperty("platform.rsrp", rsrpRaw > 97 ? -100 : rsrpRaw - 140);
    var rsrqRaw = Device.getProperty("device.rsrq") || 0;
    Device.setProperty("platform.rsrq", rsrqRaw > 34 ? -10 : (rsrqRaw - 39) / 2.0);

    var awakeSecs = Device.getProperty("device.awakeTime");
    var sleepSecs = Device.getProperty("device.sleepTime");

    if (awakeSecs && sleepSecs) {
        Device.setProperty("platform.sleepRatioPercent", parseFloat((1-(sleepSecs / (awakeSecs+sleepSecs))) * 100).toFixed(2));
    }

    // extract sector and tower id from cell-id
    // maybe used for lookup with online lte cell map services like www.cellmapper.net
    var cellID = Device.getProperty("device.ci");
    if (cellID) {
        var ci = parseInt(cellID,16);
        var towerID =parseInt(ci/256,10);
        Device.setProperty("platform.eNodeB.towerID", towerID);
        var sector = ci & 255
        Device.setProperty("platform.eNodeB.sectorID", sector);
    }
}

// currently also parses the status
function NB_ParseDeviceQuery(input) {
    for (var key in input.d) {
        var v = input.d[key];
        switch (key) {
            case "temperature":
                v = v / 10.0;
                break;
            case "vbat":
                v = v / 1000.0;
                NB_SetBatteryStatus(v)
                continue;
            case "EMM":
                Device.setProperty("device.EMM",NB_EMM_reason(v));
                continue;
            case "EMM_r":
                Device.setProperty("device.EMM_r", NB_EMM_reason(v));
                continue;
            case "ESM":
                Device.setProperty("device.ESM", NB_ESM_reason(v));
                continue;
            case "ESM_r":
                Device.setProperty("device.ESM_r", NB_ESM_reason(v));
                continue;
        }
        Device.setProperty("device." + key, v);
    }
    NB_UpdateDerivedStatistics();
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
            var vbat = d.vbat / 1000.0
            //powerStatus Score:
            NB_SetBatteryStatus(vbat)
        }
        if (d.monitor) {
            Device.setProperty("debug.monitor", d.monitor);
        }
        if (d.temperature) {
            Device.setProperty("device.temperature", d.temperature / 10.0);
        }

        if(d.hFree && d.hAlloc){
            Device.setProperty("platform.device.heapAllocs", d.hAlloc-d.hFree);
        }
    }
}

function NB_ExtractEnvData(input) {
    if (input.d) {
        var d = input.d;
        if (d.vbat) {
            var vbat = d.vbat / 1000.0
            //powerStatus Score:
            NB_SetBatteryStatus(vbat)
        }
        if (d.envType) {
            Device.setProperty("device.addon.envType", d.envType);
        }
        if (d.envTemp) {
            Device.setProperty("device.addon.envTemp", d.envTemp / 1000.0);
        }
        if (d.envHumidity) {
            Device.setProperty("device.addon.envHumidity", d.envHumidity / 1000.0);
        }
        if (d.envCo2) {
            Device.setProperty("device.addon.envCo2", d.envCo2);
        }
        if (d.envPressure) {
            Device.setProperty("device.addon.envPressure", d.envPressure);
        }
        if (d.envError) {
            Device.setProperty("device.addon.envError", true);
        }else{
            Device.setProperty("device.addon.envError", false);
        }
    }

    /*
    var data = {
      "c02": 400
    }*/
    return null;
}

function NB_ExtractMainWmbusValue(wmbus) {

    // DWZ Lorenz GmbH Aufputzwasserzähler
    // Zählerplatform Artikelnummer: LZ-S-OMS-2020
    // Verbaut in TR Test Liegenschaft
    if (wmbus.MFieldCodeString === "DWZ"
        && wmbus.DeviceString === "Water") {
        if (wmbus.Body && wmbus.Body.DataRecords) {

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if (wmbus.Body.DataRecords[i].VifQuantity === "Volume"
                    && wmbus.Body.DataRecords[i].DifFunctionString === "Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit) {
                    return wmbus.Body.DataRecords[i].ValueString + " " + wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    // Zenner
    if (wmbus.MFieldCodeString === "ZRI"
        && wmbus.DeviceString === "Radio converter (meter side)") {
        if (wmbus.Body && wmbus.Body.DataRecords) {

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if (wmbus.Body.DataRecords[i].VifQuantity === "Volume"
                    && wmbus.Body.DataRecords[i].DifFunctionString === "Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit) {
                    return wmbus.Body.DataRecords[i].ValueString + " " + wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    // Müller HCA
    if (wmbus.MFieldCodeString === "MEH"
        && wmbus.DeviceString === "Heat Cost") {
        if (wmbus.Body && wmbus.Body.DataRecords) {

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if (wmbus.Body.DataRecords[i].VifQuantity === "H.C.A."
                    && wmbus.Body.DataRecords[i].DifFunctionString === "Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit) {
                    return wmbus.Body.DataRecords[i].ValueString + " " + wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    if (wmbus.MFieldCodeString === "REL"
        && wmbus.DeviceString === "Radio converter (meter side)") {
        if (wmbus.Body && wmbus.Body.DataRecords) {

            var len = wmbus.Body.DataRecords.length;
            for (var i = 0; i < len; i++) {
                if (wmbus.Body.DataRecords[i].StorageNo === 0
                    && wmbus.Body.DataRecords[i].DifFunctionString === "Current Value"
                    && wmbus.Body.DataRecords[i].VifUnit) {
                    return wmbus.Body.DataRecords[i].ValueString + " " + wmbus.Body.DataRecords[i].VifUnit;
                }
            }
        }
    }

    // Generic
    if (wmbus.Body && wmbus.Body.DataRecords) {
        var len = wmbus.Body.DataRecords.length;
        for (var i = 0; i < len; i++) {
            if (wmbus.Body.DataRecords[i].StorageNo === 0
                && wmbus.Body.DataRecords[i].VifQuantity !== "Time & Date"
                && wmbus.Body.DataRecords[i].VifQuantity !== "Date"
                && wmbus.Body.DataRecords[i].VifQuantity !== "Averaging Duration"
                && wmbus.Body.DataRecords[i].DifFunctionString === "Current Value"
                && wmbus.Body.DataRecords[i].VifUnit) {
                return wmbus.Body.DataRecords[i].ValueString + " " + wmbus.Body.DataRecords[i].VifUnit;
            }
        }
    }

    return "";
}

function NB_UpdateWmbusMeterStatistics(mbusId) {
    //update received Meters
    var received = Device.getProperty("platform.wmbus.receivedMeters");
    //if (received) {
    //  received = received.slice(1, received.length - 1).split(',');
    //}

    if (!received || received.length === 0) {
        received = [mbusId]
    } else if (received.indexOf(mbusId) >= 0) {
        return;
    } else {

        received = [mbusId].concat(received)
    }

    Device.setProperty("platform.wmbus.receivedMeters", received);
    Device.setProperty("platform.wmbus.receivedMetersCount", received.length);


    var whiteList = Device.getConfig("devFilter");
    if (whiteList && whiteList.length > 0) {
        var expected = whiteList.split(',');
        var missingMeters = expected.filter(function (x) {
            return received.indexOf(x) === -1
        });

        Device.setProperty("platform.wmbus.missingMeters", missingMeters);
        Device.setProperty("platform.wmbus.missingMetersCount", missingMeters.length);
    }
}

function NB_ResetWmbusMetersStatistics() {
    Device.setProperty("platform.wmbus.receivedMeters", []);
    Device.setProperty("platform.wmbus.receivedMetersCount", 0);

    var whiteList = Device.getConfig("devFilter");
    if (whiteList) {
        var expected = whiteList.split(",");
        Device.setProperty("platform.wmbus.expectedMetersCount", expected.length);
        Device.setProperty("platform.wmbus.missingMeters", expected);
        Device.setProperty("platform.wmbus.missingMetersCount", expected.length);
    } else {
        Device.setProperty("platform.wmbus.expectedMetersCount", 0);
        Device.setProperty("platform.wmbus.missingMeters", []);
        Device.setProperty("platform.wmbus.missingMetersCount", 0);
    }
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

    if (!input.d.telegram) {
        return null;
    }

    var oldLastReadout = Device.getProperty("platform.wmbus.lastReadout")
    var newLastReadout = new Date(input.d.timestamp * 1000 || Date.now())
    if (!oldLastReadout || new Date(oldLastReadout) < newLastReadout) {
        Device.setProperty("platform.wmbus.lastReadout", newLastReadout.toISOString());
    }

    var wmbus = Parser.parseWmbus(parseBase64(input.d.telegram));

    if (wmbus && wmbus.IdString) {
        NB_UpdateWmbusMeterStatistics(wmbus.IdString);
    }

    // Decode an incoming message to an object of fields.
    return {
        "mainValue": NB_ExtractMainWmbusValue(wmbus),
        "mbus": wmbus,
        "time": input.d.timestamp * 1000 || 0,
        "rssi": input.d.rssi,
        "gwImei": input.i,
    };
}

function NB_ParseStatusQuery(input) {
    NB_ParseDeviceQuery(input);
    if (input.d && input.d.collected && input.d.telegrams === input.d.uploading) {
        NB_ResetWmbusMetersStatistics();
    }
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
        case "wmbus":
            return NB_ParseDataQuery(input);
        case "status":
            return NB_ParseStatusQuery(input);
        case "diag":
            return null;
        case "env":
            return NB_ExtractEnvData(input);
        case "receives":
        case "sync-config":
            return null; // todo
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

function int40_BE(bytes, idx) {
    return signed(uint40_BE(bytes, idx), 40);
}

function int16_BE(bytes, idx) {
    return signed(uint16_BE(bytes, idx), 16);
}


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
    var lastFcnt = Device.getProperty("status.fcnt")
    var errInSplit = Device.getProperty("lorawan.errInSplit")

    Device.setProperty("status.SF", input.spreadingFactor);
    Device.setProperty("status.RSSI", input.rssi);
    Device.setProperty("status.fcnt", input.fCnt);

    if (port == 11) {
        Device.setProperty("lorawan.errInSplit", false);
        Parser.clearPartial("wmbus");
        var wmbus = Parser.parseWmbus(bytes);
        decoded = {};
        decoded.mbus = wmbus;
    } else if (port >= 12 && port <= 99) {
        var part = Math.floor(port / 10);
        var total = port % 10;
        //decoded.part = part;
        //decoded.total = total;
        if (part == 1) {
            Device.setProperty("lorawan.errInSplit", false);
            Parser.clearPartial("wmbus");
            Parser.joinPartial(bytes, "wmbus");
        } else if (part < total) {
            if (input.fCnt - lastFcnt == 1 && !errInSplit) {
                Parser.joinPartial(bytes, "wmbus");
                // return nil to avoid empty entry in device data
                decoded = null;
            } else {
                Device.setProperty("lorawan.errInSplit", true);
                Parser.clearPartial("wmbus");
                // return nil to avoid empty entry in device data
                decoded = null;
            }
        } else if (part == total) {
            if (input.fCnt - lastFcnt == 1 && !errInSplit) {
                decoded = {};
                var joined = Parser.joinPartial(bytes, "wmbus");
                Parser.clearPartial("wmbus");
                var wmbus = Parser.parseWmbus(joined);
                decoded.mbus = wmbus;
            } else {
                Device.setProperty("lorawan.errInSplit", true);
                Parser.clearPartial("wmbus");
                // return nil to avoid emptry entry in device data
                decoded = null;
            }
        }
    } else if (port == 1) {
        // status
        decoded = LW_Decoder(bytes, port);
        Device.setProperty("lorawan.errInSplit", false);
        Device.setProperty("status.firmware", decoded.FirmwareVersion);
        Device.setProperty("status.voltage", decoded.Vbat);
        // Only show temperature when value is plausible
        if (decoded.Temp > -300) {
            Device.setProperty("status.temperature", decoded.Temp);
        }

        // return nil to avoid empty entry in device data
        decoded = null;
    } else {
        // unknown port or port 0
        // return null to drop avoid empty data entry
        decoded = null;
    }


    return decoded;
}


function Parse(input) {
    if (input.i) {
        //IMEI = nb iot input
        return NB_Parse(input)
    } else if (input.devEUI) {
        //devEUI = lorawan input
        return LW_Parse(input)
    } else {
        throw new Error("Neither NB IoT nor LORWAN Msg detected.");
    }

}