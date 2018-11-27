"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var JsonArrayWriter = /** @class */ (function () {
    function JsonArrayWriter() {
        this.isEmpty = false;
    }
    JsonArrayWriter.prototype.open = function () {
        this.write('[');
    };
    JsonArrayWriter.prototype.writeItem = function (data) {
        if (!this.isEmpty) {
            this.write(',');
        }
        this.isEmpty = false;
        this.write(JSON.stringify(data));
    };
    JsonArrayWriter.prototype.writeArray = function (data) {
        this.write(data.map(JSON.stringify).join(','));
    };
    JsonArrayWriter.prototype.close = function () {
        this.write(']');
    };
    return JsonArrayWriter;
}());
exports.JsonArrayWriter = JsonArrayWriter;
var StdoutJsonArrayWriter = /** @class */ (function (_super) {
    __extends(StdoutJsonArrayWriter, _super);
    function StdoutJsonArrayWriter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StdoutJsonArrayWriter.prototype.write = function (data) {
        process.stdout.write(data);
    };
    return StdoutJsonArrayWriter;
}(JsonArrayWriter));
exports.StdoutJsonArrayWriter = StdoutJsonArrayWriter;
var FileJsonArrayWriter = /** @class */ (function (_super) {
    __extends(FileJsonArrayWriter, _super);
    function FileJsonArrayWriter(file) {
        var _this = _super.call(this) || this;
        _this.file = file;
        fs.writeFileSync(_this.file, '', {
            encoding: 'UTF-8'
        });
        return _this;
    }
    FileJsonArrayWriter.prototype.write = function (data) {
        fs.appendFileSync(this.file, data, {
            encoding: 'UTF-8'
        });
    };
    return FileJsonArrayWriter;
}(JsonArrayWriter));
exports.FileJsonArrayWriter = FileJsonArrayWriter;
//# sourceMappingURL=JsonWriter.js.map