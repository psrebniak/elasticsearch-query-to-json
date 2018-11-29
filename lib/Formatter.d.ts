export interface Formatter {
    open(): string;
    formatEntry(data: any): string;
    close(): string;
}
export declare class JsonFormatter implements Formatter {
    protected hasPreviousItem: boolean;
    open(): string;
    formatEntry: (data: any) => string;
    close(): string;
}
export declare class JsonPerEntryFormatter implements Formatter {
    open(): string;
    formatEntry(data: any): string;
    close(): string;
}
export declare const FormatterFactory: (formatter: "json" | "jsonPerRow") => JsonFormatter | JsonPerEntryFormatter;
