import * as vscode from "vscode"
export default class TreeProvider{
    constructor(){

    }

    public static initTreeList(){
        let treeList = new TreeProvider()
        // vscode.window.registerTreeDataProvider("tree",treeList)
    }

    getTreeItem(element:any) {
        return element;    
    }
          
    getChildren(element:any) {
        let trees:any[] = [];
        let temp1 = new vscode.TreeItem("测试1");
        let temp2 = new vscode.TreeItem("测试2");
        let temp3 = new vscode.TreeItem("测试3");
        trees.push(temp1);
        trees.push(temp2);
        trees.push(temp3);
        return new Promise(resolve => {
            return resolve(trees);
        });
    }  
}