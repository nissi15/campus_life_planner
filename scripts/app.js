import { removingSpace, validatingTask } from "./validators.js";

const pages = document.querySelectorAll('.page')
const navlinks =  document.querySelectorAll('.nav-links')
const currentPgTitle = document.getElementById('top-page-name')



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
        let isActiveLink = linkPageName === pageName;

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


// closes the form when we hit x or cancel
function closeTaskForm() {
    taskDialog.close();
}

//reading the values being filled in form
function readAddedTask() {
    return {
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

    document.getElementById('polite-message').textContent = 'All task details in this form are okay';
    document.getElementById('form-intro').textContent = '';
}

// puts the a suggested tag into the tag input
function chooseSuggestedTag(event) {
  const clickedBtn = event.currentTarget;
  const suggestTag = clickedBtn.getAttribute('data-tag-suggestion');
  const tagInput = document.getElementById('task-tag');

  tagInput.value = suggestTag;
  tagInput.focus();
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

showActivePage(getUrlPage());
