import { SnippetsProvider } from './Snippets/SnippetsProvider';
import { TodoList } from './Todo/TodoList';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { TreeViewProvider } from './TreeViewProvider';
import { createWebView, createTodoWebView, getHtmlByName, getTitleByName, createSnippetsWebView } from './WebView';
import { TodoDataProvider } from './Todo/TodosDataProvider';
import { TODO } from './Todo/todo'
import { DateiFileSystemProvider } from './DateiFileSystemProvider';
import * as path from 'path';
import { debug } from 'console';
// import { createPreviewReact, previewReact } from './preview/PreviewReact';
export function activate(context: vscode.ExtensionContext) {
	// let snippetRoot = context.extensionPath;
	const snippetsProvider = new SnippetsProvider();


	vscode.window.registerTreeDataProvider(
		'Chaos.views.snippets',
		snippetsProvider
	);

	let snippetsPanel: vscode.WebviewPanel;
	addEvent("Chaos.snippets.showCommonSnippetsList", snippetsJson => {
		if (!snippetsPanel) {
			snippetsPanel = createSnippetsWebView(context, 'commonSnippetsList', snippetsJson);
		} else {
			snippetsPanel.title = getTitleByName("commonSnippetsList")
			snippetsPanel.webview.html = getHtmlByName(context, "commonSnippetsList", snippetsJson);
		}

		snippetsPanel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'saveSnippets':
						console.log("保存代码片段")
						snippetsProvider.updateSnippetJson(JSON.parse(message.snippets), "custom")
						break;
				}
			},
			undefined,
			context.subscriptions
		);
		snippetsPanel.onDidDispose(
			() => {
				//@ts-ignore
				snippetsPanel = undefined
			},
			null,
			context.subscriptions
		);
	})

	addEvent("Chaos.snippets.showCustomSnippetsList", snippetsJson => {
		if (!snippetsPanel) {
			snippetsPanel = createSnippetsWebView(context, 'customSnippetsList', snippetsJson);
		} else {
			snippetsPanel.title = getTitleByName("customSnippetsList")
			snippetsPanel.webview.html = getHtmlByName(context, "customSnippetsList", snippetsJson);
		}

		snippetsPanel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'getSnippets':
						console.log("获取代码片段", message.type)
						let root = process.env.APPDATA + "\\Code\\User\\snippets";
						let _path = ""
						if (message.type == "custom") {
							_path = path.join(root, 'chaos_custom.code-snippets');
						} else if (message.type == "common") {
							_path = path.join(root, 'chaos_common.code-snippets');
						}
						let snipptes = fs.readFileSync(_path, 'utf-8');
						let _snipptes = JSON.parse(snipptes);
						snippetsPanel.webview.postMessage({ command: "getSnippets", success: true, data: _snipptes });
						break
					case 'saveSnippets':
						console.log(message)
						console.log("保存代码片段")
						snippetsProvider.updateSnippetJson(JSON.parse(message.snippets), "custom")
						break;
					case 'deleteSnippet':
						console.log("删除对应代码片段")
						snippetsProvider.updateSnippetJson(JSON.parse(message.snippets), "custom")
						break;
				}
			},
			undefined,
			context.subscriptions
		);
		snippetsPanel.onDidDispose(
			() => {
				//@ts-ignore
				snippetsPanel = undefined
			},
			null,
			context.subscriptions
		);
	})




	// let previewPanel: vscode.WebviewPanel;
	// addEvent('Chaos.preview', (e) => {
	// 	console.log("预览", e.fsPath)
	// 	try {
	// 		if (!previewPanel) {
	// 			// 创建预览webview
	// 			previewPanel = createPreviewReact(context, e.fsPath)
	// 		} else {
	// 			// 更改预览webview
	// 			previewPanel.webview.html = previewReact(context, e.fsPath);
	// 		}
	// 	} catch (e) {
	// 		console.log(e)
	// 	}

	// })


	//https://www.zcool.com.cn/work/ZMzIzMjA5MzY=.html
	// let todoRoot = context.extensionPath;
	// console.log("插件路径：", todoRoot);
	// const todoDataProvider = new TodoDataProvider(todoRoot);
	// vscode.window.registerTreeDataProvider(
	// 	'Chaos.views.todos',
	// 	todoDataProvider
	// );

	// vscode.window.createTreeView('Chaos.views.todos', {
	// 	treeDataProvider: todoDataProvider
	// });

	// let todoPanel: vscode.WebviewPanel;

	// let todoDetailPanel: vscode.WebviewPanel;
	// addEvent('Chaos.todos.showTodoList', (todoJson) => {
	// 	if (!todoPanel) {
	// 		todoPanel = createTodoWebView(context, 'todoList', todoJson);
	// 	} else {
	// 		todoPanel.title = getTitleByName('todoList')
	// 		todoPanel.webview.html = getHtmlByName(context, "todoList", todoJson);
	// 	}

	// 	todoPanel.webview.onDidReceiveMessage(
	// 		message => {
	// 			switch (message.command) {
	// 				case 'updateTodoList':
	// 					console.log(message.todoJson)
	// 					todoDataProvider.updateTodoJson(message.todoJson, 'todoList')
	// 					vscode.window.createTreeView('Chaos.views.todos', {
	// 						treeDataProvider: todoDataProvider
	// 					});
	// 					break;
	// 			}
	// 		},
	// 		undefined,
	// 		context.subscriptions
	// 	);
	// 	todoPanel.onDidDispose(
	// 		() => {
	// 			// When the panel is closed, cancel any future updates to the webview content
	// 			//@ts-ignore
	// 			todoPanel = undefined
	// 		},
	// 		null,
	// 		context.subscriptions
	// 	);
	// });

	// addEvent('Chaos.todos.showCompleteList', (todoJson) => {
	// 	if (!todoPanel) {
	// 		todoPanel = createTodoWebView(context, 'completeList', todoJson);
	// 	} else {

	// 		todoPanel.title = getTitleByName('completeList')
	// 		todoPanel.webview.html = getHtmlByName(context, "completeList", todoJson);
	// 	}
	// 	todoPanel.onDidDispose(
	// 		() => {
	// 			// When the panel is closed, cancel any future updates to the webview content
	// 			//@ts-ignore
	// 			todoPanel = undefined
	// 		},
	// 		null,
	// 		context.subscriptions
	// 	);
	// });

	// addEvent('Chaos.todos.showTrash', (todoJson) => {
	// 	if (!todoPanel) {
	// 		todoPanel = createTodoWebView(context, 'trash', todoJson);
	// 	} else {

	// 		todoPanel.title = getTitleByName('trash')
	// 		todoPanel.webview.html = getHtmlByName(context, "trash", todoJson);
	// 	}
	// 	todoPanel.webview.onDidReceiveMessage(
	// 		message => {
	// 			switch (message.command) {
	// 				case 'updateTodoList':
	// 					console.log(message.todoJson)
	// 					todoDataProvider.updateTodoJson(message.todoJson, 'todoList')
	// 					vscode.window.createTreeView('Chaos.views.todos', {
	// 						treeDataProvider: todoDataProvider
	// 					});
	// 					break;
	// 			}
	// 		},
	// 		undefined,
	// 		context.subscriptions
	// 	);
	// 	todoPanel.onDidDispose(
	// 		() => {
	// 			// When the panel is closed, cancel any future updates to the webview content
	// 			//@ts-ignore
	// 			todoPanel = undefined
	// 		},
	// 		null,
	// 		context.subscriptions
	// 	);
	// });

	// addEvent('Chaos.todos.removeItem', (itemInfo) => {
	// 	todoDataProvider.deleteTodo(itemInfo);
	// 	vscode.window.createTreeView('tree.views.todos', {
	// 		treeDataProvider: todoDataProvider
	// 	});
	// });

	// addEvent('Chaos.todos.completeItem', (itemInfo) => {
	// 	todoDataProvider.completeTodo(itemInfo);
	// 	vscode.window.createTreeView('tree.views.todos', {
	// 		treeDataProvider: todoDataProvider
	// 	});
	// });


	// 添加命令
	function addEvent(command: string, callback: (...args: any[]) => any, thisArg?: any) {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

}
export function deactivate() { }


