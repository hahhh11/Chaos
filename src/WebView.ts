import { ExtensionContext, ViewColumn, WebviewPanel, window, commands, Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TODO } from './Todo/todo';
// 创建一个全局变量，类型为：WebviewPanel 或者 undefined
let webviewPanel: WebviewPanel | undefined;
let webvidwId: string;
// 创建一个可导出的方法,并且带上参数
export function createWebView(
    context: ExtensionContext,      // 上面的代码刚介绍过，可忽略
    viewColumn: ViewColumn,         // 窗口编辑器
    label: string,                   // 传递进来的一个 label 值，就是点击树视图项 showInformationMessage 的值
    ...args: any
) {

    if (webviewPanel === undefined) {

        // 上面重点讲解了 createWebviewPanel 传递4个参数
        webviewPanel = window.createWebviewPanel(
            'webView',                          // 标识，随意命名
            label,                              // 面板标题
            viewColumn,                         // 展示在哪个面板上
            {
                retainContextWhenHidden: true,  // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
                enableScripts: true,             // 下面的 html 页可以使用 Scripts
                localResourceRoots: [Uri.file(context.extensionPath)],// 指定允许加载的本地资源的根目录

            }

        )

        webviewPanel.webview.html = getHtmlByName(context, label);


    } else {

        // 如果面板已经存在，重新设置标题
        webviewPanel.title = label;
        webviewPanel.reveal();  // Webview面板一次只能显示在一列中。如果它已经显示，则此方法将其移动到新列。
    }

    // onDidDispose: 如果关闭该面板，将 webviewPanel 置 undefined
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });

    return webviewPanel;
}

let todoItemId
export function createTodoWebView(context: ExtensionContext, itemInfo?: any) {
    if (webviewPanel === undefined || (itemInfo && itemInfo.id !== webvidwId)) {

        // 上面重点讲解了 createWebviewPanel 传递4个参数
        webviewPanel = window.createWebviewPanel(
            'TodoDetail',                          // 标识，随意命名
            "TODO详情",                              // 面板标题
            ViewColumn.One,                         // 展示在哪个面板上
            {
                retainContextWhenHidden: true,  // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
                enableScripts: true,             // 下面的 html 页可以使用 Scripts
                localResourceRoots: [Uri.file(context.extensionPath)],// 指定允许加载的本地资源的根目录
            }

        )

        webviewPanel.webview.html = getHtmlByName(context, "editTodo", itemInfo);

    } else {

        // 如果面板已经存在，重新设置标题
        // webviewPanel.title = label;
        webviewPanel.reveal();  // Webview面板一次只能显示在一列中。如果它已经显示，则此方法将其移动到新列。
    }

    // onDidDispose: 如果关闭该面板，将 webviewPanel 置 undefined
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });

    return webviewPanel;
}

// 这个方法没什么了，就是一个 最简单的嵌入 iframe 的 html 页面
export function getHtmlByName(context: ExtensionContext, name: string, itemInfo?: any) {
    let html = ""
    switch (name) {
        case "editTodo":
            html = fs.readFileSync(path.join(context.extensionPath, 'src', 'templetes', name + ".html")).toString();
            if (itemInfo) {
                html = html.replace("$itemInfo", JSON.stringify(itemInfo))
                // console.log(html)
                html = html.replace("$editTodoValue", itemInfo.content)
            } else {

            }
            break
    }
    return html;
}