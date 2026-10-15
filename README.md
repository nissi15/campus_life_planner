# Edu Planner

Edu Planner is a web app for students. It helps students plan tasks, track study time, and manage campus activities.

## Links

- Repository: https://github.com/nissi15/campus_life_planner/
- GitHub Pages: 
- Demo video: 

## Design

The app uses a clean student dashboard design. Green shows important information. The app has light mode and dark mode.

The layout works on:

- Mobile screens
- Tablet screens
- Desktop screens

## Main features

- Add, edit, and delete tasks
- Set a title, duration, due date, tag, and note
- Mark a task as complete
- Search tasks with regular expressions
- Sort tasks by date, title, or duration
- View task details
- View tasks due today
- View a seven-day chart
- View total tasks, total time, and the top tag
- Save tasks and settings in the browser
- Change the duration unit
- Change the weekly target
- Use light mode or dark mode
- Import and export JSON data
- Reset the sample data

## How to run the app

1. Download or clone the repository.
2. Open the project folder in Visual Studio Code.
3. Start the project with Live Server.
4. Open `index.html` in the browser.

The app does not need a server database.

## Project files

- `index.html` contains the page structure.
- `styles/style.css` contains the page styles.
- `scripts/app.js` controls user actions.
- `scripts/ui.js` displays tasks and dashboard data.
- `scripts/state.js` stores the current app state.
- `scripts/storage.js` saves and loads local data.
- `scripts/search.js` controls regex search.
- `scripts/validators.js` checks user input.
- `assets/seed.json` contains sample tasks.
- `test.html` runs the automated tests.

## Task data

Each task contains:

- `id`
- `title`
- `duration`
- `dueDate`
- `tag`
- `completed`
- `note`
- `createdAt`
- `updatedAt`

The app stores duration values in minutes.

## Regex catalogue

### Repeated words

Pattern:

`/\b(\w+)\s+\1\b/i`

Valid title:

`Review JavaScript notes`

Invalid title:

`Review review notes`

### Duration

Pattern:

`/^(0|[1-9]\d*)(\.\d{1,2})?$/`

Valid values:

- `30`
- `1.5`
- `90.25`

Invalid values:

- `-5`
- `abc`
- `1.234`

The duration must also be greater than zero.

### Tag

Pattern:

`/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`

Valid tags:

- `Study`
- `Campus Event`
- `Group-Project`

Invalid tags:

- `Study101`
- `Club!`

### Date

Pattern:

`/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`

Valid date:

`2026-10-16`

Invalid date:

`16-10-2026`

The app also rejects dates that do not exist.

### Task search

The search field accepts a regular expression.

Examples:

- `study`
- `club|event`
- `^Attend`
- `notes$`

The search is not case-sensitive. An invalid pattern shows an error and does not stop the app.

## Keyboard map

| Key | Action |
|---|---|
| `Tab` | Move to the next control |
| `Shift + Tab` | Move to the previous control |
| `Enter` | Open a link or use a button |
| `Space` | Use a button, checkbox, or switch |
| `Escape` | Close an open task dialog |
| Arrow keys | Change some form choices |

## Accessibility

The app includes:

- A skip link
- Clear page headings
- Form labels and error messages
- Visible keyboard focus
- Keyboard-accessible dialogs
- Status and error messages
- Text labels for chart values
- Light and dark themes
- Mobile, tablet, and desktop layouts

## Tests

1. Start the project with Live Server.
2. Open `test.html`.
3. Read the test result at the top of the page.

The current result is:

`24 of 24 tests passed`

The tests check:

- Form validation
- Repeated words
- Dates and durations
- Tags
- Regex search
- Safe HTML output
- JSON import data
- Duplicate task IDs
- Invalid timestamps

## Sample data

`assets/seed.json` contains at least 10 sample tasks.

The records include:

- Different tags
- Small and large durations
- Different dates
- Complete and incomplete tasks
- Notes with different text

## Data storage

The app saves tasks and settings in `localStorage`. The data stays in the same browser after a page refresh.

Export important tasks before you clear browser data.

## Known limitation

The light theme can appear for a short time when the app loads a saved dark theme.

## Author

Created by Nissi.

- GitHub: https://github.com/nissi15
- Email: n.ishema@alustudent.com
