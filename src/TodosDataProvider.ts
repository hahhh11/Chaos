import { TreeDataProvider, TreeItem, TreeView } from "vscode";
import { TodoTreeItem } from "./Todos";

export class TodoDataProvider implements TreeDataProvider<TodoTreeItem>{
    private info;
    constructor(info:any){
        this.info = info;
    }

    getTreeItem(element:TodoTreeItem):TreeItem{
        return element;
    }

    getChildren(element: TodoTreeItem){
        return null;
    }

    getParent(element: TodoTreeItem){
        return null;
    }
}