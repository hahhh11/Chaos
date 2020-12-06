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
}
export function deactivate() {}
