class Task {
    constructor(name, priority) {
        this.name = name;
        this.priority = priority;
    }
}

class UI {
    addTaskUI(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        let taskPriority = '';
        if(task.priority === '1') {
            taskPriority = 'low';
        } else if(task.priority === '2') {
            taskPriority = 'medium';
        } else {
            taskPriority = 'high';
        } 
        li.innerHTML = `
        <div class="tName">${task.name}</div><div class=span><span class="priority ${taskPriority}">${taskPriority}</span><a href="#" class="remove">&times;</a></div></li>
        `;
        taskList.appendChild(li);
    }

    showAlert(msg, className) {
        const container = document.getElementById('container');
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));
        container.insertBefore(div, form);
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 4000);
    }

    clearFields() {
        document.getElementById('name').value = "";
        document.getElementById('priority').value = "0";
    }

    deleteTaskUI(target) {
        if(target.className === 'remove') {
            target.parentElement.parentElement.remove();
        }
    }

    removeTasksUI() {
        taskList.innerHTML = '';
    }
}

class LocalStorage {
    static getTasks() {
        let tasks;
        if(localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return tasks;
    } 

    static showTasks() {
        const tasks = LocalStorage.getTasks();
        tasks.forEach(function(task) {
            const ui = new UI();
            ui.addTaskUI(task);
        });
    }

    static addTaskLS(task) {
        const tasks = LocalStorage.getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static deleteTaskLS(target) {
        const tasks = LocalStorage.getTasks();
        tasks.forEach(function(task, index) {
            if(task.name === target.textContent) {
                tasks.splice(index, 1);
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeTasksLS() {
        localStorage.removeItem('tasks');
    }
    
}

// defining UI variables

const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const taskList = document.getElementById('taskList');
const form = document.querySelector('.addTask');

// event listeners

document.addEventListener('DOMContentLoaded', LocalStorage.showTasks);
form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
clearBtn.addEventListener('click', removeTasks);
filter.addEventListener('keyup', filterTasks);


// defining functions

function addTask(e) {
    const name = document.getElementById('name').value;
    const priority = document.getElementById('priority').value;
    const task =  new Task(name, priority);
    const ui = new UI();
    if(name === "" || priority === "0") {
        ui.showAlert('Please, fill in all the fields', 'fail');
    } else {
        ui.addTaskUI(task);
        LocalStorage.addTaskLS(task);
        ui.showAlert('Task added', 'success');
        ui.clearFields();
    }
    e.preventDefault();
}

function deleteTask(e) {
    const ui = new UI();
    ui.deleteTaskUI(e.target);
    LocalStorage.deleteTaskLS(e.target.parentElement.previousSibling);
    e.preventDefault();
}

function removeTasks(e) {
    const ui = new UI();
    ui.removeTasksUI();
    LocalStorage.removeTasksLS();
    e.preventDefault();
}

function filterTasks(e) {
    const input = e.target.value.toLowerCase();
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(function(taskItem) {
        const task = taskItem.childNodes[2];
        const taskPriority = task.childNodes[0];
        function displayTask() {
            taskItem.style.display = 'block';
        }
        function hideTask() {
            taskItem.style.display = 'none';
        }

        if(input === 'low') {
            if (taskPriority.textContent === 'low') { 
                displayTask(); 
            } else {
                hideTask();
            }
        } else if(input === 'medium') {
            if (taskPriority.textContent === 'medium') { 
                displayTask(); 
            } else {
                hideTask();
            }
        } else if(input === 'high') {
            if (taskPriority.textContent === 'high') { 
                displayTask(); 
            } else {
                hideTask();
            }
        } else if(input === '') {
            displayTask();
        }
    });
}
