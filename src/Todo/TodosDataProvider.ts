import { TodoState } from './TodoState';
import { TreeDataProvider, TreeItem, TreeView, TreeItemCollapsibleState, window, Uri, EventEmitter } from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { publicDecrypt } from "crypto";
import { TodoItem } from "./TodoItem";
import { TodoList } from "./TodoList";
import { CompleteList } from "./CompleteList";
import { Trash } from "./Trash";
import { TODO } from "./TODO";


export class TodoDataProvider implements TreeDataProvider<TodoItem>{
    // private info;
    private todoRoot = "";
    public todosJsonPath = "";
    constructor(todoRoot?: string) {
        this.todoRoot = todoRoot ? todoRoot : "";
        this.todosJsonPath = path.join(this.todoRoot, 'Todos.json');
    }

    // 这里将每一个 children 再一一映射到 TreeItem 数据结构
    getTreeItem(item: TodoItem) {
        // const uri = Uri.parse('...');
        // const item = new TreeItem(uri);
        return item;
    }

    getChildren(element?: TreeItem): Thenable<any[]> {
        if (!this.todoRoot) {
            window.showInformationMessage('No todoRoot');
            return Promise.resolve([]);
        }
        // console.log(this.todoRoot);
        if (this.pathExists(this.todosJsonPath)) {
            // 存在就读取
            return Promise.resolve(this.getItemsInTodoJson(this.todosJsonPath));
        } else {
            // 不存在就生成
            try {
                let buff = {
                    "todoList": [
                        {
                            "timestamp": Date.now(),
                            "content": "TODO示例-欢迎使用Chaos",
                            "state": TodoState.todo,
                            "id": 0
                        }
                    ],
                    "completeList": [],
                    "trash": []
                };
                let has = this.pathExists(this.todosJsonPath);
                fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');

                return Promise.resolve(this.getItemsInTodoJson(this.todosJsonPath));
            } catch (e) {
                window.showInformationMessage(e);
                return Promise.resolve([]);
            }
        }
    }

    public deleteTodo(todoInfo: TODO) {
        if (!todoInfo) {
            return
        }
        // let items = this.getItemsInTodosJson(this.todosJsonPath)
        // let newTodoList: TODO[] = []
        // items.forEach(item => {
        //     if (item.id === todoInfo.id) {
        //         return
        //     }
        //     let newTodo = new TODO(item.content, item.state, item.id, item.timestamp)
        //     newTodoList.push(newTodo)
        // })
        // let buff = {
        //     todoList: newTodoList
        // }
        // fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
    }

    public completeTodo(todoInfo: TODO) {
        if (!todoInfo) {
            return
        }
        // let items = this.getItemsInTodosJson(this.todosJsonPath)
        // let newTodoList: TODO[] = []
        // items.forEach(item => {
        //     if (item.id === todoInfo.id) {
        //         item.state = TodoState.complete
        //     }
        //     let newTodo = new TODO(item.content, item.state, item.id, item.timestamp)
        //     newTodoList.push(newTodo)
        // })
        // let buff = {
        //     todoList: newTodoList
        // }
        // fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
    }

    public updateTodoJson(todoInfo: TODO) {
        if (!todoInfo) {
            return
        }
        // let items = this.getItemsInTodoJson(this.todosJsonPath)
        // let newTodoList = []
        // let newItemFlag = true
        // items.forEach(item => {
        //     if (item.id === todoInfo.id) {
        //         newItemFlag = false
        //         if (item.content !== todoInfo.content) {
        //             item.content = todoInfo.content;
        //         }
        //     }
        //     let newTodo = new TODO(item.content, item.state, item.id, item.timestamp)
        //     newTodoList.push(newTodo)
        // })
        // if (newItemFlag) {
        //     let newTodo = new TODO(todoInfo.content, todoInfo.state)
        //     newTodoList.push(newTodo)
        // }
        // let buff = {
        //     todoList: newTodoList
        // }
        // fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
    }

    private getItemsInTodoJson(todosJsonPath: string): TreeItem[] {
        if (this.pathExists(todosJsonPath)) {
            const todoJson = fs.readFileSync(todosJsonPath, 'utf-8');
            let _todoJson = JSON.parse(todoJson);
            //@ts-ignore
            console.log(todoJson, _todoJson['todoList']);
            let todoList = new TodoList(_todoJson['todoList'])
            let completeList = new CompleteList(_todoJson['completeList'])
            let trash = new Trash(_todoJson['trash'])
            return [todoList, completeList, trash];
        } else {
            let todoList = new TodoList([])
            let completeList = new CompleteList([])
            let trash = new Trash([])
            return [todoList, completeList, trash];
        }
    }

    private getItemsInTodosJson2(todosJsonPath: string): TodoItem[] {
        if (this.pathExists(todosJsonPath)) {
            const todoJson = fs.readFileSync(todosJsonPath, 'utf-8');
            let _todoJson = JSON.parse(todoJson);
            //@ts-ignore
            console.log(todoJson, _todoJson['todoList']);
            //@ts-ignore

            const todoItems = [];
            if (_todoJson['todoList'] && _todoJson['todoList'].length > 0) {
                for (let i = 0; i < _todoJson['todoList'].length; i++) {
                    if (_todoJson['todoList'][i].state !== TodoState.todo) {
                        break
                    }
                    todoItems.push(new TodoItem(_todoJson['todoList'][i]));
                }
            }
            return todoItems;
        } else {
            return [];
        }
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

    getParent(element: TodoItem) {
        return null;
    }
}






