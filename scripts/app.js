import { removingSpace, validatingTask } from "./validators.js";

import { addTask, findTask, removeTask, reverseSortDirection, setSearchText, setSortField, updateTask } from "./state.js";

import { closeTaskDetails, openTaskDetails, renderEverything } from "./ui.js";

const pages = document.querySelectorAll('.page')
const navlinks =  document.querySelectorAll('.nav-links')
const currentPgTitle = document.getElementById('top-name')



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
            renderEverything();
            document.getElementById('polite-message').textContent = 'Task deleted.';
        }
    }
}


function editTaskFromDetals() {
    closeTaskDetails();
    openEditForm(viewedTaskId);
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


searchInput.addEventListener('input', searchTasks);
sortSelect.addEventListener('change', changeSortField);
sortDirectionBtn.addEventListener('click', changeSortDirection);
taskTableBody.addEventListener('click', HandleTaskAction);
taskCards.addEventListener('click', HandleTaskAction)
closeDetailsBtn.addEventListener('click', closeTaskDetails);
closeDetailsBottomBtn.addEventListener('click', closeTaskDetails);
editFromDetailsBtn.addEventListener('click', editTaskFromDetals);

showActivePage(getUrlPage());
renderEverything();

