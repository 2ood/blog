
const signupForm = document.querySelector("form.signup");
console.dir(signupForm);
signupForm.addEventListener("submit", onSignupSubmit);

const name = signupForm.querySelector("input[name ='name']");
const mail = signupForm.querySelector("input[name ='email']");
const pw = signupForm.querySelector("input[name ='password']");
const check =signupForm.querySelector("input[name ='check']");
const message = document.getElementById("message");
check.addEventListener('input',()=>{
  message.classList.remove("hidden");
  if(pw.value!=check.value) {
    message.textContent="password is different.";
    message.classList.remove("okay");
    message.classList.add("error");
  }
  else {
    message.textContent="password checked.";
    message.classList.remove("error");
    message.classList.add("okay");
  }
});


function onSignupSubmit(event){
  event.preventDefault();

  const email = mail.value;
  const password = pw.value;
  const checkValue = check.value;
  if(password!=checkValue) return;

  auth.createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;

    var docData = {
      NAME : name.value,
      EMAIL : mail.value,
    };
    db.collection('users').doc(user.uid).set(docData).then((docRef) => {
      alert("User added successfully!");
      window.location.href = './index.html';
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(`failed to update user DB. error(${errorCode}) : ${errorMessage}`);
    });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(`failed to sign up. error(${errorCode}) : ${errorMessage}`);
  });

}
