auth.onAuthStateChanged((user) => {
  if (user) {

    document.getElementById("login").style.display="flex";
    const uid = user.uid;
    const name = user.displayName;
    console.log("logined as ",name);

    const nameAnchor = document.querySelector("a#name");
    nameAnchor.textContent = name;

    storage.child(`profile/${user.uid}.png`).getDownloadURL().then((url) => {
      var img = document.querySelector("img#profilePic");
      img.setAttribute('src', url);
    })
    .catch((error) => {
      console.log("error in downloading profile pic : ",error);
    });


  } else {
    document.getElementById("logout").style.display="flex";
        console.log("logout");
  }
});
