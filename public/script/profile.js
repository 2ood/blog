class Profile {
  static format = ["BIO","EMAIL","NAME","NICKNAME","PIC","POSTS"];

  constructor (bio, email, name, nickname, pic, posts) {
      this.BIO = bio;
      this.EMAIL = email;
      this.NAME = name;
      this.NICKNAME = nickname;
      this.PIC = pic;
      this.POSTS = posts;
  }
  static fromJson(json) {
    return new Profile(json.BIO, json.EMAIL, json.NAME, json.NICKNAME, json.PIC, json.POSTS);
  }
  toString() {
      return this.BIO+", "+
      this.EMAIL+", "+
      this.NAME+", "+
      this.NICKNAME+", "+
      this.PIC+", "+
      this.POSTS;
  }
  toJson() {
      return {
        BIO : this.BIO,
        EMAIL : this.EMAIL,
        NAME : this.NAME,
        NICKNAME : this.NICKNAME,
        PIC : this.PIC,
        POSTS : this.POSTS
        };
  }
}

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
  initializeScrollContainer();
  db.collection('users').where("NICKNAME", "==", nickname).get().then((querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
      const profile  = Profile.fromJson(doc.data());

      /*load profile data to the elements*/
      profile_nickname.value=profile.NICKNAME;
      profile_bio.value=profile.BIO;
      profile_name.textContent=profile.NAME;

      /*load posts data*/
      const ul = document.querySelector(".slide-horiz-scroll-container[name='posts'] ul");
      for(i=0;i<profile.POSTS.length;i++) {
        const post_name= profile.POSTS[i];
        db.collection('posts').doc(post_name).get().then((doc)=>{
          ul.appendChild(buildPosts(doc.data(),post_name));
        });
      }
    });
  });
}

function buildPosts(json, name) {
  const result = document.createElement("li");
  result.className="slide-div60-div40";
  result.innerHTML=`
  <img class="first-part" src="img/sample_image_landscape.jpg"/>
  <div class="second-part">
    <h4>${json.TITLE}</h4>
    <p>${json.SUMMARY}</p>
  </div>
  `;

  result.addEventListener("click",()=>{
    window.location.href=`post.html?id=${name}`;
  });

  return result;
}

function handleEditButton(evt) {
  toggleEditMode(true);
}

function handleSaveButton(evt) {
  //!TODO
  // porifle pic is not sending properly.

  const user = auth.currentUser;
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
        }).then(()=>{toggleEditMode(false);});
      }
  });
}

function handleDiscardButton(evt) {
  if(confirm("Do you want to cancel editing?\nUnsaved changes are discared.")) {
    toggleEditMode(false);
  }
}

function toggleEditMode(isEnteringEditMode) {
  if(isEnteringEditMode) {
    profile_nickname.placeholder=profile_nickname.value;
    profile_bio.placeholder=profile_bio.value;
  } else {
    profile_nickname.value=profile_nickname.placeholder;
    profile_bio.value=profile_bio.placeholder;
  }

  edit_profile_button.classList.toggle("hidden");
  save_button.classList.toggle("hidden");
  discard_button.classList.toggle("hidden");
  profile_pic_input_label.classList.toggle("hidden");

  profile_nickname.disabled = !isEnteringEditMode;
  profile_bio.disabled = !isEnteringEditMode;
  profile_pic_input.disabled = !isEnteringEditMode;

}
