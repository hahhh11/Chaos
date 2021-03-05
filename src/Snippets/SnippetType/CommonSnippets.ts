import { TreeItem } from 'vscode';
export class CommonSnippetsItem extends TreeItem {
    constructor(snippetsItems: any) {
        super('')
        let keys = Object.keys(snippetsItems)
        this.label = `通用代码片段  [${keys.length}]`;
        this.command = {
            title: '点击查看详情',
            command: "Chaos.snippets.showCommonSnippetsList",
            arguments: [snippetsItems]
        };
    }
} 