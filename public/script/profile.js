function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
  onAuthLoginedProfile(user);
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
  alert("You need to login to watch the content.");
  window.location.href="login.html";
}

function onAuthLoginedProfile(user) {
}

const params = new URLSearchParams(window.location.search);
const nickname = params.get("nickname");

db.collection('users').where("NICKNAME", "==", nickname).get().then((querySnapshot)=>{
  querySnapshot.forEach((doc)=>{
    const posts_db = doc.data().POSTS;
    const name_db = doc.data().NAME;
    const nickname_db = doc.data().NICKNAME;
    const bio_db = doc.data().BIO;

    console.log(name_db);

    document.getElementById("profile-nickname").textContent=nickname_db;
    document.getElementById("bio").textContent=bio_db;

    console.log(document.getElementById("profile-name"));
    document.getElementById("profile-name").textContent=name_db;

    const ul = document.querySelector(".slide-horiz-scroll-container[name='posts'] ul");

    for(i=0;i<posts_db.length;i++) {
      db.collection('posts').doc(posts_db[i]).get().then((postDoc)=>{
        const img_source = "img/sample_image_landscape.jpg";
        const post_title = postDoc.data().TITLE;
        const post_summary = postDoc.data().SUMMARY;
        ul.innerHTML+=`<li>
          <div class="slide-div60-div40">
            <div><img src="${img_source}"/></div>
            <div>
              <h4>${post_title}</h4>
              <p>${post_summary}</p>
            </div>
          </div>
        </li>`;
      });
    }
  });
});
