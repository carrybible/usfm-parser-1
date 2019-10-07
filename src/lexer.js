"use strict";
exports.__esModule = true;
var lexer_1 = require("perplex/lib/lexer");
var UsfmLexer = /** @class */ (function () {
    function UsfmLexer(s) {
        this.lexer = new lexer_1["default"](s);
        this.lexer
            .token('p', /^\\q\d\s?\n/i)
            .token('TAG', /\\\+?[^p]{1}\w{0,}\*?\s*/i)
            .token('TEXT', /[^\\]+/)
            .token('p', /^\\p\s?\n/i)
            .token('br', /^\\p\s/i)
            .token('po', /^\\po\s?\n/i)
            .token('pr', /^\\pr\s/i)
            .token('p', /^\\pi\d\s?\n/i)
            .token('br', /^\\pi\d\s/i);
    }
    UsfmLexer.prototype._tkn = function (t) {
        if (t.type == 'TAG')
            t.type = t.match.replace(/^\\/, '').trim();
        return t;
    };
    UsfmLexer.prototype.peek = function () {
        return this._tkn(this.lexer.peek());
    };
    UsfmLexer.prototype.next = function () {
        return this._tkn(this.lexer.next());
    };
    UsfmLexer.prototype.expect = function (type) {
        var token = this.lexer.next();
        var surrogateType = token.type == 'TAG' ? token.match.replace(/^\\/, '').trim() : token.type;
        if (surrogateType != type) {
            var start = token.strpos().start;
            throw new Error("Expected " + type + ", got " + surrogateType + " (at " + start.line + ":" + start.column + ")");
        }
        return token;
    };
    return UsfmLexer;
}());
exports.UsfmLexer = UsfmLexer;
