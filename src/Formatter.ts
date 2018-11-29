export interface Formatter {
  open (): string

  formatEntry (data: any): string

  close (): string
}

export class JsonFormatter implements Formatter {

  protected hasPreviousItem: boolean = false

  open (): string {
    return '[\n'
  }

  formatEntry = (data: any): string => {
    const json = JSON.stringify(data)
    if (this.hasPreviousItem) {
      return ',\n' + json
    }
    this.hasPreviousItem = true
    return json
  }

  close (): string {
    return '\n]'
  }
}

export class JsonPerEntryFormatter implements Formatter {
  open (): string {
    return ''
  }

  formatEntry (data: any): string {
    return JSON.stringify(data) + '\n'
  }

  close (): string {
    return ''
  }
}

export const FormatterFactory = (formatter: 'json' | 'jsonPerRow') => {
  switch (formatter) {
    case 'json': {
      return new JsonFormatter()
    }
    case 'jsonPerRow': {
      return new JsonPerEntryFormatter()
    }
  }
  throw new Error(`Unsupported formatter ${String(formatter)} exception`)
}
