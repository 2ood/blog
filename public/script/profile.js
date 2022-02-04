function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
  onAuthLoginedProfile(user);
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
  alert("You need to login to watch the content.");
  window.location.href="login.html";
}

function onAuthLoginedProfile(user) {
  const params = new URLSearchParams(window.location.search);
  const nickname = params.get("nickname");
}

const scrollContainer = document.querySelector(".posts-slide");

scrollContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    scrollContainer.scrollLeft += event.deltaY*0.3;
});
