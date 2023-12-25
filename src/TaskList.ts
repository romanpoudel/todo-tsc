import { Task } from "./Task";

export interface ITaskList {
	list: Task[];

	getTaskById: (id: string) => Task | null;
	getTaskByIndex: (index: number) => Task | null;

	addTask: (task: Task) => Task[];
}

export class TaskList implements ITaskList {
	list: Task[];

	constructor(tasks?: Task[]) {
		this.list = tasks || [];
	}

	addTask = (task: Task) => {
		this.list.unshift(task);

		return this.list;
	};

	deleteTask=(id: string) =>{
		const index = this.list.findIndex((item) => item.id === id);
		this.list.splice(index,1);
	};

	getTaskById = (id: string) => {
		return this.list.find((item) => item.id === id) || null;
	};

	getTaskByIndex = (index: number) => {
		return this.list[index] || null;
	};
}
