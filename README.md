# elasticsearch-query-to-json

cli tool to fetch all documents from elasticsearch by query. 

## usage
```$sh
$ elasticsearch-query-to-json -h "$ELASTIC_HOST" -i "$ELASTIC_INDEX" -b "$QUERY"
```

### available options

* `--host`(`-h`) host eg. http://elasticsearch.co:9200
* `--index`(`-i`) index
* `--body`(`-b`) query body - some examples below
* `--scroll` specify how long a consistent view of the index should be maintained for scrolled search - default `1m`
* `--size` - number of hits to return at once - default `1000`

 ## some examples of `--body`
 
 * get all documents from yesterday based on `timestamp` field
 ```
'{"query":{"range":{"timestamp":{"gte":"now-1d/d","lt": "now/d"}}}}'
 ```
 * get all documents with `ip` field equals "127.0.0.1" 
 
 ```
 {"query":{"bool":{"must":[{"match_phrase":{"ip":{"query":"127.0.0.1"}}}]}}}
 ```
 
 
 * [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/_executing_searches.html)