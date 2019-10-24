import { Parser } from 'pratt';
import { UsfmLexer } from './lexer';

function arrify(val) {
  if (val === null || val === undefined) {
    return [];
  }

  return Array.isArray(val) ? val : [val];
}

function single(parser: Parser, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => [{ type }])
    .led(type, bp, (left, t, bp) => left.concat({ type }));
}

function value(parser: Parser, lex: UsfmLexer, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => [{ [type]: parser.parse(bp), type }])
    .led(type, bp, (left, t, bp) => left.concat({ [type]: parser.parse(bp), type }));
}

function content(parser: Parser, lex: UsfmLexer, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => [{ content: parser.parse(bp), type }])
    .led(type, bp, (left, t, bp) => left.concat({ content: parser.parse(bp), type }));
}

function enclosed(
  parser: Parser,
  lex: UsfmLexer,
  bp: number,
  opener: string,
  closer: string = `${opener}*`,
  type: string = opener,
) {
  parser
    .builder()
    .bp(closer, -1)
    .either(opener, bp, (left, t, bp) => {
      const value = parser.parse(bp);
      lex.expect(closer);
      return arrify(left).concat({ type: opener, value });
    });
}

function valueOrEnclosed(
  parser: Parser,
  lex: UsfmLexer,
  bp: number,
  opener: string,
  closer: string = `${opener}*`,
  type: string = opener,
) {
  parser
    .builder()
    .bp(closer, -1)
    .either(opener, bp, (left, t, bp) => {
      const value = parser.parse(bp);
      const next = lex.peek().match

      // If we match the closer, then treat as enclosed marker
      if (next.replace(/^\\/, '').trim() === closer) {
        lex.expect(closer)
        return arrify(left).concat({ type: opener, value: value })
      }

      // Treat as 'value' marker
      if (left) return left.concat({ [type]: parser.parse(bp), type })
    });
}

export class UsfmParser extends Parser {
  start = 0;

  constructor(lex: UsfmLexer) {
    super(lex);
    const builder = this.builder();
    builder.bp('$EOF', -1);
    builder.nud('TEXT', Number.MAX_VALUE, (t, bp) => [t.match.replace(/(^(\r?\n)+|(\r?\n)+$)/g, '')]);
    builder.led('TEXT', Number.MAX_VALUE, (left, t, bp) => left.concat(t.match.replace(/(^(\r?\n)+|(\r?\n)+$)/g, '')));

    // binding power
    // this controls operator precedence;
    // the higher the value, the tighter a token binds to the tokens that follow.
    let BP = 10;

    BP += 10;

    // \c
    // Chapter
    builder.led('c', BP, (left, t, bp) => {
      const num = parseInt(lex.expect('TEXT').match.trim());
      const id = this.start;
      this.start++;
      const content = this.parse(bp);
      return left.concat({ type: 'c', num, id, content });
    });

    BP += 10;

    // \p
    // Paragraph
    builder.either('p', BP, (left, t, bp) => {
      const content = this.parse(bp);
      return arrify(left).concat({ type: 'p', content });
    });

    builder.either('pm', BP, (left, t, bp) => {
      var content = this.parse(bp)
      return arrify(left).concat({ type: 'pm', content })
    })
    builder.either('pi1', BP, (left, t, bp) => {
      var content = this.parse(bp)
      return arrify(left).concat({ type: 'pi1', content })
    })
    builder.either('li1', BP, (left, t, bp) => {
      var content = this.parse(bp)
      return arrify(left).concat({ type: 'li1', content })
    })

    // \nb
    // No-break Paragraph
    builder.either('nb', BP, (left, t, bp) => {
      const content = this.parse(bp);
      return arrify(left).concat({ type: 'nb', content });
    });

    BP += 10;

    // \v #
    // Verse
    builder.either('v', BP, (left, t, bp) => {
      const text = lex.peek().match;
      const num = /^\s*(\d+)\s*/.exec(text);
      lex.lexer.position += num[0].length;
      // Indexes rootID
      const id = this.start;
      this.start++;

      return arrify(left).concat({ type: 'v', num: parseInt(num[1]), id, value: this.parse(bp) });
    });

    BP += 10;

    builder.either('h', BP, (left, t, bp) => {
      const text = lex.peek().match;
      lex.lexer.position += text.length;
      const id = this.start;
      this.start++;
      return arrify(left).concat({ type: 'h', text, id, value: this.parse(bp) });
    });

    // \p [text]
    // Line break
    content(this, lex, BP, 'br');

    // \b
    // Blank line
    single(this, BP, 'b');

    single(this, BP, 'li1');
    single(this, BP, 'li2');
    single(this, BP, 'li3');
    single(this, BP, 'li4');
    single(this, BP, 'm');
    single(this, BP, 'mi');

    // Paragraphs
    single(this, BP, 'pc');
    single(this, BP, 'pmc');
    single(this, BP, 'pmo');
    single(this, BP, 'pmr');
    single(this, BP, 'pi1');
    single(this, BP, 'pi2');
    single(this, BP, 'pi3');

    // \q#
    // Poetic line
    single(this, BP, 'q1');
    single(this, BP, 'q2');
    single(this, BP, 'q3');
    single(this, BP, 'q4');

    // \qm#
    // Embedded text poetic line.
    content(this, lex, BP, 'qm1');
    content(this, lex, BP, 'qm2');

    // \qr
    // Right-aligned poetic line.
    content(this, lex, BP, 'qr');

    // \qc
    // Centered poetic line.
    content(this, lex, BP, 'qc');

    // \qa
    // Acrostic heading.
    content(this, lex, BP, 'qa');

    // \qd
    // Hebrew note.
    content(this, lex, BP, 'qd');

    value(this, lex, BP, 'cl');
    value(this, lex, BP, 'cp');
    value(this, lex, BP, 'd');
    value(this, lex, BP, 'id');
    value(this, lex, BP, 'ide');
    value(this, lex, BP, 'ili');
    value(this, lex, BP, 'ili1');
    value(this, lex, BP, 'ili2');
    value(this, lex, BP, 'im');
    value(this, lex, BP, 'imt1');
    value(this, lex, BP, 'imt2');
    value(this, lex, BP, 'ip');
    value(this, lex, BP, 'ie');
    value(this, lex, BP, 'iex');
    value(this, lex, BP, 'is1');
    value(this, lex, BP, 'ms1');
    value(this, lex, BP, 'rem');

    // \mt#
    // Major title.
    content(this, lex, BP, 'mt1');
    content(this, lex, BP, 'mt2');
    content(this, lex, BP, 'mt3');

    value(this, lex, BP, 'mr');
    value(this, lex, BP, 's1');
    value(this, lex, BP, 's2');
    value(this, lex, BP, 'sp');
    value(this, lex, BP, 'toc1');
    value(this, lex, BP, 'toc2');
    value(this, lex, BP, 'toc3');

    // Tables
    value(this, lex, BP, 'tr');
    value(this, lex, BP, 'tc1');
    value(this, lex, BP, 'tcr2');

    BP += 10;
    enclosed(this, lex, BP, 'add');
    enclosed(this, lex, BP, 'bk');
    enclosed(this, lex, BP, 'f');
    enclosed(this, lex, BP, 'k');
    enclosed(this, lex, BP, 'tl');
    enclosed(this, lex, BP, 'it');
    enclosed(this, lex, BP, 'ord');
    enclosed(this, lex, BP, 'sc');
    enclosed(this, lex, BP, 'bdit');

    // \qs ... \qs*
    enclosed(this, lex, BP, 'qs');

    // Quoted Text
    enclosed(this, lex, BP, 'qt');

    // \qac ... \qac*
    // Acrostic letter within a poetic line
    enclosed(this, lex, BP, 'qac');

    // \wj ... \wj*
    // Words of Jesus
    enclosed(this, lex, BP, 'wj');
    enclosed(this, lex, BP, 'w');
    enclosed(this, lex, BP, 'x');

		BP += 10;

    // \nd ... \nd*
    // Name of God
    enclosed(this, lex, BP, 'nd');

    value(this, lex, BP, 'fl');
    enclosed(this, lex, BP, 'fm');
    value(this, lex, BP, 'fq');
    value(this, lex, BP, 'fr');
    value(this, lex, BP, 'ft');
    value(this, lex, BP, 'fqa');
    enclosed(this, lex, BP, 'fv');
    value(this, lex, BP, 'xo');
    value(this, lex, BP, 'xt');

    BP += 10;
    enclosed(this, lex, BP, '+bk', '+bk*', 'bk');
    enclosed(this, lex, BP, '+add', '+add*', 'add');
    enclosed(this, lex, BP, '+fv', '+fv*', 'fv');
    enclosed(this, lex, BP, '+sc', '+sc*', 'sc');
    enclosed(this, lex, BP, '+bdit', '+bdit*', 'bdit');
    enclosed(this, lex, BP, '+nd', '+nd*', 'nd');
    enclosed(this, lex, BP, '+tl', '+tl*', 'tl');
    enclosed(this, lex, BP, '+wj', '+wj*', 'wj');

    // \+nd ... \+nd*
    // Name of God
    enclosed(this, lex, BP, '+nd', '+nd*', 'nd');
  }
}
