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


