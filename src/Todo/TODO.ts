import { TodoState } from "./TodoState";

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