import * as vscode from 'vscode';
import { TreeViewProvider } from './TreeViewProvider';
import { createWebView, createTodoWebView, getHtmlByName } from './WebView';
import { TodoDataProvider } from './Todo/TodosDataProvider';
import { TODO } from './Todo/todo'
import { DateiFileSystemProvider } from './DateiFileSystemProvider';
import * as path from 'path';
export function activate(context: vscode.ExtensionContext) {
	//https://www.zcool.com.cn/work/ZMzIzMjA5MzY=.html
	let todoRoot = context.extensionPath
	console.log("插件路径：", todoRoot)
	const todoDataProvider = new TodoDataProvider(todoRoot)
	vscode.window.registerTreeDataProvider(
		'Chaos.views.todos',
		todoDataProvider
	);

	vscode.window.createTreeView('Chaos.views.todos', {
		treeDataProvider: todoDataProvider
	});

	let todoDetailPanel: vscode.WebviewPanel;
	addEvent('Chaos.todos.addItem', (content) => {

		let itemInfo = new TODO("")
		if (!todoDetailPanel) {
			todoDetailPanel = createTodoWebView(context, itemInfo)
		} else {
			todoDetailPanel.webview.html = getHtmlByName(context, "editTodo", itemInfo);
		}
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
		if (!todoDetailPanel) {
			todoDetailPanel = createTodoWebView(context, itemInfo)
		} else {
			todoDetailPanel.webview.html = getHtmlByName(context, "editTodo", itemInfo);
		}
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

	addEvent('Chaos.todos.removeItem', (itemInfo) => {
		todoDataProvider.deleteTodo(itemInfo)
		vscode.window.createTreeView('tree.views.todos', {
			treeDataProvider: todoDataProvider
		});
	})

	addEvent('Chaos.todos.completeItem', (itemInfo) => {
		todoDataProvider.completeTodo(itemInfo)
		vscode.window.createTreeView('tree.views.todos', {
			treeDataProvider: todoDataProvider
		});
	})

	addEvent('Chaos.todos.mergeItem', (item) => {
		// 合并项
	})



	// 添加命令
	function addEvent(command: string, callback: (...args: any[]) => any, thisArg?: any) {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

}
export function deactivate() { }


