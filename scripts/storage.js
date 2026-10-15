const tasksStorageName = 'campusPlannerTasks';
const settingsStorageName = 'campusPlannerSettings';

function readSavedJson(name) {
    const savedTxt = localStorage.getItem(name);

    if (savedTxt === null) return null;

    try {
        return JSON.parse(savedTxt);
    } catch (error) {
        return null;
    }
}


export function loadTasks() {
    return readSavedJson(tasksStorageName);
}

export function saveTasks(tasks) {
    localStorage.setItem(tasksStorageName, JSON.stringify(tasks));
} 


export function loadSettings() {
    return readSavedJson(settingsStorageName);
}

export function saveSettings(settings) {
    localStorage.setItem(settingsStorageName, JSON.stringify(settings));
}

// getting tasks (sample data) in seed.json 
export async function loadSeedTasks() {
    const response = await fetch('assets/seed.json');

    if (!response.ok) {
        throw new Error('The sample taks could not be loaded');
    }

    return response.json();
}

export function downloadJson(tasks) {
    const jsonText = JSON.stringify(tasks, null, 2);
    const jsonFile = new Blob([jsonText], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(jsonFile);
    const downloadLink = document.createElement('a');

    downloadLink.href = downloadUrl;
    downloadLink.download = 'campus-planner-tasks.json';
    downloadLink.click();

    URL.revokeObjectURL(downloadUrl);
}
