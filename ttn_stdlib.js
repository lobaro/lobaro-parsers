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
