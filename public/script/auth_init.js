let userFirebase;

function setUserDB(user) {
  userFirebase = new UserFirebase(user.uid);
}

auth.onAuthStateChanged((user) => {
  if (user) {
    setUserDB(user);
    onAuthLogined(user);
  }
  else onAuthAnonymous();
});
