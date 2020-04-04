"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CommunFunctions_1 = require("./CommunFunctions");
var DECODE = new Uint8Array([7, 10, 13, 15, 3, 6, 11, 4, 14, 0, 1, 9, 5, 8, 12, 2]);
// d36 and d22 is a maker that shows the initial of a reading
var firstMarker = 36;
var secondMarker = 22;
var sizeOfMessage = 25;
var DecodedReadings = /** @class */ (function () {
    function DecodedReadings(_a) {
        var e_1, _b;
        var arrayBuffer = _a.arrayBuffer;
        this.data = arrayBuffer;
        this.readings = [];
        this.cleanArrayBuffer();
        try {
            for (var _c = __values(this.buffers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var message = _d.value;
                this.decodeMessage(message);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    // remove unpleasant bytes from pattern of decode from palm
    DecodedReadings.prototype.cleanArrayBuffer = function () {
        var data = this.data;
        while (data[0] !== firstMarker) {
            if (data[0] === secondMarker) {
                data.unshift(firstMarker);
                break;
            }
            data.shift();
        }
        this.buffers = this.splitArrayBuffer(data, sizeOfMessage);
    };
    // split the array into many messages
    DecodedReadings.prototype.splitArrayBuffer = function (buffer, max) {
        var bufferMatrix;
        bufferMatrix = buffer.reduce(function (column, item, index) {
            var line = Math.floor(index / max);
            column[line] = __spread((column[line] || []), [item]);
            return column;
        }, []);
        bufferMatrix = bufferMatrix.filter(function (item) {
            if (item.length === sizeOfMessage) {
                return item;
            }
        });
        return bufferMatrix;
    };
    ;
    // pattern of decode from palm
    DecodedReadings.prototype.cleanArrayMessage = function (message) {
        message.pop();
        message.shift();
        message.shift();
        return new Uint8Array(message);
    };
    // decode the message into reading object
    DecodedReadings.prototype.decodeMessage = function (message) {
        var clearMessage;
        clearMessage = this.cleanArrayMessage(message);
        var decodedArray = new Uint8Array(message.length);
        var startIndex = message[0] & 0x0F;
        var encyKey = ((message[0] & 0xF0) >> 4);
        var byteSum = 0;
        for (var i = 0; i < clearMessage.length; i++) {
            var byteTmp = (message[startIndex] ^ encyKey);
            decodedArray[i] = ((byteTmp & 0xF0) | DECODE[byteTmp & 0x0F]);
            encyKey = message[startIndex];
            if (++startIndex >= message.length)
                startIndex = 1;
        }
        for (var k = 0; k < (message.length - 2); k++) {
            byteSum += decodedArray[k];
        }
        var hexByteSum = CommunFunctions_1.arrayToHexString(new Uint8Array([byteSum]));
        var hexString = CommunFunctions_1.arrayToHexString(decodedArray);
        if (hexByteSum !== hexString.substring(40, 42)) {
            return;
        }
        var reading = {
            transmitter: parseInt(hexString.substring(12, 20), 16),
            batery: CommunFunctions_1.formatBatery(hexString.substring(26, 28)),
            reading: parseInt(hexString.substring(28, 36), 16),
            readed_at: new Date(Date.now())
        };
        this.readings.push(reading);
    };
    return DecodedReadings;
}());
exports.default = DecodedReadings;
