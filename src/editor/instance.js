import { _Lexer } from "@/editor/lexer.js";
import { _Parser } from "@/editor/parser.js";

export class Editor {
  parse = this.parseMarkdown(true);

  parseMarkdown(blockType) {
    const parse = (src) => {
      const lexer = blockType ? _Lexer.lex : _Lexer.lexInline;
      const parser = blockType ? _Parser.parse : _Parser.parseInline;

      try {
        let tokens = lexer(src);
        let html = parser(tokens);

        // return html;
      } catch (e) {
        throw new Error(e);
      }
    };

    return parse;
  }
}
