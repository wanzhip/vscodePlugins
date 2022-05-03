import * as vscode from 'vscode';
import { join } from 'path';

import renderHtml from './renderHtml';

export const createWebview = async (extensionPath: any) => {
    const { fileName } = vscode.window.visibleTextEditors[0].document;
    let appkey = '';
    try {
        // todo: 同一工作区打开多项目时的情况
        const rootPath: any = (vscode.workspace.workspaceFolders as any)[0].uri.path;
        const envFile = await vscode.workspace.fs.readFile(vscode.Uri.file(`${rootPath}/.env`));
        const envStr = envFile.toString();
        const startIndex = envStr.indexOf('VUE_APP_NAME=');
        if (startIndex !== -1) {
            for (let i = startIndex + 13; i < envStr.length; i++) {
                if (envStr[i] === '\n') {
                    break;
                } else {
                    appkey = appkey + envStr[i];
                }
            }
        }
    } catch (error) {
        console.log('error', error)
    }
    const panel = vscode.window.createWebviewPanel(
        'FETools',
        'FETools',
        vscode.ViewColumn.Three,
        {
            enableScripts: true,
            enableCommandUris: true,
        },
    );

    // 构造HTML
    const html = renderHtml({
        scripts: [{
            src: panel.webview.asWebviewUri(vscode.Uri.file(
                join(extensionPath, 'fevue3/dist/assets', 'index.js'),
            )),
        }],
        links: [{
            href: panel.webview.asWebviewUri(vscode.Uri.file(
                join(extensionPath, 'fevue3/dist/assets', 'index.css'),
            )),
            rel: 'stylesheet',
        }],
    });

    panel.webview.html = html;
    panel.webview.postMessage({
        cfgObj: {
            fileName,
            appkey,
        },
    });
    // panel.webview.onDidReceiveMessage(messageHandler(panel.webview));
    panel.webview.onDidReceiveMessage((event) => {
        console.log(event, '接收的消息');
    });
}; 