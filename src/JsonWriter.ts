import * as fs from 'fs'

export abstract class JsonArrayWriter {

  private isEmpty: boolean = false

  open (): void {
    this.write('[')
  }

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

  protected abstract write (data: string): void
}

export class StdoutJsonArrayWriter extends JsonArrayWriter {
  protected write (data: string): void {
    process.stdout.write(data)
  }
}

export class FileJsonArrayWriter extends JsonArrayWriter {
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