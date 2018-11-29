export interface Writer {
    write(data: string): void;
}
export declare class StdoutWriter implements Writer {
    write(data: string): void;
}
export declare class FileWriter implements Writer {
    protected file: string;
    constructor(file: string);
    write(data: string): void;
}
export declare const WriterFactory: (filename?: string) => Writer;
