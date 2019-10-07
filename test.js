"use strict";
exports.__esModule = true;
var src_1 = require("./src");
var content = "\n\\c 1  \n\\ms1 BOOK 1 \n\\q1\n\\v 1 Blessed is the man who doesn\u2019t walk in the counsel of the wicked, \n\\q2 nor stand on the path of sinners, \n\\q2 nor sit in the seat of scoffers; \n\\q1\n\\v 2 but his delight is in Yahweh\u2019s\f + \fr 1:2  \ft \u201CYahweh\u201D is God\u2019s proper Name, sometimes rendered \u201CLORD\u201D (all caps) in other translations.\f* law. \n\\q2 On his law he meditates day and night. \n\\q1\n\\v 3 He will be like a tree planted by the streams of water, \n\\q2 that produces its fruit in its season, \n\\q2 whose leaf also does not wither. \n\\q2 Whatever he does shall prosper. \n\\q1\n\\v 4 The wicked are not so, \n\\q2 but are like the chaff which the wind drives away. \n\\q1\n\\v 5 Therefore the wicked shall not stand in the judgment, \n\\q2 nor sinners in the congregation of the righteous. \n\\q1\n\\v 6 For Yahweh knows the way of the righteous, \n\\q2 but the way of the wicked shall perish. \n";
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.main = function () {
        var usfmLexer = new src_1.UsfmLexer();
        usfmLexer.lexer.source = "\n" + content;
        var usfmParser = new src_1.UsfmParser(usfmLexer);
        usfmParser.start = 1;
        var result = usfmParser.parse();
        console.log(JSON.stringify(result, null, 2));
    };
    return Test;
}());
Test.main();
