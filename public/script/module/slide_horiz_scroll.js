

function initializeScrollContainer() {
  const scrollContainer = document.getElementsByClassName("slide-horiz-scroll-container");

  for( s of scrollContainer) {
    s.addEventListener("wheel", (event) => {
        event.preventDefault();
        scrollContainer.scrollLeft += event.deltaY*0.3;
    });
  }
}
