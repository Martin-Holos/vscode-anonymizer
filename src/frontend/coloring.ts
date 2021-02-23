import * as vscode from "vscode";
import { colorize, ColorEnum } from "../backend/colorizer";

const colormap = new Map<ColorEnum, string>([
  [ColorEnum.Comment, "#0987cb"],
  [ColorEnum.Table, "yellow"],
  [ColorEnum.Column, "orange"],
  [ColorEnum.Datatype, "Tomato"],
  [ColorEnum.Program, "SlateBlue"],
  [ColorEnum.Keyword1, "blue"],
  [ColorEnum.Keyword2, "green"],
  [ColorEnum.Parameter, "grey"],
  [ColorEnum.Optional, "MediumOrchid"],
  [ColorEnum.Anonymization, "RoyalBlue"],
]);

function wrapNode(line: number, col: number, name: string): vscode.Range {
  const from = new vscode.Position(line - 1, col);
  const to = new vscode.Position(line - 1, col + name.length);
  return new vscode.Range(from, to);
}

export function updateDecorations(editor: vscode.TextEditor) {
  const enumKeys = Object.keys(ColorEnum)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => Number(key));
  const map = new Map<ColorEnum, vscode.Range[]>();
  enumKeys.forEach((i) => map.set(i, []));
  colorize((color: ColorEnum, line: number, col: number, name: string) => {
    map.get(color)?.push(wrapNode(line, col, name));
  });
  enumKeys.forEach((i) => {
    const lab: string = "ano." + ColorEnum[i];
    const col: string = colormap.get(i) ?? "white";
    const options: vscode.DecorationRenderOptions = {
      backgroundColor: { id: lab },
      borderWidth: "1",
      color: col,
    };
    const deko: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType(options);
    editor.setDecorations(deko, <vscode.Range[]>map.get(i));
  });
}
