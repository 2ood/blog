function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
}

const search = document.getElementById("search");
const input = search.querySelector("input:first-of-type");
const suggestions = document.getElementById("suggestions");


db.collection('notes').doc("categories").get().then((doc)=>{
  const suggestions_ul = suggestions.querySelector("ul");
  const categories = doc.data().data;
  for(i=0;i<categories.length;i++) {
    let li = document.createElement("li");
    li.innerHTML=categories[i];
    li.addEventListener("click",(evt)=>{
      input.value=evt.srcElement.innerHTML;
    });
    suggestions_ul.appendChild(li);
  }
});

search.addEventListener("focusin",(evt)=>{
  suggestions.classList.remove("hidden");
});
