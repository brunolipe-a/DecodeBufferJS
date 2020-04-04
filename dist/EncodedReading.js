"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var java_random_1 = __importDefault(require("java-random"));
var CommunFunctions_1 = require("./CommunFunctions");
var ENCODE = new Uint8Array([9, 10, 15, 4, 7, 12, 5, 0, 13, 11, 1, 6, 14, 2, 8, 3]);
var EncodedReading = /** @class */ (function () {
    function EncodedReading(_a) {
        var id = _a.id, reading = _a.reading;
        this.hexID = CommunFunctions_1.numberToHexString(Number(id));
        this.hexReading = CommunFunctions_1.numberToHexString(Number(reading));
        this.message = "270F000000000B" + this.hexID + "0B0202" + this.hexReading;
        this.encodeMessage();
    }
    EncodedReading.prototype.encodeMessage = function () {
        var arrayOfMessage = CommunFunctions_1.hexStringToArray(this.message);
        var bytesum = 0;
        for (var k = 0; k < arrayOfMessage.length; k++) {
            bytesum += arrayOfMessage[k];
        }
        var hexbytesum = CommunFunctions_1.arrayToHexString(new Uint8Array([bytesum]));
        this.message = "" + CommunFunctions_1.arrayToHexString(arrayOfMessage) + hexbytesum + "00";
        var message = CommunFunctions_1.hexStringToArray(this.message);
        var length = message.length - 1;
        var encodedArray = new Uint8Array(message.length);
        var startIndex = new Uint8Array([new java_random_1.default().nextInt()])[0] & 0x0F;
        var encyKey = new Uint8Array([new java_random_1.default().nextInt()])[0] & 0x0F;
        while (startIndex >= length)
            startIndex -= length;
        if (startIndex != 0)
            startIndex++;
        encodedArray[0] = ((encyKey << 4) | startIndex);
        for (var i = 0; i < length; i++) {
            var byteTmp = ((message[i] & 0xF0) | ENCODE[message[i] & 0x0F]);
            byteTmp ^= encyKey;
            encodedArray[startIndex++] = byteTmp;
            encyKey = byteTmp;
            if (startIndex >= length + 1)
                startIndex = 1;
        }
        this.message = CommunFunctions_1.arrayToHexString(encodedArray);
    };
    return EncodedReading;
}());
exports.default = EncodedReading;
