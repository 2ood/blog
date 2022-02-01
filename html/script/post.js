const params = new URLSearchParams(window.location.search);

const del = document.getElementById("delete");
del.addEventListener("click",(event)=>{
  if(confirm("Do you really want to delete?")){
    db.collection("posts").doc(params.get("id")).delete().then(() => {
      alert("Document successfully deleted!");
      window.location.href = './post_list.html';
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
});
const edit = document.getElementById("edit");
edit.addEventListener("click",(event)=>{
      window.location.href = `./post_write.html?id=${params.get("id")}`;
});

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
