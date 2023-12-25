import "normalize.css";
import "./styles/main.scss";

import { Task } from "./Task";
import { TaskList } from "./TaskList";

const searchInput = document.getElementById(
	"search-input"
) as HTMLInputElement | null;
const inputField = document.getElementById(
	"textInput"
) as HTMLInputElement | null;
const inputButton = document.querySelector(
	".task__input--icon"
) as HTMLButtonElement | null;
const taskListElement = document.getElementById("task-list");

const all = document.getElementById("all");
const completed = document.getElementById("complete");
const remaining = document.getElementById("remain");

enum FilterType {
	All,
	Completed,
	Remaining,
}

//make nav active
// Get all navigation links
const links = document.querySelectorAll(".header__link");
links[0].classList.add("header__link--active");

// Add click event listener to each link
links.forEach((link) => {
	link.addEventListener("click", function () {
		// Remove 'active' class from all links
		links.forEach((otherLink) => {
			otherLink.classList.remove("header__link--active");
		});

		// Add 'active' class to the clicked link
		link.classList.add("header__link--active");
	});
});

function clearSearchInput() {
	if (searchInput instanceof HTMLInputElement) {
		searchInput.value = "";
	}
}
let status = FilterType.All;
all?.addEventListener("click", () => {
	clearSearchInput();
	status = FilterType.All;
	render(FilterType.All);
});

completed?.addEventListener("click", () => {
	clearSearchInput();
	status = FilterType.Completed;
	render(FilterType.Completed);
});

remaining?.addEventListener("click", () => {
	clearSearchInput();
	status = FilterType.Remaining;
	render(FilterType.Remaining);
});

const taskList = new TaskList();

function createTask(value: string): Task {
	const task = new Task(value);
	taskList.addTask(task);

	return task;
}

function toggleTaskCompleted(id: string): Task {
	const task = taskList.getTaskById(id);

	if (!task) {
		throw new Error(`Task with id ${id} not found`);
	}

	if (task) {
		task.toggleCompleted();
	}

	return task;
}

function clearInputField() {
	const inputValue = inputField?.value.trim();
	if (inputValue !== "" && inputValue !== undefined) {
		console.log("added task");
		createTask(inputValue);
		render(status);
		if (inputField) {
			inputField.value = "";
		}
	}
}
//add task
inputField?.addEventListener("keyup", (e) => {
	if (e.key === "Enter") {
		clearInputField();
	}
});

inputButton?.addEventListener("click", () => {
	clearInputField();
});

function search(list: TaskList, searchTerm: string = ""): TaskList {
	const tasks = list.list.filter((item) => {
		return item.value.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return new TaskList(tasks);
}

function sortByStatus(list: TaskList, filter: FilterType): TaskList {
	switch (filter) {
		case FilterType.Completed:
			return new TaskList(list.list.filter((task) => task.completed));
		case FilterType.Remaining:
			return new TaskList(list.list.filter((task) => !task.completed));
		case FilterType.All:
		default:
			return list;
	}
}

function renderList(tasks: TaskList) {
	if (!taskListElement) throw new Error("DOM element not found");

	taskListElement.innerHTML = "";

	if (tasks.list.length === 0) {
		// Display a message when there are no matches
		const noMatchMessage = document.createElement("p");
		noMatchMessage.textContent = "No task found";
		noMatchMessage.classList.add("error");
		taskListElement.appendChild(noMatchMessage);
		return;
	}

	tasks.list.forEach((task) => {
		const element = document.createElement("div");
		element.classList.add("task-item");

		const label = document.createElement("label");
		element.appendChild(label);

		const inputField = document.createElement("input");
		inputField.setAttribute("type", "checkbox");
		inputField.classList.add("checkbox");
		inputField.setAttribute("title", "toggle task status");
		inputField.checked = task.completed;

		inputField.addEventListener("change", () => {
			toggleTaskCompleted(task.id);
			render(status);
		});
		// Create a container for taskValue and deleteIcon
		const contentContainer = document.createElement("div");
		contentContainer.classList.add("list-data");
		const taskValue = document.createElement("p");
		taskValue.classList.add("task-item-value");
		taskValue.textContent = task.value;

		if (task.completed) {
			taskValue.classList.add("task-completed");
		}

		const deleteIcon = document.createElement("i");
		deleteIcon.classList.add("bi", "bi-trash-fill", "deleteIcon");
		deleteIcon.setAttribute("title", "delete");
		deleteIcon.addEventListener("click", () => {
			taskList.deleteTask(task.id);
			render(status);
		});
		label.appendChild(inputField);
		contentContainer.appendChild(taskValue);
		contentContainer.appendChild(deleteIcon);

		element.appendChild(contentContainer);

		taskListElement.appendChild(element);
	});
}

searchInput?.addEventListener("input", (e) => {
	const searchParam = (e.target as HTMLInputElement)?.value;

	render(status, searchParam);
});

function render(filter: FilterType = FilterType.All, searchParam: string = "") {
	const filteredTaskList = sortByStatus(search(taskList, searchParam), filter);

	renderList(filteredTaskList);
}

render(status);
