class Post {
    constructor (title, writer, last_update, summary, content) {
        this.TITLE = title;
        this.WRITER = writer;
        this.LAST_UPDATE=last_update;
        this.SUMMARY=summary;
        this.CONTENT=content;
    }
    toString() {
        return this.TITLE+", "+this.WRITER+", "+this.LAST_UPDATE+", "+this.SUMMARY+", "+this.CONTENT;
    }
    toJson() {
        return {
            TITLE: this.TITLE,
            WRITER: this.WRITER,
            LAST_UPDATE: this.LAST_UPDATE,
            SUMMARY: this.SUMMARY,
            CONTENT: this.CONTENT
            };
    }
}
const title = document.querySelector("input[name='TITLE']");
const writer = document.querySelector("h4[name='WRITER']");
const summary = document.querySelector("textarea[name='SUMMARY']");
const markdown = document.querySelector("textarea[name='CONTENT']");
const preview = document.querySelector("div.preview");

const viewButton = document.querySelector("button[name='viewButton']");

viewButton.addEventListener("click", (event)=>{
  previewContent = markdown.value.split("\n").join("\n<br/>");
  preview.innerHTML=marked.parse(previewContent);
  markdown.style.display=(markdown.style.display=="none")?"block":"none";
  preview.style.display=(preview.style.display=="none")?"block":"none";
  viewButton.textContent=(viewButton.textContent=="preview")?"back to edit mode":"preview";
});

const form = document.querySelector("form");
form.addEventListener("submit",onSubmit);

const params = new URLSearchParams(window.location.search);
const isEditMode = params.has("id");

if(isEditMode) {
  /*textarea value put*/
  db.collection('posts').doc(params.get("id")).get().then((snapshot)=>{
        if(snapshot.exists){
          const dat = snapshot.data();
          title.value=dat.TITLE;
          writer.value=dat.WRITER;
          summary.value=dat.SUMMARY;
          const content = dat.CONTENT.split("\\n").join("\n");
          markdown.value=content;
        } else {
          alert("doesn't exist!");
          window.location.href = './post_list.html';
        }
    });
}


function onSubmit(event){
  event.preventDefault();

  const last_update = firebase.firestore.FieldValue.serverTimestamp();
  const content = markdown.value.split("\n").join("\\n");


  const newPost = new Post(title.value,writer.textContent,last_update,summary.value,content);
  const user = auth.currentUser;

  if(user==null) {
    alert("you should login to post.");
    return;
  }

  if(isEditMode){
    db.collection('posts').doc(params.get("id")).update(newPost.toJson()).then((docRef) => {
      alert("Document edited successfully!");
      window.location.href = './post_list.html';
    })
    .catch((error) => {
        alertError(error,"editing document");
    });
  }
  else {
    db.collection('posts').add(newPost.toJson()).then((docRef) => {
      db.collection('users').doc(user.uid).get().then((userDoc)=>{
        const formerPosts = userDoc.data().POSTS;
        db.collection('users').doc(user.uid).update({
            POSTS : [...formerPosts,docRef.id]
          }).then(() => {
            alert("Document uploaded successfully!");
            window.location.href = './post_list.html';
          }).catch((error) => {
            deleteDocument(docRef);
            alertError(error,"updating user post DB");
          });
        }).catch((error) => {
            deleteDocument(docRef);
            alertError(error,"reading writer");
      });
    }).catch((error) => {
        alertError(error,"uploading post");
  });
  }

}

function deleteDocument(docRef) {
  docRef.delete().catch(()=>{
    alertError(error, "deleting post");
  });
}

function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
  db.collection('users').doc(user.uid).get().then((doc)=>{
    writer.innerHTML =doc.data().NICKNAME;
  });

}

function onAuthAnonymous() {
  alert("You should login to post.");
  window.location.href="post_list.html";
}
