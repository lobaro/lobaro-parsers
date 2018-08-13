function Encoder(object, port) {
    // Encode downlink messages sent as
    // object to an array or buffer of bytes.
    var bytes = [];

    string = object["string"] || "";

    for (var i = 0; i < string.length; ++i) {
        bytes.push(string.charCodeAt(i));
    }

    return bytes;
}