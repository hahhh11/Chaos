import { TreeDataProvider, TreeItem, TreeView, TreeItemCollapsibleState, window} from "vscode";
import { TodoTreeItem } from "./Todos";
import * as fs from 'fs';
import * as path from 'path';

export class TodoDataProvider implements TreeDataProvider<TodoTreeItem>{
    // private info;
    private workspaceRoot = "";

    constructor(workspaceRoot?: string) {
        this.workspaceRoot = workspaceRoot ? workspaceRoot : "";
    }

    getTreeItem(element: TodoItem): TreeItem {
        return element;
    }

    getChildren(element?: TodoItem): Thenable<TodoItem[]> {
        if (!this.workspaceRoot) {
            window.showInformationMessage('No TodoItem in empty workspace');
            return Promise.resolve([]);
        }
        console.log(this.workspaceRoot);
        const todosJsonPath = path.join(this.workspaceRoot, 'Todos.json');
        if (this.pathExists(todosJsonPath)) {
            // 存在就读取
            return Promise.resolve(this.getItemsInTodosJson(todosJsonPath));
        } else {
            // 不存在就生成
            try{
                let buff = {
                    "todoList":[
                        {
                            "timestamp":"${Date.now()}",
                            "content":"adfasdfasdf"
                        }
                    ]
                };
                fs.writeFileSync(todosJsonPath, JSON.stringify(buff), 'utf-8');
                let has = this.pathExists(todosJsonPath);
                return Promise.resolve(this.getItemsInTodosJson(todosJsonPath));
            }catch(e){
                window.showInformationMessage(e);
                return Promise.resolve([]);
            }
        }
    }

    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    private getItemsInTodosJson(todosJsonPath: string): TodoItem[] {
        if (this.pathExists(todosJsonPath)) {
            const todoJson = fs.readFileSync(todosJsonPath, 'utf-8');
            //@ts-ignore
            console.log(todoJson,todoJson['todoList']);
            let _todoJson = JSON.parse(todoJson);
            //@ts-ignore
            const todoItems =  _todoJson['todoList'].map((item: any) => {
                console.log(item);
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

    getParent(element: TodoTreeItem){
        return null;
    }
}

class TodoItem extends TreeItem{
    public timestamp:string;
    public state:TodoState;
    
    constructor(itemInfo:any) {
        super('',TreeItemCollapsibleState.None);
        this.label = itemInfo.content;
        this.id = itemInfo.id?itemInfo.id:null;
        this.timestamp = itemInfo.timestamp+"";
        this.description = itemInfo.timestamp+"";
        this.state = itemInfo.state?itemInfo.state:TodoState.todo;
        this.command = {
            title:'点击查看详情',
            command:"Chaos.todos.clickItem",
            arguments:[itemInfo]   
        };
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