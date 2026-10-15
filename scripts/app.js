import { removingSpace, validatingImport, validatingTask } from "./validators.js";

import { addTask, findTask, removeTask, reverseSortDirection, setSearchText, setSettings, setSortField, setTasks, state, toggleTaskCompleted, updateTask, updateTaskNote } from "./state.js";

import { applyTheme, closeTaskDetails, openTaskDetails, renderEverything } from "./ui.js";
import { downloadJson, saveSettings, saveTasks, loadSeedTasks, loadSettings, loadTasks } from "./storage.js";

const pages = document.querySelectorAll('.page')
const navlinks =  document.querySelectorAll('.nav-links')
const currentPgTitle = document.getElementById('top-name')

// setting vars
const durationUnitInputs = document.querySelectorAll('input[name="unit"]');
const weeklyCap = document.getElementById('weekly-cap');
const saveSettingsBtn = document.getElementById('save-settings');
const exportJsonBtn = document.getElementById('export-json');
const themeButtons = document.querySelectorAll('[data-theme-toggle]');
const importJsonInput = document.getElementById('import-json');
const resetDataBtn = document.getElementById('reset-data');


let viewedTaskId = "";

function getUrlPage() {
    let pgUrl = window.location.hash.replace('#', '').replace('-page', '');

    if (pgUrl === 'about') {
        return 'about';
    } else if (pgUrl === 'task') {
        return 'task';
    } else if (pgUrl === 'settings')
        return 'settings';
    else {
        return 'dashboard';
    }

}

//  helps us see one page and hides the rest
function showActivePage(pageName) {
    for (let i = 0; i < pages.length; i += 1) {
        const currentPage =  pages[i];
        const showPage =  currentPage.id === pageName + '-page';

        currentPage.hidden = !showPage;
        currentPage.classList.toggle('active', showPage);
    }

    for (let i = 0; i < navlinks.length; i += 1) {
        let currentLink = navlinks[i];
        let linkPageName = currentLink.getAttribute('href').replace('#', '');
        let isActiveLink = linkPageName === pageName + '-page';

        currentLink.classList.toggle('active', isActiveLink);

        if (isActiveLink) {
        currentLink.setAttribute('aria-current', 'page');
        } else {
        currentLink.removeAttribute('aria-current');
        }
    }

    const UrlPageNames = {
        dashboard: 'Dashboard',
        task: 'Tasks',
        about: 'About',
        settings: 'Settings'
    };

    if (currentPgTitle) {
        currentPgTitle.textContent = UrlPageNames[pageName];
    }
          
}


const taskDialog = document.getElementById('task-dialog');
const taskForm = document.getElementById('task-form');
const closeBtn = document.getElementById('close-dialog');
const cancelBtn = document.getElementById('cancel-dialog');
const openBtn = document.querySelectorAll('[data-open-form]');
const tagBtns = document.querySelectorAll('[data-tag-suggestion]');


// it hides old data or red error from previous tasks creation attempts
function clearTaskForm() {
    taskForm.reset();
    document.getElementById('task-id').value = '';

    const fieldNames = ['title', 'duration', 'dueDate', 'tag'];

    for (let i = 0; i < fieldNames.length; i += 1) {
        const fieldName = fieldNames[i];
        const inputId = fieldName === 'dueDate' ? 'task-date' : 'task-' + fieldName;
        const input = document.getElementById(inputId);
        const error = document.getElementById(fieldName + '-error');

        input.setAttribute('aria-invalid', 'false');
        error.textContent = '';
    }
}

// it just opens an empty form 
function openTaskForm() {
    clearTaskForm();
    document.getElementById('form-title').textContent = 'Add task';
    document.getElementById('form-intro').textContent = 'Add the essential information for your campus task.';
    document.getElementById('save-task-button').textContent = 'Check task';
    taskDialog.showModal();
    document.getElementById('task-title').focus();
}


function openEditForm(taskId) {
    const task = findTask(taskId);

    if(!task) return;

    clearTaskForm();
    document.getElementById('task-id').value =task.id;
    document.getElementById("task-title").value = task.title;
    document.getElementById('task-duration').value = task.duration;
    document.getElementById('task-date').value = task.dueDate
    document.getElementById("task-tag").value = task.tag;
    document.getElementById("task-note").value = task.note;
    document.getElementById("form-title").textContent = "Edit task";
    document.getElementById('form-intro').textContent = 'Update the task information below';
    document.getElementById('save-task-button').textContent = 'Save changes';
    taskDialog.showModal();
    document.getElementById('task-title').focus();
}


// closes the form when we hit x or cancel
function closeTaskForm() {
    taskDialog.close();
}

//reading the values being filled in form
function readAddedTask() {
    return {
        id: document.getElementById('task-id').value,
        title: removingSpace(document.getElementById('task-title').value),
        duration:  document.getElementById('task-duration').value.trim(),
        dueDate: document.getElementById('task-date').value,
        note: document.getElementById('task-note').value.trim(),
        tag: removingSpace(document.getElementById('task-tag').value)
    }
}

// shows the user validation errors
function displayErrors(errors) {
    const fieldNames = ['title', 'duration', 'dueDate', 'tag'];

    for (let i = 0; i < fieldNames.length; i += 1) {
        const fieldName = fieldNames[i];
        const inputId = fieldName === 'dueDate' ? 'task-date' : 'task-' + fieldName;
        const input = document.getElementById(inputId);
        const error = document.getElementById(fieldName + '-error');
        const errorMsg = errors[fieldName] || '';

        error.textContent = errorMsg;
        input.setAttribute('aria-invalid', errorMsg !== '' ? 'true' : 'false');
  }

}


function focusInvalidError(errors) {
      if (errors.title) {
        document.getElementById('task-title').focus();
    } else if (errors.duration) {
        document.getElementById('task-duration').focus();
    } else if (errors.dueDate) {
        document.getElementById('task-date').focus();
    } else if (errors.tag) {
        document.getElementById('task-tag').focus();
    }
}

// validates the form
function submitTask(sub) {
    sub.preventDefault();

    const task = readAddedTask()
    const errors = validatingTask(task)
    
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-duration').value = task.duration;
    document.getElementById('task-tag').value = task.tag;
    document.getElementById('task-note').value = task.note;
    
    displayErrors(errors);

    if (Object.keys(errors).length > 0) {
        focusInvalidError(errors)
        return;
    }
    const currentTime = new Date().toISOString()

    const durationInMinutes = state.settings.durationUnit === 'hours'
        ? Number(task.duration) * 60
        : Number(task.duration);

    if (task.id === '') {
        addTask({
            id: 'task-' + Date.now(),
            title: task.title,
            duration: Number(task.duration),
            dueDate: task.dueDate,
            tag: task.tag,
            completed: false,
            note: task.note,
            createdAt: currentTime,
            updatedAt: currentTime
        });
        document.getElementById('polite-message').textContent = 'Task added.';
    } else {
        const oldTask = findTask(task.id);

        updateTask(task.id, {
            id: oldTask.id,
            title: task.title,
            duration: Number(task.duration),
            dueDate: task.dueDate,
            tag: task.tag,
            note: task.note,
            completed: oldTask.completed,
            createdAt: oldTask.createdAt,
            updatedAt: currentTime
        });
        document.getElementById('form-intro').textContent = '';
    }

    saveTasks(state.tasks)
    closeTaskForm();
    renderEverything();
}



// puts the a suggested tag into the tag input
function chooseSuggestedTag(event) {
  const clickedBtn = event.currentTarget;
  const suggestTag = clickedBtn.getAttribute('data-tag-suggestion');
  const tagInput = document.getElementById('task-tag');

  tagInput.value = suggestTag;
  tagInput.focus();
}


function searchTasks(event) {
    setSearchText(event.target.value);
    renderEverything();
}



function changeSortField(event) {
    setSortField(event.target.value);
    renderEverything();
}


function changeSortDirection() {
    reverseSortDirection();
    renderEverything();

}


// it handles edit and delete, details for tables and cards
function HandleTaskAction(event) {
    const actionBtn = event.target.closest('[data-action]');

    if (!actionBtn) return;

    const taskId = actionBtn.getAttribute('data-id');
    const action = actionBtn.getAttribute('data-action');

    if (action === 'details') {
        const task = findTask(taskId);
        viewedTaskId = taskId;
        openTaskDetails(task);
    } else if (action === 'edit') {
        openEditForm(taskId);
    } else if (action === 'delete') {
        const shouldDelete = window.confirm('Delete this task');
        
        if (shouldDelete) {
            removeTask(taskId);
            saveTasks(state.tasks);
            renderEverything();
            document.getElementById('polite-message').textContent = 'Task deleted.';
        }
    }
}


function editTaskFromDetals() {
    closeTaskDetails();
    openEditForm(viewedTaskId);
}


// when today checkbox changes it updates a task
function changeTodayTask(event) {
    const checkbox = event.target.closest('[data-action="toggle-completed"]');

    if (!checkbox) return;

    const taskId = checkbox.getAttribute('data-id');
    toggleTaskCompleted(taskId);
    saveTasks(state.tasks);
    renderEverything();

    const targetMsg = document.getElementById('target_text').textContent;
    document.getElementById('polite-message').textContent = 'Task Completion updated. ' + targetMsg;
}



// saves a note added from the today's card
function handleTodayTaskAction(event) {
    const actionBtn = event.target.closest('[data-action]');

    if (!actionBtn) return;

    const action = actionBtn.getAttribute('data-action');
    const taskId = actionBtn.getAttribute('data-id');

    if (action === 'edit') {
        openEditForm(taskId);
        return;
    }

    if(action!== 'save-note') return;

    const todayTask = actionBtn.closest('.today-task');
    const noteInput = todayTask.querySelector('textarea');

    updateTaskNote(taskId, noteInput.value);
    renderEverything();

    const targetMsg = document.getElementById('target_text').textContent;
    document.getElementById('polite-message').textContent = 'Task note saved. ' + targetMsg;
}


function savePlannerSettings() {
    let selectedUnit = '';

    for (let i = 0; i < durationUnitInputs.length; i +=1) {
        if (durationUnitInputs[i].checked) selectedUnit = durationUnitInputs[i].value;
    }

    const targetHours = Number(weeklyCap.value)

    if (selectedUnit === '' || targetHours < 1 || targetHours > 168) {
        weeklyCap.setAttribute('aria-invalid', 'true');
        document.getElementById('urgent-message').textContent = 'Choose a duration unit and a weekly target in hours (1-168).';
        return;
    }

    weeklyCap.setAttribute('aria-invalid', 'false');
    setSettings({
        durationUnit: selectedUnit,
        weeklyTarget: targetHours,
        theme: state.settings.theme
    });
    saveSettings(state.settings);
    renderEverything();
    document.getElementById('polite-message').textContent = 'Planner settings saved.';
}


function toggleTheme() {
    const nextTheme = state.settings.theme === 'dark' ? 'light' : 'dark';

    setSettings({
        durationUnit: state.settings.durationUnit,
        weeklyTarget: state.settings.weeklyTarget,
        theme: nextTheme
    });
    saveSettings(state.settings);
    applyTheme();
    document.getElementById('polite-message').textContent = nextTheme + ' theme enabled.';
}
    
function exportTasks() {
    downloadJson(state.tasks);
    document.getElementById('polite-message').textContent = 'Tasks exported as JSON.';

}


async function importTasks(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    try {
        const fileText = await selectedFile.text();
        const importedTasks = JSON.parse(fileText);
        const importError = validatingImport(importedTasks);

        if (importError !== '') {
            document.getElementById('urgent-message').textContent = importError;
            return;
        }
        
        const shouldImport = window.confirm('Replace the current tasKs with the imported tasks');
        if (!shouldImport) return;

        setTasks(importedTasks);
        saveTasks(state.tasks);
        renderEverything();
        document.getElementById('polite-message').textContent = 'Tasks imported successfully.';
    } catch (error) {
        document.getElementById('urgent-message').textContent = 'The selected file is not a valid JSON.';
    } finally {
        event.target.value = '';
    }
} 


async function resetSampleData() {
    const shouldReset = window.confirm('Replace the current tasks with the sample tasks?');

    if (!shouldReset) return;

    try {
        const seedTasks = await loadSeedTasks();
        const seedError = validatingImport(seedTasks);

        if (seedError !== '') throw new Error(seedError);

        setTasks(seedTasks);
        saveTasks(state.tasks);
        renderEverything();
        document.getElementById('polite-message').textContent = 'Sample tasks restored.';
    } catch (error) {
        document.getElementById('urgent-message').textContent = 'The sample tasks could not be restored.';
    }
}


async function startApp() {
    const savedSettings = loadSettings();
    if(savedSettings !== null) setSettings(savedSettings);

    const savedTasks = loadTasks();

    if (savedTasks !== null && validatingImport(savedTasks) === '') {
        setTasks(savedTasks);
    } else {
        try {
            const seedTasks = await loadSeedTasks();

            if (validatingImport(seedTasks) !== '') {
                throw new Error('The sample tasks are invalid.');
            }

            setTasks(seedTasks);
            saveTasks(state.tasks)
        } catch (error) {
            document.getElementById('urgent-message').textContent = 'The saved tasks couldnot be loaded.'
        }
    }

    applyTheme();
    showActivePage(getUrlPage());
    renderEverything();
}

window.addEventListener('hashchange', function (){
    showActivePage(getUrlPage());
});

// connects the add task button to the dialog
for (let i = 0; i < openBtn.length; i+= 1) {
    openBtn[i].addEventListener('click', openTaskForm);
}

cancelBtn.addEventListener('click', closeTaskForm);
closeBtn.addEventListener('click', closeTaskForm);
taskForm.addEventListener('submit', submitTask);

for (let i=0; i < tagBtns.length; i += 1 ) {
    tagBtns[i].addEventListener('click', chooseSuggestedTag);
}


const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-opt');
const sortDirectionBtn = document.getElementById('sort-direction');
const taskTableBody = document.getElementById('task-table-body');
const taskCards = document.getElementById('task-cards');
const closeDetailsBtn = document.getElementById('close-details');
const closeDetailsBottomBtn = document.getElementById('close-details-bottom');
const editFromDetailsBtn = document.getElementById('edit-from-details');
const todayTasks = document.getElementById('today-tasks');
const recentTasks = document.getElementById('recent-tasks')


searchInput.addEventListener('input', searchTasks);
sortSelect.addEventListener('change', changeSortField);
sortDirectionBtn.addEventListener('click', changeSortDirection);
taskTableBody.addEventListener('click', HandleTaskAction);
taskCards.addEventListener('click', HandleTaskAction)
closeDetailsBtn.addEventListener('click', closeTaskDetails);
closeDetailsBottomBtn.addEventListener('click', closeTaskDetails);
editFromDetailsBtn.addEventListener('click', editTaskFromDetals);
todayTasks.addEventListener('change', changeTodayTask);
todayTasks.addEventListener('click', handleTodayTaskAction);
recentTasks.addEventListener('click', HandleTaskAction)

// settings event listeners and data json 
saveSettingsBtn.addEventListener('click', savePlannerSettings);

for (let i = 0; i < themeButtons.length; i += 1) {
    themeButtons[i].addEventListener('click', toggleTheme);
}

exportJsonBtn.addEventListener('click', exportTasks);
importJsonInput.addEventListener('change', importTasks);
resetDataBtn.addEventListener('click', resetSampleData);

startApp();

