import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, ProviderResult, window } from "vscode";
import * as  fs from "fs";
import * as path from "path";

export class MyTreeData implements TreeDataProvider<MyTreeItem>{
    constructor(private rootPath: string){
    }

    getTreeItem(element: MyTreeItem) : MyTreeItem | Thenable<MyTreeItem> {
        return element;
    }

    getChildren(element?: MyTreeItem | undefined): ProviderResult<MyTreeItem[]>{
        if(!this.rootPath){
            window.showInformationMessage('No file in empty directory');
            return Promise.resolve([]);
        }
        if(element === undefined){
            return Promise.resolve(this.searchFiles(this.rootPath));
        }
        else{
            return Promise.resolve(this.searchFiles(path.join(element.parentPath, element.label)));
        }
    }
    //查找文件，文件夹
    private searchFiles(parentPath: string): MyTreeItem[] {
        var treeDir: MyTreeItem[] = [];
        if(this.pathExists(parentPath)){
            var fsReadDir = fs.readdirSync(parentPath, 'utf-8');
            fsReadDir.forEach(fileName => {
                var filePath = path.join(parentPath, fileName);//用绝对路径
                if(fs.statSync(filePath).isDirectory()){//目录
                    treeDir.push(new MyTreeItem(fileName, parentPath, TreeItemCollapsibleState.Collapsed));
                }
                else{//文件
                    treeDir.push(new MyTreeItem(fileName, parentPath, TreeItemCollapsibleState.None));
                }
            });
        }
        return treeDir;
    }   
    //判断路径是否存在
    private pathExists(filePath: string): boolean{
        try{
            fs.accessSync(filePath);
        }
        catch(err){
            return false;
        }
        return true;
    }
}

export class MyTreeItem extends TreeItem{
    constructor(
        public readonly label: string,      //存储当前标签
        public readonly parentPath: string,   //存储当前标签的路径，不包含该标签这个目录
        public readonly collapsibleState: TreeItemCollapsibleState
    ){
        super(label, collapsibleState);
    }
    //设置鼠标悬停在此项上时的工具提示文本
    // get tooltip():string{
    //     return path.join(this.parentPath, this.label);
    // }
    //为每项添加点击事件的命令
    command = {
        title: "this.label",
        command: 'MyTreeItem.itemClick',
        arguments: [    //传递两个参数
            this.label,
            path.join(this.parentPath, this.label)
        ]
    };
    contextValue = 'MyTreeItem';//提供给 when 使用
}