import { TreeItem } from 'vscode';
export class TodoList extends TreeItem {
    constructor(todoJson: any) {
        super('')

        this.label = `代办项目  [${todoJson.todoList.length}]`;
        this.command = {
            title: '点击查看详情',
            command: "Chaos.todos.showTodoList",
            arguments: [todoJson]
        };
    }
} 