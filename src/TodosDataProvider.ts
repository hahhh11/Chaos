import { TreeDataProvider, TreeItem, TreeView, TreeItemCollapsibleState, window} from "vscode";
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
        this.todosJsonPath =  path.join(this.todoRoot, 'Todos.json');
    }

    getTreeItem(element: TodoItem): TreeItem {
        return element;
    }

    getChildren(element?: TodoItem): Thenable<TodoItem[]> {
        if (!this.todoRoot) {
            window.showInformationMessage('No todoRoot');
            return Promise.resolve([]);
        }
        console.log(this.todoRoot);
        if (this.pathExists(this.todosJsonPath)) {
            // 存在就读取
            return Promise.resolve(this.getItemsInTodosJson(this.todosJsonPath));
        } else {
            // 不存在就生成
            try{
                let buff = {
                    "todoList":[
                        {
                            "timestamp":Date.now(),
                            "content":"TODO示例-欢迎使用Chaos",
                            "state":TodoState.todo,
                            "id":0
                        }
                    ]
                };
                let has = this.pathExists(this.todosJsonPath);
                fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
                
                return Promise.resolve(this.getItemsInTodosJson(this.todosJsonPath));
            }catch(e){
                window.showInformationMessage(e);
                return Promise.resolve([]);
            }
        }
    }

    public updateTodoJson(todoInfo:TODO){
        let items = this.getItemsInTodosJson(this.todosJsonPath)
        let newItems = items.map(item => {
            if(item.id === todoInfo.id){
                item.content = todoInfo.content;
            }
        })
        let buff = {
            todoList:newItems
        }
        fs.writeFileSync(this.todosJsonPath, JSON.stringify(buff), 'utf-8');
    }

    private getItemsInTodosJson(todosJsonPath: string): TodoItem[] {
        if (this.pathExists(todosJsonPath)) {
            const todoJson = fs.readFileSync(todosJsonPath, 'utf-8');
            //@ts-ignore
            console.log(todoJson,todoJson['todoList']);
            let _todoJson = JSON.parse(todoJson);
            //@ts-ignore
            const todoItems =  _todoJson['todoList'].map((item: any) => {
                return new TodoItem(item);
            });

            return  todoItems;
        } else {
            return [];
        }
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }

    getParent(element: TodoItem){
        return null;
    }
}

class TodoItem extends TreeItem{
    public timestamp:string;
    public state:TodoState;
    public content:string
    constructor(itemInfo:any) {
        super('',TreeItemCollapsibleState.None);
        this.content = itemInfo.content;
        this.label = fixString(itemInfo.content,18) ;
        this.id = itemInfo.id?itemInfo.id:0;
        this.timestamp =  itemInfo.timestamp+"";
        this.description = timeFun.getTimeFormat(itemInfo.timestamp);
        this.state = itemInfo.state?itemInfo.state:TodoState.todo;
        this.command = {
            title:'点击查看详情',
            command:"Chaos.todos.clickItem",
            arguments:[itemInfo]   
        };
    }
}

export interface TODO{
    timestamp:number,
    id:string,
    content:string,
    state:TodoState
}

export class TODO implements TODO {
    constructor(content:string,state?:TodoState,id?:string,timestamp?:number){
        this.content = content
        this.state = state?state:TodoState.todo;
        this.id = id?id:"TODO_"+Date.now(),
        this.timestamp = timestamp?timestamp:Date.now()
    }
}

/**
 * Todo状态 
 */
enum TodoState{
    todo,
    complete,
    cancel
}