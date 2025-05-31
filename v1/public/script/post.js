const params = new URLSearchParams(window.location.search);

const del = document.getElementById("delete");
del.addEventListener("click",(event)=>{
  if(confirm("Do you really want to delete?")){
    writer = document.getElementById("writer").innerHTML;

    db.collection('users').where("NICKNAME", "==", writer).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        let formerPosts = doc.data().POSTS;
        const idx = formerPosts.indexOf(params.get("id"));
        if (idx > -1)formerPosts.splice(idx,1);

        db.collection('users').doc(doc.id).update({
          POSTS : [...formerPosts]
        }).then(()=>{
          db.collection("posts").doc(params.get("id")).delete().then(() => {
            alert("Document successfully deleted!");
            window.location.href = './post_list.html';
          }).catch((error) => {
            alertError(error,"deleting document");
          });
        }).catch((error) => {
          alertError(error,"finding user nickname");
        });
      });
    });
  }
});
const edit = document.getElementById("edit");
edit.addEventListener("click",(event)=>{
      window.location.href = `./post_write.html?id=${params.get("id")}`;
});

if(!(params.has("id"))) {
  alert("Cannot read post id. redirecting you to list.");
  window.location.href="./post_list.html";
}
db.collection('posts').doc(params.get("id")).get().then((snapshot)=>{

      if(snapshot.exists){
        const dat = snapshot.data()
        document.getElementById("title").innerHTML=dat.TITLE;
        document.getElementById("writer").innerHTML=dat.WRITER;

        const date = dat.LAST_UPDATE.toDate();
        document.getElementById("last-update").innerHTML=`
        ${date.getYear()+1900}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

        const content = makeItMultipleLine(dat.CONTENT);
        parseAndLoadMd(content);

      } else {
        alert("doesn't exist!");
        window.location.href = './post_list.html';
      }
  });

function parseAndLoadMd(rawMd){
  const md = document.getElementById("md");
  md.innerHTML = marked.parse(rawMd);
}

function makeItMultipleLine(string) {
  return string.split("\\n").join("\n");
}

function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
  db.collection('users').doc(user.uid).get().then((userRef)=>{
    if(userRef.data().NICKNAME==document.getElementById("writer").innerHTML) {
      document.getElementById("delete").classList.remove("hidden");
      document.getElementById("edit").classList.remove("hidden");
    }
  });
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
}
