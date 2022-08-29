import * as vscode from 'vscode';
import { createWebview } from './utils/createWebview';
import { renderSideBar } from './sideBar/renderSideBar';
import { sideBarClick } from './sideBar/sideBarClick';
import { completion } from './uiComponent/completion';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "fetools" is now active!');
	vscode.window.showInformationMessage('欢迎使用FETools!');
	renderSideBar();
	vscode.commands.registerCommand('edu-tools.handleClickItem', (url, title, isOpenBrowser) => {
		sideBarClick(url, title, isOpenBrowser);
	});

	completion(context);

	context.subscriptions.push(vscode.commands.registerCommand('openWebview', async () => {
		console.log('执行');
		createWebview(context.extensionPath);
	}));

	// context.subscriptions.push(vscode.commands.registerCommand('openCfgPanel', async () => {
	//     // 当前可视窗口
	// 	const { document } = vscode.window.visibleTextEditors[0];
	// 	// 获取可视窗口文件内容
	//     const cfgFile = await document.getText().replace(/\s\s|\n/g, '');
	//     createWebview(context.extensionPath, cfgFile);
	// }));

	let disposable = vscode.commands.registerCommand('fetools.helloWorld', (edit: vscode.TextEditorEdit) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		const { selections } = editor
		// 选中多个代码时
		if (selections.length > 1) {
			return
		}
		console.log(editor, 'editor');
		const chraterBefore = editor.document.getText(new vscode.Range(new vscode.Position(editor.selection.start.line, 0), new vscode.Position(editor.selection.start.line, editor.selection.end.character)));
		const selectVal = editor.document.getText(editor.selection);
		console.log(chraterBefore, '--');
		console.log(selectVal, '++');
		let space;
		try {
			console.log(chraterBefore.match(/\w/));
			space = (chraterBefore.match(/\w/) as any).index;
		} catch (error) {
			vscode.window.showInformationMessage(JSON.stringify(error));
		}
		

		
		console.log(space, 'space');
		const insertVal = `${' '.repeat(space * Number(editor.options.tabSize))}console.log(${selectVal}, '${selectVal}');\r\n`
		editor.edit(editBuilder => {
			editBuilder.replace(new vscode.Range(editor.selection.start.line + 1, 0, editor.selection.start.line + 1, 0), insertVal)
		})
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('copyline', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		// const start = new vscode.Position(position.line, 0);//当前行开始位置 
		// const range = new vscode.Range(start, position);// 返回一个数组  [{line: '2', charater: '0'}, {line: '2', charater: '10'}]
		// const text = editor.document.getText(range);
		// console.log(text, '当前行文本');
	}));
}

export function deactivate() { }
