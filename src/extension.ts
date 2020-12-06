import * as vscode from 'vscode';
import { TreeViewProvider } from './TreeViewProvider';
import { createWebView } from './WebView';
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('Chaos.helloWorld', () => {
		vscode.window.showInformationMessage('chaos正在运行中');
	}));
    // 实现树视图的初始化
	// TreeViewProvider.initTreeViewItem();
	addEvent('Chaos.todos.addItem',()=>{
		const panel = vscode.window.createWebviewPanel(
			'catCoding', // Identifies the type of the webview. Used internally
			'Cat Coding', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{} // Webview options. More on these later.
		  );

		
		  panel.webview.html = getWebviewContent();
	});

	addEvent('Chaos.openFile', () => {
		let options = {
			canSelectFiles: false,		//是否可选择文件
			canSelectFolders: true,		//是否可选择目录
			canSelectMany: false,		//是否可多选
			defaultUri: vscode.Uri.file("D:/VScode"),	//默认打开的文件夹
			openLabel: '选择文件夹'
		};
		//向用户显示“文件打开”对话框，允许用户选择用于打开目的的文件。
		vscode.window.showOpenDialog(options).then(result => {
			if(result === undefined){
				vscode.window.showInformationMessage("can't open dir.");
			}
			else{
				vscode.window.showInformationMessage("open dir: " + result.toString());
			}
		});
	});

	addEvent('MyTreeItem.itemClick', (label, filePath) => {
		//TODO：可以获取文件内容显示出来，这里暂时只打印入参
		console.log("label : " + label);
		console.log("filePath : " + filePath);
	});

	// 添加命令
	function addEvent(command:string,callback:(...args:any[])=>any,thisArg?:any){
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

	function getWebviewContent() {
		return `<!DOCTYPE html>
	  <html lang="en">
	  <head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Cat Coding</title>
	  </head>
	  <body>
		  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
	  </body>
	  </html>`;
	  }
}
export function deactivate() {}
