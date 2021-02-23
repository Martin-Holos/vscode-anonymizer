import { Token, ParserRuleContext } from "antlr4ts";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import { AnoListener } from "../parser/AnoListener";
import * as Ano from "../parser/AnoParser";
import { getActiveAno } from "./anoclass";

export enum ColorEnum {
  Comment,
  Table,
  Column,
  Datatype,
  Program,
  Keyword1,
  Keyword2,
  Parameter,
  Optional,
  Anonymization,
}

export function colorize(func: (color: ColorEnum, line: number, col: number, word: string) => void) {
  const ano = getActiveAno();
  const colorizer = new Colorizer(func);
  ParseTreeWalker.DEFAULT.walk(<AnoListener>colorizer, ano.tree);
  colorizer.comments(ano.tokens);
}

class Colorizer implements AnoListener {
  func: (color: ColorEnum, line: number, col: number, word: string) => void;
  constructor(func: (color: ColorEnum, line: number, col: number, word: string) => void) {
    this.func = func;
  }
  colorizeToken(color: ColorEnum, token: Token) {
    this.func(color, token.line, token.charPositionInLine, token.text ?? "");
  }
  colorize(color: ColorEnum, node: ParserRuleContext) {
    this.colorizeToken(color, node.start);
  }
  comments(tokens: Token[]) {
    tokens.filter((t) => t.channel == Token.HIDDEN_CHANNEL).forEach((child) => this.colorizeToken(ColorEnum.Comment, child));
  }
  // Special colors
  enterTableid(ctx: Ano.TableidContext) {
    this.colorize(ColorEnum.Table, ctx);
  }
  enterColumnid(ctx: Ano.ColumnidContext) {
    this.colorize(ColorEnum.Column, ctx);
  }
  enterDatatype(ctx: Ano.DatatypeContext) {
    this.colorize(ColorEnum.Datatype, ctx);
  }

  enterTable(ctx: Ano.TableContext) {
    this.colorize(ColorEnum.Keyword1, ctx);
  }
  enterPk(ctx: Ano.PkContext) {
    this.colorize(ColorEnum.Keyword2, ctx);
  }
  enterUnique(ctx: Ano.UniqueContext) {
    this.colorize(ColorEnum.Keyword2, ctx);
  }
  enterColumn(ctx: Ano.ColumnContext) {
    this.colorize(ColorEnum.Keyword2, ctx);
  }
  enterNumsize(ctx: Ano.NumsizeContext) {
    this.colorize(ColorEnum.Parameter, ctx);
  }
  enterScale(ctx: Ano.ScaleContext) {
    this.colorize(ColorEnum.Parameter, ctx);
  }
  enterFk(ctx: Ano.FkContext) {
    this.colorize(ColorEnum.Keyword1, ctx);
  }
  enterTaskGroup(ctx: Ano.TaskGroupContext) {
    this.colorize(ColorEnum.Keyword1, ctx);
  }
  enterWorkTask(ctx: Ano.WorkTaskContext) {
    this.colorize(ColorEnum.Keyword1, ctx);
  }
  enterAnonymization(ctx: Ano.AnonymizationContext) {
    this.colorize(ColorEnum.Keyword2, ctx);
  }
  enterMask(ctx: Ano.MaskContext) {
    this.colorize(ColorEnum.Anonymization, ctx);
  }
  enterNamespace(ctx: Ano.NamespaceContext) {
    this.colorize(ColorEnum.Program, ctx);
  }
  enterTransformprog(ctx: Ano.TransformprogContext) {
    this.colorize(ColorEnum.Program, ctx);
  }
  enterConvertprog(ctx: Ano.ConvertprogContext) {
    this.colorize(ColorEnum.Program, ctx);
  }
}
