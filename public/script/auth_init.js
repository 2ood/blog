auth.onAuthStateChanged((user) => {
  if (user) onAuthLogined(user);
  else onAuthAnonymous();
});
