import * as vscode from "vscode";
import { getCompletion } from "../backend/completion";

// Completions
export class AnoCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    let text = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));
    let i = text.length;
    for (; i > 0; i--) {
      const ch = text.charAt(i - 1);
      if (!((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || (ch >= "0" && ch <= "9"))) break;
    }
    text = text.substring(i);

    const result = getCompletion(position.line + 1, position.character, text);
    const completions = result.map((x) => new vscode.CompletionItem(x));

    // a completion item that inserts its text as snippet,
    // the `insertText`-property is a `SnippetString` which will be
    // honored by the editor.
    const snippetCompletion = new vscode.CompletionItem("Good part of the day");
    snippetCompletion.insertText = new vscode.SnippetString("Good ${1|morning,afternoon,evening|}. It is ${1}, right?");
    snippetCompletion.documentation = new vscode.MarkdownString(
      "Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting."
    );

    // a completion item that can be accepted by a commit character,
    // the `commitCharacters`-property is set which means that the completion will
    // be inserted and then the character will be typed.
    const commitCharacterCompletion = new vscode.CompletionItem("console");
    commitCharacterCompletion.commitCharacters = ["."];
    commitCharacterCompletion.documentation = new vscode.MarkdownString("Press `.` to get `console.`");

    // a completion item that retriggers IntelliSense when being accepted,
    // the `command`-property is set which the editor will execute after
    // completion has been inserted. Also, the `insertText` is set so that
    // a space is inserted after `new`
    const commandCompletion = new vscode.CompletionItem("new");
    commandCompletion.kind = vscode.CompletionItemKind.Keyword;
    commandCompletion.insertText = "new ";
    commandCompletion.command = {
      command: "editor.action.triggerSuggest",
      title: "Re-trigger completions...",
    };

    // return all completion items as array
    completions.push(snippetCompletion, commitCharacterCompletion, commandCompletion);
    return completions;
  }
}
