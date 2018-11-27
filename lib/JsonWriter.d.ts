export declare abstract class JsonArrayWriter {
    private isEmpty;
    open(): void;
    writeItem(data: any): void;
    writeArray(data: any[]): void;
    close(): void;
    protected abstract write(data: string): void;
}
export declare class StdoutJsonArrayWriter extends JsonArrayWriter {
    protected write(data: string): void;
}
export declare class FileJsonArrayWriter extends JsonArrayWriter {
    protected file: string;
    constructor(file: string);
    write(data: string): void;
}
