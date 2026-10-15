import { higlightText, makeSearchRegex, taskMatching, tweakSpecialHtml } from "./search.js";
import { state } from "./state.js" ;

// task-rendering elements 
const taskCards =  document.getElementById('task-cards');
const taskCount =  document.getElementById('task-nbr');
const taskTableBody = document.getElementById('task-table-body');
const emptyState = document.getElementById('empty-state');
const searchError =  document.getElementById('search-error');
const taskDetailsdialog = document.getElementById('task-details-dialog');
const sortDirection = document.getElementById('sort-direction')


// dashboard output elementss,
const totalTasks =  document.getElementById('total-tasks');
const totalDuration =  document.getElementById('total-duration');
const topTag = document.getElementById('top-task');
const todayDate = document.getElementById('today-date');
const todayTasks = document.getElementById('today-tasks');
const weeklyTotal = document.getElementById('total-weekly');
const weeklyChart = document.getElementById('week-chart');
const targetText = document.getElementById('target_text');
const weeklyProgress = document.getElementById('week-progress');
const recentTasks = document.getElementById('recent-tasks');

// setting elements used on setting page
const durationUnitInputs = document.querySelectorAll('input[name="unit"]');
const weeklyCap = document.getElementById('weekly-cap');
const themeButtons = document.querySelectorAll('[data-theme-toggle]');
const durationLabel = document.getElementById('duration-label');

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
    updateSettingForm()
    renderTasks();
    updateSortDirectionlabel();
    renderDashboard();
}

function makeDateText(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return year + '-' + month + '-' + day;
}

function formatHours(min) {
    const hours = Math.round((min / 60) * 100) / 100;
    
    return hours + (hours === 1 ? ' hour' : ' hours');
}


// find tags used by the most tasks

export function findTopTag(tasks) {
    const tagCounts = {};
    let mostUsedTag = 'None';
    let highestCount  = 0;

    for (let i=0; i < tasks.length; i+=1) {
        const tag = tasks[i].tag;
        const tagKey = tag.toLowerCase();

        if(!tagCounts[tagKey]) {
            tagCounts[tagKey] = {
                name: tag,
                count: 0
            };
        }

        tagCounts[tagKey].count += 1;

        if (tagCounts[tagKey].count > highestCount) {
            mostUsedTag = tagCounts[tagKey].name;
            highestCount = tagCounts[tagKey].count;
        }
    }

    return mostUsedTag;
}

// displays statistic cards 

export function renderStatistics() {
    let durationInMinutes = 0;

    for (let i = 0; i < state.tasks.length; i += 1) {
        durationInMinutes += Number(state.tasks[i].duration);
    }

    totalTasks.textContent = state.tasks.length;
    totalDuration.textContent = formatDuration(durationInMinutes);
    topTag.textContent = findTopTag(state.tasks);
}

// shows tags that are due today

export function renderTodayTasks() {
    const currentDate = new Date();
    const currentDateText = makeDateText(currentDate);
    const tasksDueToday = state.tasks.filter(function (task) {
        return task.dueDate === currentDateText;
    });


    todayDate.textContent = currentDate.toLocaleDateString('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    if (tasksDueToday.length === 0) {
        todayTasks.innerHTML = '<p class="today-empty">No tasks are due today.</p>';
        return;
    }

    todayTasks.innerHTML = tasksDueToday.map(function (task) {
        const completedClass = task.completed ? ' completed' : '';
        const checked = task.completed ? ' checked' : '';
        const checkLabel = task.completed ? 'Mark ' + task.title + ' not completed' : 'Mark ' + task.title +' completed';

        return '<article class="today-task' + completedClass + '">' +
            '<div class= "today-task-row">' +
            '<label class="today-check">' +
            '<span class="screen-reader-only">' +tweakSpecialHtml(checkLabel) + '</span>' +
            '<input type="checkbox" data-action="toggle-completed" data-id="' + tweakSpecialHtml(task.id) + '"' + checked + '>' +
            '</label>' +
            '<strong class= "today-task-title">' + tweakSpecialHtml(task.title) + '</strong>' +
            '<div class="today-task-meta">' +
            '<span class="tag">' + tweakSpecialHtml(task.tag) + '</span>' +
            '<span>' + tweakSpecialHtml(formatDuration(task.duration)) + '</span>' +
            '<button class="action-button" type="button" data-action="edit" data-id="' + tweakSpecialHtml(task.id) + '">Edit</button>' +
            '</div></div>' +
            '<details class="today-note">' +
            '<summary>View or edit note</summary>' +
            '<div class="today-note-editor">' +
            '<label class="screen-reader-only" for="today-note-' + tweakSpecialHtml(task.id) + '">Note for ' + tweakSpecialHtml(task.title) + '</label>' + 
            '<textarea id="today-note-' + tweakSpecialHtml(task.id) + '" maxlength="200">' + tweakSpecialHtml(task.note) + '</textarea>' +
            '<button class="button secondary" type="button" data-action="save-note" data-id="' + tweakSpecialHtml(task.id) + '">Save note</button>' +
            '</div></details></article>';

    }).join('');
}


// create 7 days 

function  getLastSevenDays() {
    const days = [];
    const currentDate = new Date();


    for (let i = 6; i >= 0; i-= 1) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        days.push(date);
    }
    return days;
}

// caluclates the duration of tasks for any day
function getMinutesForDate(dateText) {
    let min = 0;

    for (let i = 0; i < state.tasks.length; i += 1) {
        if (state.tasks[i].dueDate === dateText) {
            min += Number(state.tasks[i].duration);
        }
    }

    return min;
}

export function renderWeeklyChart() {
    const days = getLastSevenDays();
    const todayText = makeDateText(new Date());
    const dayTotals = [];

    let highestMinutes = 0;
    let totalMinutes = 0;

    for (let i = 0; i < days.length; i += 1) {
        const dateText = makeDateText(days[i]);
        const minutes = getMinutesForDate(dateText);
        dayTotals.push(minutes);
        totalMinutes += minutes;

        if (minutes > highestMinutes) {
            highestMinutes = minutes;
        }
    }

    weeklyChart.innerHTML = days.map(function (date, index) {
        const dateText = makeDateText(date);
        const minutes = dayTotals[index];
        const barHeight = highestMinutes === 0 ? 4 : Math.max(4, Math.round((minutes / highestMinutes) * 100));
        const todayClass = dateText === todayText ? ' today' : '';
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        const hoursLabel = formatHours(minutes);

        return '<div class="bar-item' + todayClass + '" tabindex="0" aria-label="' +
            tweakSpecialHtml(dayName + ', ' + hoursLabel) + '" style="--bar-height: ' + barHeight + '%">' +
            '<div class="bar-shell">' +
            '<span class="bar-value">' + tweakSpecialHtml(hoursLabel) + '</span>' +
            '<span class="bar" style="height: ' + barHeight + '%"></span>' +
            '</div><span>' + tweakSpecialHtml(dayName) + '</span></div>';

    }).join('');

    weeklyTotal.textContent = formatHours(totalMinutes);
    return totalMinutes;
}


// Update progress bar i'm using 20 hours as target for now
export function updateWeeklyTarget(totalMinutes) {
    
    const targetHours = state.settings.weeklyTarget;
    const targetMinutes = targetHours * 60;
    const completedHours = Math.round((totalMinutes / 60) * 100) / 100;
    const progressValue = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));


    weeklyProgress.value = progressValue;
    weeklyProgress.textContent = progressValue + '%';

    if (totalMinutes <= targetMinutes) {
        const remainingHours = Math.round(((targetMinutes - totalMinutes) / 60) * 100) / 100;
        targetText.textContent = 'Weekly target: ' + completedHours + ' of ' + targetHours + 
            ' hours - ' + remainingHours + ' hours remaining.';
    } else {
        const exceededHours = Math.round(((totalMinutes - targetMinutes) / 60) * 100) /100;
        targetText.textContent = 'Weekly target: ' + completedHours + ' of ' + targetHours + ' hours - target exceeded by ' + exceededHours + ' hours.';
    }
}


// showing 5 recent tasks
export function renderRecentTasks() {
    const recent = state.tasks.slice().sort(function (firstTask, secondTask) {
        return secondTask.updatedAt.localeCompare(firstTask.updatedAt)
    }).slice(0, 5);
    
    if (recent.length === 0) {
        recentTasks.innerHTML = '<li class="today-empty">No tasks have been added.</li>';
        return;
    }

    recentTasks.innerHTML = recent.map(function (task) {
        return '<li class="simple-task">' +
            makeTitleButton(task, null) +
            '<span><span class="tag">' + tweakSpecialHtml(task.tag) + '</span></span>' +
            '<time datetime="' + tweakSpecialHtml(task.dueDate) + '">' + tweakSpecialHtml(formatDate(task.dueDate)) + '</time>' +
            '<span>' + tweakSpecialHtml(formatDuration(task.duration)) + '</span>' +
            '<button class="action-button" type="button" data-action="edit" data-id="' + tweakSpecialHtml(task.id) + '">Edit</button>' +
            '<button class="action-button delete" type="button" data-action="delete" data-id="' + tweakSpecialHtml(task.id) + '">Delete</button>' +
            '</li>'
    }).join('');
}


// all dashboard functions called here 
export function renderDashboard() {
    renderStatistics();
    renderTodayTasks();
    const totalMin = renderWeeklyChart();
    updateWeeklyTarget(totalMin);
    renderRecentTasks();

}


export function updateSettingForm() {
    for (let i = 0; i < durationUnitInputs.length; i += 1) {
        durationUnitInputs[i].checked = durationUnitInputs[i].value === state.settings.durationUnit;
    }

    weeklyCap.value = state.settings.weeklyTarget;
    durationLabel.textContent = '(' + state.settings.durationUnit + ')';
}


// this applies theme to the page and updates the theme btns 
export function applyTheme() {
    const darkMode = state.settings.theme === 'dark';
    const nextThemeText = darkMode ? 'Light mode' : 'Dark mode';

    document.documentElement.setAttribute('data-theme', state.settings.theme);

    for (let i = 0; i < themeButtons.length; i += 1) {
        const button = themeButtons[i];
        const text = button.querySelector('span');

        button.setAttribute('aria-pressed', darkMode ? 'true' : 'false');
        button.setAttribute('aria-label', 'change to ' + nextThemeText.toLowerCase());

        if (text) text.textContent = nextThemeText;
    }
}
