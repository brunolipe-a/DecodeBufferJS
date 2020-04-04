"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HEX_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
exports.formatBatery = function (hex) {
    return (parseInt(hex, 16) / 18).toFixed(2) + "V";
};
// convert an Uint8Array to hex string
exports.arrayToHexString = function (array) {
    var length = array.length;
    var buf = [];
    var index = 0;
    for (var i = 0; i < length; i++) {
        var byte = array[i];
        buf[index++] = HEX_DIGITS[(byte >>> 4) & 0x0F];
        buf[index++] = HEX_DIGITS[byte & 0x0F];
    }
    return buf.join('');
};
exports.hexStringToArray = function (string) {
    var array = [];
    for (var i = 0; i < string.length; i += 2) {
        array.push(parseInt(string.substr(i, 2), 16));
    }
    return new Uint8Array(array);
};
var numberToUint8Array = function (number) {
    var array = new Uint8Array(4);
    array[3] = (number & 0xFF);
    array[2] = ((number >> 8) & 0xFF);
    array[1] = ((number >> 16) & 0xFF);
    array[0] = ((number >> 24) & 0xFF);
    return array;
};
exports.numberToHexString = function (number) {
    return exports.arrayToHexString(numberToUint8Array(number));
};
