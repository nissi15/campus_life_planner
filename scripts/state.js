const sampleTasks = [
    {
        id: 'task-1',
        title: 'Attend jquery session',
        duration: 90,
        dueDate: '2026-10-09',
        tag: 'study',
        completed: false,
        note: 'We are scraping rotten tomatoes',
        createdAt: '2026-10-01T09:00:00.000Z',
        updatedAT: '2026-10-01T09:00:00.000Z'
    },
    {
        id: 'task-2',
        title: 'Attend regex class',
        duration: 60,
        dueDate: '2026-10-08',
        tag: 'Lecture',
        completed: false,
        note: 'Remember to start backdropping',
        createdAt: '2026-10-01T09:00:00.000Z',
        updatedAt: '2026-10-01T09:00:00.000Z'
    },
    {
        id: 'task-3',
        title: 'Prepare to join robotics Club',
        duration: 120,
        dueDate: '2026-10-07',
        tag: 'Club',
        completed: false,
        note: '',
        createdAt: '2026-10-02T010:00:00.000Z',
        updatedAt: '2026-10-02T010:00:00.000Z'
    }

]

export const state = {
    tasks: sampleTasks,
    searchText: '',
    sortField: 'dueDate',
    sortDirection: 'ascending'
};

export function setTasks(tasks) {
    state.tasks = tasks;
}

export function addTask(task) {
    state.tasks.push(task);
}

export function findTask(taskId) {
    return state.tasks.find(function (task) {
        return task.id === taskId;
    })
}

export function updateTask(taskId, changedTask) {
    const taskIndex = state.tasks.findIndex(function (task) {
        return task.id === taskId;
    });

    if (taskIndex !== -1) {
        state.tasks[taskIndex] = changedTask;
    }
}

export function removeTask(id) {
    state.tasks = state.tasks.filter(function (task) {
        return task.id !== id
    });
}

export function setSearchText(searchText) {
    state.searchText = searchText;
}

export function setSortField(sortField) {
    state.sortField = sortField;
}

export function reverseSortDirection() {
    if (state.sortDirection === 'ascending') {
        state.sortDirection = 'descending';

    }else {
        state.sortDirection = 'ascending';
    }
}
