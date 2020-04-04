const HEX_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

export const formatBatery = (hex: string) => {
  return `${(parseInt(hex, 16) / 18).toFixed(2)}V`;
};

// convert an Uint8Array to hex string
export const arrayToHexString = (array: Uint8Array) => {
  const length = array.length;
  const buf = [];
  let index = 0;

  for(let i = 0; i < length; i++) {
    const byte = array[i];

    buf[index++] = HEX_DIGITS[(byte >>> 4) & 0x0F];
    buf[index++] = HEX_DIGITS[byte & 0x0F];
  }

  return buf.join('');
};

export const hexStringToArray = (string: string) => {
  const array = [];

  for (let i = 0; i < string.length; i += 2) {
    array.push(parseInt(string.substr(i, 2), 16));
  }

  return new Uint8Array(array);
};

const numberToUint8Array = (number: number) => {
  const array = new Uint8Array(4);

  array[3] = (number & 0xFF);
  array[2] = ((number >> 8) & 0xFF);
  array[1] = ((number >> 16) & 0xFF);
  array[0] = ((number >> 24) & 0xFF);

  return array;
};

export const numberToHexString = (number: number) => {
  return arrayToHexString(numberToUint8Array(number))
};
