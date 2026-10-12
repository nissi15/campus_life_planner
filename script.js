const navLinks = document.querySelectorAll(".nav-links");
const pages = document.querySelectorAll(".page");
const topName = document.getElementById("top-name");


function changePage(event) {
    event.preventDefault();

    const clickedLink = event.currentTarget;
    const pageId = clickedLink.getAttribute("href");
    const selectedPage = document.querySelector(pageId);

    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }
  
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("active");
    }

    selectedPage.classList.add("active");
    clickedLink.classList.add("active");
    topName.textContent = clickedLink.textContent.trim();

    window.location.hash = pageId;
}


for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", changePage);
}
