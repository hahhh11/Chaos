import * as vscode from 'vscode';
import { TreeViewProvider } from './TreeViewProvider';
import { createWebView } from './WebView';
import { TodoDataProvider } from './TodosDataProvider';
import { DateiFileSystemProvider } from './DateiFileSystemProvider';
export function activate(context: vscode.ExtensionContext) {

	vscode.window.registerTreeDataProvider(
		'tree.views.todos',
		new TodoDataProvider(vscode.workspace.rootPath)
	);

	vscode.window.createTreeView('tree.views.todos', {
		treeDataProvider: new TodoDataProvider(vscode.workspace.rootPath)
	});

	
	addEvent('Chaos.todos.addItem',(content)=>{
		const todoDetailPanel = vscode.window.createWebviewPanel("AddTodoItem","新增TODO",vscode.ViewColumn.One,{});
		todoDetailPanel.webview.html = `<html><body><div><textarea></textarea></div></body></html>`;
	});

	addEvent('Chaos.todos.clickItem',(itemInfo)=>{
		const todoDetailPanel = vscode.window.createWebviewPanel("TodoDetail","TODO详情",vscode.ViewColumn.One,{});
		todoDetailPanel.webview.html = `<html><body><div>${itemInfo.content}</div></body></html>`;
		// vscode.window.showTextDocument(itemInfo.label);
	});

	// 添加命令
	function addEvent(command:string,callback:(...args:any[])=>any,thisArg?:any){
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

}
export function deactivate() {}


