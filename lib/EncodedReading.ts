// @ts-ignore
import Random from 'java-random';
import { numberToHexString, hexStringToArray, arrayToHexString } from './CommunFunctions';
const ENCODE = new Uint8Array([9, 10, 15, 4, 7, 12, 5, 0, 13, 11, 1, 6, 14, 2, 8, 3])

export default class EncodedReading {
  private readonly hexID: string;
  private readonly hexReading: string;
  public message: string;

  constructor({ id, reading }: { id: number, reading: number}){
    this.hexID = numberToHexString(Number(id));
    this.hexReading = numberToHexString(Number(reading));
    this.message = `270F000000000B${this.hexID}0B0202${this.hexReading}`;

    this.encodeMessage();
  }

  encodeMessage() {
    const arrayOfMessage = hexStringToArray(this.message);
    let bytesum = 0;

    for(let k = 0; k < arrayOfMessage.length; k++) {
      bytesum += arrayOfMessage[k];
    }

    const hexbytesum = arrayToHexString(new Uint8Array([bytesum]));
    this.message = `${arrayToHexString(arrayOfMessage)}${hexbytesum}00`;

    const message = hexStringToArray(this.message);
    const length = message.length - 1;
    const encodedArray = new Uint8Array(message.length);
    let startIndex = new Uint8Array([new Random().nextInt()])[0] & 0x0F;
    let encyKey = new Uint8Array([new Random().nextInt()])[0] & 0x0F;

    while (startIndex >= length) startIndex -= length;
    if (startIndex != 0) startIndex++;

    encodedArray[0] = ((encyKey << 4) | startIndex);

    for(let i = 0; i < length; i++) {
      let byteTmp = ((message[i] & 0xF0) | ENCODE[message[i] & 0x0F]);
      byteTmp ^= encyKey;
      encodedArray[startIndex++] = byteTmp;
      encyKey = byteTmp;

      if (startIndex >= length + 1) startIndex = 1;
    }

    this.message = arrayToHexString(encodedArray);
  }

}
