import { arrayToHexString, formatBatery } from './CommunFunctions';
const DECODE = new Uint8Array([7, 10, 13, 15, 3, 6, 11, 4, 14, 0, 1, 9, 5, 8, 12, 2]);

// d36 and d22 is a maker that shows the initial of a reading
const firstMarker = 36;
const secondMarker = 22;
const sizeOfMessage = 25;

interface IReadings {
  transmitter: number,
  batery: string,
  reading: number,
  readed_at: Date
}


export default class DecodedReadings {
  readonly data: number[];
  private buffers: number[][];
  public readings: IReadings[];

  constructor({ arrayBuffer }: { arrayBuffer: number[]}) {
    this.data = arrayBuffer;
    this.readings = [];
    this.cleanArrayBuffer();

    for(let message of this.buffers) {
      this.decodeMessage(message);
    }
  }

  // remove unpleasant bytes from pattern of decode from palm
  cleanArrayBuffer() {
    let data = this.data;

    while(data[0] !== firstMarker) {
      if (data[0] === secondMarker) {
        data.unshift(firstMarker);
        break;
      }
      data.shift();
    }

    this.buffers = this.splitArrayBuffer(data, sizeOfMessage);
  }

  // split the array into many messages
  splitArrayBuffer(buffer: number[], max: number) {
    let bufferMatrix: number[][];

    bufferMatrix = buffer.reduce((column: number[][], item, index) => {
      const line = Math.floor(index / max);
      column[line] = [...(column[line] || []), item];
      return column;
    }, []);

    bufferMatrix = bufferMatrix.filter((item) => {
      if (item.length === sizeOfMessage) {
        return item;
      }
    });

    return bufferMatrix
  };

  // pattern of decode from palm
  cleanArrayMessage(message: number[]) {
    message.pop();
    message.shift();
    message.shift();

    return new Uint8Array(message);
  }

  // decode the message into reading object
  decodeMessage(message: number[]) {
    let clearMessage: Uint8Array;

    clearMessage = this.cleanArrayMessage(message);

    const decodedArray = new Uint8Array(message.length);
    let startIndex = message[0] & 0x0F;
    let encyKey = ((message[0] & 0xF0) >> 4);
    let byteSum = 0;

    for(let i = 0; i < clearMessage.length; i++) {
      const byteTmp = (message[startIndex] ^ encyKey);
      decodedArray[i] = ((byteTmp & 0xF0) | DECODE[byteTmp & 0x0F]);
      encyKey = message[startIndex];

      if (++startIndex >= message.length) startIndex = 1;
    }

    for(let k = 0; k < (message.length - 2); k++) {
      byteSum += decodedArray[k];
    }

    const hexByteSum = arrayToHexString(new Uint8Array([byteSum]));
    const hexString = arrayToHexString(decodedArray);

    if (hexByteSum !== hexString.substring(40, 42)) {
      return;
    }

    const reading: IReadings = {
      transmitter: parseInt(hexString.substring(12, 20), 16),
      batery: formatBatery(hexString.substring(26, 28)),
      reading: parseInt(hexString.substring(28, 36), 16),
      readed_at: new Date(Date.now())
    };

    this.readings.push(reading);
  }

}
