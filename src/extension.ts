import * as vscode from 'vscode';
import { createWebview } from './utils/createWebview';
import { renderSideBar } from './sideBar/renderSideBar';
import { sideBarClick } from './sideBar/sideBarClick';
import { completion } from './uiComponent/completion';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "fetools" is now active!');

	renderSideBar();
	vscode.commands.registerCommand('edu-tools.handleClickItem', (url, title, isOpenBrowser) => {
        sideBarClick(url, title, isOpenBrowser);
    });

	completion(context);

	context.subscriptions.push(vscode.commands.registerCommand('openPanel', async () => {
        createWebview(context.extensionPath);
    }));

    // context.subscriptions.push(vscode.commands.registerCommand('openCfgPanel', async () => {
    //     // 当前可视窗口
	// 	const { document } = vscode.window.visibleTextEditors[0];
	// 	// 获取可视窗口文件内容
    //     const cfgFile = await document.getText().replace(/\s\s|\n/g, '');
    //     createWebview(context.extensionPath, cfgFile);
    // }));

	let disposable = vscode.commands.registerCommand('fetools.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from FETools!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
