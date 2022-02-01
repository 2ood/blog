const user = auth.currentUser;
console.log(user);

app.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("login").style.display="flex";
    var uid = user.uid;
    console.log("logined");

  } else {
    document.getElementById("logout").style.display="flex";
        console.log("logout");
  }
});
