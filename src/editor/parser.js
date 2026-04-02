import { _Renderer } from "@/editor/renderer.js";
export class _Parser {
  constructor() {
    this.renderer = new _Renderer();
    this.renderer.parser = this;
  }

  static parse(tokens) {
    const parser = new _Parser();
    return parser.parse(tokens);
  }
  static parseInline(tokens) {
    const parser = new _Parser();
    return parser.parseInline(tokens);
  }

  parse(tokens) {
    let out = "";

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      switch (token.type) {
        case "space": {
          out += this.renderer.space(token);
          continue;
        }
        case "heading": {
          out += this.renderer.heading(token);
          continue;
        }

        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          throw new Error(errMsg);
        }
      }
    }

    return out;
  }

  parseInline(tokens, renderer = this.renderer) {
    let out = "";

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      switch (token.type) {
        case "text": {
          out += renderer.text(token);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          throw new Error(errMsg);
        }
      }
    }
    return out;
  }
}
