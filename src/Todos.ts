
import { TreeItem, TreeItemCollapsibleState, TreeDataProvider, Uri, window } from 'vscode';
import { join } from 'path';

export interface TODO{
    hashId:string;
    timestamp:number;
    content:string;
}

export class TodoTreeItem extends TreeItem{
    constructor(info:any) {
        super('',TreeItemCollapsibleState.None);
        this.label = info.label;
        this.id = info.id;
        this.description = info.description;
        this.command = {
            title:'点击查看详情',
            command:"Chaos.todos.clickItem",
            arguments:[info]   
        };
    }
}