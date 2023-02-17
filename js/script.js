/* Все переменные */

const checkbox = document.querySelectorAll(".checkbox__list");
const todoInput = document.querySelector(".todo__input");
const todoList = document.querySelector(".todo-list");
const welcomeList = document.querySelector(".todo-list-welcome");
const checkboxForAll = document.querySelector("#checkAll");
const footer = document.querySelector(".footer");
const counter = document.querySelector(".counter");
const clearAllBtn = document.querySelector(".footer__clearall");
const localTasks = JSON.parse(localStorage.getItem('tasks'));
let arrTasks = [];


todoInput.addEventListener('input', (e) => {
    if (e.target.value === " ") {
        e.target.value = "";
    }
})

document.addEventListener('click', (el) => {
    if (el.target != todoInput && todoInput.value) {
        const newTask = {
            id: Date.now(),
            text: todoInput.value,
            status: false,
        };
        todoInput.value = '';
        todoInput.focus();
        renderTask(newTask)
        checkWelcome();
        lastTasks();
        checkStatusAll(arrTasks);
        saveLocalstorage();
    }
})

/* Отправление значения инпута в list */
todoInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && e.target.value) {
        const newTask = {
            id: Date.now(),
            text: e.target.value,
            status: false,
        };
        e.target.value = '';
        e.target.focus();

        if (!tabDone.classList.contains("footer__tabs-active")) {
            renderTask(newTask)
        } else {
            arrTasks.push(newTask)
        }
        checkTab(document.querySelector('.todo-list-active'));
        checkWelcome();
        lastTasks();
        checkStatusAll(arrTasks);
        saveLocalstorage();
    }
})

/* Приветственный экран */
function checkWelcome() {
    if (arrTasks.length > 0) {
        welcomeList.classList.add('todo-list-welcome-hide');
        footer.classList.remove("footer-hide");
    } else {
        welcomeList.classList.remove('todo-list-welcome-hide');
        footer.classList.add("footer-hide");
    }
}


/* рендер задач */
function renderTask(task, isView = false) {
    const spanClass = task.status ? 'todo-title todo-title-done' : 'todo-title';
    const taskHtml = `<li id="${task.id}" class="todo-task">
            <label class="completed">
              <input type="checkbox" class="checkbox__list" checked="${task.status}"/>
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
        const listId = Number(parentNode.id);

        /* находим индекс в массиве */
        const index = arrTasks.findIndex((task) => {
            return task.id === listId;
        })

        /* удаляем элемент из массива */
        arrTasks.splice(index, 1);

        /* отобразить окно без задач */
        checkWelcome()

        /* подсчет оставшихся задач */
        lastTasks()

        const arrayActive = arrTasks.filter((el) => el.status == false)

        if (tabActive.classList.contains("footer__tabs-active") && arrayActive.length == 0) {
            document.querySelector('.todo-list-active').classList.remove('todo-list-welcome-hide')
        }

        saveLocalstorage()
    }
}

/* подсчет оставшихся задач */
function lastTasks() {
    const taskLast = arrTasks.filter((item) => item.status == false)
    counter.textContent = taskLast.length;
}



/* Отмечаем задачу как выполненную */

todoList.addEventListener('click', markTask);

function markTask(event) {
    if (event.target.classList.contains("completed")) {
        const titleNode = event.target.closest('.todo-task');
        const todoTitle = titleNode.querySelector(".todo-title");
        todoTitle.classList.toggle("todo-title-done");
        const titleId = Number(titleNode.id);
        const index = arrTasks.findIndex((task) => {
            return task.id === titleId;
        });
        checkTab(titleNode);
        arrTasks[index] = {
            ...arrTasks[index],
            status: !arrTasks[index].status
        };
        if (arrTasks[index].status == true) {
            titleNode.querySelector('input').setAttribute('checked', true);
        } else {
            titleNode.querySelector('input').setAttribute('checked', false);
        };

        lastTasks()

        checkStatusAll(arrTasks)
        saveLocalstorage()

        const arrayActive = arrTasks.filter((el) => el.status == false)

        if (tabActive.classList.contains("footer__tabs-active") && arrayActive.length == 0) {
            document.querySelector('.todo-list-active').classList.remove('todo-list-welcome-hide')
        }

        if (tabDone.classList.contains("footer__tabs-active") && arrayActive.length == arrTasks.length) {
            document.querySelector('.todo-list-marked').classList.remove('todo-list-welcome-hide')
        }
    }
}

/* проверка всех задач */

function checkStatusAll(array) {
    const arrDone = array.filter((item) => item.status === true)
    if (array.length === arrDone.length) {
        checkboxForAll.setAttribute('checked', true)
    } else {
        checkboxForAll.setAttribute('checked', false)
    }
}

/* Отмечаем все задачи, как выполненные */
checkboxForAll.addEventListener('change', markAlltasks);

function markAlltasks() {
    const todoTasks = document.querySelectorAll(".todo-task")
    const isChecked = checkboxForAll.getAttribute("checked") === "true";

    if (isChecked) {
        arrTasks.forEach((task, i) => {
            if (task.status == true) {
                task.status = false
                todoTasks[i].querySelector("input").setAttribute('checked', false);
                todoTasks[i].querySelector("span").classList.remove("todo-title-done");
                checkboxForAll.setAttribute('checked', false);
            }
        })
    } else {
        arrTasks.forEach((task, i) => {
            if (task.status == false) {
                task.status = true
                todoTasks[i].querySelector("input").setAttribute('checked', true);
                todoTasks[i].querySelector("span").classList.add("todo-title-done");
                checkboxForAll.setAttribute('checked', true);
            }
        })
    }

    if (tabDone.classList.contains("footer__tabs-active")) {
        document.querySelector('.todo-list-marked').classList.remove('todo-list-welcome-hide')
        todoList.innerHTML = '';
    }

    if (tabActive.classList.contains("footer__tabs-active")) {
        document.querySelector('.todo-list-active').classList.remove('todo-list-welcome-hide')
        todoList.innerHTML = '';
    }

    lastTasks()
    saveLocalstorage()
}

/* Удаляем все сделанные задачи */
clearAllBtn.addEventListener('click', clearDone)

function clearDone() {
    const newTask = arrTasks.filter((el) => el.status == false);
    arrTasks = newTask;
    saveLocalstorage()
    todoList.innerHTML = '';
    arrTasks.forEach((task) => {
        renderTask(task, true)
    })
    checkWelcome()
    checkboxForAll.setAttribute('checked', false)
    if (tabDone.classList.contains("footer__tabs-active") && arrTasks.length > 0) {
        todoList.innerHTML = '';
        document.querySelector('.todo-list-marked').classList.remove('todo-list-welcome-hide')
    }
    lastTasks()
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

/* проверка какая вкладка открыта */
function checkTab(node) {
    if (tabDone.classList.contains("footer__tabs-active")) {
        node.classList.add("todo-task-hide");
    }
    if (tabActive.classList.contains("footer__tabs-active")) {
        node.classList.add("todo-task-hide");
    }
}

/* выполненные вкладка */
const tabDone = document.querySelector('#doneTasks')
tabDone.addEventListener('click', showDone)

function showDone() {
    document.querySelector('.todo-list-active').classList.add('todo-list-welcome-hide')
    const arrayDone = arrTasks.filter((el) => el.status == true)
    if (arrayDone.length == 0) {
        document.querySelector('.todo-list-marked').classList.remove('todo-list-welcome-hide')
    }
    todoList.innerHTML = '';
    arrayDone.forEach((item) => {
        renderTask(item, true)
    })
}

/* активные вкладки */
const tabActive = document.querySelector('#activeTasks')
tabActive.addEventListener('click', showActive)

function showActive() {
    document.querySelector('.todo-list-marked').classList.add('todo-list-welcome-hide')
    const arrayActive = arrTasks.filter((el) => el.status == false)
    if (arrayActive.length == 0) {
        document.querySelector('.todo-list-active').classList.remove('todo-list-welcome-hide')
    }
    todoList.innerHTML = '';
    arrayActive.forEach((item) => {
        renderTask(item, true)
    })
}

/* все вкладки */
const tabEvery = document.querySelector('#allTasks')
tabEvery.addEventListener('click', showAll)

function showAll() {
    document.querySelector('.todo-list-marked').classList.add('todo-list-welcome-hide')
    document.querySelector('.todo-list-active').classList.add('todo-list-welcome-hide')
    todoList.innerHTML = '';
    arrTasks.forEach((item) => {
        renderTask(item, true)
    })
}

/* изменение задачи по дабл клику textContent*/
todoList.addEventListener('dblclick', changeTask);

function changeTask(event) {
    if (event.target.classList.contains("todo-title")) {
        /* убираем кнопку удалить */
        const button = event.target.parentNode.querySelector('button');
        button.classList.add('delete-hide');
        const spanClass = event.target.classList.value;
        const liElem = event.target.parentNode;

        /* ищем нужный индекс элемента из массива */
        const index = arrTasks.findIndex((task) => {
            return task.id == event.target.parentNode.id;
        })
        const value = arrTasks[index].text

        /* получаем название таска */
        const spanTodo = event.target.closest('.todo-title');
        const inputChange = document.createElement('input');
        inputChange.setAttribute('type', "text");
        inputChange.classList.add('input-change');
        inputChange.value = spanTodo.textContent;

        /* удаляем таск и заменяем на инпут */
        spanTodo.parentNode.replaceChild(inputChange, spanTodo);
        inputChange.focus();

        /* меняем value у элемента массива и создаем разметку*/
        inputChange.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                arrTasks[index] = {
                    ...arrTasks[index],
                    text: inputChange.value
                }
                inputChange.remove()
                const newSpan = `<span class="${spanClass}">${arrTasks[index].text}</span>`;
                button.insertAdjacentHTML('beforeBegin', newSpan)
                button.classList.remove('delete-hide');
                saveLocalstorage()
            }
            if (inputChange.value == "") {
                arrTasks.splice(index, 1);
                liElem.remove();
                saveLocalstorage();
                lastTasks();
            }
        })

        document.addEventListener('click', (el) => {
            if (el.target != inputChange && liElem.contains(inputChange)) {
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
                    saveLocalstorage();
                    lastTasks();
                }
            }
        })
    }
}

/* функция сохранения в localStorage */
function saveLocalstorage() {
    localStorage.setItem("tasks", JSON.stringify(arrTasks));
}

function initTable() {
    localTasks.forEach((el) => {
        renderTask(el)
    })
    checkWelcome()
}

initTable()
lastTasks()