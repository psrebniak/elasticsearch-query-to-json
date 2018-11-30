"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var elasticsearch = require("elasticsearch");
var yargs = require("yargs");
var Formatter_1 = require("./Formatter");
var SearchQuery_1 = require("./SearchQuery");
var Writer_1 = require("./Writer");
var pkg = require('../package.json');
var args = yargs
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
    .argv;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var client, writer, formatter, query;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new elasticsearch.Client({
                    host: args.host
                });
                return [4 /*yield*/, client.ping({
                        requestTimeout: 1000
                    })];
            case 1:
                _a.sent();
                writer = Writer_1.WriterFactory(args.output);
                formatter = Formatter_1.FormatterFactory(args.format);
                query = new SearchQuery_1.SearchQuery(client, {
                    index: args.index,
                    scroll: args.scroll,
                    size: args.size,
                    body: args.body
                });
                writer.write(formatter.open());
                return [4 /*yield*/, query.process((function (response, progress, total) {
                        writer.write(response.hits.hits.map(function (entry) { return (formatter.formatEntry(args.contentOnly ? entry._source : entry)); }).join(''));
                        process.stderr.write("Downloading " + progress + "/" + total + " documents\r");
                    }))];
            case 2:
                _a.sent();
                return [4 /*yield*/, query.cleanUp()];
            case 3:
                _a.sent();
                writer.write(formatter.close());
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=cli.js.map