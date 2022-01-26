const loginForm = document.querySelector("form.login");
console.dir(loginForm);
loginForm.addEventListener("submit", onLoginSubmit);

function onLoginSubmit(event){
  event.preventDefault();
  console.log("submitted");
}
