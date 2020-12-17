import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import * as path from 'path';
import { fixString, timeFun } from "../extConst";
import { TodoState } from './TodoState';

const TODOSTATE_ICON_MAP = new Map<string, string>([
    [TodoState.todo + '', 'todoIcon.svg'],
    [TodoState.complete + '', 'complete.svg'],
    [TodoState.cancel + '', 'pig3.svg']
]);


export class TodoItem extends TreeItem {
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