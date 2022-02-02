
const loginForm = document.querySelector("form.login");
console.dir(loginForm);
loginForm.addEventListener("submit", onLoginSubmit);

function onLoginSubmit(event){

  event.preventDefault();
  const email = loginForm.querySelector("input[name ='email']").value;
  const password = loginForm.querySelector("input[name ='password']").value;


  auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    setTimeout(()=>{
      window.location.href="index.html";
    },2000);
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(`failed to login. error(${errorCode}) : ${errorMessage}`);
  });

}
