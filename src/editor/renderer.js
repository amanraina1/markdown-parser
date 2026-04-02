export class _Renderer {
  space({ tokens, depth }) {
    return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
  }

  heading({ tokens, depth }) {
    console.log(this);
    return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
  }

  text(token) {
    return "tokens" in token && token.tokens
      ? this.parser.parseInline(token.tokens)
      : "escaped" in token && token.escaped
        ? token.text
        : escapeHtmlEntities(token.text);
  }
}
