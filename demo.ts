import { UsfmLexer, UsfmParser, UsfmStringify } from './src';

const content = `
\\c 101
\\s1 I Will Walk with Integrity
\\d A Psalm of David.
\\q1
\\v 1 \\nd Lord\\nd* will sing of \\x + \\xo 101:1 \\xt [Ex. 34:7]\\x*steadfast love and justice;
\\q2 to you, \\nd Lord\\nd*, I will make music.
\\q1
\\v 2 I will \\x + \\xo 101:2 \\xt [Ps. 4:4] \\x*ponder the way \\x + \\xo 101:2 \\xt Ps. 119:1; Prov. 11:20; [Matt. 5:48] \\x*that is blameless.
\\q2 Oh when will you \\x + \\xo 101:2 \\xt [Ex. 20:24; John 14:23] \\x*come to me?
\\q1 I will \\x + \\xo 101:2 \\xt 1 Kgs. 9:4 \\x*walk with \\x + \\xo 101:2 \\xt Ps. 78:72\\x*integrity of heart
\\q2 within my house;
\\q1
\\v 3 I will not set before my eyes
\\q2 anything \\x + \\xo 101:3 \\xt Deut. 15:9 \\x*that is worthless.
\\q1 I hate the work \\+nd Lord\\+nd* of those who \\x + \\xo 101:3 \\xt See Ps. 40:4\\x*fall away;
\\q2 it shall not cling to me.
\\q1
\\v 4 \\x + \\xo 101:4 \\xt Prov. 11:20; 17:20 \\x*A perverse heart shall be far from me;
\\q2 I will \\x + \\xo 101:4 \\xt [1 Cor. 5:11]\\x*know nothing of evil.
\\b
\\q1
\\v 5 Whoever slanders his neighbor \\x + \\xo 101:5 \\xt Ps. 15:3 \\x*secretly
\\q2 I will \\x + \\xo 101:5 \\xt ver. 8 \\x*destroy.
\\q1 Whoever has a \\x + \\xo 101:5 \\xt Ps. 18:27; 131:1; Prov. 6:17; 21:4; 30:13 \\x*haughty look and an \\x + \\xo 101:5 \\xt Prov. 16:5\\x*arrogant heart
\\q2 I will not endure.
\\b
\\q1
\\v 6 I will look with favor on the faithful in the land,
\\q2 that they may dwell with me;
\\q1 he who walks in \\x + \\xo 101:6 \\xt Ps. 119:1; Prov. 11:20; [Matt. 5:48]\\x*the way that is blameless
\\q2 shall minister to me.
\\b
\\q1
\\v 7 No one who \\x + \\xo 101:7 \\xt Ps. 52:2 \\x*practices deceit
\\q2 shall dwell,in my house;
\\q1 no one who utters lies
\\q2 shall \\x + \\xo 101:7 \\xt Ps. 102:28\\x*continue before my eyes.
\\b
\\q1
\\v 8 \\x + \\xo 101:8 \\xt [Ps. 73:14] \\x*Morning by morning I will destroy
\\q2 all the wicked in the land,
\\q1 \\x + \\xo 101:8 \\xt Ps. 75:10 \\x*cutting off all \\x + \\xo 101:8 \\xt Ps. 94:4 \\x*the evildoers
\\q2 from \\x + \\xo 101:8 \\xt Ps. 48:1, 8; [Isa. 52:1]\\x*the city of the \\nd Lord\\nd*.
\\v 13 \\x + \\xo 58:13 \\xt ch. 56:2; See Neh. 13:15-21 \\x*“If you turn back your foot from the Sabbath
\\q2 from doing your pleasure\\f + \\fr 58:13 \\ft Or \\fq business\\f* on my holy day,
\\q1 and call the Sabbath a delight
    `;

class Test {
  static main() {
    const usfmLexer = new UsfmLexer();
    usfmLexer.lexer.source = `\n${content}`;
    const usfmParser = new UsfmStringify(usfmLexer);
    usfmParser.start = 1;
    const result = usfmParser.format();
    console.log(result);
  }
}

Test.main();
