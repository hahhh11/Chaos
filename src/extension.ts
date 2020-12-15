import * as vscode from 'vscode';
import { TreeViewProvider } from './TreeViewProvider';
import { createWebView, createTodoWebView } from './WebView';
import { TodoDataProvider, TODO } from './TodosDataProvider';
import { DateiFileSystemProvider } from './DateiFileSystemProvider';
import * as path from 'path';
export function activate(context: vscode.ExtensionContext) {
	let todoRoot = context.extensionPath
	console.log("插件路径：", todoRoot)
	const todoDataProvider = new TodoDataProvider(todoRoot)
	vscode.window.registerTreeDataProvider(
		'tree.views.todos',
		todoDataProvider
	);

	vscode.window.createTreeView('tree.views.todos', {
		treeDataProvider: todoDataProvider
	});

	let a = vscode.window.createWebviewPanel('TodoDetail',                          // 标识，随意命名
		"TODO详情",                              // 面板标题
		vscode.ViewColumn.One)
	a.webview.html = `<iframe width="1000" height="1000" src="http://www.w3cschool.cc"></iframe>`
	addEvent('Chaos.todos.addItem', (content) => {

		let itemInfo = new TODO("")
		const todoDetailPanel = createTodoWebView(context, itemInfo)
		todoDetailPanel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'saveTodoItem':
						console.log(message.itemInfo)
						todoDataProvider.updateTodoJson(message.itemInfo)
						vscode.window.createTreeView('tree.views.todos', {
							treeDataProvider: todoDataProvider
						});
						break;
				}
			},
			undefined,
			context.subscriptions
		);
	});

	addEvent('Chaos.todos.clickItem', (itemInfo) => {
		const todoDetailPanel = createTodoWebView(context, itemInfo)
		todoDetailPanel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'saveTodoItem':
						console.log(message.itemInfo)
						todoDataProvider.updateTodoJson(message.itemInfo)
						vscode.window.createTreeView('tree.views.todos', {
							treeDataProvider: todoDataProvider
						});
						break;
					case 'deleteTODO':
						todoDataProvider.deleteTodo(message.itemInfo)
						vscode.window.createTreeView('tree.views.todos', {
							treeDataProvider: todoDataProvider
						});
						break;
				}
			},
			undefined,
			context.subscriptions
		);
	});

	addEvent('Chaos.todos.mergeItem', (item) => {
		// 合并项
	})



	// 添加命令
	function addEvent(command: string, callback: (...args: any[]) => any, thisArg?: any) {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

}
export function deactivate() { }


