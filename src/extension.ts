import * as vscode from 'vscode';
import * as fs from 'fs';
import { TreeViewProvider } from './TreeViewProvider';
import { createWebView } from './WebView';
import { TodoDataProvider } from './TodosDataProvider';
export function activate(context: vscode.ExtensionContext) {
	
	const todosFilePath = './todos.json';
	

	// 绑定视图
	
	addEvent('Chaos.helloWorld',()=>{
		let hasTodos = fs.existsSync(todosFilePath);
		console.log(hasTodos);
		vscode.window.showInformationMessage(hasTodos.toString());
		if(hasTodos){
			let content = fs.readFileSync(todosFilePath);
			console.log(content);
			//@ts-ignore
			let json = JSON.parse(content);
			console.log(json);
			vscode.window.registerTreeDataProvider('tree.views.todos',new TodoDataProvider(content));
		} else {
			let sss = {};
			let content = fs.writeFileSync(todosFilePath,JSON.stringify(sss) );
			console.log(content);
		}
	});

	addEvent('Chaos.todos.addItem',(content)=>{
		console.log(content);
		const todoDetailPanel = vscode.window.createWebviewPanel("TodoDetail","TODO详情",vscode.ViewColumn.One,{});
		todoDetailPanel.webview.html = `<html><body><div>${content}</div></body></html>`;
	});


	// addEvent('Chaos.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Chaos正在运行中');
	// });
    // 实现树视图的初始化 
	// TreeViewProvider.initTreeViewItem();
	

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
		  <iframe src="https://beacon.duiba.com.cn/" width="100%"></iframe>
	  </body>
	  </html>`;
	  }
}
export function deactivate() {}
