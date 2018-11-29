import * as fs from 'fs'

export interface Writer {
  write (data: string): void
}

export class StdoutWriter implements Writer {
  write (data: string): void {
    process.stdout.write(data)
  }
}

export class FileWriter implements Writer {
  constructor (protected file: string) {
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

export const WriterFactory = (filename?: string): Writer => {
  if (!filename || filename === '-') {
    return new StdoutWriter()
  }
  return new FileWriter(filename)
}
