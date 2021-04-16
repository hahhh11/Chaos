import { CustomSnippetsItem } from './SnippetType/CustomSnippetsItem';
import { CommonSnippetsItem } from './SnippetType/CommonSnippets';
import { TreeDataProvider, TreeItem, TreeView, TreeItemCollapsibleState, window, Uri, EventEmitter, Event, ProviderResult } from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { promises } from 'dns';
export class SnippetsProvider implements TreeDataProvider<SnippetItem>{
    // private info;
    private snippetsRoot = "./snippets/";
    // 通用代码片段
    public commonSnippetsPath = "";
    // 自定义代码片段
    public customSnippetsPath = "";
    constructor() {
        this.snippetsRoot = process.env.APPDATA + "\\Code\\User\\snippets";
        this.commonSnippetsPath = path.join(this.snippetsRoot, 'chaos_common.code-snippets');
        this.customSnippetsPath = path.join(this.snippetsRoot, 'chaos_custom.code-snippets');
        console.log("路径：", this.customSnippetsPath)
    }

    onDidChangeTreeData?: Event<void | TreeItem | null | undefined> | undefined;
    getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: TreeItem): ProviderResult<TreeItem[]> {
        console.log(process.env)
        if (!this.snippetsRoot) {
            window.showInformationMessage('No snippetsRoot');
            return Promise.resolve([]);
        }

        try {
            let commonSnippetsItem: CommonSnippetsItem
            let customSnippetsItem: CustomSnippetsItem
            if (this.pathExists(this.commonSnippetsPath)) {
                const common_code_snipptes = fs.readFileSync(this.commonSnippetsPath, 'utf-8');
                console.log(common_code_snipptes)
                let _common_code_snipptes = JSON.parse(common_code_snipptes);
                commonSnippetsItem = new CommonSnippetsItem(_common_code_snipptes)
            } else {
                // 初始化通用代码片段
                let commonBuff = {

                };
                let has = this.pathExists(this.commonSnippetsPath);
                fs.writeFileSync(this.commonSnippetsPath, JSON.stringify(commonBuff), 'utf-8');
                commonSnippetsItem = new CommonSnippetsItem(commonBuff)
            }

            if (this.pathExists(this.customSnippetsPath)) {
                const custom_code_snipptes = fs.readFileSync(this.customSnippetsPath, 'utf-8');
                let _custom_code_snipptes = JSON.parse(custom_code_snipptes);
                customSnippetsItem = new CustomSnippetsItem(_custom_code_snipptes)
            } else {
                let customBuff = {

                };
                let has = this.pathExists(this.customSnippetsPath);
                fs.writeFileSync(this.customSnippetsPath, JSON.stringify(customBuff), 'utf-8');
                customSnippetsItem = new CustomSnippetsItem({})
            }

            return Promise.resolve([commonSnippetsItem, customSnippetsItem])

        } catch (e) {
            window.showWarningMessage("读取代码片段失败", e)
        }

    }


    public updateSnippetJson(info: any, type: string) {
        if (!info || !type) {
            return
        }
        // let items = this.getItemsInTodoJson(this.todosJsonPath)
        let buff = info
        let writePath: string = ""
        switch (type) {
            case "custom":
                writePath = this.customSnippetsPath
                break;
            case "common":
                writePath = this.commonSnippetsPath
                break;
        }

        fs.writeFileSync(writePath, JSON.stringify(buff), 'utf-8');
    }


    private refreshEvent: EventEmitter<any | null> = new EventEmitter<any | null>();

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }

    getParent(element: SnippetItem) {
        return null;
    }
}







export class SnippetItem extends TreeItem {

}