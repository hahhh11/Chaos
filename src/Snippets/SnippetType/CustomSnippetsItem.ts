import { TreeItem } from 'vscode';
export class CustomSnippetsItem extends TreeItem {
    constructor(snippetsItems: any) {
        super('')
        let keys = Object.keys(snippetsItems)
        this.label = `自定义代码片段  [${keys.length}]`;
        this.command = {
            title: '点击查看详情',
            command: "Chaos.snippets.showCustomSnippetsList",
            arguments: [snippetsItems]
        };
    }
} 