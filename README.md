please use elasticdump instead of this package. It's much more powerful and maintained. 

# elasticsearch-query-to-json

cli tool to fetch all documents from elasticsearch by query. 

## usage
```$sh
$ elasticsearch-query-to-json -h "$ELASTIC_HOST" -i "$ELASTIC_INDEX" -b "$QUERY" -o output.json -f jsonPerRow
```

## available options

* `--host`(`-h`) host eg. http://elasticsearch.co:9200
* `--index`(`-i`) index
* `--body`(`-b`) query body - some examples below
* `--output`(`-o`) output file - leave empty to write results to stdout
* `--format`(`-f`) - possible values:['json','jsonPerRow'] - json means single array with elements, jsonPerRow means every record is encoded as json as put into separate line 
* `--scroll` specify how long a consistent view of the index should be maintained for scrolled search - default `1m`
* `--size` - number of hits to return at once - default `1000`
* `--contentOnly` - write only `_source_` field value

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
