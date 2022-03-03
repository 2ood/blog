
const loginForm = document.querySelector("form.login");
loginForm.addEventListener("submit", onLoginSubmit);

function onLoginSubmit(event){

  event.preventDefault();
  const email = loginForm.querySelector("input[name ='email']").value;
  const password = loginForm.querySelector("input[name ='password']").value;


  auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.has("from")?params.get("from"):"index.html";
      window.location.href=redirect;
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(`failed to login. error(${errorCode}) : ${errorMessage}`);
  });

}

function onAuthLogined(user) {
  return;
}

function onAuthAnonymous() {
  return;
}
