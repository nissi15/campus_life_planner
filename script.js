const taskFeature = document.querySelector('a[href="#task-page"]');
const dashboard = document.getElementById('dashboard-page');
const taskPage = document.getElementById('task-page');


taskFeature.addEventListener('click', function (makeThis) {
    makeThis.preventDefault();

    dashboard.classList.remove('active');
    taskPage.classList.add('active');
//  
});
