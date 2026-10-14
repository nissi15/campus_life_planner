import { higlightText, makeSearchRegex, taskMatching, tweakSpecialHtml } from "./search.js";
import { state } from "./state.js" ;

const taskCards =  document.getElementById('task-cards');
const taskCount =  document.getElementById('task-nbr');
const taskTableBody = document.getElementById('task-table-body');
const emptyState = document.getElementById('empty-state');
const searchError =  document.getElementById('search-error');
const taskDetailsdialog = document.getElementById('task-details-dialog');
const sortDirection = document.getElementById('sort-direction')


export function formatDuration(duration) {
    const minutes = Number(duration)

    if (minutes <= 60) {
        return minutes + (minutes === 1 ? ' minute' : ' minutes');
    }

    const hours = Math.round((minutes / 60) * 100) / 100;
    return hours + (hours === 1 ? ' hour' : ' hours');
}

export function formatDate(dateText) {
    const dateParts = dateText.split('-');
    const year = Number(dateParts[0]);
    const month =  Number(dateParts[1]);
    const day = Number(dateParts[2]);
    const date =  new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
    });
}


export function getVisibleTasks() {
    const searchResult =  makeSearchRegex(state.searchText);
    let visibleTasks =  state.tasks.slice();

    if (searchResult.regex !== null) {
        visibleTasks =  visibleTasks.filter(function (task){
            return taskMatching(task, searchResult.regex)
        });
    }

    visibleTasks.sort(function (FirstTask, secondTask) {
        let comparison = 0;
        if(state.sortField === 'title') {
            comparison = FirstTask.title.localeCompare(secondTask.title);
        } else if (state.sortField === 'duration') {
            comparison = FirstTask.duration - secondTask.duration;
        } else {
            comparison =  FirstTask.dueDate.localeCompare(secondTask.dueDate);
        }

        if (state.sortDirection === 'descending') {
            return comparison * -1;
        }

        return comparison
    });

    return {
        tasks: visibleTasks,
        regex: searchResult.regex,
        error: searchResult.error
    };
}

function makeTitleButton(task, regex) {
    return '<button class="task-title-button" type="button" data-action="details" data-id="' +
        tweakSpecialHtml(task.id) + '">' + higlightText(task.title, regex) + '</button>';
 
}

function renderTaskTable(tasks, regex) {
    taskTableBody.innerHTML = tasks.map(function (task) {
        return '<tr>' +
            '<td>' + makeTitleButton(task, regex) + '</td>' +
            '<td><span class="tag">' + higlightText(task.tag, regex) + '</span></td>' +
            '<td>' + tweakSpecialHtml(formatDate(task.dueDate)) + '</td>' +
            '<td>' + tweakSpecialHtml(formatDuration(task.duration)) + '</td>' +
            '<td><button class="action-button" type="button" data-action="edit" data-id="' + tweakSpecialHtml(task.id) + '">Edit</button></td>' +
            '<td><button class="action-button delete" type="button" data-action="delete" data-id="' + tweakSpecialHtml(task.id) + '">Delete</button></td>' +
            '</tr>';
    }).join('');
}

function renderTaskCards(tasks, regex) {
    taskCards.innerHTML =  tasks.map(function (task) {
        return '<article class="task-card">' +
            '<h2>' + makeTitleButton(task, regex) + '</h2>' +
            '<p><span class="tag">' + higlightText(task.tag, regex) + '</span></p>' +
            '<p>Due: ' + tweakSpecialHtml(formatDate(task.dueDate)) + '</p>' + 
            '<p>Duration: ' + tweakSpecialHtml(formatDuration(task.duration)) + '</p>' +
            '<div class="task-card-actions">' +
            '<button class="action-button" type="button" data-action="edit" data-id="' + tweakSpecialHtml(task.id) + '">Edit</button>' +
            '<button class="action-button delete" type="button" data-action="delete" data-id="' + tweakSpecialHtml(task.id) + '">Delete</button>' +
            '</div></article>';
    
   
    }).join('');
} 


// update both task and search messages.
export function renderTasks() {
    const visibleResult = getVisibleTasks();
    const tasks = visibleResult.tasks;

    renderTaskTable(tasks, visibleResult.regex);
    renderTaskCards(tasks, visibleResult.regex);

    taskCount.textContent = tasks.length+ (tasks.length === 1 ? ' task' : ' tasks');
    searchError.textContent= visibleResult.error;
    emptyState.hidden = tasks.length !== 0 || visibleResult.error !== '';
}


export function updateSortDirectionlabel() {
    const ascending =  state.sortDirection === 'ascending';

    if (state.sortField === 'title') {
        sortDirection.textContent= ascending ? 'A-Z' : 'Z-A';
    } else if (state.sortField === 'duration') {
        sortDirection.textContent = ascending ? 'Shortest first' : 'Longest first';
    } else {
        sortDirection.textContent = ascending ? 'Oldest first' : 'Newest first';
    }
}

//  opens the task details dialog and fills it

export function openTaskDetails(task) {
    document.getElementById('details-title').textContent = task.title;
    document.getElementById('details-status').textContent = task.completed ? 'Completed' : 'Not completed';
    document.getElementById('details-tag').textContent = task.tag;
    document.getElementById('details-date').textContent = formatDate(task.dueDate);
    document.getElementById('details-duration').textContent = formatDuration(task.duration);
    document.getElementById('details-note').textContent = task.note || 'No note added.';
    document.querySelector('.details-note').classList.toggle('empty', task.note === '');
    taskDetailsdialog.showModal()
}


export  function closeTaskDetails() {
    taskDetailsdialog.close();
}

export function renderEverything() {
    renderTasks();
    updateSortDirectionlabel();
}
