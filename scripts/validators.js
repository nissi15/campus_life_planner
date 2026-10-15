const repeatedWord = /\b(\w+)\s+\1\b/i;
const durationRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
const tagRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;


export function validatingTitle(title) {
    if (title === '') {
        return 'Please add a Title.';
    }

    if (title.length < 3 || title.length > 80) {
        return 'The title should be atleast 3 to 80 characters.';
    }

    if (repeatedWord.test(title)) {
        return "Don't repeat the same word twice";
    }

    return '';

}

// removes spaces from start and end and also trims repeated space
export function removingSpace(text) {
    return String(text).trim().replace(/\s+/g, ' ');
}


// this checks if the duration(time) is not negative number
export function validatingDuration(duration) {
    let time = String(duration).trim();

    if (!durationRegex.test(time)) {
        return 'Enter a valid number (positive)';
    }

    if(Number(time) <= 0) {
        return 'Duration must be greater than zero';
    }

    return '';
}

    //  validates if the date entered is the correct format
export function validatingDate(date) {
    if (!dateRegex.test(date)) {
        return 'Use a valid date with this YYYY-MM-DD format.';
    }

    const dateSplit = date.split('-');
    const year = Number(dateSplit[0]);
    const month = Number(dateSplit[1]);
    const day = Number(dateSplit[2]);
    const newDate = new Date(Date.UTC(year, month - 1, day));

    let correctYear = newDate.getUTCFullYear() === year;
    let correctMonth =  newDate.getUTCMonth() === month - 1;
    let correctDay = newDate.getUTCDate() === day;

    if (!correctYear || !correctDay || !correctMonth) {
        return "This date does not exist, try again";

    }

    return '';
}


export function validatingTag(tag) {
    if (!tagRegex.test(tag)) {
        return 'Use letters, single spaces, or hyphens only.';
    }

    if (tag.length < 2 || tag.length > 25) {
        return 'Tag must be 2 to 25 characters.';
    }

  return '';
}


export function validatingTask(task) {
    let errors = {};

    const titleError = validatingTitle(task.title);
    const durationError = validatingDuration(task.duration);
    const dateError = validatingDate(task.dueDate);
    const tagError = validatingTag(task.tag);

    
    if (dateError !== ''){
        errors.dueDate = dateError;
    }

    if (titleError !== '' ){
        errors.title = titleError;
    }

    if (tagError !== '') {
        errors.tag = tagError;
    }

    if (durationError !== '') {
        errors.duration = durationError;
    }

    return errors;
}


function isValidTimestamp(value) {
    if (typeof value !== 'string' || value === ''){
        return false;
    }
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return false;

    return date.toISOString() === value;

}

export function validatingImport(data) {
    if (!Array.isArray(data)) {
        return 'The imported JSON file must contain a list of tasks.';
    }

    const taskIds = [];

    for (let i = 0; i < data.length; i += 1) {
        const task = data[i];
        const taskNumber = i + 1;

        if (!task || typeof task !== 'object' || Array.isArray(task)) {
            return 'Task ' + taskNumber + ' must be an object.';
        }

        const requiredFields = [
            'id',
            'title',
            'duration',
            'dueDate',
            'tag',
            'completed',
            'note',
            'createdAt',
            'updatedAt'
        ];

        for (let fieldIndx = 0; fieldIndx < requiredFields.length; fieldIndx += 1) {
            const fieldName = requiredFields[fieldIndx];

            if (!Object.prototype.hasOwnProperty.call(task, fieldName)) {
                return 'Task ' + taskNumber + ' is missing ' + fieldName + '.';
            }
        }

        if (typeof task.id !== 'string' || task.id.trim() === '') {
            return 'Task ' + taskNumber + ' needs a valid ID.';
        }

        if (taskIds.includes(task.id)) {
            return 'Every imported task must have an ID';
        }

        taskIds.push(task.id);

        if (typeof task.title !== 'string' ||  typeof task.tag !== 'string' || typeof task.dueDate !== 'string') {
            return 'Task ' + taskNumber + 'has invalid title, tag, or date text.';
        }

        if (typeof task.duration !== 'number' || !Number.isFinite(task.duration)) {
            return 'Task ' + taskNumber + ' needs a numeric(real number) duration.';
        }

        const taskErrors = validatingTask(task);
        if (Object.keys(taskErrors).length > 0) {
            return 'Task ' + taskNumber + ' has invalid task information.';
        }

        if (typeof task.completed !== 'boolean') {
            return 'Task ' + taskNumber + 'needs a true or false as a completed value.';
        }

        if (typeof task.note !== 'string' || task.note.length > 200) {
            return 'Task ' + taskNumber + ' has an invalid note.';
        }

        if (!isValidTimestamp(task.createdAt) || !isValidTimestamp(task.updatedAt)) {
            return 'Task ' + taskNumber + ' has an invalid timestamp.'
        }
    }

    return '';
}

