
import { TreeItem } from 'vscode';
export class CompleteList extends TreeItem {
    constructor(todoJson: any) {
        super('')
        todoJson.completeList = todoJson.completeList ? todoJson.completeList : []
        this.label = `已完成  [${todoJson.completeList.length}]`

        this.command = {
            title: '点击查看详情',
            command: "Chaos.todos.showCompleteList",
            arguments: [todoJson]
        };
    }
}