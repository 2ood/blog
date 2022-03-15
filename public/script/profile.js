function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
  onAuthLoginedProfile(user);
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
  alert("You need to login to watch the content.");
  window.location.href="login.html";
}

const edit_profile_button = document.getElementById("edit-profile");
const save_button = document.getElementById("save");
const discard_button = document.getElementById("discard");
const profile_image = document.getElementById('profile-image');
const profile_pic_input_label = document.getElementById('profile-pic-input-label');
const profile_nickname = document.getElementById("profile-nickname");
const profile_name = document.getElementById("profile-name");
const profile_bio = document.getElementById("bio");
const profile_pic_input = document.getElementById("profile-pic-input");
const params = new URLSearchParams(window.location.search);
const nickname = params.get("nickname");

function onAuthLoginedProfile(user) {

  let my_nickname ="";

  /*show edit-profile button only to profile owner*/
  db.collection('users').doc(user.uid).get().then((doc)=>{
      my_nickname = doc.data().NICKNAME;
      if(my_nickname==nickname) edit_profile_button.classList.remove("hidden");
  });

  /*add Event listener to buttons*/
  edit_profile_button.addEventListener("click",handleEditButton);
  save_button.addEventListener("click",handleSaveButton);
  discard_button.addEventListener("click",handleDiscardButton);

  profile_pic_input.addEventListener("change", function() {
   const reader = new FileReader();
   reader.addEventListener("load", () => {
     const uploaded_image = reader.result;
     profile_image.src = uploaded_image;
   });
   reader.readAsDataURL(this.files[0]);
});

  /*load profile data*/
  db.collection('users').where("NICKNAME", "==", nickname).get().then((querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
      const posts_db = doc.data().POSTS;
      const name_db = doc.data().NAME;
      const nickname_db = doc.data().NICKNAME;
      const bio_db = doc.data().BIO;

      profile_nickname.value=nickname_db;
      profile_bio.value=bio_db;
      profile_name.textContent=name_db;

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
}

function handleEditButton(evt) {
  const inputs = document.querySelectorAll(".column-left input");
  edit_profile_button.classList.add("hidden");
  save_button.classList.remove("hidden");
  discard_button.classList.remove("hidden");
  profile_pic_input_label.classList.remove("hidden");

  profile_nickname.disabled = false;
  profile_bio.disabled = false;
  profile_pic_input.disabled = false;
  profile_nickname.placeholder=profile_nickname.value;
  profile_bio.placeholder=profile_bio.value;
}

function handleSaveButton(evt) {
  const user = auth.currentUser;
  console.log(user.uid);
  db.collection('users').doc(user.uid).get().then((doc)=>{
      my_nickname = doc.data().NICKNAME;
      if(my_nickname==nickname) {
        const bio_new = profile_bio.value;
        const nickname_new = profile_nickname.value;
        const pic_new = "profile/undraw_profile_pic.png";
        db.collection('users').doc(user.uid).update({
          BIO : bio_new,
          NICKNAME : nickname_new,
          PIC : pic_new
        });
      }
  });
}

function handleDiscardButton(evt) {
  if(confirm("Do you want to cancel editing?\nUnsaved changes are discared.")) {
    const inputs = document.querySelectorAll(".column-left input");
    edit_profile_button.classList.remove("hidden");
    save_button.classList.add("hidden");
    discard_button.classList.add("hidden");
    profile_pic_input_label.classList.add("hidden");

    profile_nickname.disabled = true;
    profile_bio.disabled = true;
    profile_pic_input.disabled = true;
    profile_nickname.value=profile_nickname.placeholder;
    profile_bio.value=profile_bio.placeholder;
  }
}
