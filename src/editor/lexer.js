import { _Tokenizer } from "@/editor/tokenizer.js";
export class _Lexer {
  constructor() {
    this.tokenizer = new _Tokenizer();
    this.tokenizer.lexer = this;
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.inlineQueue = [];
  }

  static lex(src) {
    const lexer = new _Lexer();
    return lexer.lex(src);
  }

  static lexInline(src) {
    const lexer = new _Lexer();
    return lexer.inlineTokens(src);
  }

  lex(src) {
    this.blockTokens(src, this.tokens);

    for (let i = 0; i < this.inlineQueue.length; i++) {
      const next = this.inlineQueue[i];
      this.inlineTokens(next.src, next.tokens);
    }
    this.inlineQueue = [];

    return this.tokens;
  }

  lexInline() {}

  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }

  blockTokens(src, tokens) {
    while (src) {
      let token;

      //   if ((token = this.tokenizer.space())) {
      //   }

      if ((token = this.tokenizer.heading(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
    }
  }

  inlineTokens(src, tokens) {
    // String with links masked to avoid interference with em and strong
    let maskedSrc = src;
    let match = null;

    // Mask out reflinks
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while (
          (match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) !=
          null
        ) {
          if (
            links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))
          ) {
            maskedSrc =
              maskedSrc.slice(0, match.index) +
              "[" +
              "a".repeat(match[0].length - 2) +
              "]" +
              maskedSrc.slice(
                this.tokenizer.rules.inline.reflinkSearch.lastIndex,
              );
          }
        }
      }
    }

    // Mask out escaped characters
    while (
      (match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) !=
      null
    ) {
      maskedSrc =
        maskedSrc.slice(0, match.index) +
        "++" +
        maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    }

    // Mask out other blocks
    while (
      (match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null
    ) {
      maskedSrc =
        maskedSrc.slice(0, match.index) +
        "[" +
        "a".repeat(match[0].length - 2) +
        "]" +
        maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }

    let keepPrevChar = false;
    let prevChar = "";
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;

      let token;

      // extensions
      if (
        this.options.extensions?.inline?.some((extTokenizer) => {
          if ((token = extTokenizer.call({ lexer: this }, src, tokens))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })
      ) {
        continue;
      }

      // escape
      if ((token = this.tokenizer.escape(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // tag
      if ((token = this.tokenizer.tag(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // link
      if ((token = this.tokenizer.link(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // reflink, nolink
      if ((token = this.tokenizer.reflink(src, this.tokens.links))) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.type === "text" && lastToken?.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // em & strong
      if ((token = this.tokenizer.emStrong(src, maskedSrc, prevChar))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // code
      if ((token = this.tokenizer.codespan(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // br
      if ((token = this.tokenizer.br(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // del (gfm)
      if ((token = this.tokenizer.del(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // autolink
      if ((token = this.tokenizer.autolink(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // url (gfm)
      if (!this.state.inLink && (token = this.tokenizer.url(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // text
      // prevent inlineText consuming extensions by clipping 'src' to extension start
      let cutSrc = src;
      if (this.options.extensions?.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if ((token = this.tokenizer.inlineText(cutSrc))) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          // Track prevChar before string of ____ started
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }

    return tokens;
  }
}
