import * as elasticsearch from 'elasticsearch'
import {FileJsonArrayWriter, StdoutJsonArrayWriter} from './JsonWriter'
import {SearchQuery} from './SearchQuery'
import * as yargs from 'yargs'

const args = yargs
  .option('host', {
    required: true,
    type: 'string',
    alias: 'h'
  })
  .option('index', {
    required: true,
    type: 'string',
    alias: 'i'
  })
  .option('body', {
    type: 'string',
    required: true,
    alias: 'b'
  })
  .option('output', {
    type: 'string',
    alias: 'o'
  })
  .option('scroll', {
    type: 'string',
    default: '1m'
  })
  .option('size', {
    type: 'number',
    default: 1000
  })
  .usage('$ elasticsearch-query-to-json -h "$ELASTIC_HOST" -i "$ELASTIC_INDEX" -b "$QUERY"')
  .showHelpOnFail(true)
  .argv;

(async () => {
  const client = new elasticsearch.Client({
    host: args.host
  })

  await client.ping({
    requestTimeout: 1000
  })

  let writer = args.output ? (new FileJsonArrayWriter(args.output)) : (new StdoutJsonArrayWriter())

  const query = new SearchQuery(client, {
    index: args.index,
    scroll: args.scroll,
    size: args.size,
    body: args.body
  })

  writer.open()

  await query.process(((response, progress, total) => {
    writer.writeArray(response.hits.hits)
    process.stderr.write(`Downloading ${progress}/${total} documents\r`)
  }))

  await query.cleanUp()

  writer.close()
})()
