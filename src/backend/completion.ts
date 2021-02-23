import { getActiveAno } from "./anoclass";
import * as Ano from "../parser/AnoParser";

// Completions
export function getCompletion(line: number, char: number, key: string): string[] {
  const list: string[] = [];
  const ano = getActiveAno();
  const node = ano.findToken(line, char);
  const rule = node ? ano.findRule(node.tokenIndex) : null;

  switch (rule?.constructor) {
    case Ano.TableContext:
      list.push("column", "primary-key", "unique-key");
      break;
    case Ano.ColumnContext: {
      const colctx: Ano.ColumnContext = <Ano.ColumnContext>rule;
      const dtctx = colctx.datatype.name;
      if (dtctx == "integer") {
        list.push("size");
      }
      if (dtctx == "decimal") {
        list.push("size","scale");
      }
      break;
    }
    // Dynamically added: text, boolean, integer, decimal, date, datetime, time
    case Ano.DatatypeContext:
      list.push("text", "boolean", "integer", "decimal", "date", "datetime", "time");
      break;
  }
  switch (rule?.parent?.constructor) {
    case Ano.ModelContext:
      list.push("table", "foreign-key", "conversion", "transformation", "distribution", "randomType", "sql", "task");
      break;
  }
  return list;
}
