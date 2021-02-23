import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { getActiveAno } from "../backend/anoclass";
import * as Ano from "../parser/AnoParser";

// strings are markdown syntax, see https://www.markdownguide.org/basic-syntax/
export function getHover(line:number,char:number):string[]{
  const ano=getActiveAno();
  const token=ano.findToken(line,char);
  if(!token)
    return [];
  const rule=ano.findRule(token.tokenIndex);
  switch(rule?.constructor){
    case Ano.TableContext: return [
      "**table** [name] (column..)* (primary-key..)? (unique-key..)*",
      "`List the database tables used for the tasks`"];
    case Ano.ColumnContext: return [
      "**column** [datatype] [name] (size [posint] (scale [posint])? )?",
      "`Column info for the table, size and scale are used for numerics`"];
    case Ano.TableidContext: return ["*SQL compliant table name* cannot have spaces, equals, lt, gt, etc"];
    case Ano.ColumnidContext: return ["*SQL compliant column name* cannot have spaces, equals, lt, gt, etc"];
    case Ano.PosintContext: return ["*positive integer*"];
    case Ano.NumsizeContext: return ["Column **size** specifies formatting of precision digits"];
    case Ano.ScaleContext: return ["Column **scale** specifies formatting of digits to right of the decimal point"];
    case Ano.DatatypeContext: return ["Column **datatype** are logical types `text, boolean, integer, decimal, date, datetime, time`"];
    default: {
      return [rule?.constructor.name + " " + <string>token.text];
    }
  }
}