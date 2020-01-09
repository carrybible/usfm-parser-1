import { UsfmLexer, UsfmParser, UsfmStringify } from './src';

const content = `
\\v 20 As for you, you meant evil against me, but \\x + \\xo 50:20 \\xt ch. 45:5, 7\\x*God meant it for good, to bring it about that many people\\f + \\fr 50:20 \\ft Or \\fq a numerous people\\f* should be kept alive, as they are today. 
\\v 21 So do not fear; \\x + \\xo 50:21 \\xt ch. 45:11; 47:12\\x*I will provide for you and your little ones.” Thus he comforted them and spoke kindly to them.
\\s1 The Death of Joseph
\\
    `;

class Test {
  static main() {
    const usfmLexer = new UsfmLexer();
    usfmLexer.lexer.source = `\n${content}`;
    const usfmParser = new UsfmStringify(usfmLexer);
    usfmParser.start = 1;
    const result = usfmParser.parse();
    console.log(JSON.stringify(result, null, 2));
  }
}

Test.main();
