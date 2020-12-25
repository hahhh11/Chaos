import { TodoList } from './Todo/TodoList';
import * as vscode from 'vscode';
import { TreeViewProvider } from './TreeViewProvider';
import { createWebView, createTodoWebView, getHtmlByName, getTitleByName } from './WebView';
import { TodoDataProvider } from './Todo/TodosDataProvider';
import { TODO } from './Todo/todo'
import { DateiFileSystemProvider } from './DateiFileSystemProvider';
import * as path from 'path';
import { debug } from 'console';
export function activate(context: vscode.ExtensionContext) {
	//https://www.zcool.com.cn/work/ZMzIzMjA5MzY=.html
	let todoRoot = context.extensionPath;
	console.log("插件路径：", todoRoot);
	const todoDataProvider = new TodoDataProvider(todoRoot);
	vscode.window.registerTreeDataProvider(
		'Chaos.views.todos',
		todoDataProvider
	);

	vscode.window.createTreeView('Chaos.views.todos', {
		treeDataProvider: todoDataProvider
	});

	let todoPanel: vscode.WebviewPanel;

	let todoDetailPanel: vscode.WebviewPanel;
	addEvent('Chaos.todos.showTodoList', (todoJson) => {
		if (!todoPanel) {
			todoPanel = createTodoWebView(context, 'todoList', todoJson);
		} else {
			todoPanel.title = getTitleByName('todoList')
			todoPanel.webview.html = getHtmlByName(context, "todoList", todoJson);
		}

		todoPanel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'updateTodoList':
						console.log(message.todoJson)
						todoDataProvider.updateTodoJson(message.todoJson, 'todoList')
						vscode.window.createTreeView('Chaos.views.todos', {
							treeDataProvider: todoDataProvider
						});
						break;
				}
			},
			undefined,
			context.subscriptions
		);
		todoPanel.onDidDispose(
			() => {
				// When the panel is closed, cancel any future updates to the webview content
				//@ts-ignore
				todoPanel = undefined
			},
			null,
			context.subscriptions
		);
	});

	addEvent('Chaos.todos.showCompleteList', (todoJson) => {
		if (!todoPanel) {
			todoPanel = createTodoWebView(context, 'completeList', todoJson);
		} else {

			todoPanel.title = getTitleByName('completeList')
			todoPanel.webview.html = getHtmlByName(context, "completeList", todoJson);
		}
		todoPanel.onDidDispose(
			() => {
				// When the panel is closed, cancel any future updates to the webview content
				//@ts-ignore
				todoPanel = undefined
			},
			null,
			context.subscriptions
		);
	});

	addEvent('Chaos.todos.showTrash', (todoJson) => {
		if (!todoPanel) {
			todoPanel = createTodoWebView(context, 'trash', todoJson);
		} else {

			todoPanel.title = getTitleByName('trash')
			todoPanel.webview.html = getHtmlByName(context, "trash", todoJson);
		}
		todoPanel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'updateTodoList':
						console.log(message.todoJson)
						todoDataProvider.updateTodoJson(message.todoJson, 'todoList')
						vscode.window.createTreeView('Chaos.views.todos', {
							treeDataProvider: todoDataProvider
						});
						break;
				}
			},
			undefined,
			context.subscriptions
		);
		todoPanel.onDidDispose(
			() => {
				// When the panel is closed, cancel any future updates to the webview content
				//@ts-ignore
				todoPanel = undefined
			},
			null,
			context.subscriptions
		);
	});

	addEvent('Chaos.todos.removeItem', (itemInfo) => {
		todoDataProvider.deleteTodo(itemInfo);
		vscode.window.createTreeView('tree.views.todos', {
			treeDataProvider: todoDataProvider
		});
	});

	addEvent('Chaos.todos.completeItem', (itemInfo) => {
		todoDataProvider.completeTodo(itemInfo);
		vscode.window.createTreeView('tree.views.todos', {
			treeDataProvider: todoDataProvider
		});
	});


	// 添加命令
	function addEvent(command: string, callback: (...args: any[]) => any, thisArg?: any) {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

}
export function deactivate() { }


