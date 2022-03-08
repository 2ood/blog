class Note {
    constructor (date, content) {
        this.DATE = date;
        this.CONTENT = content;
    }
    toString() {
        return this.DATE+", "+this.CONTENT;
    }
    toJson() {
        return {
            DATE: this.DATE,
            CONTENT: this.CONTENT
            };
    }
}

function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
}

const more_note = document.getElementById("more-note");
more_note.addEventListener("click",(evt)=>{
  evt.srcElement.parentNode.insertBefore(buildNote(categories),evt.srcElement );

});

let categories =[];
let categoryReady = false;
db.collection('notes').doc("categories").get().then((doc)=>{
  categories = doc.data().data;
  categoryReady=true;
  more_note.parentNode.insertBefore(buildNote(categories),more_note);
});

/*
<div class="note">
  <div class="search">
    <input type="text" class="search-input" placeholder="type category"></input>
    <div class="suggestions">
      <ul>
      <li> ${doc.data().TITLE} </li>
      <li class="hidden add-category"></li>
      </ul>
    </div>
  </div>
  <input type="text" class="content" placeholder="content"></input>
</div>
*/



function buildNote(category) {
  const result = document.createElement("div");
  result.className="note";

  result.appendChild(buildSearch());
  result.appendChild(document.createElement("hr"));
  result.appendChild(buildTextarea("text","content","content"));

  const add_cat = result.querySelectorAll("li.add-category");
  for(obj of add_cat) {obj.addEventListener("click",handleAddCategory);}

  return result;
}

function buildSearch() {
  const result = document.createElement("div");
  result.className="search";

  const search_input = buildInput("text","type category","search-input");
  search_input.addEventListener("input", handleSearchInput);
  result.appendChild(search_input);

  const suggestions = document.createElement("div");
  suggestions.className="suggestions hidden";
  const ul = document.createElement("ul");

  const add_cat = document.createElement("li");
  add_cat.className = "hidden add-category";
  add_cat.addEventListener("click", handleAddCategory);
  ul.appendChild(add_cat);

  for(category of categories) {
    let child = buildNoteLi(suggestions, category);
    ul.appendChild(child);
  } 
  suggestions.appendChild(ul);

  result.appendChild(suggestions);

  result.addEventListener("focusin",(evt)=>{
    handleSearchInput(evt);
    show(suggestions);
  });
  result.addEventListener("keydown",(evt)=>{
    if(evt.code=="Enter") {
      hide(suggestions);
      const source = evt.srcElement;
      if(source.parentNode.getElementsByClassName("selected-cat").length!=0) source.placeholder="";
    }
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
function buildTextarea(type, placeholder, className) {
  const result = document.createElement("textarea");
  result.type = type;
  result.placeholder = placeholder;
  result.className = className;

  return result;
}
function buildNoteLi(suggestions, content) {
  let li = document.createElement("li");
  li.innerHTML=content;
  li.addEventListener("click",(evt)=>{
    addSelectedCat(evt.srcElement);
    hide(suggestions);
  });
  return li;
}


function handleSearchInput(evt) {
    const source = evt.srcElement;
    const add_cat = source.parentNode.querySelector("li.add-category");
    const suggestions_li = add_cat.parentNode.getElementsByTagName("li");
    const selected_cats = source.parentNode.getElementsByClassName("selected-cat");
    add_cat.innerHTML =source.value;

    let flag=0;
    for(i=1;i<suggestions_li.length;i++) {
      const li = suggestions_li[i]  ;
      onlyShowIf(li.textContent.includes(source.value),li);
      if(li.textContent==source.value) flag++;
      for(selected of selected_cats) {
        onlyShowIf(selected.innerHTML!=li.textContent, li);
      }
    }
    onlyShowIf(flag==0 && source.value.length>0,add_cat);

}

function handleAddCategory(evt) {
  const source = evt.srcElement;
  const new_cat_name = source.textContent;

  /*update notes/categories in firestore*/
  db.collection('notes').doc('categories').get().then((catDoc)=>{
    const former_cats = catDoc.data().data;
    db.collection('notes').doc('categories').update({
        data : [...former_cats,new_cat_name]
      }).catch((error) => {
        alertError(error,"updating category document");
    });
  });

  /*make new document of the new category and make nested collection*/
  db.collection('notes').doc(new_cat_name).set({}).then(()=>{
    const json = new Note(firebase.firestore.FieldValue.serverTimestamp(), "Generated this category").toJson();
    db.collection('notes').doc(new_cat_name).collection('data').doc("202022").set(json);
  });

  /*update categories array on session*/
  categories.push(new_cat_name);

  /*update all suggestions_li*/
  const suggestions = document.getElementsByClassName("suggestions");
  for(s of suggestions) {
    const ul = s.querySelector("ul:first-of-type");
    ul.appendChild(buildNoteLi(s, new_cat_name));
  }

  /*add new category to selected_cats*/
  addSelectedCat(evt.srcElement);
}


function addSelectedCat(source) {
  const result = document.createElement("div");
  result.className="selected-cat";
  result.innerHTML = source.innerHTML;

  const target = source.parentNode.parentNode.parentNode;
  target.insertBefore(result,target.firstChild);

  target.querySelector("input.search-input").value="";
}

function hide(target) {target.classList.add("hidden");}
function show(target) {target.classList.remove("hidden");}
function onlyShowIf(statement, target) {if(statement) show(target); else hide(target);}
