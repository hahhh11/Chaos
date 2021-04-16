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

export function createSnippetsWebView(context: ExtensionContext, type: string = 'commonSnippetsList', info?: any, title = "代码片段管理") {
    // 上面重点讲解了 createWebviewPanel 传递4个参数
    webviewPanel = window.createWebviewPanel(
        'commonSnippetsList',                          // 标识，随意命名
        title,                              // 面板标题
        ViewColumn.One,                         // 展示在哪个面板上
        {
            retainContextWhenHidden: true,  // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
            enableScripts: true,             // 下面的 html 页可以使用 Scripts
            localResourceRoots: [Uri.file(context.extensionPath)],// 指定允许加载的本地资源的根目录
        }

    );

    webviewPanel.title = getTitleByName(type)

    webviewPanel.webview.html = getHtmlByName(context, type, info);
    // onDidDispose: 如果关闭该面板，将 webviewPanel 置 undefined
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });

    return webviewPanel;
}


let todoItemId
export function createTodoWebView(context: ExtensionContext, type: string = 'todoList', info?: any, title = "代办项目") {
    // 上面重点讲解了 createWebviewPanel 传递4个参数
    webviewPanel = window.createWebviewPanel(
        'TodoDetail',                          // 标识，随意命名
        title,                              // 面板标题
        ViewColumn.One,                         // 展示在哪个面板上
        {
            retainContextWhenHidden: true,  // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
            enableScripts: true,             // 下面的 html 页可以使用 Scripts
            localResourceRoots: [Uri.file(context.extensionPath)],// 指定允许加载的本地资源的根目录
        }

    );

    webviewPanel.title = getTitleByName(type)

    webviewPanel.webview.html = getHtmlByName(context, type, info);
    // onDidDispose: 如果关闭该面板，将 webviewPanel 置 undefined
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });

    return webviewPanel;
}

export function getTitleByName(name: string) {
    let title = "待办项目"
    switch (name) {
        case "commonSnippetsList":
            title = "通用代码片段"
            break
        case "customSnippetsList":
            title = "自定义代码片段"
            break
        case "todoList":
            title = "待办项目"
            break
        case "completeList":
            title = "已完成"
            break
        case "trash":
            title = "回收站"
            break
    }
    return title
}

// 这个方法没什么了，就是一个 最简单的嵌入 iframe 的 html 页面
export function getHtmlByName(context: ExtensionContext, name: string, info?: any) {
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    const resourcePath = path.join(context.extensionPath, 'src', 'templetes', name + ".html");
    const dirPath = path.dirname(resourcePath);
    let html = "";
    switch (name) {
        case "snippetsManagement":
            // 代码片段管理
            html = fs.readFileSync(resourcePath).toString();
            // console.log(info)
            if (info) {
                html = html.replace(/"\$snippetsJson"/g, JSON.stringify(info));
            } else {
                html = html.replace(/"\$snippetsJson"/g, JSON.stringify({}));
            }
            break;
        case "commonSnippetsList":
            // 通用代码片段列表
            html = fs.readFileSync(resourcePath).toString();
            // console.log(info)
            if (info) {
                html = html.replace(/"\$snippetsJson"/g, JSON.stringify(info));
            } else {
                html = html.replace(/"\$snippetsJson"/g, JSON.stringify({}));
            }
            break;
        case "customSnippetsList":
            // 自定义代码片段列表
            html = fs.readFileSync(path.join(context.extensionPath, 'src', 'templetes', 'build', "index.html")).toString();
            // html = fs.readFileSync(resourcePath).toString();
            // console.log(info)
            if (info) {
                html = html.replace(/"\$snippetsJson"/g, JSON.stringify(info));
            } else {
                html = html.replace(/"\$snippetsJson"/g, JSON.stringify({}));
            }
            break;
        case "editTodo":
            html = fs.readFileSync(resourcePath).toString();
            if (info) {
                html = html.replace("$itemInfo", JSON.stringify(info));
                // console.log(html)
                html = html.replace("$editTodoValue", info.content);
            } else {

            }
            break;
        case "todoList":
            html = fs.readFileSync(resourcePath).toString();
            console.log(info)
            if (info) {
                html = html.replace(/"\$todoJson"/g, JSON.stringify(info));
            } else {
                html = html.replace(/"\$todoJson"/g, JSON.stringify({ todoList: [], completeList: [], trash: [] }));
            }
            break;
        case "completeList":
            html = fs.readFileSync(resourcePath).toString();
            console.log(info)
            if (info) {
                html = html.replace(/"\$todoJson"/g, JSON.stringify(info));
            } else {
                html = html.replace(/"\$todoJson"/g, JSON.stringify({ todoList: [], completeList: [], trash: [] }));
            }
            break;
        case "trash":
            html = fs.readFileSync(resourcePath).toString();
            console.log(info)
            if (info) {
                html = html.replace(/"\$todoJson"/g, JSON.stringify(info));
            } else {
                html = html.replace(/"\$todoJson"/g, JSON.stringify({ todoList: [], completeList: [], trash: [] }));
            }
            break;
    }
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    // console.log(dirPath);
    console.log(html);
    return html;
}