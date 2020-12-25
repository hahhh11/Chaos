import { TreeItem } from 'vscode';
export class Trash extends TreeItem {
    constructor(todoJson: any) {
        super('')
        todoJson.trash = todoJson.trash ? todoJson.trash : []
        this.label = `回收站  [${todoJson.trash.length}]`
        this.command = {
            title: '点击查看详情',
            command: "Chaos.todos.showTrash",
            arguments: [todoJson]
        };
    }
}