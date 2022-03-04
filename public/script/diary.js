function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
}

const more_note = document.getElementById("more-note");
more_note.addEventListener("click",(evt)=>{
  evt.srcElement.parentNode.appendChild(buildNote(categories));

});

let categories =[];
let categoryReady = false;
db.collection('notes').doc("categories").get().then((doc)=>{
  categories = doc.data().data;
  categoryReady=true;
  more_note.parentNode.insertBefore(buildNote(categories),more_note);
});





function buildNote(category) {
  const result = document.createElement("div");
  result.className="note";

  result.appendChild(buildSearch());
  result.appendChild(buildInput("text","content","content"));

  return result;
}

function buildSearch() {
  const result = document.createElement("div");
  result.className="search";

  const category_input = buildInput("text","category","category");
  category_input.addEventListener("input", handleSearchInput);
  result.appendChild(category_input);

  const suggestions = document.createElement("div");
  suggestions.className="suggestions";
  const ul = document.createElement("ul");
  ul.innerHTML = `<li class="hidden add-category"></li>`;

  for(i=0;categoryReady && i<categories.length;i++) {
    let child = createNoteLi(category_input, suggestions, categories[i]);
    ul.appendChild(child);
  }
  suggestions.appendChild(ul);


  result.appendChild(suggestions);

  result.addEventListener("focusin",(evt)=>{
    show(suggestions);
  });

  return result;
}

function buildInput(type, placeholder, className) {
  const result = document.createElement("input");
  result.type = type;
  result.placeholder = placeholder;
  result.className = className;

  return result;
}


function handleSearchInput(evt) {
    const source = evt.srcElement;
    const add_cat = source.parentNode.querySelector("li.add-category");
    const suggestions_li = add_cat.parentNode.getElementsByTagName("li");

    add_cat.innerHTML = `add ${source.value}` ;
    onlyShowIf(source.value.length>0, add_cat);

    let flag=0;
    for(i=1;i<suggestions_li.length;i++) {
      const li = suggestions_li[i];
      onlyShowIf(li.textContent.includes(source.value),li);

      if(li.textContent==source.value) flag++;
    }
    onlyShowIf(flag==0,add_cat);
}

function createNoteLi(input, suggestions, content) {
  let li = document.createElement("li");
  li.innerHTML=content;
  li.addEventListener("click",(evt)=>{
    input.value=evt.srcElement.innerHTML;
    hide(suggestions);
  });
  return li;
}

function hide(target) {
  target.classList.add("hidden");
}

function show(target) {
  target.classList.remove("hidden");
}

function onlyShowIf(statement, target) {
  if(statement) show(target);
  else hide(target);
}
