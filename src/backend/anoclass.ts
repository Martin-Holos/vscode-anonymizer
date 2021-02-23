import { CharStreams, CommonTokenStream, Token, ParserRuleContext  } from "antlr4ts";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { AnoLexer } from "../parser/AnoLexer";
import * as Ano from "../parser/AnoParser";

export function createAnoHolder(content: string): AnoHolder {
  return new AnoHolderClass(content);
}

export interface AnoHolder {
  tree: Ano.ModelContext;
  tokens: Token[];
  parser: Ano.AnoParser;
  findToken(line: number, char: number): Token | null;
  findRule(tokenIndex: number): ParseTree;
//  process(func: (color: ColorEnum, line: number, col: number, word: string) => void): void;
}

let activeAno: () => AnoHolder;

export function setActiveAno(getter: () => AnoHolder) {
  activeAno = getter;
}

export function getActiveAno() {
  return activeAno();
}

export class AnoHolderClass implements AnoHolder {
  tree: Ano.ModelContext;
  tokens: Token[];
  parser: Ano.AnoParser;
  constructor(content: string) {
    const lexer = new AnoLexer(CharStreams.fromString(content));
    const ch = new CommonTokenStream(lexer);
    this.parser = new Ano.AnoParser(ch);
    this.tree = this.parser.model();
    this.tokens = ch.getTokens();
  }
  findToken(line: number, char: number) {
    return (
      this.tokens.find((t) => {
        return t.line > line || (t.line == line && t.charPositionInLine + (t.text?.length ?? 0) >= char);
      }) ?? null
    );
  }
  traverse(ctx: ParserRuleContext, i: number) {
    const found = ctx.children?.find((ch) => {
      if (ch instanceof ParserRuleContext) {
        const from = ch.start.tokenIndex;
        const to = ch.stop?.tokenIndex ?? from;
        return i >= from && i <= to;
      }
      if (ch instanceof TerminalNode) {
        return ch.symbol.tokenIndex == i;
      }
      return false;
    });
    if (found instanceof TerminalNode) {
      return found;
    }
    if (found instanceof ParserRuleContext) {
      if (found.start.tokenIndex == i) return found;
      return this.traverse(found, i);
    }
    return null;
  }
  findRule(i: number) {
    return this.traverse(this.tree, i);
  }
}
