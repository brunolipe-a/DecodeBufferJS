interface IReadings {
    transmitter: number;
    batery: string;
    reading: number;
    readed_at: Date;
}
export default class DecodedReadings {
    readonly data: number[];
    private buffers;
    readings: IReadings[];
    constructor({ arrayBuffer }: {
        arrayBuffer: number[];
    });
    cleanArrayBuffer(): void;
    splitArrayBuffer(buffer: number[], max: number): number[][];
    cleanArrayMessage(message: number[]): Uint8Array;
    decodeMessage(message: number[]): void;
}
export {};
