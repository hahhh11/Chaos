import { TreeDataProvider, TreeItem, TreeView, TreeItemCollapsibleState, window, Uri, EventEmitter } from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { fixString, timeFun } from "./extConst";
import { publicDecrypt } from "crypto";

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

    getChildren(element?: TodoItem): Thenable<TodoItem[]> {
        if (!this.todoRoot) {
            window.showInformationMessage('No todoRoot');
            return Promise.resolve([]);
        }
        // console.log(this.todoRoot);
        if (this.pathExists(this.todosJsonPath)) {
            // 存在就读取
            return Promise.resolve(this.getItemsInTodosJson(this.todosJsonPath));
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
                    ]
                };
                let has = this.pathExists(this.todosJsonPath);
                fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');

                return Promise.resolve(this.getItemsInTodosJson(this.todosJsonPath));
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
        let items = this.getItemsInTodosJson(this.todosJsonPath)
        let newTodoList: TODO[] = []
        items.forEach(item => {
            if (item.id === todoInfo.id) {
                return
            }
            let newTodo = new TODO(item.content, item.state, item.id, item.timestamp)
            newTodoList.push(newTodo)
        })
        let buff = {
            todoList: newTodoList
        }
        fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
    }

    public completeTodo(todoInfo: TODO) {
        if (!todoInfo) {
            return
        }
        let items = this.getItemsInTodosJson(this.todosJsonPath)
        let newTodoList: TODO[] = []
        items.forEach(item => {
            if (item.id === todoInfo.id) {
                item.state = TodoState.complete
            }
            let newTodo = new TODO(item.content, item.state, item.id, item.timestamp)
            newTodoList.push(newTodo)
        })
        let buff = {
            todoList: newTodoList
        }
        fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
    }

    public updateTodoJson(todoInfo: TODO) {
        if (!todoInfo) {
            return
        }
        let items = this.getItemsInTodosJson(this.todosJsonPath)
        let newTodoList = []
        let newItemFlag = true
        items.forEach(item => {
            if (item.id === todoInfo.id) {
                newItemFlag = false
                if (item.content !== todoInfo.content) {
                    item.content = todoInfo.content;
                }
            }
            let newTodo = new TODO(item.content, item.state, item.id, item.timestamp)
            newTodoList.push(newTodo)
        })
        if (newItemFlag) {
            let newTodo = new TODO(todoInfo.content, todoInfo.state)
            newTodoList.push(newTodo)
        }
        let buff = {
            todoList: newTodoList
        }
        fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
    }

    private getItemsInTodosJson(todosJsonPath: string): TodoItem[] {
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

/**
 * Todo状态 
 */
enum TodoState {
    todo,
    complete,
    cancel
}

const TODOSTATE_ICON_MAP = new Map<string, string>([
    [TodoState.todo + '', 'todoIcon.svg'],
    [TodoState.complete + '', 'complete.svg'],
    [TodoState.cancel + '', 'pig3.svg']
]);

class TodoItem extends TreeItem {
    public timestamp: number;
    public state: TodoState;
    public content: string
    private _itemInfo: any;
    constructor(itemInfo: any) {

        super(`${fixString(itemInfo.content, 18)}`, TreeItemCollapsibleState.None);
        this.content = itemInfo.content;
        this.tooltip = timeFun.getTimeFormat(itemInfo.timestamp);
        // this.label = fixString(itemInfo.content, 18);
        this.id = itemInfo.id ? itemInfo.id : 0;
        this.timestamp = itemInfo.timestamp;
        // this.description = timeFun.getTimeFormat(itemInfo.timestamp);
        this.state = itemInfo.state ? itemInfo.state : TodoState.todo;
        this.command = {
            title: '点击查看详情',
            command: "Chaos.todos.clickItem",
            arguments: [itemInfo]
        };

        this._itemInfo = itemInfo

        // iconPath： 为该项的图标因为我们是通过上面的 Map 获取的，所以我额外写了一个方法，放在下面
        this.iconPath = TodoItem.getIconUriForState(this.state + '');
        console.log(this.iconPath)
    }




    // __filename：当前文件的路径
    // 重点讲解 Uri.file(join(__filename,'..', '..') 算是一种固定写法
    // Uri.file(join(__filename,'..','assert', ITEM_ICON_MAP.get(label)+''));   写成这样图标出不来
    // 所以小伙伴们就以下面这种写法编写
    static getIconUriForState(state: string): Uri {
        return Uri.file(path.join(__filename, '..', '..', 'assets', 'imgs', TODOSTATE_ICON_MAP.get(state) + ''));
    }

}

export interface TODO {
    timestamp: number,
    id: string,
    content: string,
    state: TodoState
}

export class TODO implements TODO {
    constructor(content: string, state?: TodoState, id?: string, timestamp?: number) {
        this.content = content
        this.state = state ? state : TodoState.todo;
        this.id = id ? id : "TODO_" + Date.now(),
            this.timestamp = timestamp ? timestamp : Date.now()
    }
}

