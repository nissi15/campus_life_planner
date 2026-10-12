const dashboard = document.getElementById('dashboard-page');
const aboutFeature = document.querySelector('a[href="#about-page"]');
const aboutPage = document.getElementById('about-page');

aboutFeature.addEventListener('click', function (visible) {
    visible.preventDefault();

    dashboard.classList.remove('active');
    aboutPage.classList.add('active');
    document.getElementById('top-name').textContent = 'About';
});
