const localTasks = localStorage.getItem('tasks');
const localType = localStorage.getItem('type');
let arrTasks = localTasks ? JSON.parse(localTasks) : [];
let type = localType ?? 'all';

const noTaskScreens = [{
        type: 'all',
        smile: '&#128559;',
        message: 'Список дел пуст',
    }, {
        type: 'done',
        smile: '&#128559;',
        message: 'Список выполненных дел пуст',
    },
    {
        type: 'active',
        smile: '&#128526;',
        message: 'Все задачи выполнены',
    }
];

const footer = document.querySelector('.footer');
const todoList = document.querySelector('.todo-list');
const tabs = document.querySelectorAll('.footer__tab');
const inputForTasks = document.querySelector(".todo__input");
const inputCheckAll = document.querySelector("#checkAll");
const buttonClearDone = document.querySelector(".footer__clearall");
const counter = document.querySelector(".footer__left");
let viewTasks = [];

const noTaskScreenTemplate = (smile, message) => {
    const el = document.createElement('div');
    el.classList.add('todo-list-welcome');
    el.innerHTML = `${smile} ${message}`;

    return el;
};

const showNoTaskScreen = (type) => {
    resetList();
    noTaskScreens.forEach((screen) => {
        if (screen.type === type) {
            todoList.appendChild(noTaskScreenTemplate(screen.smile, screen.message));
        }
    });
};

const onFilterTasks = (e) => {
    const target = e.target;
    type = target.dataset.type;

    tabs.forEach((tab) => {
        tab.classList.remove('footer__tabs-active');
    });

    target.classList.add('footer__tabs-active');

    renderTasks(arrTasks);
};

const templateTasks = (task) => {
    const el = document.createElement('li');
    el.classList.add('todo-task');
    el.innerHTML = `
    <label class="completed">
    <input type="checkbox" />
    <div class="custom-checkbox"></div>
  </label>
  <input class="todo-title ${task.isDone && 'todo-title-done'}" type="text" value="${task.title}" readonly />
  <button class="delete">
    <img src="/img/trash_bin.png" alt="#" />
  </button>`;
    const checkbox = el.querySelector('input[type="checkbox"]');
    const input = el.querySelector('.todo-title');
    const deleteButton = el.querySelector('.delete');
    const index = arrTasks.indexOf(task);

    if (task.isDone) {
        checkbox.checked = true;
    };

    checkbox.addEventListener('change', () => {
        task.isDone = checkbox.checked;
        input.classList.toggle('todo-title-done');
        renderTasks(arrTasks);
    });

    input.addEventListener('dblclick', () => {
        input.readOnly = false;
        input.classList.add('input-change');
        input.classList.remove('todo-title-done');
    });

    input.addEventListener('focusout', () => {
        saveChangedTask();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveChangedTask();
            input.blur();
        };
    });

    const saveChangedTask = () => {
        input.readOnly = true;
        input.classList.remove('input-change');
        if (task.isDone) {
            input.classList.add('todo-title-done');
        };
        arrTasks[index] = {
            title: input.value,
            isDone: task.isDone,
        };
        saveLocalStorage();
    };

    deleteButton.addEventListener('click', () => {
        arrTasks.splice(index, 1);
        renderTasks(arrTasks);
    });

    return el;
};

const resetList = () => {
    todoList.innerHTML = '';
};

const renderTasks = (tasks) => {
    resetList();
    switch (type) {
        case 'done':
            viewTasks = tasks.filter((task) => task.isDone);
            break;
        case 'active':
            viewTasks = tasks.filter((task) => !task.isDone);
            break;
        default:
            viewTasks = tasks;
            break;
    };

    const tasksDone = arrTasks.filter((task) => task.isDone);

    counter.innerHTML = `${arrTasks.length - tasksDone.length} left`;

    inputCheckAll.checked = tasksDone.length === arrTasks.length;

    if (arrTasks.length === 0) {
        inputCheckAll.disabled = true;
        footer.classList.add('footer-hide');
        showNoTaskScreen("all");
        saveLocalStorage();
        return;
    }

    inputCheckAll.disabled = false;
    footer.classList.remove('footer-hide');

    if (viewTasks.length === 0) {
        showNoTaskScreen(type);
        saveLocalStorage();
        return;
    };

    viewTasks.forEach((task) => {
        todoList.append(templateTasks(task));
    });
    saveLocalStorage();
};

const createTask = () => {
    const task = {
        title: inputForTasks.value,
        isDone: false,
    };
    arrTasks.push(task);
    inputForTasks.value = '';
    inputForTasks.focus();
    renderTasks(arrTasks);
};

const markAllTasks = () => {
    arrTasks.forEach((task) => {
        task.isDone = inputCheckAll.checked;
    });
    renderTasks(arrTasks);
};

const clearDoneTasks = () => {
    arrTasks = arrTasks.filter((task) => !task.isDone);
    renderTasks(arrTasks);
};

const saveLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(arrTasks));
    localStorage.setItem('type', type);
};

const init = () => {
    tabs.forEach((tab) => {
        if (type === tab.dataset.type) {
            tab.classList.add('footer__tabs-active');
        };
    });

    buttonClearDone.addEventListener('click', clearDoneTasks);

    inputCheckAll.addEventListener('change', markAllTasks);

    inputForTasks.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' || !inputForTasks.value) {
            return;
        };
        createTask();
    });

    inputForTasks.addEventListener('focusout', () => {
        if (!inputForTasks.value) {
            return;
        }
        createTask();
    });

    inputForTasks.addEventListener('input', (e) => {
        let value = e.target.value;
        if (value === ' ') {
            e.target.value = '';
        }
    });

    tabs.forEach((tab) => {
        tab.addEventListener('click', onFilterTasks);
    });

    renderTasks(arrTasks);
};

init();