const scrollContainer = document.querySelector(".slide-horiz-scroll-container");

scrollContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    scrollContainer.scrollLeft += event.deltaY*0.3;
});
