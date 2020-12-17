import { TreeItem } from 'vscode';
export class TodoList extends TreeItem {
    constructor(todoList: any[]) {
        super('')

        this.label = `代办项目  [${todoList.length}]`;
        this.command = {
            title: '点击查看详情',
            command: "Chaos.todos.showTodoList",
            arguments: [todoList]
        };
    }
} 