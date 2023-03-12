/* Все переменные */
const tabDone = document.querySelector('#tabDone')
const tabActive = document.querySelector('#tabActive')
const tabEvery = document.querySelector('#tabEvery')
const checkbox = document.querySelectorAll(".checkbox__list");
const todoInput = document.querySelector(".todo__input");
const todoList = document.querySelector(".todo-list");
const welcomeList = document.querySelector(".todo-list-welcome");
const checkboxForAll = document.querySelector("#checkAll");
const footer = document.querySelector(".footer");
const counter = document.querySelector(".counter");
const clearAllBtn = document.querySelector(".footer__clearall");
const localTasks = JSON.parse(localStorage.getItem('tasks'));
const localTabs = JSON.parse(localStorage.getItem('tabs'));
let arrTasks = localTasks ? localTasks : [];
let arrTabs = localTabs ? localTabs : [{
    "status": true,
    "id": "tabEvery"
}, {
    "status": false,
    "id": "tabDone"
}, {
    "status": false,
    "id": "tabActive"
}];

/* функция, меняющая статус таба в массиве */
function changeTabStatus(tab) {
    arrTabs.forEach((item) => {
        item.status = false
        if (tab == item.id) {
            item.status = true;
        }
    })
    saveLocalstorage()
}

todoInput.addEventListener('input', (e) => {
    if (e.target.value === " ") {
        e.target.value = "";
    }
})

function saveFunctions(word) {
    checkWelcomeScreen();
    lastTasks();
    saveLocalstorage();
    if (word === "withCheckStatus") {
        checkStatusAll(arrTasks);
    }
}

function pushTask() {
    const newTask = {
        id: Date.now(),
        text: todoInput.value,
        status: "isActive",
    };
    todoInput.value = '';
    todoInput.focus();
    if (!tabDone.classList.contains("footer__tabs-active")) {
        renderTask(newTask)
    } else {
        arrTasks.push(newTask)
    }
    saveFunctions("withCheckStatus");
}

/* отправка таска в массив по клику вне инпута */
document.addEventListener('click', (el) => {
    if (el.target != todoInput && todoInput.value) {
        pushTask()
    }
})

/* Отправление таска в массив по enter */
todoInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && e.target.value) {
        pushTask()
    }
})

/* Приветственный экран */
function checkWelcomeScreen() {
    const arrayActive = arrTasks.filter((el) => el.status == "isActive")
    const arrayDone = arrTasks.filter((el) => el.status == "isDone");

    if (arrTasks.length > 0) {
        welcomeList.classList.add('todo-list-welcome-hide');
        footer.classList.remove("footer-hide");
    } else {
        welcomeList.classList.remove('todo-list-welcome-hide');
        footer.classList.add("footer-hide");
    }

    if (tabDone.classList.contains("footer__tabs-active") && arrayDone.length > 0) {
        document.querySelector(".todo-list-marked").classList.add('todo-list-welcome-hide')
    }
    if (tabDone.classList.contains("footer__tabs-active") && arrayDone.length === 0 && arrTasks.length > 0) {
        document.querySelector(".todo-list-marked").classList.remove('todo-list-welcome-hide')
    }

    if (tabActive.classList.contains("footer__tabs-active") && arrayActive.length > 0) {
        document.querySelector(".todo-list-active").classList.add('todo-list-welcome-hide')
    }
    if (tabActive.classList.contains("footer__tabs-active") && arrayActive.length === 0 && arrTasks.length > 0) {
        document.querySelector(".todo-list-active").classList.remove('todo-list-welcome-hide')
    }
    if (tabActive.classList.contains("footer__tabs-active") && arrayActive.length === 0 && arrTasks.length === 0) {
        document.querySelector(".todo-list-active").classList.add('todo-list-welcome-hide')
    }
}

/* рендер задач */
function renderTask(task, isView = false) {
    const spanClass = (task.status === "isActive") ? 'todo-title' : 'todo-title todo-title-done';
    const checkboxStatus = (task.status === "isActive") ? false : true
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
    }
    todoList.insertAdjacentHTML('beforeend', taskHtml);
}

/* Удаление задачи по нажатию на кнопке */
todoList.addEventListener('click', deleteTask);

function deleteTask(event) {
    if (event.target.classList.contains("delete")) {
        const parentNode = event.target.closest('.todo-task');
        parentNode.remove();
        /* id задачи */
        const listId = +parentNode.id;
        /* находим индекс в массиве */
        const index = arrTasks.findIndex((task) => {
            return task.id === listId;
        })
        /* удаляем элемент из массива */
        arrTasks.splice(index, 1);

        if (tabDone.classList.contains("footer__tabs-active") && arrTasks.length == 0) {
            checkboxForAll.setAttribute('checked', false);
        }
        saveFunctions("withCheckStatus");
    }
}

/* подсчет оставшихся задач */
function lastTasks() {
    const taskLast = arrTasks.filter((item) => item.status == "isActive")
    counter.textContent = taskLast.length;
}

/* Отмечаем задачу как выполненную */
todoList.addEventListener('click', markTask);

function markTask(event) {
    if (event.target.classList.contains("completed")) {
        const titleNode = event.target.closest('.todo-task');
        const todoTitle = titleNode.querySelector(".todo-title");
        todoTitle.classList.toggle("todo-title-done");
        const titleId = +titleNode.id;
        const index = arrTasks.findIndex((task) => {
            return task.id === titleId;
        });
        if (tabDone.classList.contains("footer__tabs-active")) {
            titleNode.classList.add("todo-task-hide");
        }
        if (tabActive.classList.contains("footer__tabs-active")) {
            titleNode.classList.add("todo-task-hide");
        }
        arrTasks[index] = {
            ...arrTasks[index],
            status: (arrTasks[index].status === "isActive") ? "isDone" : "isActive"
        };
        if (arrTasks[index].status == "isDone") {
            titleNode.querySelector('input').setAttribute('checked', true);
        } else {
            titleNode.querySelector('input').setAttribute('checked', false);
        };
        saveFunctions("withCheckStatus");
    }
}

/* проверка всех задач */

function checkStatusAll(array) {
    const arrDone = array.filter((item) => item.status === "isDone")
    if (array.length === arrDone.length) {
        checkboxForAll.setAttribute('checked', true)
    } else {
        checkboxForAll.setAttribute('checked', false)
    }
    if (arrTasks.length == 0) {
        checkboxForAll.setAttribute('checked', false)
    }
}

/* Отмечаем все задачи, как выполненные */
checkboxForAll.addEventListener('change', markAllTasks);

function markAllTasks() {
    const todoTasks = document.querySelectorAll(".todo-task")
    const isChecked = checkboxForAll.getAttribute("checked") === "true";

    function changeTaskStatus(word) {
        arrTasks.forEach((task, i) => {
            if (isChecked) {
                if (task.status === "isDone") {
                    task.status = "isActive"
                    checkboxForAll.setAttribute('checked', false);
                    if (word === "forAll") {
                        todoTasks[i].querySelector("input").setAttribute('checked', false);
                        todoTasks[i].querySelector("span").classList.remove("todo-title-done");
                    }
                }
            } else {
                task.status = "isDone"
                checkboxForAll.setAttribute('checked', true);
                if (word === "forAll") {
                    todoTasks[i].querySelector("input").setAttribute('checked', true);
                    todoTasks[i].querySelector("span").classList.add("todo-title-done");
                }
            }
        })
    }

    if (tabEvery.classList.contains("footer__tabs-active")) {
        changeTaskStatus("forAll")
    }

    if (tabDone.classList.contains("footer__tabs-active") && isChecked) {
        changeTaskStatus();
        document.querySelector('.todo-list-marked').classList.remove('todo-list-welcome-hide')
        todoList.innerHTML = '';
    }

    if (tabActive.classList.contains("footer__tabs-active") && isChecked) {
        changeTaskStatus();
        showTab('tabActive');
    }

    if (tabDone.classList.contains("footer__tabs-active") && !isChecked) {
        changeTaskStatus();
        showTab('tabDone');
    }

    if (tabActive.classList.contains("footer__tabs-active") && !isChecked && arrTasks.length > 0) {
        changeTaskStatus();
        document.querySelector('.todo-list-active').classList.remove('todo-list-welcome-hide')
        todoList.innerHTML = '';
    }
    lastTasks()
    saveLocalstorage()
}

/* Удаляем все сделанные задачи */
clearAllBtn.addEventListener('click', clearDone)

function clearDone() {
    const newTask = arrTasks.filter((el) => el.status == "isActive");
    arrTasks = newTask;
    todoList.innerHTML = '';
    arrTasks.forEach((task) => {
        renderTask(task, true)
    })
    checkboxForAll.setAttribute('checked', false)
    if (tabDone.classList.contains("footer__tabs-active") && arrTasks.length > 0) {
        todoList.innerHTML = '';
    }
    saveFunctions();
}

/* Функции переключения вкладок */
const tabsAll = document.querySelectorAll('.footer__tab')
tabsAll.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        e.preventDefault;
        tabsAll.forEach((item) => {
            item.classList.remove("footer__tabs-active");
        })
        tab.classList.add("footer__tabs-active");
    })
})

/* функции отображения контента на вкладках */
tabDone.addEventListener('click', function () {
    showTab('tabDone')
});
tabActive.addEventListener('click', function () {
    showTab('tabActive')
});
tabEvery.addEventListener('click', function () {
    showTab('tabEvery')
});

function showTab(tabName) {
    changeTabStatus(tabName);
    document.querySelector('.todo-list-active').classList.add('todo-list-welcome-hide');
    document.querySelector('.todo-list-marked').classList.add('todo-list-welcome-hide');
    todoList.innerHTML = '';
    let arrayTasks;
    if (tabName === 'tabDone') {
        arrayTasks = arrTasks.filter((el) => el.status == "isDone");
    } else if (tabName === 'tabActive') {
        arrayTasks = arrTasks.filter((el) => el.status == "isActive");
    } else {
        arrayTasks = arrTasks;
    }
    checkWelcomeScreen();
    arrayTasks.forEach((item) => {
        renderTask(item, true);
    });
}

/* изменение задачи по дабл клику textContent*/
todoList.addEventListener('dblclick', changeTask);

function changeTask(event) {
    if (!event.target.classList.contains("todo-title")) {
        return
    }
    const button = event.target.parentNode.querySelector('button');
    const spanClass = event.target.classList.value;
    const liElem = event.target.parentNode;
    const spanTodo = event.target.closest('.todo-title');
    const inputChange = document.createElement('input');
    const index = arrTasks.findIndex((task) => {
        return task.id == event.target.parentNode.id;
    })
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
        inputChange.remove()
        const newSpan = `<span class="${spanClass}">${arrTasks[index].text}</span>`;
        button.insertAdjacentHTML('beforeBegin', newSpan)
        button.classList.remove('delete-hide');
        saveLocalstorage()
        if (inputChange.value == "") {
            arrTasks.splice(index, 1);
            liElem.remove();
            saveFunctions();
        }
    }

    inputChange.addEventListener('keydown', (e) => {
        if (e.keyCode !== 13) {
            return
        }
        saveChanges()
    })

    document.addEventListener('click', (el) => {
        if (el.target != inputChange && liElem.contains(inputChange)) {
            saveChanges()
        }
    })
}

function saveLocalstorage() {
    localStorage.setItem("tasks", JSON.stringify(arrTasks));
    localStorage.setItem("tabs", JSON.stringify(arrTabs));
}

function initTable() {
    if (localTabs) {
        localTabs.forEach(tab => {
            if (tab.status == true) {
                document.querySelector(`#${tab.id}`).classList.add("footer__tabs-active");
            }
        });
    } else {
        document.querySelectorAll(".footer__tab")[0].classList.add("footer__tabs-active");
    }

    if (localTasks) {
        localTasks.forEach(item => {
            const activeTab = document.querySelector('.footer__tabs-active');
            const status = item.status;
            if (activeTab === tabDone && status === 'isDone' ||
                activeTab === tabActive && status === 'isActive' ||
                activeTab === tabEvery) {
                renderTask(item, true);
                if (activeTab === tabDone && arrTasks.filter(i => i.status === 'isDone').length === 0) {
                    document.querySelector('.todo-list-marked').classList.remove('todo-list-welcome-hide');
                } else if (activeTab === tabActive && arrTasks.filter(i => i.status === 'isActive').length === 0) {
                    document.querySelector('.todo-list-active').classList.remove('todo-list-welcome-hide');
                }
            }
        });
    }

    checkWelcomeScreen()
    checkStatusAll(arrTasks)
}
initTable()
lastTasks()