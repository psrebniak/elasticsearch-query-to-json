import * as elasticsearch from 'elasticsearch'
import * as fs from 'fs'
import * as yargs from 'yargs'

abstract class JsonArrayWriter {

  private isEmpty: boolean = false

  open (): void {
    this.write('[')
  }

  protected abstract write (data: string): void

  writeItem (data: any): void {
    if (!this.isEmpty) {
      this.write(',')
    }
    this.isEmpty = false
    this.write(JSON.stringify(data))
  }

  writeArray (data: any[]): void {
    this.write(data.map(JSON.stringify as any).join(','))
  }

  close (): void {
    this.write(']')
  }
}

class StdoutJsonArrayWriter extends JsonArrayWriter {
  protected write (data: string): void {
    process.stdout.write(data)
  }
}

class FileJsonArrayWriter extends JsonArrayWriter {
  constructor (protected file: string) {
    super()
    fs.writeFileSync(this.file, '', {
      encoding: 'UTF-8'
    })
  }

  write (data: string): void {
    fs.appendFileSync(this.file, data, {
      encoding: 'UTF-8'
    })
  }
}

interface SearchQueryOptions {
  index: string,
  scroll: string,
  size: number,
  body: any
}

class SearchQuery {

  protected scrollIds: string[] = []
  protected progress: number = 0

  constructor (protected client: elasticsearch.Client, protected options: SearchQueryOptions) {

  }

  async process (handler: (response: elasticsearch.SearchResponse<any>, progress: number, total: number) => void) {
    let search = await this.client.search({
      index: args.index,
      scroll: args.scroll,
      size: args.size,
      body: args.query
    })

    this.progress = search.hits.hits.length
    this.scrollIds.push(search._scroll_id)

    handler(search, this.progress, search.hits.total)

    while (search.hits.total > this.progress) {
      search = await this.client.scroll({
        scrollId: search._scroll_id,
        scroll: args.scroll
      })

      this.scrollIds.push(search._scroll_id)
      this.progress += search.hits.hits.length

      handler(search, this.progress, search.hits.total)
    }
  }

  cleanUp () {
    return this.client.clearScroll({
      scrollId: this.scrollIds
    })
  }
}

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
  .option('query', {
    type: 'string',
    required: true,
    alias: 'q'
  })
  .option('output', {
    type: 'string',
    alias: 'o'
  })
  .option('scroll', {
    type: 'string',
    default: '1s',
  })
  .option('size', {
    type: 'number',
    default: 100,
  })
  .usage('elasticsearch-query-to-json -h "$ES_HOST" -i "$ES_INDEX" -q "testQuery"')
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
    body: args.query
  })

  writer.open()

  await query.process(((response, progress, total) => {
    writer.writeArray(response.hits.hits)
    process.stderr.write(`Downloading ${progress}/${total} documents\r`)
  }))

  await query.cleanUp()

  writer.close()
})()
