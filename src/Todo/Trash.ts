import { TreeItem } from 'vscode';
export class Trash extends TreeItem {
    constructor(trash: any[]) {
        super('')

        this.label = `回收站  [${trash.length}]`
    }
}