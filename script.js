const dashboard = document.getElementById('dashboard-page');
const settingFeature = document.querySelector('a[href="#settings-page"]');
const settingPage = document.getElementById('settings-page');

settingFeature.addEventListener('click', function (visible) {
    visible.preventDefault();
    dashboard.classList.remove('active');
    settingPage.classList.add('active');
    document.getElementById('top-name').textContent = 'Settings';
});
