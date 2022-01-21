const search = document.querySelector(".search");
const li = document.querySelectorAll("ul li a");

search.classList.add("underline");
for(i=0;i<li.length;i++) li[i].classList.add("underline");
