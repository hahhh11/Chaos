import { TreeItem } from 'vscode';
export class CompleteList extends TreeItem {
    constructor(completeList: any[]) {
        super('')

        this.label = `已完成  [${completeList.length}]`
    }
}