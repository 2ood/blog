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
        alert("Error editing document: ", error);
    });

    return ;
  }

  db.collection('posts').add(newPost.toJson()).then((docRef) => {
    db.collection('users').doc(user.uid).get().then((userDoc)=>{

      if(userDoc.data().hasPosted) {
        db.collection('users').doc(user.uid).update({
          posts: db.FieldValue.arrayUnion(docRef.id),
        }).then(() => {
          alert("Document uploaded successfully!");
          window.location.href = './post_list.html';
        }).catch((error) => {
          docRef.delete().catch(()=>{
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(`failed to delete post. error(${errorCode}) : ${errorMessage}`);
          });
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(`failed to update user DB. error(${errorCode}) : ${errorMessage}`);
        });
      } else {
        db.collection('users').doc(user.uid).update({
          hasPoted : true,
          posts: [docRef.id],
        }).then(() => {
          alert("Document uploaded successfully!");
          window.location.href = './post_list.html';
        }).catch((error) => {
          docRef.delete().catch(()=>{
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(`failed to delete post. error(${errorCode}) : ${errorMessage}`);
          });
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(`failed to update user DB. error(${errorCode}) : ${errorMessage}`);
        });
      }
    }).catch((error) => {
      docRef.delete().catch(()=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(`failed to delete post. error(${errorCode}) : ${errorMessage}`);
      });
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(`Error finding user: error(${errorCode}) : ${errorMessage}`);
  });
}).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(`Error adding document: error(${errorCode}) : ${errorMessage}`);
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
