  /*modularize html of top bar*/
  const top_bar = document.getElementById("top_bar");

  top_bar.innerHTML=`
  <div class="logo_bar">
    <!--deprecated
    <span class="search">
      <span class="material-icons" id="search">search</span>
      <input type="text" id="top_search" placeholder="search">
    </span>
    -->
    <div class="logo">
      <a href="landing_page.html"><h1>2ood</h1></a>
    </div> <!--.logo-->
    <div class="space_box" id="vw10"> </div>
    <div class="nav_bar">
      <ul>
        <li><a href="#" id="about">ABOUT</a></li>
        <li><a href="#" id="coder">CODER</a></li>
        <li><a href="#" id="notes">NOTES</a></li>
        <li><a href="#" id="hobbies">HOBBIES</a></li>
      </ul>
    </div><!--.navbar-->

    <span class="log_status">
      <ul id="logout">
        <li><a href="#" id="login">LOGIN</a></li>
        <li><a href="#" id="signup">SIGN UP</a></li>
      </ul>
    </span><!--.log_status-->
  </div> <!--.logo_bar-->
  `;

  /*logo vanishing effect*/
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
      logo = document.querySelector(".logo");
      logo.style.opacity=(scrollY<100?1:(1-scrollY/200))*1.0;
  });

  /*top_bar underline implement*/
  const li = document.querySelectorAll("ul li a");
  for(i=0;i<li.length;i++) li[i].classList.add("underline");

  /* assign href to each a tags*/
  const about = document.querySelector("a#about");
  const coder = document.querySelector("a#coder");
  const notes = document.querySelector("#notes");
  const hobbies = document.querySelector("#hobbies");
  const login = document.querySelector("#login");
  const signup = document.querySelector("#signup");


  coder.href="coder.html";
  notes.href="post.html";
  login.href="login.html";
  signup.href="signup.html";
