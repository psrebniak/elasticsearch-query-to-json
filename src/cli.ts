import * as elasticsearch from 'elasticsearch'
import * as yargs from 'yargs'
import {FormatterFactory} from './Formatter'
import {SearchQuery} from './SearchQuery'
import {WriterFactory} from './Writer'

const pkg = require('../package.json')

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
  .option('format', {
    alias: 'f',
    required: true,
    choices: ['json', 'jsonPerRow']
  })
  .option('scroll', {
    type: 'string',
    default: '1m'
  })
  .option('contentOnly', {
    type: 'boolean',
    default: false
  })
  .option('size', {
    type: 'number',
    default: 1000
  })
  .version(pkg.version)
  .showHelpOnFail(true)
  .argv

console.log(args);

(async () => {
  const client = new elasticsearch.Client({
    host: args.host
  })

  await client.ping({
    requestTimeout: 1000
  })

  const writer = WriterFactory(args.output)
  const formatter = FormatterFactory(args.format)

  const query = new SearchQuery(client, {
    index: args.index,
    scroll: args.scroll,
    size: args.size,
    body: args.body
  })

  writer.write(formatter.open())

  await query.process(((response, progress, total) => {
    writer.write(response.hits.hits.map((entry) => (
      formatter.formatEntry(args.contentOnly ? entry._source : entry)
    )).join(''))
    process.stderr.write(`Downloading ${progress}/${total} documents\r`)
  }))

  await query.cleanUp()

  writer.write(formatter.close())
})()
