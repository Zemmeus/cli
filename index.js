const fs = require('fs');

// Проверка наличия файла задач
function checkForFile() {
    if (!fs.existsSync("tasks.json")) {
        fs.writeFileSync('tasks.json', JSON.stringify([])); // Инициализация файла
    }
}

// Загрузка задач из файла
function loadTasks(){
    checkForFile();
    const data = fs.readFileSync("tasks.json", "utf-8");
    return data.trim() === "" ? [] : JSON.parse(data);
}

// Сохранение задач в файл
function saveTasks(tasks) {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}

// Добавление новой задачи
function addTask(taska) {
    let tasks = loadTasks();
    const newTask = {
        "id": tasks.length + 1, // ID задачи
        "description": taska,
        "status": "todo"
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Задача "${taska}" добавлена с ID ${newTask.id}`);
}

// Обновление задачи по ID
function updateTask(taska, id) {
    let tasks = loadTasks();
    const taskId = parseInt(id);
    let taskFound = false;

    const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
            taskFound = true;
            return { ...task, description: taska };
        }
        return task;
    });

    if (taskFound) {
        saveTasks(updatedTasks);
        console.log(`Задача с ID ${id} обновлена.`);
    } else {
        console.log(`Задача с ID ${id} не найдена.`);
    }
}

// Удаление задачи по ID
function deleteTask(id) {
    let tasks = loadTasks();
    const taskId = parseInt(id);

    const filteredTasks = tasks.filter(task => task.id !== taskId);

    if (filteredTasks.length !== tasks.length) {
        saveTasks(filteredTasks);
        console.log(`Задача с ID ${id} удалена.`);
    } else {
        console.log(`Задача с ID ${id} не найдена.`);
    }
}

// Универсальная функция для изменения статуса задачи
function changeTaskStatus(id, status) {
    let tasks = loadTasks();
    const taskId = parseInt(id);
    let taskFound = false;

    const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
            taskFound = true;
            return { ...task, status: status };
        }
        return task;
    });

    if (taskFound) {
        saveTasks(updatedTasks);
        console.log(`Статус задачи с ID ${id} изменён на "${status}".`);
    } else {
        console.log(`Задача с ID ${id} не найдена.`);
    }
}

// Вывод всех описаний задач
function showDescriptions() {
    let tasks = loadTasks();
    tasks.forEach(task => console.log(task.description));
}

// Смена статусов всех задач
function updateAllTasksStatus(status) {
    let tasks = loadTasks();
    const updatedTasks = tasks.map(task => ({ ...task, status }));
    saveTasks(updatedTasks);
    console.log(`Все задачи обновлены на статус "${status}".`);
}

// Обработка команд
const args = process.argv.slice(2);
const command = args[0];
const task = args[1];
const id = args[1];
const task_update = args[2];

// Используем switch для более удобной обработки команд
switch (command) {
    case "add":
        if (task) {
            addTask(task);
        } else {
            console.log('Напишите node index.js add "Название задачи"');
        }
        break;

    case "update":
        if (id && task_update) {
            updateTask(task_update, id);
        }
        break;

    case "delete":
        if (id) {
            deleteTask(id);
        }
        break;

    case "prog":
        if (id) {
            changeTaskStatus(id, "in-progress");
        }
        break;

    case "done":
        if (id) {
            changeTaskStatus(id, "done");
        }
        break;

    case "list":
        showDescriptions();
        break;

    case "list-todo":
        updateAllTasksStatus("todo");
        break;

    case "list-done":
        updateAllTasksStatus("done");
        break;

    case "list-progress":
        updateAllTasksStatus("in-progress");
        break;

    default:
        console.log('Команда не распознана. Используйте команды: add, update, delete, prog, done, list, list-todo, list-done, list-progress');
}
