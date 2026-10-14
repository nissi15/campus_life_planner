
export function makeSearchRegex(searchText) {
    if (searchText.trim() === '') {
        return { regex: null, error: '' };
    }

    try {
        const regex = new RegExp(searchText, 'gi');
        return { regex: regex, error: '' }
    } catch (error) {
        return { regex: null, error: 'Please add a valid regex' };
    }
}

// check if the task is similar to the search regex

export function taskMatching(task, regex) {
    if (regex === null) {
        return true;
    }

    const searchableText = [task.title, task.tag, task.dueDate, task.note].join(' ');
    regex.lastIndex = 0

    return regex.test(searchableText);
}


export function tweakSpecialHtml(text) {
    return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


// highlights search matches
export function higlightText(text, search) {
    const originalText = String(text);

    if (search === null) {
        return tweakSpecialHtml(originalText);
    }

    const matchRegex =  new RegExp(search.source, search.flags);
    let highlightTxt = '';
    let previousMatch =  0;

    for (const match of originalText.matchAll(matchRegex)) {
        const matchStart = match.index;
        const matchEnd =  matchStart + match[0].length;

        highlightTxt += tweakSpecialHtml(originalText.slice(previousMatch, matchStart))
        highlightTxt += '<mark>' + tweakSpecialHtml(match[0]) + '</mark>';
        previousMatch = matchEnd;
    }

    highlightTxt += tweakSpecialHtml(originalText.slice(previousMatch));
    return highlightTxt
}
