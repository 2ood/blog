function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
  const params = new URLSearchParams(window.location.search);
  const category  = params.has("category")?params.get("category"):"coffee";

  let paginate =db.collection("notes").doc(category).collection("data").orderBy("DATE","desc").limit(25);
  let last = 0;

  let docs =[];

  paginate.get().then((documentSnapshots)=>{
    last = documentSnapshots.docs[documentSnapshots.docs.length-1];
    for(doc of documentSnapshots.docs) {
      docs.push(doc);
    }
  });
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
  
}
