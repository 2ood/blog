let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
    logo = document.querySelector(".logo");
    logo.style.opacity=(scrollY<100?1:(1-scrollY/200))*1.0;
});


const li = document.querySelectorAll("ul li a");
for(i=0;i<li.length;i++) li[i].classList.add("underline");

/*
const load = document.querySelector("#loading");
const load_cl = load.classList;
load_cl.add("active");
load.addEventListener('transitionend', () => {
  if(load_cl.contains("active")) {
    load_cl.add("done");
    load_cl.remove("active");
  }
  else if(load_cl.contains("done")) {
    load.style.zIndex=-1000;
  }
});
*/
