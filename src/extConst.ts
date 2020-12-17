import * as vscode from 'vscode';


export function fixString(str: string, number = 4) {
    if (!str || str === "") {
        return "";
    }
    let strArr = str.split("");
    if (strArr.length <= number) {
        return str;
    } else {
        let _name = "";
        for (let i = 0; i < number; i++) {
            _name += strArr[i];
        }
        _name += "...";
        return _name;
    }
}

export function string2buffer(str: string) {
    let val = "";
    for (let i = 0; i < str.length; i++) {
        val += ',' + code2utf8(str.charCodeAt(i));
    }
    val += ',00';
    console.log(val);
    if (!val) {
        val = "";
    }
    // 将16进制转化为ArrayBuffer
    //@ts-ignore
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }));
}


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

export function code2utf8(uni: any) {
    let uni2 = uni.toString(2);
    if (uni < 128) {
        return uni.toString(16);
    } else if (uni < 2048) {
        uni2 = ('00000000000000000' + uni2).slice(-11);
        const s1 = parseInt("110" + uni2.substring(0, 5), 2);
        const s2 = parseInt("10" + uni2.substring(5), 2);
        return s1.toString(16) + ',' + s2.toString(16);
    } else {
        uni2 = ('00000000000000000' + uni2).slice(-16);
        const s1 = parseInt('1110' + uni2.substring(0, 4), 2);
        const s2 = parseInt('10' + uni2.substring(4, 10), 2);
        const s3 = parseInt('10' + uni2.substring(10), 2);
        return s1.toString(16) + ',' + s2.toString(16) + ',' + s3.toString(16);
    }
}


export const timeFun = {
    /**
     * 获取今天零点时间戳
     */
    getTodayMark() {
        return new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    },
    getTimeFormat(timestamp: number) {
        let time = new Date(timestamp);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
        let hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        let minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        let second = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();

        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    },
    /**
    * 倒计时（默认开始时间为当前时间）
    * @param endTime 结束时间 时间戳
    * @returns 例：剩余时间 {d:1, h:16, m:45, s:41} 代表：1天 16小时 45 分钟41 秒
    */
    getEndTime(endTime: number) {
        var startDate = new Date(); //开始时间，当前时间
        var endDate = new Date(endTime); //结束时间，需传入时间参数
        var t = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
        var d = 0, h = 0, m = 0, s = 0;
        if (t >= 0) {
            d = Math.floor(t / 1000 / 3600 / 24);
            h = Math.floor(t / 1000 / 60 / 60 % 24);
            m = Math.floor(t / 1000 / 60 % 60);
            s = Math.floor(t / 1000 % 60);
        }
        return { d: d, h: h, m: m, s: s };
    },
    /**
     * 返回当前时间戳
     */
    now() {
        return new Date().getTime();
    }
}