"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonFormatter = /** @class */ (function () {
    function JsonFormatter() {
        var _this = this;
        this.hasPreviousItem = false;
        this.formatEntry = function (data) {
            var json = JSON.stringify(data);
            if (_this.hasPreviousItem) {
                return ',\n' + json;
            }
            _this.hasPreviousItem = true;
            return json;
        };
    }
    JsonFormatter.prototype.open = function () {
        return '[\n';
    };
    JsonFormatter.prototype.close = function () {
        return '\n]';
    };
    return JsonFormatter;
}());
exports.JsonFormatter = JsonFormatter;
var JsonPerEntryFormatter = /** @class */ (function () {
    function JsonPerEntryFormatter() {
    }
    JsonPerEntryFormatter.prototype.open = function () {
        return '';
    };
    JsonPerEntryFormatter.prototype.formatEntry = function (data) {
        return JSON.stringify(data) + '\n';
    };
    JsonPerEntryFormatter.prototype.close = function () {
        return '';
    };
    return JsonPerEntryFormatter;
}());
exports.JsonPerEntryFormatter = JsonPerEntryFormatter;
exports.FormatterFactory = function (formatter) {
    switch (formatter) {
        case 'json': {
            return new JsonFormatter();
        }
        case 'jsonPerRow': {
            return new JsonPerEntryFormatter();
        }
    }
    throw new Error("Unsupported formatter " + String(formatter) + " exception");
};
//# sourceMappingURL=Formatter.js.map