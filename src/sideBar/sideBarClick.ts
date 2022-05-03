import * as vscode from 'vscode';

export const sideBarClick = (url: string, title: string, isOpenBrowser: boolean) => {
    if (isOpenBrowser) {
        vscode.env.openExternal(vscode.Uri.parse(url));
      } else {
        const panel = vscode.window.createWebviewPanel(
          'webview',
          '',
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            retainContextWhenHidden: true
          }
        );
        panel.title = title;
        panel.webview.html = `<!DOCTYPE html>
          <html lang="en">
            <head>
              <style>
                * { box-sizing: border-box; }
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
              </style>
            </head>
            <body>
              <iframe src='http://127.0.0.1:3000/' style="height:100%; width:100%;background-color: #f8f8f8" frameborder="no" border="0" />
            </body>
          </html>
        `;
      }
}; 
