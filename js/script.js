const tabDone = document.querySelector('#tabDone');
const tabActive = document.querySelector('#tabActive');
const tabEvery = document.querySelector('#tabEvery');
const checkbox = document.querySelectorAll(".checkbox__list");
const todoInput = document.querySelector(".todo__input");
const todoList = document.querySelector(".todo-list");
const noTaskScreen = document.querySelector(".todo-list-welcome");
const todoScreenDone = document.querySelector('.todo-list-marked');
const todoScreenActive = document.querySelector('.todo-list-active');
const checkboxForAll = document.querySelector("#checkAll");
const footer = document.querySelector(".footer");
const counter = document.querySelector(".counter");
const clearAllBtn = document.querySelector(".footer__clearall");
const localTasks = JSON.parse(localStorage.getItem('tasks'));
const localTabs = JSON.parse(localStorage.getItem('tabs'));
let arrTasks = localTasks ? localTasks : [];
let arrTabs = localTabs ? localTabs : [{
    "isOpen": true,
    "id": "tabEvery"
}, {
    "isOpen": false,
    "id": "tabDone"
}, {
    "isOpen": false,
    "id": "tabActive"
}];

function changeTabStatus(tab) {
    arrTabs.forEach((item) => {
        item.isOpen = false
        if (tab === item.id) {
            item.isOpen = true;
        }
    })
    saveLocalstorage()
};

todoInput.addEventListener('input', (e) => {
    if (e.target.value === " ") {
        e.target.value = "";
    }
});

function viewCurrentTab(withCheckStatus = false) {
    checkCurrentTasks();
    lastTasks();
    saveLocalstorage();
    if (withCheckStatus) {
        checkStatusAll(arrTasks);
    }
};

function pushTask() {
    const newTask = {
        id: Date.now(),
        text: todoInput.value,
        isDone: false,
    };
    todoInput.value = '';
    todoInput.focus();
    if (!tabDone.classList.contains("footer__tabs-active")) {
        renderTask(newTask);
    } else {
        arrTasks.push(newTask);
    }
    viewCurrentTab(true);
};

/* отправка таска в массив по клику вне инпута */
document.addEventListener('click', (el) => {
    if (el.target != todoInput && todoInput.value) {
        pushTask();
    }
});

/* Отправление таска в массив по enter */
todoInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && e.target.value) {
        pushTask();
    };
});

function checkCurrentTasks() {
    const arrayActive = arrTasks.filter((el) => el.isDone === false);
    const arrayDone = arrTasks.filter((el) => el.isDone);
    const isTabDone = tabDone.classList.contains("footer__tabs-active");
    const isTabActive = tabActive.classList.contains("footer__tabs-active");
    const isTasksEmpty = arrTasks.length === 0;
    const doneTasksEmpty = arrayDone.length === 0;
    const activeTasksEmpty = arrayActive.length === 0;

    if (!isTasksEmpty) {
        noTaskScreen.classList.add('todo-list-welcome-hide');
        footer.classList.remove("footer-hide");
    } else {
        noTaskScreen.classList.remove('todo-list-welcome-hide');
        footer.classList.add("footer-hide");
    };

    if (isTabDone) {
        if (!doneTasksEmpty) {
            todoScreenDone.classList.add('todo-list-welcome-hide');
        } else if (!isTasksEmpty) {
            todoScreenDone.classList.remove('todo-list-welcome-hide');
        }
    }

    if (isTabActive) {
        if (!activeTasksEmpty) {
            todoScreenActive.classList.add('todo-list-welcome-hide');
        } else if (!isTasksEmpty) {
            todoScreenActive.classList.remove('todo-list-welcome-hide');
        } else {
            todoScreenActive.classList.add('todo-list-welcome-hide');
        }
    }
};

function renderTask(task, isView = false) {
    const spanClass = task.isDone ? 'todo-title todo-title-done' : 'todo-title';
    const checkboxStatus = task.isDone;
    const taskHtml = `<li id="${task.id}" class="todo-task">
            <label class="completed">
              <input type="checkbox" class="checkbox__list" checked="${checkboxStatus}"/>
              <div class="custom-checkbox"></div>
            </label>
            <span class="${spanClass}">${task.text}</span>
            <button class="delete">
              <img src="/img/trash_bin.png" alt="#" />
            </button>
          </li>`;
    if (!isView) {
        arrTasks.push(task);
    };
    todoList.insertAdjacentHTML('beforeend', taskHtml);
};

todoList.addEventListener('click', deleteTask);

function deleteTask(event) {
    if (event.target.classList.contains("delete")) {
        const task = event.target.closest('.todo-task');
        task.remove();

        const listId = +task.id;
        const index = arrTasks.findIndex((task) => {
            return task.id === listId;
        });

        arrTasks.splice(index, 1);
        if (tabDone.classList.contains("footer__tabs-active") && arrTasks.length === 0) {
            checkboxForAll.setAttribute('checked', false);
        };
        viewCurrentTab(true);
    };
};

function lastTasks() {
    const taskLast = arrTasks.filter((item) => item.isDone === false);
    counter.textContent = taskLast.length;
};

todoList.addEventListener('click', markTask);

function markTask(event) {
    if (event.target.classList.contains("completed")) {
        const task = event.target.closest('.todo-task');
        const todoTitle = task.querySelector(".todo-title");
        todoTitle.classList.toggle("todo-title-done");
        const titleId = +task.id;
        const index = arrTasks.findIndex((task) => {
            return task.id === titleId;
        });
        if (tabDone.classList.contains("footer__tabs-active")) {
            task.classList.add("todo-task-hide");
        };
        if (tabActive.classList.contains("footer__tabs-active")) {
            task.classList.add("todo-task-hide");
        };
        arrTasks[index] = {
            ...arrTasks[index],
            isDone: arrTasks[index].isDone ? false : true
        };
        if (arrTasks[index].isDone) {
            task.querySelector('input').setAttribute('checked', true);
        } else {
            task.querySelector('input').setAttribute('checked', false);
        };
        viewCurrentTab(true);
    };
};

function checkStatusAll(array) {
    const arrDone = array.filter((item) => item.isDone);
    if (array.length === arrDone.length) {
        checkboxForAll.setAttribute('checked', true);
    } else {
        checkboxForAll.setAttribute('checked', false);
    };
    if (arrTasks.length === 0) {
        checkboxForAll.setAttribute('checked', false);
    };
};

checkboxForAll.addEventListener('change', markAllTasks);

function markAllTasks() {
    const isChecked = checkboxForAll.getAttribute("checked") === "true";
    const isTabDone = tabDone.classList.contains("footer__tabs-active");
    const isTabActive = tabActive.classList.contains("footer__tabs-active");
    const isTabEvery = tabEvery.classList.contains("footer__tabs-active")

    if (isTabEvery) {
        changeTaskStatus(true);
    };

    if (isTabDone) {
        if (isChecked) {
            changeTaskStatus();
            todoScreenDone.classList.remove('todo-list-welcome-hide');
            todoList.innerHTML = '';
        } else {
            changeTaskStatus();
            showTab('tabDone');
        }
    }

    if (isTabActive) {
        if (isChecked) {
            changeTaskStatus();
            showTab('tabActive');
        } else if (arrTasks.length !== 0) {
            changeTaskStatus();
            todoScreenActive.classList.remove('todo-list-welcome-hide');
            todoList.innerHTML = '';
        }
    }
    lastTasks();
    saveLocalstorage();
};

function changeTaskStatus(forAll = false) {
    const todoTasks = document.querySelectorAll(".todo-task");
    const isChecked = checkboxForAll.getAttribute("checked") === "true";
    arrTasks.forEach((task, i) => {
        if (isChecked) {
            if (task.isDone) {
                task.isDone = false;
                checkboxForAll.setAttribute('checked', false);
                if (forAll) {
                    todoTasks[i].querySelector("input").setAttribute('checked', false);
                    todoTasks[i].querySelector("span").classList.remove("todo-title-done");
                };
            };
        } else {
            task.isDone = true
            checkboxForAll.setAttribute('checked', true);
            if (forAll) {
                todoTasks[i].querySelector("input").setAttribute('checked', true);
                todoTasks[i].querySelector("span").classList.add("todo-title-done");
            };
        };
    });
};

clearAllBtn.addEventListener('click', clearDone);

function clearDone() {
    const arrayNew = arrTasks.filter((el) => el.isDone === false);
    arrTasks = arrayNew;
    todoList.innerHTML = '';
    arrTasks.forEach((task) => {
        renderTask(task, true);
    });
    checkboxForAll.setAttribute('checked', false);
    if (tabDone.classList.contains("footer__tabs-active") && arrTasks.length !== 0) {
        todoList.innerHTML = '';
    };
    viewCurrentTab();
};

const tabsAll = document.querySelectorAll('.footer__tab');
tabsAll.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        e.preventDefault;
        tabsAll.forEach((item) => {
            item.classList.remove("footer__tabs-active");
        });
        tab.classList.add("footer__tabs-active");
    });
});

tabDone.addEventListener('click', () => {
    showTab('tabDone');
});
tabActive.addEventListener('click', () => {
    showTab('tabActive');
});
tabEvery.addEventListener('click', () => {
    showTab('tabEvery');
});

function showTab(tabName) {
    changeTabStatus(tabName);
    todoScreenActive.classList.add('todo-list-welcome-hide');
    todoScreenDone.classList.add('todo-list-welcome-hide');
    todoList.innerHTML = '';
    let arrayTasks;
    if (tabName === 'tabDone') {
        arrayTasks = arrTasks.filter((el) => el.isDone);
    } else if (tabName === 'tabActive') {
        arrayTasks = arrTasks.filter((el) => el.isDone === false);
    } else {
        arrayTasks = arrTasks;
    };
    checkCurrentTasks();
    arrayTasks.forEach((item) => {
        renderTask(item, true);
    });
};

todoList.addEventListener('dblclick', changeTask);

function changeTask(event) {
    if (!event.target.classList.contains("todo-title")) {
        return;
    }
    const button = event.target.parentNode.querySelector('button');
    const spanClass = event.target.classList.value;
    const liElem = event.target.parentNode;
    const spanTodo = event.target.closest('.todo-title');
    const inputChange = document.createElement('input');
    const index = arrTasks.findIndex((task) => {
        return task.id === event.target.parentNode.id;
    });
    button.classList.add('delete-hide');

    inputChange.setAttribute('type', "text");
    inputChange.classList.add('input-change');
    inputChange.value = spanTodo.textContent;

    spanTodo.parentNode.replaceChild(inputChange, spanTodo);
    inputChange.focus();

    function saveChanges() {
        arrTasks[index] = {
            ...arrTasks[index],
            text: inputChange.value
        }
        inputChange.remove();
        const newSpan = `<span class="${spanClass}">${arrTasks[index].text}</span>`;
        button.insertAdjacentHTML('beforeBegin', newSpan)
        button.classList.remove('delete-hide');
        saveLocalstorage();
        if (inputChange.value === "") {
            arrTasks.splice(index, 1);
            liElem.remove();
            viewCurrentTab();
        };
    };

    inputChange.addEventListener('keydown', (e) => {
        if (e.keyCode !== 13) {
            return;
        };
        saveChanges();
    });

    document.addEventListener('click', (el) => {
        if (el.target !== inputChange && liElem.contains(inputChange)) {
            saveChanges();
        };
    });
};

function saveLocalstorage() {
    localStorage.setItem("tasks", JSON.stringify(arrTasks));
    localStorage.setItem("tabs", JSON.stringify(arrTabs));
}

function initTable() {
    if (localTabs) {
        localTabs.forEach(tab => {
            if (tab.isOpen) {
                document.querySelector(`#${tab.id}`).classList.add('footer__tabs-active');
            }
        });
    } else {
        document.querySelectorAll('.footer__tab')[0].classList.add('footer__tabs-active');
    }

    if (localTasks) {
        const activeTab = document.querySelector('.footer__tabs-active');
        const isTabDone = activeTab === tabDone;
        const isTabActive = activeTab === tabActive;

        localTasks.forEach(task => {
            const status = task.isDone;
            const isDone = status === true;
            const isActive = status === false;

            if ((isTabDone && isDone) || (isTabActive && isActive) || activeTab === tabEvery) {
                renderTask(task, true);

                const isAllDone = isTabDone && arrTasks.filter(task => task.isDone).length === 0;
                const isAllActive = isTabActive && arrTasks.filter(task => task.isDone === false).length === 0;

                if (isAllDone) {
                    todoScreenDone.classList.remove('todo-list-welcome-hide');
                } else if (isAllActive) {
                    todoScreenActive.classList.remove('todo-list-welcome-hide');
                };
            };
        });
    };
    checkCurrentTasks();
    checkStatusAll(arrTasks);
};
initTable();
lastTasks()