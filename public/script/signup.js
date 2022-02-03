
const signupForm = document.querySelector("form.signup");
signupForm.addEventListener("submit", onSignupSubmit);

const name = signupForm.querySelector("input[name ='name']");
const nickname = signupForm.querySelector("input[name ='nickname']");
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
      PIC : `profile/undraw_profile_pic.png`,
      NICKNAME : nickname.value,
      POSTS : [],
    };
    db.collection('users').doc(user.uid).set(docData).then((docRef) => {
      alert("User added successfully!");
      window.location.href = './index.html';
    })
    .catch((error) => {
      alertError(error, "updating user DB");
    });
  })
  .catch((error) => {
    alertError(error, "signing up");
  });

}
