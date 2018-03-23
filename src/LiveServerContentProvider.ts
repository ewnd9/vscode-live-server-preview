import * as vscode from 'vscode';
import { Rc } from './types';

export default class LiveServerContentProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange: vscode.EventEmitter<vscode.Uri>;

  constructor() {
    this._onDidChange = new vscode.EventEmitter<vscode.Uri>();
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }

  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    const rc: Rc = JSON.parse(uri.query);

    return `
      <html>
        <header>
          <style>
            body, html, div {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background-color: #fff;
            }
          </style>
        </header>
        <body>
          <div>
            <iframe src="http://127.0.0.1:${rc.port}" width="100%" height="100%" seamless frameborder=0>
            </iframe>
          </div>
        </body>
      </html>
    `;
  }
}
