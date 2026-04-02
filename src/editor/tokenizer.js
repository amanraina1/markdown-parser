import { block } from "@/editor/rules.js";
export class _Tokenizer {
  heading(src) {
    const cap = block.normal.heading.exec(src);

    if (cap) {
      let text = cap[2].trim();
      const textTokens = this.lexer.inline(text);

      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: textTokens,
      };
    }
  }
}
