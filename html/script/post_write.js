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
const writer = document.querySelector("input[name='WRITER']");
const summary = document.querySelector("textarea[name='SUMMARY']");
const markdown = document.querySelector("textarea[name='CONTENT']");
const preview = document.querySelector("div.preview");

const viewButton = document.querySelector("button[name='viewButton']");

viewButton.addEventListener("click", (event)=>{
  preview.innerHTML=marked.parse(markdown.value);
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
          const dat = snapshot.data()
          title.value=dat.TITLE;
          writer.value=dat.WRITER;
          summary.value=dat.SUMMARY;
          markdown.value=dat.CONTENT;
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

  const newPost = new Post(title.value,writer.value,last_update,summary.value,content);

  if(isEditMode){
    db.collection('posts').doc(params.get("id")).update(newPost.toJson()).then((docRef) => {
      alert("Document edited successfully!");
      window.location.href = './post_list.html';
    })
    .catch((error) => {
        alert("Error editing document: ", error);
    });
  }
  else {
    db.collection('posts').add(newPost.toJson()).then((docRef) => {
      alert("Document uploaded successfully!");
      window.location.href = './post_list.html';
    })
    .catch((error) => {
        alert("Error adding document: ", error);
    });
}


}
