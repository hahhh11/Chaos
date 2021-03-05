import { ExtensionContext, ViewColumn, WebviewPanel, window, commands, Uri, Extension, debug } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as DOMParser from 'dom-parser';

// 创建一个全局变量，类型为：WebviewPanel 或者 undefined
let webviewPanel: WebviewPanel | undefined;
let webvidwId: string;

export function createPreviewReact(context: ExtensionContext, fsPath: string) {

    let currentFileName = fsPath.split("\\")[fsPath.split("\\").length - 1]
    // 只有jsx可用
    if (currentFileName.indexOf("jsx") < 0) {
        return window.createWebviewPanel('预览', "格式异常", ViewColumn.Two)
    }
    webviewPanel = window.createWebviewPanel(
        '预览',                          // 标识，随意命名
        '预览 - ' + currentFileName,                              // 面板标题
        ViewColumn.One,                         // 展示在哪个面板上
        {
            retainContextWhenHidden: true,  // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
            enableScripts: true,             // 下面的 html 页可以使用 Scripts
            localResourceRoots: [Uri.file(context.extensionPath)],// 指定允许加载的本地资源的根目录
        }

    );

    webviewPanel.webview.html = previewReact(context, fsPath);
    // onDidDispose: 如果关闭该面板，将 webviewPanel 置 undefined
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });

    return webviewPanel;
}

export function previewReact(context: ExtensionContext, fsPath: string) {
    let currentFileName = fsPath.split("\\")[fsPath.split("\\").length - 1]
    let jsx = "";
    let html = ""
    jsx = fs.readFileSync(fsPath).toString();
    // console.log(jsx)
    var parser = new DOMParser();
    var doc = parser.parseFromString(jsx);

    console.log(doc)
    let dom = jsx.split("")

    html =
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <title>${'预览 - ' + currentFileName}</title>
            <script>
                !(function(e, i) {
                    var t = e.documentElement,
                    n = navigator.userAgent.match(/iphone|ipod|ipad/gi),
                    a = n ? Math.min(i.devicePixelRatio, 3) : 1,
                    m = 'orientationchange' in window ? 'orientationchange' : 'resize';
                    t.dataset.dpr = a;
                    for (
                    var d, l, c = !1, o = e.getElementsByTagName('meta'), r = 0;
                    r < o.length;
                    r++
                    )
                    (l = o[r]), 'viewport' == l.name && ((c = !0), (d = l));
                    if (c)
                    d.content =
                        'width=device-width,initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0,user-scalable=no';
                    else {
                    var o = e.createElement('meta');
                    (o.name = 'viewport'),
                        (o.content =
                        'width=device-width,initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0,user-scalable=no'),
                        t.firstElementChild.appendChild(o);
                    }
                    var s = function() {
                    var e = t.clientWidth;
                    e / a > 750 && (e = 750 * a),
                        (window.remScale = e / 750),
                        (t.style.fontSize = 200 * (e / 750) + 'px');
                    };
                    s(), e.addEventListener && i.addEventListener(m, s, !1);
                })(document, window);
            </script>
            <script>
            function getApp(){
                return {
                cloud:{},
                cloudName:"clientTemplate2C",
                requestType:"mock"
                }
            }
            </script>
        </head>
        <body>
            <noscript>
            You need to enable JavaScript to run this app.
            </noscript>
            <div id="root">
            
            </div>
        </body>
        </html>`
    return jsx
}


