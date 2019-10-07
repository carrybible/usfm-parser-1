"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var pratt_1 = require("pratt");
function arrify(val) {
    if (val === null || val === undefined) {
        return '';
    }
    return val;
}
function single(parser, bp, type) {
    parser
        .builder()
        .nud(type, bp, function (t, bp) { return ''; })
        .led(type, bp, function (left, t, bp) { return left.concat(''); });
}
function value(parser, lex, bp, type) {
    parser
        .builder()
        .nud(type, bp, function (t, bp) { return parser.parse(bp); })
        .led(type, bp, function (left, t, bp) { return left.concat(parser.parse(bp)); });
}
function content(parser, lex, bp, type) {
    parser
        .builder()
        .nud(type, bp, function (t, bp) { return parser.parse(bp); })
        .led(type, bp, function (left, t, bp) { return left.concat(parser.parse(bp)); });
}
function ignoreEnclosed(parser, lex, bp, opener, closer, type) {
    if (closer === void 0) { closer = opener + "*"; }
    if (type === void 0) { type = opener; }
    parser
        .builder()
        .bp(closer, -1)
        .either(opener, bp, function (left, t, bp) {
        var value = parser.parse(bp);
        lex.expect(closer);
        return arrify(left).concat('');
    });
}
function enclosed(parser, lex, bp, opener, closer, type) {
    if (closer === void 0) { closer = opener + "*"; }
    if (type === void 0) { type = opener; }
    parser
        .builder()
        .bp(closer, -1)
        .either(opener, bp, function (left, t, bp) {
        var value = parser.parse(bp);
        lex.expect(closer);
        return arrify(left).concat(value);
    });
}
var UsfmStringify = /** @class */ (function (_super) {
    __extends(UsfmStringify, _super);
    function UsfmStringify(lex) {
        var _this = _super.call(this, lex) || this;
        _this.start = 0;
        var builder = _this.builder();
        builder.bp('$EOF', -1);
        builder.nud('TEXT', Number.MAX_VALUE, function (t, bp) { return t.match.replace(/(^(\r?\n)+|(\r?\n)+$)/g, ''); });
        builder.led('TEXT', Number.MAX_VALUE, function (left, t, bp) { return left.concat(t.match.replace(/(^(\r?\n)+|(\r?\n)+$)/g, '')); });
        // binding power
        // this controls operator precedence;
        // the higher the value, the tighter a token binds to the tokens that follow.
        var BP = 10;
        BP += 10;
        // \c
        // Chapter
        builder.led('c', BP, function (left, t, bp) {
            var num = parseInt(lex.expect('TEXT').match.trim());
            var id = _this.start;
            _this.start++;
            var content = _this.parse(bp);
            return left.concat(content);
        });
        BP += 10;
        // \p
        // Paragraph
        builder.either('p', BP, function (left, t, bp) {
            var content = _this.parse(bp);
            return arrify(left).concat(content);
        });
        // \nb
        // No-break Paragraph
        builder.either('nb', BP, function (left, t, bp) {
            var content = _this.parse(bp);
            return arrify(left).concat(content);
        });
        BP += 10;
        // \v #
        // Verse
        builder.either('v', BP, function (left, t, bp) {
            var text = lex.peek().match;
            var num = /^\s*(\d+)\s*/.exec(text);
            lex.lexer.position += num[0].length;
            // Indexes rootID
            var id = _this.start;
            _this.start++;
            return arrify(left).concat(_this.parse(bp));
        });
        BP += 10;
        builder.either('h', BP, function (left, t, bp) {
            var text = lex.peek().match;
            lex.lexer.position += text.length;
            var id = _this.start;
            _this.start++;
            return arrify(left).concat(_this.parse(bp));
        });
        // \p [text]
        // Line break
        content(_this, lex, BP, 'br');
        // \b
        // Blank line
        single(_this, BP, 'b');
        single(_this, BP, 'li1');
        single(_this, BP, 'm');
        single(_this, BP, 'mi');
        single(_this, BP, 'pc');
        single(_this, BP, 'pi1');
        // \q#
        // Poetic line
        single(_this, BP, 'q1');
        single(_this, BP, 'q2');
        // \qm#
        // Embedded text poetic line.
        content(_this, lex, BP, 'qm1');
        content(_this, lex, BP, 'qm2');
        // \qr
        // Right-aligned poetic line.
        content(_this, lex, BP, 'qr');
        // \qc
        // Centered poetic line.
        content(_this, lex, BP, 'qc');
        // \qa
        // Acrostic heading.
        content(_this, lex, BP, 'qa');
        // \qd
        // Hebrew note.
        content(_this, lex, BP, 'qd');
        value(_this, lex, BP, 'cl');
        value(_this, lex, BP, 'cp');
        value(_this, lex, BP, 'd');
        value(_this, lex, BP, 'id');
        value(_this, lex, BP, 'ide');
        value(_this, lex, BP, 'ili');
        value(_this, lex, BP, 'ili2');
        value(_this, lex, BP, 'ip');
        value(_this, lex, BP, 'is1');
        value(_this, lex, BP, 'ms1');
        // \mt#
        // Major title.
        content(_this, lex, BP, 'mt1');
        content(_this, lex, BP, 'mt2');
        content(_this, lex, BP, 'mt3');
        value(_this, lex, BP, 's1');
        value(_this, lex, BP, 'sp');
        value(_this, lex, BP, 'toc1');
        value(_this, lex, BP, 'toc2');
        value(_this, lex, BP, 'toc3');
        BP += 10;
        enclosed(_this, lex, BP, 'add');
        ignoreEnclosed(_this, lex, BP, 'bk');
        ignoreEnclosed(_this, lex, BP, 'f');
        enclosed(_this, lex, BP, 'k');
        // \qs ... \qs*
        enclosed(_this, lex, BP, 'qs');
        // \qac ... \qac*
        // Acrostic letter within a poetic line
        enclosed(_this, lex, BP, 'qac');
        enclosed(_this, lex, BP, 'wj');
        ignoreEnclosed(_this, lex, BP, 'x');
        BP += 10;
        ignoreEnclosed(_this, lex, BP, '+bk', '+bk*', 'bk');
        value(_this, lex, BP, 'fl');
        value(_this, lex, BP, 'fq');
        value(_this, lex, BP, 'fr');
        value(_this, lex, BP, 'ft');
        value(_this, lex, BP, 'fqa');
        value(_this, lex, BP, 'xo');
        value(_this, lex, BP, 'xt');
        return _this;
    }
    return UsfmStringify;
}(pratt_1.Parser));
exports.UsfmStringify = UsfmStringify;
