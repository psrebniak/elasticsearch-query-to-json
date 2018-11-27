import * as elasticsearch from 'elasticsearch';
export interface SearchQueryOptions {
    index: string;
    scroll: string;
    size: number;
    body: string;
}
export declare class SearchQuery {
    protected client: elasticsearch.Client;
    protected options: SearchQueryOptions;
    protected scrollIds: string[];
    protected progress: number;
    constructor(client: elasticsearch.Client, options: SearchQueryOptions);
    process(handler: (response: elasticsearch.SearchResponse<any>, progress: number, total: number) => void): Promise<void>;
    cleanUp(): Promise<any>;
}
