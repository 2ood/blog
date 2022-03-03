/*modularize html of top bar*/
const top_bar = document.getElementById("top_bar");

top_bar.innerHTML=`
  <div class="logo">
    <a href="index.html"><h1>2ood</h1></a>
  </div> <!--.logo-->
  <div class="space_box" id="vw10"> </div>
  <div class="nav_bar">
    <ul>
      <li><a href="#" id="about">ABOUT</a></li>
      <li><a href="#" id="coder">CODER</a></li>
      <li><a href="#">NOTES</a>
        <ul class="hidden">
          <li><a href="#" id="diary">DIARY</a></li>
          <li><a href="#" id="posts">POSTS</a></li>
        </ul>
      </li>
      <li><a href="#">HOBBIES</a>
        <ul class="hidden">
          <li><a href="#">COFFEE</a></li>
          <li><a href="#">EXERCISE</a></li>
          <li><a href="#">MUSIC</a></li>
          <li><a href="#">PLANT</a></li>
        </ul>
      </li>
    </ul>
  </div><!--.navbar-->

  <span class="log_status">
    <ul style="display:none;" id="logouted-pad">
      <li><a href="#" id="loginHref">LOGIN</a></li>
      <li><a href="#" id="signupHref">SIGN UP</a></li>
    </ul>
    <ul style="display:none;" id="logined-pad">
      <li><a href="#" id="name"></a></li>
      <li><a href="#" id="logout">LOGOUT</a></li>
      <li><div id ="profilePic-container"><a href="#" id="profile"><img id="profilePic" src="img/profile_gray.png"/></a></div></li>
    </ul>
  </span><!--.log_status-->
  <span class="material-icons grayscale-font" id="menu">menu</span>
`;
/*top_bar underline implement*/
const li = document.querySelectorAll(".nav_bar > ul > li > a");
for(i=0;i<li.length;i++) li[i].classList.add("underline-gradient-show");

/* assign href to each a tags*/
const about = document.querySelector("a#about");
const coder = document.querySelector("a#coder");
const diary = document.querySelector("a#diary");
const posts = document.querySelector("a#posts");
const login = document.querySelector("#loginHref");
const signup = document.querySelector("#signupHref");
const profile = document.querySelector("a#profile");
const nameAnchor = document.querySelector("a#name");

coder.href="coder.html";
diary.href="diary.html";
posts.href="post_list.html";
login.href=`login.html?from=${window.location.href}`;
signup.href="signup.html";
nameAnchor.href=`profile.html`;
profile.href=`profile.html`;

/* show nested ul*/

const majorUl = document.querySelectorAll(".nav_bar > ul > li");
for(i=0;i<majorUl.length;i++) {
  const minorUl = majorUl[i].querySelector("li > ul");
  if(minorUl!=null) {
    majorUl[i].addEventListener("click", ()=>{
      minorUl.classList.toggle("hidden");
    });
  }
}
/*collapse to hamburger*/
const menu = document.querySelector("span#menu");

/*logout function*/
const logout = document.getElementById("logout");
logout.addEventListener("click",onLogout);

function onLogout() {
  auth.signOut().then(() => {
    alert("logout");
  window.location.href="index.html";
  }).catch((error) => {
    alertError(error,"logout");
});
}

function onAuthLoginedTopBar(user) {
  document.getElementById("logined-pad").style.display="flex";
  const uid = user.uid

  const nameAnchor = document.querySelector("a#name");
  nameAnchor.textContent = name;

  db.collection('users').doc(uid).get().then((doc)=>{
    if(doc.exists){
      const name= doc.data().NAME;
      nameAnchor.innerHTML = name;
      console.log("logined as ",name);
      const nickname = doc.data().NICKNAME;
      const query = `?nickname=${nickname}`;
      profile.href=`profile.html`+query;
      nameAnchor.href=`profile.html`+query;

      storage.ref(doc.data().PIC).getDownloadURL().then((url) => {
        var img = document.querySelector("img#profilePic");
        img.setAttribute('src', url);
      }).catch((error) => {
        console.log("error in downloading profile pic : ",error);
      });
    }
  });
}



function onAuthAnonymousTopBar(){
    document.getElementById("logouted-pad").style.display="flex";
    console.log("logout");
}
