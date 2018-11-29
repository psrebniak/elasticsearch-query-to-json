"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var StdoutWriter = /** @class */ (function () {
    function StdoutWriter() {
    }
    StdoutWriter.prototype.write = function (data) {
        process.stdout.write(data);
    };
    return StdoutWriter;
}());
exports.StdoutWriter = StdoutWriter;
var FileWriter = /** @class */ (function () {
    function FileWriter(file) {
        this.file = file;
        fs.writeFileSync(this.file, '', {
            encoding: 'UTF-8'
        });
    }
    FileWriter.prototype.write = function (data) {
        fs.appendFileSync(this.file, data, {
            encoding: 'UTF-8'
        });
    };
    return FileWriter;
}());
exports.FileWriter = FileWriter;
exports.WriterFactory = function (filename) {
    if (!filename || filename === '-') {
        return new StdoutWriter();
    }
    return new FileWriter(filename);
};
//# sourceMappingURL=Writer.js.map