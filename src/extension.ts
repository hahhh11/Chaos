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
	
	const todosFilePath = 'D:/todos.json';
	let fsProvider = new DateiFileSystemProvider();
	

	addEvent('Chaos.helloWorld',async ()=>{
		let	hasTodos = await fsProvider.exists(vscode.Uri.file(todosFilePath));
		console.log(hasTodos);
		vscode.window.showInformationMessage(hasTodos.toString());
		if(hasTodos){
			let content = await fsProvider.readFile(vscode.Uri.file(todosFilePath));
			//@ts-ignore
			let json = JSON.parse(content);
			console.log(json);
			// vscode.window.registerTreeDataProvider('tree.views.todos',new TodoDataProvider(content));
		} else {
			let sss = {};
			let buff = string2buffer(JSON.stringify(sss));
			let content2 = await fsProvider.writeFile(vscode.Uri.file(todosFilePath),buff,{create:true,overwrite:true} );
			console.log(content2);
		}
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


	// addEvent('Chaos.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Chaos正在运行中');
	// });
    // 实现树视图的初始化 
	// TreeViewProvider.initTreeViewItem();
	

	// addEvent('Chaos.openFile', () => {
	// 	let options = {
	// 		canSelectFiles: false,		//是否可选择文件
	// 		canSelectFolders: true,		//是否可选择目录
	// 		canSelectMany: false,		//是否可多选
	// 		defaultUri: vscode.Uri.file("D:/VScode"),	//默认打开的文件夹
	// 		openLabel: '选择文件夹'
	// 	};
	// 	//向用户显示“文件打开”对话框，允许用户选择用于打开目的的文件。
	// 	vscode.window.showOpenDialog(options).then(result => {
	// 		if(result === undefined){
	// 			vscode.window.showInformationMessage("can't open dir.");
	// 		}
	// 		else{
	// 			vscode.window.showInformationMessage("open dir: " + result.toString());
	// 		}
	// 	});
	// });


	// 添加命令
	function addEvent(command:string,callback:(...args:any[])=>any,thisArg?:any){
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

	function code2utf8(uni:any) {
		let uni2 = uni.toString(2);
		if (uni < 128) {
			return uni.toString(16);
		} else if (uni < 2048) {
			uni2 = ('00000000000000000' + uni2).slice(-11);
			const s1 =  parseInt("110" + uni2.substring(0, 5), 2);
			const s2 =  parseInt("10" + uni2.substring(5), 2);
			return s1.toString(16) + ',' + s2.toString(16);
		} else {
			uni2 = ('00000000000000000' + uni2).slice(-16);
			const s1 = parseInt('1110' + uni2.substring(0, 4),2 );
			const s2 = parseInt('10' + uni2.substring(4, 10), 2 );
			const s3 = parseInt('10' + uni2.substring(10), 2);
			return s1.toString(16) + ',' + s2.toString(16) + ',' + s3.toString(16);
		}
	}
	
	function string2buffer(str:string) {
		let val = "";
		for (let i = 0; i < str.length; i++) {
			val += ',' + code2utf8(str.charCodeAt(i));
		}
		val += ',00';
		console.log(val);
		if(!val){
			val = "";
		}
		// 将16进制转化为ArrayBuffer
		//@ts-ignore
		return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
			return parseInt(h, 16);
		}));
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


/**
 * 打开字符串文本
 * @param fileContent 
 * @param fileLanguage  常见类型有 xml, python, java, javascript, typescript, c 等
 */
export function openStrInWindow(fileContent: string, fileLanguage: string = 'xml') {
    var option = {
        language: fileLanguage,
        content: fileContent
    };
    vscode.workspace.openTextDocument(option)
        .then(doc => {
            vscode.window.showTextDocument(doc);
        }, err => {
            console.error('Open string in window err,' + err);
        }).then(undefined, err => {
            // 捕获异常，相当于try-catch
            console.error('Open string in window err,' + err);
        });
}
/**
 * 修改在VSCode编辑器中打开的文档内容并且继续展示
 */
export function editOpenedFileInWindow(filePath: string) {
    // 获取 vscode.TextDocument对象
    vscode.workspace.openTextDocument(filePath).then(doc => {
        // 获取 vscode.TextEditor对象
        vscode.window.showTextDocument(doc).then(editor => {
            // 获取 vscode.TextEditorEdit对象， 然后进行字符处理
            editor.edit(editorEdit => {
                // 这里可以做以下操作: 删除, 插入, 替换, 设置换行符
                // 以插入字符串为例: "Hello Word\r\n"
                editorEdit.insert(new vscode.Position(0, 0), "Hello Word\r\n");
            }).then(isSuccess => {
                if (isSuccess) {
                    console.log("Edit successed");
                } else {
                    console.log("Edit failed");
                }
            }, err => {
                console.error("Edit error, " + err);
            });
        });
    }).then(undefined, err => {
        console.error(err);
    });
}
