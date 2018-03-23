import * as vscode from 'vscode';
import * as fs from 'fs';

import { Rc } from './types';
import LiveServerContentProvider from './LiveServerContentProvider';

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.registerTextDocumentContentProvider('LiveServerPreview', new LiveServerContentProvider());

  const disposablePreview = vscode.commands.registerTextEditorCommand('extension.liveServerPreview.open', livePreview);
  context.subscriptions.push(disposablePreview);
}

export function deactivate() {
}

function livePreview(textEditor: vscode.TextEditor) {
  const workspacePath = vscode.workspace.rootPath;
  const documentPath = textEditor.document.uri.path.substr(0, textEditor.document.uri.path.lastIndexOf('/'));

  const rootPath = workspacePath ? workspacePath : documentPath;

  const rcFilePath = `${rootPath}/.preview.json`;
  const rc: Rc = {
    port: 8080
  };

  if (fs.existsSync(rcFilePath)) {
    const data = JSON.parse(fs.readFileSync(rcFilePath, 'utf-8'));
    Object.assign(rc, data);
  }

  console.log(rc)

  const relativePath = textEditor.document.uri.path.substr(rootPath.length + 1);

  // see https://code.visualstudio.com/docs/extensionAPI/vscode-api-commands#_links
  const uri = encodeURI(
    `LiveServerPreview://authority/${relativePath}?${JSON.stringify(rc)}`
  );

  const previewUri = vscode.Uri.parse(uri);

  vscode.commands
    .executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two)
    .then(s => console.log('done'), vscode.window.showErrorMessage);
}
