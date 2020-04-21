"use strict";
exports.__esModule = true;
var src_1 = require("./src");
var content = "\n\\c 101\n\\s1 I Will Walk with Integrity\n\\d A Psalm of David.\n\\q1\n\\v 1 \\nd Lord\\nd* will sing of \\x + \\xo 101:1 \\xt [Ex. 34:7]\\x*steadfast love and justice;\n\\q2 to you, \\nd Lord\\nd*, I will make music.\n\\q1\n\\v 2 I will \\x + \\xo 101:2 \\xt [Ps. 4:4] \\x*ponder the way \\x + \\xo 101:2 \\xt Ps. 119:1; Prov. 11:20; [Matt. 5:48] \\x*that is blameless.\n\\q2 Oh when will you \\x + \\xo 101:2 \\xt [Ex. 20:24; John 14:23] \\x*come to me?\n\\q1 I will \\x + \\xo 101:2 \\xt 1 Kgs. 9:4 \\x*walk with \\x + \\xo 101:2 \\xt Ps. 78:72\\x*integrity of heart\n\\q2 within my house;\n\\q1\n\\v 3 I will not set before my eyes\n\\q2 anything \\x + \\xo 101:3 \\xt Deut. 15:9 \\x*that is worthless.\n\\q1 I hate the work \\+nd Lord\\+nd* of those who \\x + \\xo 101:3 \\xt See Ps. 40:4\\x*fall away;\n\\q2 it shall not cling to me.\n\\q1\n\\v 4 \\x + \\xo 101:4 \\xt Prov. 11:20; 17:20 \\x*A perverse heart shall be far from me;\n\\q2 I will \\x + \\xo 101:4 \\xt [1 Cor. 5:11]\\x*know nothing of evil.\n\\b\n\\q1\n\\v 5 Whoever slanders his neighbor \\x + \\xo 101:5 \\xt Ps. 15:3 \\x*secretly\n\\q2 I will \\x + \\xo 101:5 \\xt ver. 8 \\x*destroy.\n\\q1 Whoever has a \\x + \\xo 101:5 \\xt Ps. 18:27; 131:1; Prov. 6:17; 21:4; 30:13 \\x*haughty look and an \\x + \\xo 101:5 \\xt Prov. 16:5\\x*arrogant heart\n\\q2 I will not endure.\n\\b\n\\q1\n\\v 6 I will look with favor on the faithful in the land,\n\\q2 that they may dwell with me;\n\\q1 he who walks in \\x + \\xo 101:6 \\xt Ps. 119:1; Prov. 11:20; [Matt. 5:48]\\x*the way that is blameless\n\\q2 shall minister to me.\n\\b\n\\q1\n\\v 7 No one who \\x + \\xo 101:7 \\xt Ps. 52:2 \\x*practices deceit\n\\q2 shall dwell,in my house;\n\\q1 no one who utters lies\n\\q2 shall \\x + \\xo 101:7 \\xt Ps. 102:28\\x*continue before my eyes.\n\\b\n\\q1\n\\v 8 \\x + \\xo 101:8 \\xt [Ps. 73:14] \\x*Morning by morning I will destroy\n\\q2 all the wicked in the land,\n\\q1 \\x + \\xo 101:8 \\xt Ps. 75:10 \\x*cutting off all \\x + \\xo 101:8 \\xt Ps. 94:4 \\x*the evildoers\n\\q2 from \\x + \\xo 101:8 \\xt Ps. 48:1, 8; [Isa. 52:1]\\x*the city of the \\nd Lord\\nd*.\n\\v 13 \\x + \\xo 58:13 \\xt ch. 56:2; See Neh. 13:15-21 \\x*\u201CIf you turn back your foot from the Sabbath\n\\q2 from doing your pleasure\\f + \\fr 58:13 \\ft Or \\fq business\\f* on my holy day,\n\\q1 and call the Sabbath a delight\n    ";
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.main = function () {
        var usfmLexer = new src_1.UsfmLexer();
        usfmLexer.lexer.source = "\n" + content;
        var usfmParser = new src_1.UsfmStringify(usfmLexer);
        usfmParser.start = 1;
        var result = usfmParser.format();
        console.log(result);
    };
    return Test;
}());
Test.main();
