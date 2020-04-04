export default class EncodedReading {
    private readonly hexID;
    private readonly hexReading;
    message: string;
    constructor({ id, reading }: {
        id: number;
        reading: number;
    });
    encodeMessage(): void;
}
