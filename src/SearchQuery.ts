import * as elasticsearch from 'elasticsearch'

export interface SearchQueryOptions {
  index: string,
  scroll: string,
  size: number,
  body: string
}

export class SearchQuery {

  protected scrollIds: string[] = []
  protected progress: number = 0

  constructor (protected client: elasticsearch.Client, protected options: SearchQueryOptions) {

  }

  async process (handler: (response: elasticsearch.SearchResponse<any>, progress: number, total: number) => void) {
    let search = await this.client.search({
      index: this.options.index,
      scroll: this.options.scroll,
      size: this.options.size,
      body: this.options.body,
      // filterPath: ['_scroll_id', 'hits.']
    })

    this.progress = search.hits.hits.length
    this.scrollIds.push(search._scroll_id)

    handler(search, this.progress, search.hits.total)

    while (search.hits.total > this.progress) {
      search = await this.client.scroll({
        scrollId: search._scroll_id,
        scroll: this.options.scroll
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