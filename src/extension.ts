import * as vscode from "vscode";
import { createAnoHolder, setActiveAno } from "./backend/anoclass";
import { updateDecorations } from "./frontend/coloring";
import { AnoHoverProvider } from "./frontend/AnoHoverProvider";
import { AnoCompletionItemProvider } from "./frontend/AnoCompletionItemProvider";


const ANO = { language: "ano", scheme: "file" };
//const diagnosticCollection = vscode.languages.createDiagnosticCollection("antlr");
//const DiagnosticTypeMap = new Map<vscode.DiagnosticType, vscode.DiagnosticSeverity>();
const isAnoFile = (document?: vscode.TextDocument | undefined): boolean =>
    document ? (document.languageId === "ano" && document.uri.scheme === "file") : false;

// this method is called when vscode is activated for "ano"
export function activate(context: vscode.ExtensionContext) {
  let timeout: NodeJS.Timer | undefined = undefined;
  let activeEditor = vscode.window.activeTextEditor;

  function triggerUpdateDecorations() {
    if (!isAnoFile(activeEditor?.document)) return;
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(() => {
      if (activeEditor) {
        const ano = createAnoHolder(activeEditor.document.getText());
        setActiveAno(() => ano);
        updateDecorations(activeEditor);
      }
    }, 500);
  }

  if (activeEditor) {
    triggerUpdateDecorations();
  }
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );
  context.subscriptions.push(vscode.languages.registerHoverProvider(ANO, new AnoHoverProvider()));
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(ANO,new AnoCompletionItemProvider()));
}
