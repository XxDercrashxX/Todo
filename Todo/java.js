const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="no-tasks">No hay tareas pendientes.</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        
        li.className = task.completed ? 'task-item completed' : 'task-item';
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.classList.add('task-text');
        textInput.value = task.text;
        textInput.readOnly = true;

        const editBtn = document.createElement('button');
        editBtn.classList.add('action-btn', 'edit-btn');
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('action-btn', 'delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

        li.appendChild(checkbox);
        li.appendChild(textInput);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Por favor, escribe una tarea.');
        return;
    }
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(id, li, textInput, editBtn) {
    const task = tasks.find(task => task.id === id);
    if (textInput.readOnly) {
        textInput.readOnly = false;
        textInput.focus();
        editBtn.innerHTML = '<i class="fas fa-save"></i>'; 
        li.classList.add('editing');
    } else {
        if (textInput.value.trim() === '') {
            alert('La tarea no puede estar vacía.');
            textInput.value = task.text;
            return;
        }
        task.text = textInput.value.trim();
        saveTasks();
        textInput.readOnly = true;
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>'; 
        li.classList.remove('editing');
    }
}

taskForm.addEventListener('submit', addTask);

taskList.addEventListener('click', (e) => {
    const li = e.target.closest('.task-item');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.closest('.delete-btn')) {
        deleteTask(id);
    }
    if (e.target.type === 'checkbox') {
        toggleTask(id);
    }
    if (e.target.closest('.edit-btn')) {
        const textInput = li.querySelector('.task-text');
        const editBtn = e.target.closest('.edit-btn');
        editTask(id, li, textInput, editBtn);
    }
});

document.addEventListener('DOMContentLoaded', renderTasks);